"use strict";

const { KafkaStreams } = require("kafka-streams");
const  config = require("./config.json");

const kafkaStreams = new KafkaStreams({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});

kafkaStreams.on("error", (error) => {
    console.log("Error occured:", error.message);
});

const consumeStream = kafkaStreams.getKStream("to-alerts");

const windowPeriod = 30 * 1000; // 30 seconds
const from = Date.now();
const to = Date.now() + windowPeriod;

//window will collect messages that fall in the period range
//a message with a timestamp larger or equal to "to" will end the window
//and emit all collected messages on the returned stream
const { stream, abort } = consumeStream.window(from, to);

stream
    .take(10) //take the first 10 messages from within the window and close the stream
    .forEach(windowMessage => {
        console.log(windowMessage); //do something with the message that was within the window
    }).then(_ => {
        //done
        kafkaStreams.closeAll();
    });

//start the stream
consumeStream.start();