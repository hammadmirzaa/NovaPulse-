FROM python:3.11-slim
 
WORKDIR /app
 
# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*
 
# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH="/app"
 
# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
 
# Create a non-root user
RUN addgroup --system appgroup && adduser --system --group appuser
 
# Copy application code
COPY . .
 
# Change ownership of the app directory
RUN chown -R appuser:appgroup /app
 
# Switch to non-root user
USER appuser
 
# Expose port
EXPOSE 8000
 
# Health check instruction
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1
 
# Default command for production
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
