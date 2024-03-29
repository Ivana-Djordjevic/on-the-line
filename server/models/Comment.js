const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    content: String,
    user: { type: Schema.Types.ObjectId, ref: 'user' },
});

module.exports = commentSchema;