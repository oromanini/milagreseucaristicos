FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Instala compiladores e dependências de sistema necessárias.
RUN apt-get update && apt-get install -y \
    build-essential \
    libffi-dev \
    libssl-dev \
    autoconf \
    automake \
    libtool \
    cmake \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Confirmado que seu arquivo é server.py
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 server:app
