'use strict';

const Moment = require ('moment');

module.exports = {
    makeIndex : ({ test, timestamp }) =>
    `${test}-${Moment(timestamp).get('month') + 1 }-${Moment(timestamp).get('year')}`
};
