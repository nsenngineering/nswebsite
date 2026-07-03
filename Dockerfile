# Build stage for the Next.js application
FROM node:20-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_JSON_SERVER_URL=http://localhost:5002
ENV NEXT_PUBLIC_JSON_SERVER_URL=${NEXT_PUBLIC_JSON_SERVER_URL}

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
RUN npm run build:local

# Runtime stage
FROM node:20-alpine AS runner
WORKDIR /app

ARG NEXT_PUBLIC_JSON_SERVER_URL=http://localhost:5002
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_PUBLIC_JSON_SERVER_URL=${NEXT_PUBLIC_JSON_SERVER_URL}

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/out ./out
COPY --from=builder /app/db.json ./db.json

EXPOSE 3000
CMD ["npm", "run", "start"]
