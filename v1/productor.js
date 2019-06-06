const { Kafka } = require('kafkajs');

const MAX_VALUE = process.env.MAX_VALUE || 0;
const MIN_VALUE = process.env.MIN_VALUE || 100;
const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';
const TEST = process.env.TEST || 'speed-up';
const TIMEOUT = process.env.TIMEOUT || 1000;

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [KAFKA_BROKER]
})

const generateMessage = () => (
    { key: TEST, value: (Math.floor(Math.random() * MAX_VALUE) + MIN_VALUE).toString() }
);

const producer = kafka.producer()

const run = async () => {
    await producer.connect()
    const messages = [
        generateMessage ()
        // , generateMessage ()
        // , generateMessage ()
    ];
    await producer.send({
        topic: 'asd',
        messages
    });
    setTimeout((() => {
        console.log (messages);
        run();
    }), 1000);
}

run ()
    .catch (console.error);
