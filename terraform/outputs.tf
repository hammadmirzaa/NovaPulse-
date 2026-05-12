output "cloud_run_url" {
  value = google_cloud_run_v2_service.api.uri
}

output "gke_cluster_name" {
  value = google_container_cluster.autopilot.name
}

output "pubsub_topic_id" {
  value = google_pubsub_topic.events.id
}
