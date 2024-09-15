FROM amazoncorretto21

ARG JAR_FILE=buildlibsKbBankService-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

EXPOSE 8083

ENTRYPOINT [java,-jar,app.jar]
