FROM node:18-alpine AS base

ENV NEXT_PUBLIC_API_URL="http://api:5000/"
ENV NEXT_PUBLIC_APP_NAME="Social Connect"

ENV TURBO_TELEMETRY_DISABLED=1
ENV PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH"
RUN corepack enable \
    && pnpm add -g turbo@latest

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm turbo prune web --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json .
RUN pnpm install --frozen-lockfile
COPY --from=builder /app/out/full .
RUN pnpm turbo run build

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

CMD node apps/web/server.js
