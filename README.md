# NovaPulse

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

## Development
See individual folder READMEs for specific service instructions.
