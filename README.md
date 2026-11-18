## Quick Start

You need Docker, an [AssemblyAI](https://www.assemblyai.com/) API key for transcription, and one LLM provider key (Google, OpenAI, Anthropic, or a local Ollama).

Create a `.env` in the root with your keys:

```env
ASSEMBLY_AI_API_KEY=your_assemblyai_api_key
LLM=google-gla:gemini-3-flash-preview
GOOGLE_API_KEY=your_google_api_key
```

Then start everything:

```bash
docker-compose up -d
```

First startup takes a few minutes; watch it with `docker-compose logs -f`. Once healthy, open [http://localhost:3107](http://localhost:3107), create an account, and start clipping. The backend API lives at [http://localhost:8000](http://localhost:8000) with interactive docs at `/docs`.
