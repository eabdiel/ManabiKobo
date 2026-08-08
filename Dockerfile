# Manabi Kōbō — Google Cloud Run production image
FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8080

WORKDIR /app

# Install dependencies separately so Cloud Build can reuse this layer.
COPY requirements.txt ./
RUN python -m pip install --upgrade pip \
    && python -m pip install --no-cache-dir -r requirements.txt

# Copy only the application files allowed by .dockerignore.
COPY . .

# Tutorial screenshots and stylesheet are runtime assets. Fail the image build
# instead of deploying a revision with a partially rendered How-to guide.
RUN test -f /app/app/static/css/how-to-use.css \
    && test -f /app/app/static/assets/tutorial/desktop-home.png \
    && test -f /app/app/static/assets/tutorial/mobile-home.jpg \
    && test -f /app/app/static/assets/tutorial/desktop-ide.png \
    && test -f /app/app/static/assets/tutorial/mobile-ide.jpg

# Run as a non-root user in production.
RUN addgroup --system manabi \
    && adduser --system --ingroup manabi --home /app manabi \
    && chown -R manabi:manabi /app
USER manabi

EXPOSE 8080

# Cloud Run injects PORT. Gunicorn configuration reads it at startup.
CMD ["gunicorn", "--config", "gunicorn.conf.py", "main:app"]
