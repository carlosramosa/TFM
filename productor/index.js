const { Kafka } = require('kafkajs')
 
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
})

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'test-group' })
let message = '';

const run = async () => {
  // Producing
    await producer.connect()
    message = { value: JSON.stringify({quality: 720, ping: Math.floor(Math.random() * 200) + 1 })};
    await producer.send({
        topic: 'mitopic',
        messages: [
            { value: JSON.stringify({quality: 720, ping: Math.floor(Math.random() * 200) + 1 })}
        ]
    });
    setTimeout((() => {
        console.log (message);
        run();
    }), 1000);
}

run ()
    // .then(process.exit(0))
    .catch (console.error);

