FROM node:20 as build-stage
WORKDIR /challet

RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

FROM nginx:stable-alpine as production-stage

COPY conf/nginx.conf /etc/nginx/nginx.conf

COPY --from=build-stage /challet/dist /usr/share/nginx/html
COPY --from=build-stage /challet/dev-dist /usr/share/nginx/html

EXPOSE 4000

CMD ["nginx", "-g", "daemon off;"]
