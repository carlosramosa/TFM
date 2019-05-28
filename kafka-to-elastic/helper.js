'use strict';

const Moment = require ('moment');

module.exports = {
    makeIndex : ({ key, timestamp }) =>
    `${key}-${Moment(timestamp).get('month') + 1 }-${Moment(timestamp).get('year')}`
};
