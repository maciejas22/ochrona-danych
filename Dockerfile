###################
#     BUILDER     #
###################
FROM node:18 AS BUILDER

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm i

COPY . .

RUN npm run prisma:generate
RUN npm run build

###################
#   PRODUCTION    #
###################
FROM node:18 AS PRODUCTION

WORKDIR /app

COPY --from=BUILDER /app/dist /app/dist

COPY package.json package-lock.json .env docker-entrypoint.sh /app/
COPY prisma /app/prisma

RUN npm i --omit=dev

RUN chmod +x /app/docker-entrypoint.sh
ENTRYPOINT [ "/app/docker-entrypoint.sh" ]

CMD ["npm", "run", "start"]
