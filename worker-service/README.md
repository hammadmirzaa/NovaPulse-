# GKE Worker Service

This service is a Python-based Pub/Sub subscriber designed to run on Google Kubernetes Engine (GKE). It processes messages from the `notification-events` topic.

## Local Development

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment**:
   Create a `.env` file with:
   ```env
   GOOGLE_CLOUD_PROJECT=your-project-id
   PUBSUB_SUBSCRIPTION_NAME=notification-worker-sub
   GOOGLE_APPLICATION_CREDENTIALS=path/to/your/key.json
   ```

3. **Run the Worker**:
   ```bash
   python main.py
   ```

## Deployment to GKE

### 1. Build and Push Docker Image

```bash
# Build the image
docker build -t gcr.io/[PROJECT_ID]/notification-worker:latest .

# Push to Google Container Registry (or Artifact Registry)
docker push gcr.io/[PROJECT_ID]/notification-worker:latest
```

### 2. Configure Kubernetes Secrets

Base64 encode your service account JSON key:
```bash
cat key.json | base64 | tr -d '\n'
```
Update `k8s/secret.yaml` with the encoded string, then apply:
```bash
kubectl apply -f k8s/secret.yaml
```

### 3. Deploy to GKE

```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### 4. Monitor the Workers

```bash
# Check pod status
kubectl get pods -l app=notification-worker

# View logs
kubectl logs -f -l app=notification-worker
```

## Features
- **Graceful Shutdown**: Handles `SIGTERM` to safely stop the subscriber.
- **Reliability**: Acknowledges messages only after successful processing; otherwise, they are retried by Pub/Sub.
- **Scalability**: Configured with 2 replicas and Kubernetes resource limits.
