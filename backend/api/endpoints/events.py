from fastapi import APIRouter, HTTPException, status
from models.schemas import EventPayload, EventResponse, ErrorResponse
from services.event_service import process_event
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post(
    "/events",
    response_model=EventResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    }
)
async def create_event(event: EventPayload):
    """
    Accepts an incoming event and processes it.
    """
    try:
        response = await process_event(event)
        return response
    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Internal server error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred while processing the event.")
