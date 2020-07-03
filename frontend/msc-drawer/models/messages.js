const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    sessionId : String,
    from: String,
    to: String,
    label: String,
    headers: Object,
    params: Object,
    body: String,
    created_at: { type: Date, default: Date.now},
    read_only: {type: Boolean, default: false}
});

module.exports = mongoose.model('Message', MessageSchema);
