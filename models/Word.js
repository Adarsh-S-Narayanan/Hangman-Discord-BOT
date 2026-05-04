const { Schema, model } = require('mongoose');

const wordSchema = new Schema({
    word: { type: String, required: true, unique: true },
    difficulty: { type: Number, required: true },
    clue: { type: String, default: 'No specific clue available.' }
});

module.exports = model('Word', wordSchema);
