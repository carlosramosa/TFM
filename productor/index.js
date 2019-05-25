const { Kafka } = require('kafkajs');

const TOPIC = 'mitopic';

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
})

const generateMessage = () => (
    { key: 'youtube', value: JSON.stringify({quality: qualities[Math.floor(Math.random() * 6) ], ping: Math.floor(Math.random() * 200) + 1 })}
);

const qualities = [360, 480, 720, 1080, 1440, 2160];

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'test-group' })
//let messages = [];

const run = async () => {
  // Producing
    await producer.connect()
    //message = { key: 'youtube', value: JSON.stringify({quality: qualities[Math.floor(Math.random() * 6) ], ping: Math.floor(Math.random() * 200) + 1 })};
    const messages = [
        generateMessage ()
        , generateMessage ()
        , generateMessage ()
    ];
    await producer.send({
        topic: 'mitopic',
        messages
    });
    setTimeout((() => {
        console.log (messages);
        run();
    }), 1000);
}

run ()
    .catch (console.error);

