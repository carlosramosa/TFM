FROM openjdk:8-jre

ENV CEREBRO_VERSION 0.8.1
RUN cd /opt/ \
    && wget -O cerebro-${CEREBRO_VERSION}.tgz https://github.com/lmenezes/cerebro/releases/download/v${CEREBRO_VERSION}/cerebro-${CEREBRO_VERSION}.tgz \
    && tar zxvf cerebro-${CEREBRO_VERSION}.tgz \
    && rm cerebro-${CEREBRO_VERSION}.tgz \
    && mkdir cerebro-${CEREBRO_VERSION}/logs \
    && mv cerebro-${CEREBRO_VERSION} cerebro

WORKDIR /opt/cerebro
EXPOSE 9000
CMD ["./bin/cerebro"]


FROM confluentinc/cp-kafka-connect:5.2.1

ENV CONNECT_PLUGIN_PATH="/usr/share/java,/usr/share/confluent-hub-components"

RUN confluent-hub install --no-prompt confluentinc/kafka-connect-datagen:latest
