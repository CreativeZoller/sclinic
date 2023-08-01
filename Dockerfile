#Test dockerfile builder for EKARTON3 frontend
FROM node:19-alpine AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm ci && npm run build --configuration=$ENVIRONMENT

FROM nginx:alpine

COPY --from=build /usr/src/app/src/environments/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/ekarton3 /usr/share/nginx/html

EXPOSE 80