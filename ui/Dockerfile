# ui/Dockerfile

FROM node:20-alpine AS build
WORKDIR /app
COPY . .
COPY .env .env
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]