# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build both frontend and backend
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Install curl for health check
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || curl -f http://localhost:5000/ || exit 1

# Start the application
CMD ["npm", "start"]
