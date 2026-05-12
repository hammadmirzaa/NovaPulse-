# NovaPulse

![CI](https://github.com/hammadmirzaa/NovaPulse-/actions/workflows/ci.yml/badge.svg)
![Deploy API](https://github.com/hammadmirzaa/NovaPulse-/actions/workflows/deploy-api.yml/badge.svg)
![Deploy Worker](https://github.com/hammadmirzaa/NovaPulse-/actions/workflows/deploy-worker.yml/badge.svg)

Real-Time Notification System with GCP Integration.

## Project Structure
- `backend/`: FastAPI application.
- `cloud-functions/`: Serverless processors.
- `worker-service/`: GKE-based background workers.
- `terraform/`: Infrastructure as Code.

## Infrastructure Provisioning

### Prerequisites
- Terraform >= 1.0
- Google Cloud SDK
- A GCP Project

### Deployment

1. Navigate to terraform:
   ```bash
   cd terraform
   ```

2. Initialize:
   ```bash
   terraform init
   ```

3. Configure variables:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your project_id
   ```

4. Plan and Apply:
   ```bash
   terraform plan
   ```
   ```bash
   terraform apply
   ```

## CI/CD Setup

### GitHub Secrets
Add the following secrets to your GitHub repository settings:
- `GCP_PROJECT_ID`: Your Google Cloud Project ID.
- `GCP_SA_KEY`: The JSON key of a service account with permissions for Artifact Registry, Cloud Run, and GKE.
- `GCP_REGION`: Your target GCP region (e.g., `us-central1`).

## Development
See individual folder READMEs for specific service instructions.
