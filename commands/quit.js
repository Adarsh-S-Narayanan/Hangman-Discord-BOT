const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { activeGames } = require('../utils/gameState');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quit')
        .setDescription('Quits the currently active Hangman game in this channel'),
    async execute(interaction) {
        const channelId = interaction.channelId;
        
        if (!activeGames.has(channelId)) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('There is no active Hangman game in this channel.');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const game = activeGames.get(channelId);
        
        if (game.collector) {
            game.status = 'lost';
            game.collector.stop('quit');
        } else {
            activeGames.delete(channelId);
        }

        const embed = new EmbedBuilder()
            .setColor('#8B5CF6')
            .setDescription('The game has been forcefully quit.');
            
        await interaction.reply({ embeds: [embed] });
    }
};
