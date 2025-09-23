FROM node:22.19.0-alpine AS build
WORKDIR /usr/src/app

COPY . .
RUN npm ci
RUN npm run build

FROM nginx:1.24.0-alpine
COPY --from=build /usr/src/app/dist/client/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
