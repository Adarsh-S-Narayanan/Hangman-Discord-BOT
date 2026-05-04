const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Shows your current rank and EXP'),
    async execute(interaction) {
        const userRecord = await User.findOne({ userId: interaction.user.id });
        if (!userRecord) {
            return interaction.reply({ content: 'You have not played any games yet!', ephemeral: true });
        }

        const level = userRecord.level || 1;
        const exp = userRecord.exp || 0;
        const nextLevelExp = level * 100;
        
        // Build a simple text-based progress bar
        const totalBars = 20;
        const filledBars = Math.floor((exp / nextLevelExp) * totalBars);
        const emptyBars = totalBars - filledBars;
        const expBar = '█'.repeat(Math.max(0, filledBars)) + '░'.repeat(Math.max(0, emptyBars));

        const embed = new EmbedBuilder()
            .setColor('#8B5CF6')
            .setTitle(`${interaction.user.username}'s Rank`)
            .addFields(
                { name: 'Level', value: `${level}`, inline: true },
                { name: 'EXP', value: `${exp} / ${nextLevelExp}`, inline: true },
                { name: 'Points', value: `${userRecord.points || 0}`, inline: true },
                { name: 'Progress', value: `\`${expBar}\``, inline: false },
                { name: 'Stats', value: `Wins: ${userRecord.gamesWon} | Losses: ${userRecord.gamesLost}`, inline: false }
            )
            .setThumbnail(interaction.user.displayAvatarURL());

        await interaction.reply({ embeds: [embed] });
    }
};
