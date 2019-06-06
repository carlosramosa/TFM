'use strict';

const { Kafka } = require('kafkajs')
const { gt, gte, lt, lte } = require ('lodash');
const chalk = require('chalk');
const alert = chalk.red('ALERTA');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
})

const consumer = kafka.consumer({ groupId: 'pene-group', fromBeginning: true })

const TTL = process.env.TTL || 10 * 1000;
const COUNT = process.env.COUNT || 20;
const THRESHOLD = process.env.THRESHOLD || 100;
const COMPARATOR = process.env.COMPARATOR || 'GT';
const data = {
    count: null
    , average: null
    , timestamp: null
};
const calculateAverage = ({ count, average }) => value => 
    ((average * count) + value) / (count + 1);

const processors = {
    GTE: gte,
    LTE: lte,
    LT: lt,
    GT: gt
};

const run = async () => {


    await consumer.connect();
    await consumer.subscribe({ topic: 'to-alerts' });

    await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        console.log({
        value: message.value.toString(),
        key: message.key.toString ()
        })
        const { timestamp, value: valueKfk, key } = message;

        const value = parseInt(valueKfk.toString());

        if (!data.timestamp) {
            data.timestamp = Date.now();
            data.average = value;
            data.count = 1;
        }
        else {
            console.info('Media: ' + data.average);
            data.average = calculateAverage ({ count: data.count, average: data.average || value }) (value);
            data.count ++;
            if (Date.now() - data.timestamp >  TTL || data.count > COUNT ) {
                if (processors[COMPARATOR](data.average, THRESHOLD) ){
                    console.log(alert + '\nLa media es: ' + data.average);
                    data.timestamp = null;
                }
                if (data.count > COUNT){
                    console.log('Se han procesado ' + data.count + ' documentos');
                }
            }
        }
    }
    });
};

run();