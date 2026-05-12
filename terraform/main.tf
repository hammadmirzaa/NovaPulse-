provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_project_service" "apis" {
  for_each = toset([
    "pubsub.googleapis.com",
    "cloudfunctions.googleapis.com",
    "container.googleapis.com",
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
    "eventarc.googleapis.com"
  ])
  service            = each.key
  disable_on_destroy = false
}

resource "google_pubsub_topic" "events" {
  name = "notification-events"
}

resource "google_pubsub_subscription" "worker_sub" {
  name                 = "notification-worker-sub"
  topic                = google_pubsub_topic.events.name
  ack_deadline_seconds = 60
}

resource "google_container_cluster" "autopilot" {
  name     = "notification-cluster"
  location = var.region
  enable_autopilot = true
}

resource "google_service_account" "app_sa" {
  account_id   = "novapulse-app-sa"
  display_name = "NovaPulse App Service Account"
}

resource "google_project_iam_member" "sa_roles" {
  for_each = toset([
    "roles/pubsub.publisher",
    "roles/pubsub.subscriber",
    "roles/cloudfunctions.invoker"
  ])
  project = var.project_id
  role    = each.key
  member  = "serviceAccount:${google_service_account.app_sa.email}"
}

resource "google_cloud_run_v2_service" "api" {
  name     = "novapulse-api"
  location = var.region

  depends_on = [google_project_service.apis]

  template {
    containers {
      image = "gcr.io/${var.project_id}/novapulse-api:latest"
      ports {
        container_port = 8000
      }
      env {
        name  = "ENVIRONMENT"
        value = var.environment
      }
      env {
        name  = "GOOGLE_CLOUD_PROJECT"
        value = var.project_id
      }
    }
  }
}

resource "google_storage_bucket" "function_bucket" {
  name     = "${var.project_id}-functions"
  location = var.region
}

data "archive_file" "function_source" {
  type        = "zip"
  source_dir  = "${path.module}/../cloud-functions/notification-processor"
  output_path = "${path.module}/function-source.zip"
}

resource "google_storage_bucket_object" "function_zip" {
  name   = "notification-processor-${data.archive_file.function_source.output_md5}.zip"
  bucket = google_storage_bucket.function_bucket.name
  source = data.archive_file.function_source.output_path
}

resource "google_cloudfunctions2_function" "processor" {
  name        = "notification-processor"
  location    = var.region
  description = "Processes notifications from Pub/Sub"

  depends_on = [google_project_service.apis]

  build_config {
    runtime     = "python311"
    entry_point = "process_notification"
    source {
      storage_source {
        bucket = google_storage_bucket.function_bucket.name
        object = google_storage_bucket_object.function_zip.name
      }
    }
  }

  service_config {
    max_instance_count = 1
    available_memory   = "256M"
    timeout_seconds    = 60
    environment_variables = {
      WEBHOOK_URL = "http://example.com"
    }
  }

  event_trigger {
    trigger_region = var.region
    event_type     = "google.cloud.pubsub.topic.v1.messagePublished"
    pubsub_topic   = google_pubsub_topic.events.id
    retry_policy   = "RETRY_POLICY_RETRY"
  }
}

resource "google_cloud_run_v2_service_iam_member" "public_access" {
  location = google_cloud_run_v2_service.api.location
  name     = google_cloud_run_v2_service.api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
