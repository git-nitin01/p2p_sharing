# ui/Dockerfile

FROM node:20-alpine as build
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]