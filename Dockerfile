# syntax=docker/dockerfile:1
# Dev-образ: Vite на :3000. Не для продакшену (немає nginx / vite build).

ARG NODE_VERSION=18.14.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

# Без .git husky install падає. Не оновлюйте npm@latest — він не сумісний з Node 18.14.
ENV HUSKY=0
# Щоб Vite не намагався відкрити браузер у контейнері (server.open).
ENV DOCKER=1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
