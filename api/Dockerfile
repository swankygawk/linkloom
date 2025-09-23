FROM node:22.19.0-alpine AS base
WORKDIR /usr/src/app

FROM base AS build
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM base AS production
ENV NODE_ENV=production
COPY --from=build /usr/src/app/package*.json .
RUN npm ci --omit=dev
COPY --from=build /usr/src/app/prisma ./prisma
RUN npx prisma generate
COPY --from=build /usr/src/app/dist/ ./dist

EXPOSE 3000

ENTRYPOINT ["sh", "-c", "npx prisma migrate deploy && exec node dist/main"]
