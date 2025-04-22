# Enhanced Data Insight Generator

A full-stack application that allows users to upload datasets and ask questions about them, receiving AI-powered insights and analysis suggestions. The application integrates with both Google's Gemini and DeepSeek's LLM APIs to provide varied perspectives and ensure reliability.

## Features

- **Dataset Upload & Analysis**: Upload CSV, Excel, or JSON files for automatic analysis
- **Contextual Questions**: Ask questions about your specific dataset
- **Dual LLM Integration**: Toggle between Gemini and DeepSeek for different analysis perspectives
- **Rich Responses**: Receive formatted responses with code snippets, explanations, and visualization suggestions
- **Query History**: View and revisit previous queries and results

## Tech Stack

- **Backend**: Python with FastAPI
- **Frontend**: Next.js with TailwindCSS
- **LLM Integration**: Google Gemini API and DeepSeek API

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- API keys for Google Gemini and DeepSeek

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Copy the example environment file and fill in your API keys:
```bash
cp .env.example .env
```

5. Start the FastAPI server:
```bash
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000, with documentation at http://localhost:8000/docs

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Copy the example environment file and fill in your backend API URL:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:3000

## Usage Guide

1. **Upload a Dataset**: Click the upload area or drag and drop a CSV, Excel, or JSON file
2. **Preview Your Data**: Review the dataset preview and basic statistics
3. **Ask Questions**: Type questions about your data in the text area
4. **Choose LLM**: Select either Gemini or DeepSeek for analysis (or compare both)
5. **View Results**: Explore the AI-generated insights, suggestions, and code examples
6. **Review History**: Access your previous queries from the history sidebar

## Environment Variables

### Backend (.env)

```
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG_MODE=True

# LLM API Keys
GEMINI_API_KEY=your-gemini-api-key
DEEPSEEK_API_KEY=your-deepseek-api-key

# File Storage
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=10  # In MB
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Project Structure

The project follows a clean architecture approach with clear separation of concerns:

- Backend: FastAPI with modular services for LLM integration and data processing
- Frontend: Next.js with component-based architecture and responsive design

For detailed structure, see the [Project Structure](./PROJECT_STRUCTURE.md) document.

## LLM Prompt Documentation

This project uses carefully crafted prompts to get the best results from the LLMs. See the [Prompt Documentation](./PROMPTS.md) for details on the prompt engineering approach.
