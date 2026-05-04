require('dotenv').config();
const mongoose = require('mongoose');
const Word = require('./models/Word');

async function addClues() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const words = await Word.find({ clue: { $exists: false } });
        console.log(`Found ${words.length} words needing clues.`);

        for (let i = 0; i < words.length; i++) {
            const doc = words[i];
            const originalWord = doc.word;
            
            try {
                const res = await fetch(`https://api.datamuse.com/words?ml=${originalWord}`);
                const data = await res.json();
                
                let clueWords = data
                    .map(x => x.word)
                    .filter(w => !w.toLowerCase().includes(originalWord.toLowerCase()) && !originalWord.toLowerCase().includes(w.toLowerCase()));
                
                let clue = "No specific clue available.";
                if (clueWords.length > 0) {
                    clue = `Related terms: ${clueWords.slice(0, 3).join(', ')}`;
                }

                doc.clue = clue;
                await doc.save();

                if (i % 50 === 0) {
                    console.log(`Updated ${i} words...`);
                }
            } catch (err) {
                console.error(`Error fetching clue for ${originalWord}:`, err.message);
                doc.clue = "No specific clue available.";
                await doc.save();
            }
            
            // Sleep slightly to avoid Datamuse rate limits (though it's quite generous)
            await new Promise(r => setTimeout(r, 50));
        }

        console.log('Done adding clues!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

addClues();
