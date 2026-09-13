FROM eclipse-temurin:21-jre

WORKDIR /app

COPY target/complaint-service-1.0.0.jar app.jar

EXPOSE 8089

ENTRYPOINT ["java", "-jar", "app.jar"]