import uuid
import logging
from models.schemas import EventPayload, EventResponse
from services.pubsub import pubsub_service

logger = logging.getLogger(__name__)

async def process_event(event: EventPayload) -> EventResponse:
    """
    Process incoming real-time events.
    """
    event_id = str(uuid.uuid4())
    logger.info(f"Processing event: {event.event_type} for user: {event.user_id} with event_id: {event_id}")
    
    # Publish to Pub/Sub
    try:
        await pubsub_service.publish_event(
            event_type=event.event_type,
            user_id=event.user_id,
            payload=event.payload,
        )
    except Exception as e:
        logger.error(f"Pub/Sub publishing failed: {e}")
        # Re-raise to be handled by the API endpoint
        raise

    return EventResponse(
        status="success",
        message="Event processed successfully",
        event_id=event_id
    )
