FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Instala ferramentas de compilação
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

# Instala as dependências
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# MUDANÇA: Usando uvicorn direto (já que gunicorn não está instalado)
CMD exec uvicorn server:app --host 0.0.0.0 --port $PORT
