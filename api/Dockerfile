# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
# Install ALL dependencies (including devDeps for build/scripts if needed)
RUN npm install
COPY . .
RUN npx prisma generate

# Stage 2: Runner
FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 8080
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npm start"]
