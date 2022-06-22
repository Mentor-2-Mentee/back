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
EXPOSE 80

CMD ["npm", "run", "start:prod"]