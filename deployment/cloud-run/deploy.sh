#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:?Set PROJECT_ID before running this script.}"
REGION="${REGION:-us-east1}"
SERVICE_NAME="${SERVICE_NAME:-manabi-kobo}"

# Source deployment uses the repository Dockerfile and Google Cloud Build.
gcloud config set project "${PROJECT_ID}"
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

gcloud run deploy "${SERVICE_NAME}" \
  --source . \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --cpu 1 \
  --memory 512Mi \
  --concurrency 80 \
  --timeout 120 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars "MK_AI_COMPANION_ENABLED=true,MK_TEMPLATES_AUTO_RELOAD=false"
