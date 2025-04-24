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

## Project Structure

The project follows a clean architecture approach with clear separation of concerns:

```
data-insight-generator/
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI application entry point
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── routes/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── queries.py    # Endpoints for handling queries
│   │   │   │   └── datasets.py   # Endpoints for dataset management
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py         # Configuration and environment variables
│   │   │   └── logging.py        # Logging configuration
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── llm/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── base.py       # Base LLM service interface
│   │   │   │   ├── gemini.py     # Gemini API integration
│   │   │   │   └── deepseek.py   # DeepSeek API integration
│   │   │   └── data/
│   │   │       ├── __init__.py
│   │   │       ├── processor.py  # Dataset processing logic
│   │   │       └── storage.py    # Temporary storage for datasets
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── dataset.py        # Dataset models
│   │   │   └── query.py          # Query models
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── prompt_builder.py # Utility for building LLM prompts
│   ├── tests/                # Test directory
│   │   ├── __init__.py
│   │   ├── test_api/
│   │   └── test_services/
│   ├── .env.example          # Environment variable template
│   ├── requirements.txt      # Python dependencies
│   └── README.md             # Backend setup instructions
│
├── frontend/                 # Next.js frontend
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Main page
│   │   │   ├── layout.tsx        # Root layout
│   │   │   └── globals.css       # Global styles
│   │   ├── components/
│   │   │   ├── ui/               # UI components
│   │   │   │   ├── Button.tsx        # Enhanced button component
│   │   │   │   ├── Card.tsx          # Card component system
│   │   │   │   ├── EmptyState.tsx    # Empty state component
│   │   │   │   ├── FileUploadPreview.tsx # File preview component
│   │   │   │   ├── LoadingSpinner.tsx # Loading indicator component
│   │   │   │   ├── Select.tsx        # Enhanced select dropdown
│   │   │   │   ├── StatusBadge.tsx   # Status indicator component
│   │   │   │   ├── TextArea.tsx      # Enhanced textarea component
│   │   │   │   └── ...
│   │   │   ├── layout/           # Layout components
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── features/         # Feature components
│   │   │   │   ├── DatasetUpload.tsx
│   │   │   │   ├── QueryInput.tsx
│   │   │   │   ├── ResponseDisplay.tsx
│   │   │   │   └── QueryHistory.tsx
│   │   │   └── data/             # Data-specific components
│   │   │       ├── DataPreview.tsx
│   │   │       └── DataStats.tsx
│   │   ├── hooks/                # Custom hooks
│   │   │   ├── useQueryAPI.ts
│   │   │   └── useDataset.ts
│   │   ├── services/             # API service layer
│   │   │   ├── api.ts            # Base API config
│   │   │   ├── queries.ts        # Query API methods
│   │   │   └── datasets.ts       # Dataset API methods
│   │   ├── types/                # TypeScript type definitions
│   │   │   ├── dataset.ts
│   │   │   └── query.ts
│   │   └── utils/                # Utility functions
│   │       ├── formatting.ts
│   │       └── validation.ts
│   ├── .env.example          # Environment variable template
│   ├── package.json          # npm dependencies
│   ├── tailwind.config.js    # TailwindCSS configuration
│   └── README.md             # Frontend setup instructions
│
├── .gitignore
├── README.md                 # Main project README
└── PROMPTS.md                # Documentation of LLM prompts
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- API keys for Google Gemini and DeepSeek

### API Keys

This application requires API keys for both the Google Gemini and DeepSeek LLM services:

1. **Google Gemini API Key**:
   - Create an account at [Google AI Studio](https://ai.google.dev/)
   - Create a new API key in your account settings
   - Add the key to your backend `.env` file as `GEMINI_API_KEY`

2. **DeepSeek API Key**:
   - Create an account at [DeepSeek Platform](https://platform.deepseek.com/)
   - Generate an API key from your dashboard
   - Add the key to your backend `.env` file as `DEEPSEEK_API_KEY`

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

5. Edit the `.env` file to add your actual API keys:
```
GEMINI_API_KEY=your-actual-gemini-api-key
DEEPSEEK_API_KEY=your-actual-deepseek-api-key
```

6. Start the FastAPI server:
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

3. Copy the example environment file:
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

## Environment Configuration

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| API_HOST | Host address for the API | 0.0.0.0 |
| API_PORT | Port for the API | 8000 |
| DEBUG_MODE | Enable debug mode | True |
| ALLOWED_ORIGINS | CORS allowed origins | ["http://localhost:3000"] |
| GEMINI_API_KEY | Google Gemini API key | (Required) |
| DEEPSEEK_API_KEY | DeepSeek API key | (Required) |
| UPLOAD_DIR | Directory for temporary file storage | ./uploads |
| MAX_UPLOAD_SIZE | Maximum file size in MB | 10 |
| FILE_RETENTION_HOURS | How long to keep uploaded files | 24 |
| LOG_LEVEL | Logging level | INFO |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | http://localhost:8000 |
| NEXT_PUBLIC_ENABLE_QUERY_HISTORY | Enable query history feature | true |
| NEXT_PUBLIC_ENABLE_DUAL_LLM_COMPARISON | Enable dual LLM comparison | true |
| NEXT_PUBLIC_DEFAULT_LLM | Default LLM service | gemini |
| NEXT_PUBLIC_MAX_FILE_SIZE_MB | Maximum file size in MB | 10 |

## UI Component System

The frontend utilizes a comprehensive UI component system for consistent design and user experience:

### Core Components

- **Card**: Container component with header and body sections
- **Button**: Enhanced button with variants, sizes, and loading states
- **Select**: Dropdown component with icon support
- **TextArea**: Text input area with validation support
- **LoadingSpinner**: Customizable loading animation
- **StatusBadge**: Status indicator for API health, etc.
- **EmptyState**: Empty state placeholder with actions
- **FileUploadPreview**: File upload preview with progress

These components use a consistent design language with standardized colors, typography, spacing, and interactive states.

## LLM Prompt Documentation

This project uses carefully crafted prompts to get the best results from the LLMs. See the [Prompt Documentation](./PROMPTS.md) for details on the prompt engineering approach.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
