'use strict';

/*
    { value: '{"quality":720,"ping":149}' }
*/

const {KafkaStreams} = require("kafka-streams");
const config = require ('./config.json');

const kafkaStreams = new KafkaStreams(config);

kafkaStreams.on("error", (error) => {
    console.log("Error occured:", error.message);
});

//creating a ktable requires a function that can be
//used to turn the kafka messages into key-value objects
//as tables can only be built on key-value pairs

const keyValueMapperEtl = ({ value, key })  => {

    const message = { 'key': ( typeof key !== 'string' ? 'youtube' : key) + Date.now(), 'value': JSON.parse(value) };

    console.log ('Message consumed  ---->  ' + JSON.stringify(message));

    return message;
}

const makeSearch = () => {

    

}


const run = async () => {
    makeSearch();

    setTimeout (() => {
        run ();
    }, 1000)
};

run ()
    .catch (console.error);
