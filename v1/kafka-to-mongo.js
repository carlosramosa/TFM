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
const consumer = kafka.consumer({ groupId: 'mitopic', fromBeginning: true })
const run = async () => {

    const database = await MongoClient.connect(MONGO_URL) ;
    const dbo = database.db("DATABASE_PRUEBAS");

    await consumer.connect()
    await consumer.subscribe({ topic: MONGO_TOPIC })

    await consumer.run({
    eachMessage: async ({ message }) => {
        console.log({
        value: message.value.toString(),
        key: message.key.toString ()
        })
        const { timestamp, value, key } = message;
        return dbo.collection("miPolla").insertOne({ timestamp, value: parseInt(value.toString()), test: key.toString()});
    },
    })
};

run();