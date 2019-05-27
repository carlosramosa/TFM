'use strict'; 
const ObjectId = require ('bson-objectid')

const bodyBulkInsert = ({ docs, index, type }) =>
    (typeof docs === 'object' ? [docs] : docs ).reduce((acc, item, i) => {

        const obj = { index:  { _index: index, _type: type, _id: ObjectId().toString() } };
        return acc.concat([obj, item]);
    }, []);



module.exports = ({ client, docs, index, type }) =>

    client.bulk(
    {
        body: bodyBulkInsert({ docs, index, type })
    }
);
