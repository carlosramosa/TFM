'use strict';

const { Kafka } = require('kafkajs')

const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';
const MULTIPLEXER_TOPIC = process.env.MULTIPLEXER_TOPIC || 'to-multiplexer';


const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [KAFKA_BROKER]
})

const consumer = kafka.consumer({ groupId: 'test-group' });

const run = async () => {

    await consumer.connect()
    await consumer.subscribe({ topic: MULTIPLEXER_TOPIC })
    const producer = kafka.producer()
    await producer.connect();

    await consumer.run({
    eachMessage: async ({ message }) => {

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
    }
    })
};

run();