# 構建階段
FROM node:22-bullseye-slim AS builder
WORKDIR /app
COPY . .
RUN npm i -g yarn --force
ENV NODE_ENV=development
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN yarn
RUN yarn build

# 運行階段
FROM node:22-bullseye-slim AS runner
WORKDIR /app
COPY --from=builder /app/build .
RUN npm i -g yarn --force
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN yarn --production
EXPOSE 8080
CMD ["node", "bin/server.js"]