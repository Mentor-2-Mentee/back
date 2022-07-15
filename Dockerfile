#install
FROM node:10 AS builder
WORKDIR /app
COPY . .
RUN npm install -g
RUN npm run build

#build
FROM node:10-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 80
EXPOSE 443
EXPOSE 8081
EXPOSE 8083

CMD ["npm", "run", "start:prod"]