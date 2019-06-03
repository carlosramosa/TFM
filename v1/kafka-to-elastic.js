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

const consumer = kafka.consumer({ groupId: 'pene-group', fromBeginning: true })

const run = async () => {


    await consumer.connect()
    await consumer.subscribe({ topic: 'to-elastic' })

    await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        console.log({
        value: message.value.toString(),
        key: message.key.toString ()
        })
        const { timestamp, value, key } = message;
        return Insert ({ client, docs: { ...JSON.parse(value.toString()), date: new Date (parseFloat(timestamp))}, index: makeIndex ({ key: key.toString(), timestamp: parseFloat(timestamp) }), type: 'metrics' });
    }
    })
};

run();