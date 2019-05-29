'use strict';

const { makeIndex } = require ('./helper');
const { Kafka } = require('kafkajs')
const config = require ('./config.json');
const Insert = require ('./insert');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
})

const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    host: 'elastic:changeme@localhost:9200',
    log: 'trace'
});

const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGO_URL || "mongodb://localhost:27017/";
const consumer = kafka.consumer({ groupId: 'test-group' })
const run = async () => {

    const database = await MongoClient.connect(url) ;
    const dbo = database.db("DATABASE_PRUEBAS");

    await consumer.connect()
    await consumer.subscribe({ topic: 'asd' })

    await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        console.log({
        value: message.value.toString(),
        key: message.key.toString ()
        })
        const { timestamp, value, key } = message;
        return Promise.all([dbo.collection("miPolla").insertOne({ timestamp, value, key}),  Insert ({ client, docs: JSON.parse(value.toString()), index: makeIndex ({ key: key.toString(), timestamp: parseFloat(timestamp) }), type: 'metrics' })]);
    },
    })
};

run();