const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    gamesPlayed: { type: Number, default: 0 },
    gamesWon: { type: Number, default: 0 },
    gamesLost: { type: Number, default: 0 },
    totalLettersGuessed: { type: Number, default: 0 },
    exp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    points: { type: Number, default: 0 }
});

module.exports = model('User', userSchema);
