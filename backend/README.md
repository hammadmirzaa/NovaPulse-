# Real-Time Notification System - Backend

This is the FastAPI backend for the Real-Time Notification System.

## Features
- **FastAPI**: Modern, fast, web framework for building APIs.
- **Pydantic**: Data validation and settings management.
- **Endpoints**:
  - `GET /health` - Health check.
  - `POST /api/events` - Submit a new event payload.

## Project Structure
```
backend/
├── api/             # API routing and endpoints
├── config/          # Configuration and environment settings
├── models/          # Pydantic schemas and database models
├── services/        # Business logic
├── main.py          # Application entrypoint
├── requirements.txt # Python dependencies
└── .env             # Environment variables
```

## Setup Instructions

1. **Create Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Application**:
   ```bash
   uvicorn main:app --reload
   ```

The API will be available at `http://localhost:8000`. 
Swagger UI documentation is available at `http://localhost:8000/docs`.

## Docker Instructions

### Prerequisites
- Docker and Docker Compose installed on your machine.

### Local Development (with Hot Reload)
To start the application in development mode with hot reload enabled:

```bash
docker compose up --build
```

The application will be accessible at `http://localhost:8000`. Changes made to the code will automatically trigger a reload.

### Production Build
To build the production-ready image:

```bash
docker build -t novapulse-api .
```

To run the production image:

```bash
docker run -p 8000:8000 --env-file .env novapulse-api
```

### Health Check
You can verify the health of the running container:

```bash
docker inspect --format='{{json .State.Health.Status}}' novapulse_api
```
