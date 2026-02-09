ARG BASE_IMAGE=nginx:alpine
FROM $BASE_IMAGE

WORKDIR /usr/share/nginx/html

# 复制默认nginx配置
COPY deploy/nginx.conf /etc/nginx/nginx.conf

# 复制预构建的静态资源
COPY dist/ .

# 复制版本信息文件
COPY version.html .

# 暴露端口
EXPOSE 80 31180 31181

# 镜像包含默认nginx.conf,可通过volume挂载自定义配置覆盖:
CMD ["nginx", "-g", "daemon off;"]
