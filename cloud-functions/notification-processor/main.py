import base64
import json
import logging
import os
import requests
from google.cloud import logging as cloud_logging

# Initialize Cloud Logging
logging_client = cloud_logging.Client()
logging_client.setup_logging()

def process_notification(event, context):
    """
    Background Cloud Function to be triggered by Pub/Sub.
    Args:
         event (dict):  The dictionary with data specific to this type of
         event. The `data` field contains the PubsubMessage message.
         context (google.cloud.functions.Context): The Cloud Functions event
         metadata. The `event_id` field contains the Pub/Sub message ID.
    """
    # 1. Parse Environment Variables
    webhook_url = os.environ.get('WEBHOOK_URL')
    if not webhook_url:
        logging.error("WEBHOOK_URL environment variable is not set.")
        return

    # 2. Decode the Pub/Sub message
    if 'data' not in event:
        logging.error("No data found in the Pub/Sub event.")
        return

    try:
        pubsub_message = base64.b64decode(event['data']).decode('utf-8')
        data = json.loads(pubsub_message)
        logging.info(f"Received message: {data}")
    except Exception as e:
        logging.error(f"Error decoding Pub/Sub message: {e}")
        return

    # 3. Extract fields
    event_type = data.get('event_type')
    user_id = data.get('user_id')
    
    # 4. Conditional Logging based on event_type
    if event_type == 'order_placed':
        logging.info(f"Processing order notification for user {user_id}")
    elif event_type == 'user_signup':
        logging.info(f"Sending welcome notification to user {user_id}")
    else:
        logging.warning(f"Unknown event type received: {event_type}")

    # 5. Forward to Webhook
    try:
        logging.info(f"Forwarding event to webhook: {webhook_url}")
        response = requests.post(webhook_url, json=data, timeout=10)
        response.raise_for_status()
        logging.info(f"Webhook delivered successfully. Status: {response.status_code}")
    except requests.exceptions.RequestException as e:
        logging.error(f"Failed to deliver webhook: {e}")
        # In a real-world scenario, you might want to implement a retry mechanism here
        # or rely on Pub/Sub's dead-letter queues if you raise an exception.
