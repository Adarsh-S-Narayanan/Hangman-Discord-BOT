const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows a list of all commands'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#8B5CF6')
            .setTitle('Hangman Bot Commands')
            .addFields(
                { name: '/hangman', value: 'Starts a new game of Hangman in the current channel.' },
                { name: '/rank', value: 'Shows your current rank, level, and EXP bar.' },
                { name: '/quit', value: 'Quits the currently active Hangman game in this channel.' },
                { name: '/leaderboard', value: 'Shows the global leaderboard for Hangman players.' },
                { name: '/help', value: 'Shows this help message.' }
            );

        await interaction.reply({ embeds: [embed] });
    }
};
