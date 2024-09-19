FROM node:20 as build-stage
WORKDIR /app
COPY package*.json ./

RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage

# 저장된 경로에서 nginx.conf 파일을 복사
COPY conf/nginx.conf /etc/nginx/nginx.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/dev-dist /usr/share/nginx/html

EXPOSE 4000
CMD ["nginx", "-g", "daemon off;"]
