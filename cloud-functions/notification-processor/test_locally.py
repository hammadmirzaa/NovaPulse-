import base64
import json
import os
from unittest.mock import patch, MagicMock
import sys

# Mock google-cloud-logging before importing main
mock_logging = MagicMock()
sys.modules["google.cloud"] = MagicMock()
sys.modules["google.cloud.logging"] = mock_logging

from main import process_notification

def test_process_notification():
    # 1. Setup Environment
    os.environ['WEBHOOK_URL'] = 'http://mock-webhook.com'
    
    # 2. Mock a Pub/Sub event
    payload = {
        "event_type": "order_placed",
        "user_id": "user_999",
        "payload": {"item": "Laptop", "price": 1200},
        "timestamp": 1620824400
    }
    encoded_data = base64.b64encode(json.dumps(payload).encode('utf-8')).decode('utf-8')
    
    event = {
        'data': encoded_data
    }
    context = MagicMock()
    context.event_id = '12345'

    # 3. Mock requests.post
    with patch('requests.post') as mock_post:
        mock_post.return_value.status_code = 200
        mock_post.return_value.raise_for_status = MagicMock()
        
        print("Starting local test for process_notification...")
        process_notification(event, context)
        
        # 4. Verify results
        mock_post.assert_called_once()
        args, kwargs = mock_post.call_args
        assert args[0] == 'http://mock-webhook.com'
        assert kwargs['json'] == payload
        print("Local test passed! Webhook was called with correct data.")

if __name__ == "__main__":
    test_process_notification()
