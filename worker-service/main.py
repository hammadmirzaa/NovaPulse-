import json
import logging
import os
import signal
import sys
import time
from concurrent.futures import TimeoutError
from google.cloud import pubsub_v1
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

class WorkerSubscriber:
    def __init__(self):
        self.project_id = os.getenv("GOOGLE_CLOUD_PROJECT", "novapulse-dev")
        self.subscription_name = os.getenv("PUBSUB_SUBSCRIPTION_NAME", "notification-worker-sub")
        self.subscriber = pubsub_v1.SubscriberClient()
        self.subscription_path = self.subscriber.subscription_path(self.project_id, self.subscription_name)
        self.streaming_pull_future = None
        self.shutdown_requested = False

    def callback(self, message: pubsub_v1.subscriber.message.Message) -> None:
        """
        Process the incoming Pub/Sub message.
        """
        try:
            data = json.loads(message.data.decode("utf-8"))
            
            event_type = data.get("event_type")
            user_id = data.get("user_id")
            timestamp = data.get("timestamp")

            logger.info(f"Received message | Event: {event_type} | User: {user_id} | Timestamp: {timestamp}")

            # Simulate processing logic
            # If processing was successful, acknowledge the message
            message.ack()
            logger.info(f"Message acknowledged: {message.message_id}")

        except Exception as e:
            logger.error(f"Error processing message: {e}")
            # If processing fails, do not acknowledge (nack) so it's retried
            message.nack()
            logger.warning(f"Message nacked (will be retried): {message.message_id}")

    def run(self):
        """
        Start the streaming pull.
        """
        logger.info(f"Starting worker subscriber on {self.subscription_path}...")
        self.streaming_pull_future = self.subscriber.subscribe(self.subscription_path, callback=self.callback)

        # Register shutdown signals
        signal.signal(signal.SIGTERM, self.shutdown)
        signal.signal(signal.SIGINT, self.shutdown)

        with self.subscriber:
            try:
                # Keep the main thread alive while the subscriber runs in the background
                while not self.shutdown_requested:
                    time.sleep(1)
            except Exception as e:
                logger.error(f"Subscriber encountered an error: {e}")
                self.streaming_pull_future.cancel()
                self.streaming_pull_future.result()

    def shutdown(self, signum, frame):
        """
        Gracefully shutdown the subscriber.
        """
        logger.info(f"Shutdown signal ({signum}) received. Closing subscriber...")
        self.shutdown_requested = True
        if self.streaming_pull_future:
            self.streaming_pull_future.cancel()
            logger.info("Streaming pull cancelled.")

if __name__ == "__main__":
    worker = WorkerSubscriber()
    worker.run()
