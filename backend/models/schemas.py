from pydantic import BaseModel, Field
from typing import Dict, Any

class EventPayload(BaseModel):
    event_type: str = Field(..., description="Type of the event")
    user_id: str = Field(..., description="User ID associated with the event")
    payload: Dict[str, Any] = Field(..., description="Dynamic payload associated with the event")

class EventResponse(BaseModel):
    status: str
    message: str
    event_id: str

class ErrorResponse(BaseModel):
    detail: str
