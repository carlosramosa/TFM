'use strict';

const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    host: 'elastic:changeme@localhost:9200',
    log: 'trace'
});

const makeIndex = ( test ) =>
    `${test}-${ new Date ().getMonth() + 1 }-${new Date ().getFullYear()}`


const exec = ({ client, index = makeIndex(process.env.TEST || 'speed-up'), type = process.env.TYPE, properties = { value: { type: 'long' }, date: { type: 'date' } } }) =>
    client.indices.create({
        index,
        body: {
            mappings: {
                [type]: {
                    properties
                }
            }
        }
    });
exec ({ client });