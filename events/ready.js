const { Events } = require('discord.js');
const connectDB = require('../db/database');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        await connectDB();
        await client.application.commands.set(client.commands.map(cmd => typeof cmd.data.toJSON === 'function' ? cmd.data.toJSON() : cmd.data));
        console.log(`Ready! Logged in as ${client.user.tag}`);
    }
};
