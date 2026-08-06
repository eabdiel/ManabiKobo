param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectId,
    [string]$Region = "us-east1",
    [string]$ServiceName = "manabi-kobo"
)

$ErrorActionPreference = "Stop"

gcloud config set project $ProjectId
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

gcloud run deploy $ServiceName `
    --source . `
    --region $Region `
    --platform managed `
    --allow-unauthenticated `
    --port 8080 `
    --cpu 1 `
    --memory 512Mi `
    --concurrency 80 `
    --timeout 120 `
    --min-instances 0 `
    --max-instances 10 `
    --set-env-vars "MK_AI_COMPANION_ENABLED=true,MK_TEMPLATES_AUTO_RELOAD=false"
