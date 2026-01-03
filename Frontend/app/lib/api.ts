const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

/**
 * Helper to get headers including the Bearer token
 */
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
};

export const api = {
  async getAgents() {
    const res = await fetch(`${BASE_URL}/api/agents`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch agents");
    return res.json();
  },

  getArchivedAgents: async () => {
    const response = await fetch(`${BASE_URL}/api/agents/archived`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, 
      }
    });
    if (!response.ok) throw new Error('Failed to fetch archive');
    return response.json();
  },
  archiveAgent: async (agentId: string) => {
    const response = await fetch(`${BASE_URL}/api/agents/${agentId}`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json' // Must tell the server we are sending JSON
      },
      // We send the specific update here
      body: JSON.stringify({ isDeleted: true }) 
    });
    
    if (!response.ok) throw new Error('Failed to archive agent');
    
    // Trigger the sidebar sync event we set up earlier
    window.dispatchEvent(new Event("agent-sync"));
    
    return response.json();
  },
  
  restoreAgent: async (agentId: string) => {
    const response = await fetch(`${BASE_URL}/api/agents/${agentId}/restore`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to restore agent');
    }
    
    return response.json();
  },

  async deleteAgent(agentId: string) {
    const res = await fetch(`${BASE_URL}/api/agents/${agentId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete agent");
    return res.json();
  },


  async createAgent(agentData: { name: string; systemPrompt: string; model: string }) {
    const res = await fetch(`${BASE_URL}/api/agents`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(agentData),
    });
    if (!res.ok) throw new Error("Failed to create agent");
    return res.json();
  },

  // --- Chat & History ---
  async getMessages(agentId: string) {
    const res = await fetch(`${BASE_URL}/api/message/${agentId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return []; 
    return res.json();
  },
  sendMessageStream(agentId: string, message: string) {
    return fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ agentId, message }),
    });
  },
  
  async sendMessageResponseWhenComplete(agentId: string, message: string) {
    const res = await fetch(`${BASE_URL}/api/chat/whenComplete`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ agentId, message }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    return res.json();
  },
  
  // async sendMessage(agentId: string, message: string) {
  //   const res = await fetch(`${BASE_URL}/api/chat`, {
  //     method: "POST",
  //     headers: getAuthHeaders(),
  //     body: JSON.stringify({ agentId, message }),
  //   });
  //   if (!res.ok) throw new Error("Failed to send message");
  //   return res.json();
  // },

  async signup(email: string, password: string, name: string) {
    const res = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    return res.json();
  },

  async forgotPassword(email: string) {
    const res = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    return res.json();
  },

  async login(email: string, password: string) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  if (!res.ok) throw new Error("Failed to send message");
    return res;
  },

  async totalTokens() {
    const res = await fetch(`${BASE_URL}/api/stats/my-tokens`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return { totalTokens: 0 };
    return res.json();
  },
};