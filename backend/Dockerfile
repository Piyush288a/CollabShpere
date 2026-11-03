# Multi-stage production Dockerfile for CollabSphere Backend
FROM node:18-alpine AS base

WORKDIR /usr/src/app

# Install dependencies (only production packages)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application code
COPY . .

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Use non-root node user for security
USER node

# Start server
CMD ["node", "server.js"]
