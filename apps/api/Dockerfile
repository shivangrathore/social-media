FROM node:22-alpine as base

ENV TURBO_TELEMETRY_DISABLED=1
ENV PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH"
RUN corepack enable \
    && pnpm add -g turbo@latest

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm turbo prune api --docker


FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json .
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full .
RUN pnpm turbo run build

FROM base AS runner
WORKDIR /app
COPY --from=installer /app/. ./
WORKDIR /app/apps/api
CMD ["./run.sh"]
