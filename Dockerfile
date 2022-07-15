#install
FROM node:16 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

#build
FROM node:16
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 80
EXPOSE 443
EXPOSE 8081
EXPOSE 8083

CMD ["npm", "run", "start:prod"]