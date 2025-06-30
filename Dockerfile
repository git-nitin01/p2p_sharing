
FROM openjdk:17-jdk-alpine AS builder
WORKDIR /app
COPY . .
RUN ./gradlew clean build

FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY --from=builder /app/app/build/libs/*.jar app.jar
CMD ["java", "-jar", "app.jar"]
