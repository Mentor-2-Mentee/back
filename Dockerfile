#install
FROM node:10 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

#build
FROM node:10-alpine
WORKDIR /app
COPY --from=builder /app ./
VOLUME ./../../mnt/hdd1/m2m_public:/app/public
EXPOSE 80
EXPOSE 443
EXPOSE 8081
EXPOSE 8083

CMD ["npm", "run", "start:prod"]