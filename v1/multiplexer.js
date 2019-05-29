'use strict';

const { makeIndex } = require ('./helper');
const { Kafka } = require('kafkajs')
const config = require ('./config.json');
const Insert = require ('./insert');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
})

const consumer = kafka.consumer({ groupId: 'test-group' });

const run = async () => {

    await consumer.connect()
    await consumer.subscribe({ topic: 'asd' })
    const producer = kafka.producer()
    await producer.connect();
    // await consumer.subscribe({ topic: 'asdasd' })
    // await consumer.subscribe({ topic: 'asdasdasd' })

    await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {

        console.log ('Send message ' + message);
        const topicMessages = [
            {
                topic: 'to-mongo',
                messages: [message],
            },
            {
                topic: 'to-elastic',
                messages: [message],
            },
            {
                topic: 'to-alerts',
                messages: [message]
            }
        ];

        await producer.sendBatch({ topicMessages })
    },
    })
};

run();