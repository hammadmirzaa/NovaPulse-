import pytest
from unittest.mock import MagicMock, patch
from services.pubsub import PubSubService
from config.settings import settings

@pytest.fixture
def mock_settings():
    with patch("services.pubsub.settings") as mock:
        mock.google_cloud_project = "test-project"
        mock.pubsub_topic_name = "test-topic"
        mock.environment = "production"  # Force production to test real client initialization
        yield mock

@pytest.mark.asyncio
async def test_publish_event_mock_mode():
    """Test publishing in mock mode (development environment)"""
    with patch("services.pubsub.settings") as mock_settings:
        mock_settings.environment = "development"
        mock_settings.google_cloud_project = "test-project"
        mock_settings.pubsub_topic_name = "test-topic"
        
        service = PubSubService()
        assert service.is_mock is True
        
        message_id = await service.publish_event(
            event_type="test_event",
            user_id="user_123",
            payload={"key": "value"}
        )
        
        assert message_id == "mock-message-id"

@pytest.mark.asyncio
async def test_publish_event_real_mode_success():
    """Test successful publishing with real client mocked"""
    with patch("services.pubsub.pubsub_v1.PublisherClient") as mock_client:
        with patch("services.pubsub.settings") as mock_settings:
            mock_settings.environment = "production"
            mock_settings.google_cloud_project = "test-project"
            mock_settings.pubsub_topic_name = "test-topic"
            
            # Setup mock future
            mock_future = MagicMock()
            mock_future.result.return_value = "real-message-id"
            mock_client.return_value.publish.return_value = mock_future
            
            service = PubSubService()
            assert service.is_mock is False
            
            message_id = await service.publish_event(
                event_type="test_event",
                user_id="user_123",
                payload={"key": "value"}
            )
            
            assert message_id == "real-message-id"
            mock_client.return_value.publish.assert_called_once()

@pytest.mark.asyncio
async def test_publish_event_error_handling():
    """Test error handling when Pub/Sub fails"""
    with patch("services.pubsub.pubsub_v1.PublisherClient") as mock_client:
        with patch("services.pubsub.settings") as mock_settings:
            mock_settings.environment = "production"
            mock_settings.google_cloud_project = "test-project"
            mock_settings.pubsub_topic_name = "test-topic"
            
            # Setup mock future to raise exception
            mock_future = MagicMock()
            mock_future.result.side_effect = Exception("Pub/Sub connection failed")
            mock_client.return_value.publish.return_value = mock_future
            
            service = PubSubService()
            
            with pytest.raises(RuntimeError) as excinfo:
                await service.publish_event(
                    event_type="test_event",
                    user_id="user_123",
                    payload={"key": "value"}
                )
            
            assert "An unexpected error occurred" in str(excinfo.value)
