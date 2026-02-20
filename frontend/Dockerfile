# Build context: ../learn-italian (monorepo root)

# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/
RUN npm ci
COPY frontend/ ./frontend/
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
WORKDIR /app/frontend
RUN npm run build

# Production stage
FROM node:20-alpine
RUN npm install -g serve@14
WORKDIR /app
COPY --from=builder /app/frontend/dist ./dist
EXPOSE 4020
CMD ["serve", "dist", "-l", "4020", "-s"]
