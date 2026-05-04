require('dotenv').config();
const mongoose = require('mongoose');
const Word = require('./models/Word');
const wordsData = require('./utils/words_with_clues.json');

const seedWords = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Word.deleteMany({});
        console.log('Cleared existing words in the collection');

        await Word.insertMany(wordsData);
        console.log(`Successfully seeded database with ${wordsData.length} words with clues!`);

        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedWords();
