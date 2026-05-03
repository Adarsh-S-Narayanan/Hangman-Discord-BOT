const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { activeGames } = require('../utils/gameState');
const User = require('../models/User');

const Word = require('../models/Word');

const hangmanStages = [
`  +---+
  |   |
      |
      |
      |
      |
=========`,
`  +---+
  |   |
  O   |
      |
      |
      |
=========`,
`  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hangman')
        .setDescription('Starts a new game of Hangman')
        .setDMPermission(false),
    async execute(interaction) {
        const channelId = interaction.channelId;

        if (activeGames.has(channelId)) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('A GAME IS ALREADY RUNNING IN THIS CHANNEL.');
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        await interaction.deferReply();

        let commandUser = await User.findOne({ userId: interaction.user.id });
        if (!commandUser) {
            commandUser = new User({ userId: interaction.user.id });
            await commandUser.save();
        }
        
        const userLevel = commandUser.level || 1;
        let targetDifficulty = Math.min(Math.ceil(userLevel / 2), 4);

        const wordDocs = await Word.find({ difficulty: targetDifficulty });
        let word = 'JAVASCRIPT';
        if (wordDocs.length > 0) {
            word = wordDocs[Math.floor(Math.random() * wordDocs.length)].word;
        }
        
        const game = {
            word: word,
            displayWord: Array(word.length).fill('_'),
            guessedLetters: [],
            mistakes: 0,
            status: 'playing',
            players: new Set(),
            playerStats: new Map()
        };

        activeGames.set(channelId, game);

        const embed = new EmbedBuilder()
            .setColor('#8B5CF6')
            .setTitle('HANGMAN')
            .setDescription(`\`\`\`\n${hangmanStages[0]}\n\`\`\`\n**WORD:** \`${game.displayWord.join(' ')}\`\n\n**GUESSED:** \`NONE\``)
            .setFooter({ text: 'TYPE A SINGLE LETTER TO GUESS' });

        const message = await interaction.editReply({ embeds: [embed] });

        const channel = interaction.client.channels.cache.get(channelId);
        if (!channel) {
            return interaction.followUp('Error: Could not find channel to start collector.');
        }
        const filter = m => m.content.length === 1 && /^[a-zA-Z]$/.test(m.content) && !m.author.bot;
        const collector = channel.createMessageCollector({ filter, time: 300000 });
        game.collector = collector;

        collector.on('collect', async m => {
            const letter = m.content.toUpperCase();
            const playerId = m.author.id;

            try {
                await m.delete();
            } catch (e) {}

            if (game.guessedLetters.includes(letter)) return;

            game.players.add(playerId);
            if (!game.playerStats.has(playerId)) {
                game.playerStats.set(playerId, 0);
            }

            game.guessedLetters.push(letter);

            if (game.word.includes(letter)) {
                let count = 0;
                for (let i = 0; i < game.word.length; i++) {
                    if (game.word[i] === letter) {
                        game.displayWord[i] = letter;
                        count++;
                    }
                }
                game.playerStats.set(playerId, game.playerStats.get(playerId) + count);
                
                if (!game.displayWord.includes('_')) {
                    game.status = 'won';
                    collector.stop('won');
                }
            } else {
                game.mistakes++;
                if (game.mistakes >= 6) {
                    game.status = 'lost';
                    collector.stop('lost');
                }
            }

            if (game.status === 'playing') {
                const updatedEmbed = new EmbedBuilder()
                    .setColor('#8B5CF6')
                    .setTitle('HANGMAN')
                    .setDescription(`\`\`\`\n${hangmanStages[game.mistakes]}\n\`\`\`\n**WORD:** \`${game.displayWord.join(' ')}\`\n\n**GUESSED:** \`${game.guessedLetters.join(', ')}\``)
                    .setFooter({ text: 'TYPE A SINGLE LETTER TO GUESS' });

                await message.edit({ embeds: [updatedEmbed] });
            }
        });

        collector.on('end', async (collected, reason) => {
            activeGames.delete(channelId);

            const finalEmbed = new EmbedBuilder()
                .setColor(game.status === 'won' ? '#00FF00' : '#FF0000')
                .setTitle(game.status === 'won' ? 'HANGMAN: VICTORY' : 'HANGMAN: DEFEAT')
                .setDescription(`\`\`\`\n${hangmanStages[game.mistakes]}\n\`\`\`\n**WORD:** \`${game.word.split('').join(' ')}\`\n\n**GUESSED:** \`${game.guessedLetters.join(', ')}\``)
                .setFooter({ text: 'GAME OVER' });

            await message.edit({ embeds: [finalEmbed] });

            for (const playerId of game.players) {
                let uRecord = await User.findOne({ userId: playerId });
                if (!uRecord) {
                    uRecord = new User({ userId: playerId });
                }

                uRecord.gamesPlayed += 1;
                
                if (game.status === 'won') {
                    uRecord.gamesWon += 1;
                    uRecord.exp += 20;
                } else if (game.status === 'lost') {
                    uRecord.gamesLost += 1;
                    uRecord.exp -= 10;
                }

                let expNeeded = uRecord.level * 100;
                if (uRecord.exp >= expNeeded) {
                    uRecord.level += 1;
                    uRecord.exp -= expNeeded;
                } else if (uRecord.exp < 0) {
                    if (uRecord.level > 1) {
                        uRecord.level -= 1;
                        uRecord.exp = (uRecord.level * 100) + uRecord.exp;
                    } else {
                        uRecord.exp = 0;
                    }
                }

                uRecord.totalLettersGuessed += game.playerStats.get(playerId) || 0;
                
                await uRecord.save();
            }
        });
    }
};
