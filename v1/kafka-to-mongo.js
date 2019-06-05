'use strict';

const { Kafka } = require('kafkajs')
const config = require ('./config.json');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});

const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGO_URL || "mongodb://localhost:27017/";
const consumer = kafka.consumer({ groupId: 'mitopic', fromBeginning: true })
const run = async () => {

    const database = await MongoClient.connect(url) ;
    const dbo = database.db("DATABASE_PRUEBAS");

    await consumer.connect()
    await consumer.subscribe({ topic: 'to-mongo' })

    await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
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