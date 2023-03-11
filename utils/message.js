const moment = require('moment');

function formatMessages(username, message) {
    return {
        username,
        message,
        time : moment().format('h:mm a')
    }
}

module.exports = formatMessages;