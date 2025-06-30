# app/Dockerfile

FROM gradle:8.4.0-jdk17-alpine AS builder
WORKDIR /app
COPY . .
RUN ./gradlew build --no-daemon

FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/app.jar app.jar
CMD ["java", "-jar", "app.jar"]
