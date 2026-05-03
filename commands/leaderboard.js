const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the top 10 Hangman players globally')
        .setDMPermission(false),
    async execute(interaction) {
        await interaction.deferReply();

        const topUsers = await User.find().sort({ gamesWon: -1, totalLettersGuessed: -1 }).limit(10);

        if (topUsers.length === 0) {
            const noDataEmbed = new EmbedBuilder()
                .setColor('#111827')
                .setDescription('NO LEADERBOARD DATA AVAILABLE.');
            return interaction.editReply({ embeds: [noDataEmbed] });
        }

        const embed = new EmbedBuilder()
            .setColor('#8B5CF6')
            .setTitle('GLOBAL HANGMAN LEADERBOARD')
            .setThumbnail(interaction.client.user.displayAvatarURL());

        let description = '';
        for (let i = 0; i < topUsers.length; i++) {
            const user = topUsers[i];
            const discordUser = await interaction.client.users.fetch(user.userId).catch(() => null);
            const username = discordUser ? discordUser.username : 'UNKNOWN';

            description += `**${i + 1}. ${username.toUpperCase()}**\n`;
            description += `> WINS: \`${user.gamesWon}\` | PLAYED: \`${user.gamesPlayed}\` | LETTERS: \`${user.totalLettersGuessed}\`\n\n`;
        }

        embed.setDescription(description);

        await interaction.editReply({ embeds: [embed] });
    }
};
