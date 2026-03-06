# Stage 1: Build the application using Maven
FROM maven:3.9-eclipse-temurin-25-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# We skip tests here to drastically speed up your build times
RUN mvn clean package -DskipTests

# Stage 2: Run the compiled JAR
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]