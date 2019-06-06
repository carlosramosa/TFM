'use strict';

const { Kafka } = require('kafkajs')
const Insert = require ('./insert');

const ELASTIC_URL = process.env.ELASTIC_URL || 'elastic:changeme@localhost:9200';
const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';
const ELASTIC_TOPIC = process.env.ELASTIC_TOPIC || 'to-elastic';

const makeIndex = ({ key, timestamp }) =>
    `${key}-${ new Date (timestamp).getMonth() + 1 }-${new Date (timestamp).getFullYear()}`

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [KAFKA_BROKER]
});

const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    host: ELASTIC_URL,
    log: 'trace'
});

const consumer = kafka.consumer({ groupId: 'elastic-group', fromBeginning: true })

const run = async () => {


    await consumer.connect()
    await consumer.subscribe({ topic: ELASTIC_TOPIC })

    await consumer.run({
    eachMessage: async ({ message }) => {
        console.log('Insertando a elastic search ' + JSON.stringify({
        value: message.value.toString(),
        key: message.key.toString ()
        }));
        const { timestamp, value, key } = message;
        return Insert ({ client, docs: { value: JSON.parse(value.toString()), date: new Date (parseFloat(timestamp))}, index: makeIndex ({ key: key.toString(), timestamp: parseFloat(timestamp) }), type: 'metrics' });
    }
    })
};

run();