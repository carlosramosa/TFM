'use strict';

const { KafkaStreams } = require('kafka-streams');
const config = require ('./config.json');

const kafkaStreams = new KafkaStreams(config);
const stream$ = kafkaStreams.getKStream('mitopic');

kafkaStreams.on('error', (error) => {
    console.log('Error occured:', error.message);
});

const [one$, two$] = stream$
    .branch([() => true, () => true]);

    stream$
    .mapJSONConvenience()
    .mapWrapKafkaValue()
    .tap((msg) =>
        console.log('one', msg))
     .wrapAsKafkaValue()
    .to('elastic-topic', 1, 'buffer');

// const producerPromiseTwo = two$
//     .mapJSONConvenience()
//     .mapWrapKafkaValue()
//     .tap((msg) => console.log('two', msg))
//     .wrapAsKafkaValue()
//     .to('output-topic-2', 1, 'buffer');

// Promise.all([
//     producerPromiseOne,
    //producerPromiseTwo,
    stream$.start();
// ]).then(() => {
//     console.log('Stream started, as kafka consumer and producers are ready.');
// }, (error) => {
//     console.log('Streaming operation failed to start: ', error);
// });
