FROM amazoncorretto21

ARG JAR_FILE=buildlibsBankService-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

EXPOSE 8082

ENTRYPOINT [java,-jar,app.jar]