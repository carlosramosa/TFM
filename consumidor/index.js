'use strict';

const {KafkaStreams} = require("kafka-streams");
const config = require ('./config.json');

const kafkaStreams = new KafkaStreams(config);
kafkaStreams.on("error", (error) => console.error(error));

const kafkaTopicName = "mitopic";
const stream = kafkaStreams.getKStream(kafkaTopicName);
stream.forEach((message) => {
    console.log('================================');
    console.log("key", message.key ? message.key.toString("utf8") : null);
    console.log("value", message.value ? message.value.toString("utf8") : null);
    console.log("partition", message.partition);
    console.log("size", message.size);
    console.log("offset", message.offset);
    console.log("timestamp", message.timestamp);
    console.log("topic", message.topic);
    console.log('================================');
});

stream.start().then(() => {
    console.log("stream started, as kafka consumer is ready.");
}, error => {
    console.log("streamed failed to start: " + error);
});