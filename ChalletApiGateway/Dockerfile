FROM amazoncorretto:21

ARG JAR_FILE=build/libs/ChalletApiGateway-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

EXPOSE 8000

ENTRYPOINT ["java","-jar","/app.jar"]