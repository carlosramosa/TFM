const { Kafka } = require('kafkajs');

const MAX_VALUE = process.env.MAX_VALUE || 100;
const MIN_VALUE = process.env.MIN_VALUE || 1;
const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';
const TEST = process.env.TEST || 'speed-up';
const TIMEOUT = process.env.TIMEOUT || 1000;
const MULTIPLEXER_TOPIC = process.env.MULTIPLEXER_TOPIC || 'to-multiplexer';


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
    ];
    await producer.send({
        topic: MULTIPLEXER_TOPIC,
        messages
    });
    setTimeout((() => {
        console.log (messages);
        run();
    }), TIMEOUT);
}

run ()
    .catch (console.error);
