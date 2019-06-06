'use strict';

const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    host: 'elastic:changeme@localhost:9200',
    log: 'trace'
});



const exec = ({ client, index = process.env.INDEX, type = process.env.TYPE, properties = JSON.parse(process.env.PROPERTIES) }) =>
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
    /**
     * {
                    'properties': {
                        'id': {'type': 'integer'},
                        'identifier': {'type': 'keyword'},
                        'species_id': {'type': 'integer'},
                        'height': {'type': 'integer'},
                        'weight': {'type': 'integer'},
                        'base_experience': {'type': 'integer'},
                        'order': {'type': 'integer'},
                        'is_default': {'type': 'integer'}
                    }
                }
     */