'use strict';

module.exports = {
    makeIndex : ({ key, timestamp }) =>
    `${key}-${ new Date (timestamp).getMonth() + 1 }-${new Date (timestamp).getFullYear()}`
};
