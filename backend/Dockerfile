# Build context: ../learn-italian (monorepo root)

# Build stage
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/
RUN npm ci
COPY backend/ ./backend/
WORKDIR /app/backend
RUN npm run build

# Production stage
FROM node:20-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ffmpeg \
    tesseract-ocr \
    tesseract-ocr-ita \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY backend/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/backend/dist ./dist

EXPOSE 4021
ENV PORT=4021
ENV NODE_ENV=production
CMD ["node", "dist/server.js"]
