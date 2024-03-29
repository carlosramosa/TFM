'use strict';

const { Kafka } = require('kafkajs')
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/';
const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';
const MONGO_TOPIC = process.env.MONGO_TOPIC || 'to-mongo';

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [KAFKA_BROKER]
});

const MongoClient = require('mongodb').MongoClient;
const consumer = kafka.consumer({ groupId: 'mongo-group', fromBeginning: true })
const run = async () => {

    const database = await MongoClient.connect(MONGO_URL) ;
    const dbo = database.db("database");

    await consumer.connect()
    await consumer.subscribe({ topic: MONGO_TOPIC })

    await consumer.run({
    eachMessage: async ({ message }) => {
        console.log('Insertando a MongoDB ' + JSON.stringify({
            value: message.value.toString(),
            key: message.key.toString ()
        }));
        const { timestamp, value, key } = message;
        return dbo.collection("metrics").insertOne({ timestamp, value: parseInt(value.toString()), test: key.toString()});
    }
    })
};

run();