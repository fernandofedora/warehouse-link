const { format } = require('timeago.js');
const handlebars = require('handlebars');


const helpers = {};

helpers.timeago = (savedTimestamp) => {
    return format(savedTimestamp);
};


module.exports = helpers;