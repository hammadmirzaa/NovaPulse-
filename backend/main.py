from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings
from api.router import api_router
from api.endpoints import health
import logging

# Configure basic logging
logging.basicConfig(level=logging.INFO if settings.debug else logging.WARNING)

app = FastAPI(
    title=settings.app_name,
    description="Backend API for Real-Time Notification System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(api_router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    logging.info(f"Starting up {settings.app_name} in {settings.environment} mode.")

@app.on_event("shutdown")
async def shutdown_event():
    logging.info(f"Shutting down {settings.app_name}.")
