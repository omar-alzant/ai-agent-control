import { Router } from 'express';
import { OpenAI } from 'openai';
import { supabaseAdmin } from '../supabase.ts';
import { protect } from '../middleware/auth.ts';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', protect, async (req: any, res) => {
  const { agentId, message } = req.body;
  const userId = req.user.id;
  const start = Date.now();
  const io = req.io;

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";
  let completionTokens = 0;

  try {
    // 1. Fetch agent
    const { data: agent } = await supabaseAdmin
      .from('Agent')
      .select('*')
      .eq('id', agentId)
      .eq('userId', userId)
      .single();

    if (!agent) {
      res.write(`event: error\ndata: Agent not found\n\n`);
      return res.end();
    }

    // 2. Get or create SINGLE conversation for this agent
    let { data: conversation } = await supabaseAdmin
      .from('Conversation')
      .select('*')
      .eq('agentId', agentId)
      .eq('userId', userId)
      .single();

    if (!conversation) {
      const { data: created } = await supabaseAdmin
        .from('Conversation')
        .insert([{ agentId, userId }])
        .select()
        .single();

      conversation = created;
    }

    // 3. Save user message
    await supabaseAdmin.from('Message').insert([{
      conversationId: conversation.id,
      userId,
      role: 'user',
      content: message
    }]);

    // 4. Load conversation history
    const { data: history } = await supabaseAdmin
      .from('Message')
      .select('role, content')
      .eq('conversationId', conversation.id)
      .order('createdAt', { ascending: true })
      .limit(20);

    // 5. OpenAI streaming
    const stream = await openai.responses.stream({
      model: agent.model || "gpt-4.1-mini",
      input: [
        { role: "system", content: agent.systemPrompt },
        ...(history || []),
        { role: "user", content: message }
      ]
    });

    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        fullResponse += event.delta;
        completionTokens++;

        res.write(`data: ${event.delta}\n\n`);
      }

      if (event.type === "response.completed") {
        const latency = Date.now() - start;

        io.to(agentId).emit('telemetry_update', {
          type: 'latency',
          value: latency,
          timestamp: new Date().toLocaleTimeString()
        });

        io.to(agentId).emit('telemetry_update', {
          type: 'tokens',
          value: completionTokens,
          timestamp: new Date().toLocaleTimeString()
        });

        await supabaseAdmin.from('Message').insert([{
          conversationId: conversation.id,
          userId,
          role: 'assistant',
          content: fullResponse,
          latencyMs: latency,
          tokensUsed: completionTokens
        }]);

        res.write(`event: done\ndata: [DONE]\n\n`);
        res.end();
      }
    }

  } catch (err) {
    console.error("Chat Error:", err);
    res.write(`event: error\ndata: LLM failed\n\n`);
    res.end();
  }
});

export default router;