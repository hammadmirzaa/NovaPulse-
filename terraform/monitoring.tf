resource "google_monitoring_notification_channel" "email" {
  display_name = "Email Alerts"
  type         = "email"
  labels = {
    email_address = var.alert_email
  }
}

resource "google_monitoring_uptime_check_config" "api_health" {
  display_name = "API Health Check"
  timeout      = "10s"
  period       = "60s"

  http_check {
    path = "/health"
    port = "443"
    use_ssl = true
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = var.project_id
      host       = replace(google_cloud_run_v2_service.api.uri, "https://", "")
    }
  }
}

resource "google_monitoring_alert_policy" "api_errors" {
  display_name = "Cloud Run Errors"
  combiner     = "OR"
  conditions {
    display_name = "High Error Rate"
    condition_threshold {
      filter     = "resource.type = \"cloud_run_revision\" AND metric.type = \"run.googleapis.com/request_count\" AND metric.labels.response_code_class = \"5xx\""
      duration   = "300s"
      comparison = "COMPARISON_GT"
      threshold_value = 5
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_RATE"
      }
    }
  }
  notification_channels = [google_monitoring_notification_channel.email.name]
}

resource "google_monitoring_alert_policy" "pubsub_backlog" {
  display_name = "Pub/Sub Backlog Age"
  combiner     = "OR"
  conditions {
    display_name = "Oldest Unacked Message Age"
    condition_threshold {
      filter     = "resource.type = \"pubsub_subscription\" AND metric.type = \"pubsub.googleapis.com/subscription/oldest_unacked_message_age\""
      duration   = "0s"
      comparison = "COMPARISON_GT"
      threshold_value = 300
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_MAX"
      }
    }
  }
  notification_channels = [google_monitoring_notification_channel.email.name]
}

resource "google_logging_metric" "processed_notifications" {
  name   = "processed_notifications_count"
  filter = "resource.type=\"cloud_run_revision\" AND textPayload:\"Published message to\""
  metric_descriptor {
    metric_kind = "DELTA"
    value_type  = "INT64"
  }
}
