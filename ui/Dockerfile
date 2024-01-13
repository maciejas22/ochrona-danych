###################
#     BUILDER     #
###################
FROM node:18 AS BUILDER

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm i

COPY . .

RUN npm run build

###################
#   PRODUCTION    #
###################
FROM nginx AS PRODUCTION

COPY --from=BUILDER /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf