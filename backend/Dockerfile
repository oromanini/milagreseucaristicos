FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# --- CORREÇÃO AQUI ---
# Instala compiladores e dependências de sistema necessárias
# para 'cryptography', 'pandas', 'jq' e outros.
RUN apt-get update && apt-get install -y \
    build-essential \
    libffi-dev \
    libssl-dev \
    python3-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*
# ---------------------

COPY requirements.txt .

# Aumentei o timeout porque pandas e numpy demoram para instalar
RUN pip install --no-cache-dir --default-timeout=100 -r requirements.txt

COPY . .

# Confirmado que seu arquivo é server.py
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 server:app
