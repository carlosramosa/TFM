'use strict';

const { KafkaStreams } = require("kafka-streams");
const { makeIndex } = require ('./helper');
const config = require ('./config.json');
const Insert = require ('./insert');
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    host: 'elastic:changeme@localhost:9200',
    log: 'trace'
});

const makeSearch = async () => {

    const ELASTIC_TOPIC = process.env.ELASTIC_TOPIC || 'mitopic';
    const kafkaStreams = new KafkaStreams(config);

    kafkaStreams.on('error', (error) => {
        console.log('Error occured:', error.message);
    });

    const consumeStream = kafkaStreams.getKStream('asd');

    const windowPeriod = 5 * 1000; // 10 seconds
    const from = Date.now();
    const to = Date.now() + windowPeriod;

    //window will collect messages that fall in the period range
    //a message with a timestamp value: { key, value }  larger or equal to 'to' will end the window
    //and emit all collected messages on the returned stream
    const { stream, abort } = consumeStream.window(from, to);
    const keyMapper = ({ time, value: { key, value } }) =>
        ({ ts: time, key: key.toString(), value: JSON.parse(value.toString()) });
    stream
        //.take(10) //take the first 10 messages from within the window and close the stream
        .map(keyMapper)
        .forEach(windowMessage =>
            
            Insert ({ client, docs: windowMessage.value, index: makeIndex ({ key: windowMessage.key, timestamp: windowMessage.ts }), type: 'metrics' })
        ).then(_ => {
            //done
            kafkaStreams.closeAll();
            run();
        });

    //start the stream
    consumeStream.start();
}

const run = async () => {

    await makeSearch ();
};

run()
    .catch (console.error);