import json
import logging
import time
from typing import Any, Dict
from google.cloud import pubsub_v1
from google.api_core import exceptions
from config.settings import settings

logger = logging.getLogger(__name__)

class PubSubService:
    def __init__(self):
        self.project_id = settings.google_cloud_project
        self.topic_name = settings.pubsub_topic_name
        self.topic_path = f"projects/{self.project_id}/topics/{self.topic_name}"
        
        # Use mock in development if no credentials or explicitly in dev mode
        self.is_mock = settings.environment == "development"
        
        if not self.is_mock:
            try:
                self.publisher = pubsub_v1.PublisherClient()
                logger.info(f"PubSubService initialized for topic: {self.topic_path}")
            except Exception as e:
                logger.warning(f"Failed to initialize real PubSub client: {e}. Falling back to mock.")
                self.is_mock = True
        
        if self.is_mock:
            logger.info(f"PubSubService initialized in MOCK mode for topic: {self.topic_path}")

    async def publish_event(self, event_type: str, user_id: str, payload: Dict[str, Any]) -> str:
        """
        Publishes an event message to Google Cloud Pub/Sub.
        """
        message_data = {
            "event_type": event_type,
            "user_id": user_id,
            "payload": payload,
            "timestamp": time.time()
        }
        
        message_bytes = json.dumps(message_data).encode("utf-8")
        
        if self.is_mock:
            logger.info(f"[MOCK PUB/SUB] Publishing to {self.topic_name}: {message_data}")
            return "mock-message-id"

        try:
            future = self.publisher.publish(self.topic_path, message_bytes)
            message_id = future.result()
            logger.info(f"Published message to {self.topic_name} with ID: {message_id}")
            return message_id
        except exceptions.GoogleAPICallError as e:
            logger.error(f"Failed to publish to Pub/Sub: {e}")
            raise RuntimeError(f"Cloud Pub/Sub error: {e}")
        except Exception as e:
            logger.error(f"Unexpected error publishing to Pub/Sub: {e}")
            raise RuntimeError("An unexpected error occurred while publishing to Pub/Sub.")

# Singleton instance
pubsub_service = PubSubService()
