# app/Dockerfile

FROM gradle:8.4.0-jdk17 AS builder
WORKDIR /app
COPY . .
RUN gradle clean build

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/build/libs/app.jar app.jar
CMD ["java", "-jar", "app.jar"]
