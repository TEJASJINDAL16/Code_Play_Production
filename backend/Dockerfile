# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Runtime stage
FROM node:20-alpine

WORKDIR /app

ENV PORT=5000
ENV NODE_ENV=production

# Install g++ for C++ compilation (CSES judge)
RUN apk add --no-cache g++ python3 openjdk17-jre

# Copy only what's needed from build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

# Copy application source
COPY . .

# Remove dev files from the final image
RUN rm -rf tests/ .env.example .prettierrc .dockerignore

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:5000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["npm", "start"]
