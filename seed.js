require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedData = [
    { userId: '111111111111111111', gamesPlayed: 50, gamesWon: 45, gamesLost: 5, totalLettersGuessed: 350 },
    { userId: '222222222222222222', gamesPlayed: 40, gamesWon: 30, gamesLost: 10, totalLettersGuessed: 280 },
    { userId: '333333333333333333', gamesPlayed: 60, gamesWon: 25, gamesLost: 35, totalLettersGuessed: 190 },
    { userId: '444444444444444444', gamesPlayed: 20, gamesWon: 18, gamesLost: 2, totalLettersGuessed: 140 },
    { userId: '555555555555555555', gamesPlayed: 80, gamesWon: 10, gamesLost: 70, totalLettersGuessed: 85 }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await User.deleteMany({});
        console.log('Cleared existing data in the Users collection');

        await User.insertMany(seedData);
        console.log('Successfully seeded database with 5 mock players!');

        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedDB();
