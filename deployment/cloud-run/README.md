# Google Cloud Run deployment

This directory contains optional deployment helpers. Run them from the repository root after installing and authenticating the Google Cloud CLI.

## PowerShell

```powershell
.\deployment\cloud-run\deploy.ps1 -ProjectId "YOUR_PROJECT_ID" -Region "us-east1"
```

## Bash

```bash
export PROJECT_ID="YOUR_PROJECT_ID"
export REGION="us-east1"
./deployment/cloud-run/deploy.sh
```

The scripts deploy from source, so Cloud Build uses the root `Dockerfile`. The service is public, listens on port 8080, scales to zero, and uses conservative starter limits suitable for this stateless site.

After deployment, verify:

```text
https://YOUR_SERVICE_URL/health
https://YOUR_SERVICE_URL/en/
https://YOUR_SERVICE_URL/es/
https://YOUR_SERVICE_URL/service-worker.js
```

Custom-domain mapping and DNS should be completed only after the generated Cloud Run URL passes these checks.
