FROM amazoncorretto:21

ARG JAR_FILE=build/libs/ChalletService-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

EXPOSE 8081

ENTRYPOINT ["java","-jar","/app.jar"]