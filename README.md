# 🚀 AI Agent Control Center

<img src="./img/DirPath.png" />

## Architecture Overview
This project follows a decoupled Full-Stack Architecture designed for high availability and low-latency updates.
<ul>
    <li> 
        <strong>Frontend</strong>: 
        <p>Built with Next.js and Tailwind CSS, hosted on Netlify.</p> 
        It uses a custom domain ai-ojz.com configured via Hostinger DNS.
    </li>
    <li>
     <strong>Backend:</strong>
     <p>A Node.js/Express server written in TypeScript, hosted on Railway. </p>
    </li>
    <li>
     <strong>Real-Time Layer:</strong>
     <p>Handled by Socket.io using a unified HTTP server to broadcast agent telemetry (latency, token usage) every 2 seconds.</p>
    </li>
    <li>
     <strong>Database:</strong>
     <p>Supabase (PostgreSQL) serves as the persistent storage for agent configurations and chat history.</p>
    </li>
    <li>
     <strong>Orchestration:</strong>
     <p>Docker Compose is used to containerize the services for consistent local development.</p>
    </li>
</ul>


## Setup Instructions
Follow these steps to run the entire stack locally using Docker.
<ol>
    <li>
        <strong>Prerequisites:</strong>
         <ul>
            <li> 
                Install 
                <a href="https://www.docker.com/products/docker-desktop/"> 
                Docker Desktop.
                </a>
            </li>
            <li>     
               A Supabase account with an active project.
            </li>
         </ul>
    </li>
     <li>
        <strong>
            Supabase setting up:
        </strong>
        <p> 
            In your supabase website,
            New Organization >> New project >> go to sql Editor tab >> (Copy the SQL From DB Folder) then Past it in the supabase sql editor... now you have our tables.
        </p>
    </li>
    <li>
        <strong> 
            Environment Configuration:
        </strong>
        <p> Create a `.env` file in the **root** directory (beside the `docker-compose.yml`):</p>
        <code>
            SUPABASE_URL=your_supabase_url
            SUPABASE_ANON_KEY=your_anon_key
            SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
            CORS_ORIGINS=http://localhost:3000
            OPENAI_API_KEY=your_openai_api_key
            JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
        </code>
        <hr />
        <i> 
            To get Supabase api keys:
            Copy the both keys :
            <img src="./img/Supabase_helper.png"/>
        </i>
    </li>
</ol>