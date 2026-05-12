import json
import unittest
from unittest.mock import MagicMock, patch
import sys

# Mock google-cloud-pubsub before importing main
mock_pubsub = MagicMock()
sys.modules["google.cloud"] = MagicMock()
sys.modules["google.cloud.pubsub_v1"] = mock_pubsub

from main import WorkerSubscriber

class TestWorkerSubscriber(unittest.TestCase):
    @patch('main.pubsub_v1.SubscriberClient')
    def test_callback_success(self, mock_subscriber):
        worker = WorkerSubscriber()
        
        # Mock message
        mock_message = MagicMock()
        payload = {
            "event_type": "test_event",
            "user_id": "user_123",
            "timestamp": 1620824400
        }
        mock_message.data = json.dumps(payload).encode("utf-8")
        mock_message.message_id = "msg_001"
        
        # Call callback
        worker.callback(mock_message)
        
        # Verify ack was called
        mock_message.ack.assert_called_once()
        mock_message.nack.assert_not_called()

    @patch('main.pubsub_v1.SubscriberClient')
    def test_callback_failure(self, mock_subscriber):
        worker = WorkerSubscriber()
        
        # Mock malformed message
        mock_message = MagicMock()
        mock_message.data = b"not json"
        mock_message.message_id = "msg_002"
        
        # Call callback
        worker.callback(mock_message)
        
        # Verify nack was called due to JSON decode error
        mock_message.nack.assert_called_once()
        mock_message.ack.assert_not_called()

if __name__ == '__main__':
    unittest.main()
