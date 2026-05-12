# Notification Processor Cloud Function

This Google Cloud Function is triggered by the `notification-events` Pub/Sub topic. It parses incoming events and forwards them to a configured webhook.

## Deployment Instructions

### Prerequisites
- [Google Cloud SDK (gcloud)](https://cloud.google.com/sdk/docs/install) installed and configured.
- A Pub/Sub topic named `notification-events`.

### Deploying via CLI

Run the following command from this directory:

```bash
gcloud functions deploy notification-processor \
--gen2 \
--runtime=python311 \
--region=us-central1 \
--source=. \
--entry-point=process_notification \
--trigger-topic=notification-events \
--set-env-vars WEBHOOK_URL="https://your-webhook-endpoint.com/api/notifications"
```

### Configuration
The function requires the following environment variable:
- `WEBHOOK_URL`: The full URL where event payloads will be sent via POST.

## Functional Logic
- **Base64 Decoding**: Decodes the Pub/Sub message data.
- **Event Filtering**: Logs specific messages for `order_placed` and `user_signup` event types.
- **Webhook Delivery**: Forwards the entire JSON payload to the `WEBHOOK_URL`.
- **Logging**: Uses structured Google Cloud Logging.
