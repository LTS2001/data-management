#
ARG BASE_IMAGE

FROM ${BASE_IMAGE} AS base

FROM base AS builder

WORKDIR /app

COPY . .

RUN pnpm build

# 选择更小体积的基础镜像
FROM nginx:alpine
WORKDIR /app/dist
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /app/dist
EXPOSE 80
# 启动nginx，关闭守护式运行，否则容器启动后会立刻关闭
CMD ["nginx", "-g", "daemon off;"]
