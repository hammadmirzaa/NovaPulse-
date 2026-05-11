from fastapi import APIRouter
from api.endpoints import health, events

api_router = APIRouter()

# Include specific routers
api_router.include_router(events.router, tags=["Events"])
