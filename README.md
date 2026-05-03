# Hangman Discord Bot

An advanced, feature-rich Discord bot that allows users to play Hangman directly in their Discord servers. The bot tracks player scores, maintains a global leaderboard, and stores game data securely using MongoDB. Built with Node.js, Discord.js (v14), and Mongoose.

## 🚀 Features
- **Interactive Hangman Games:** Play classic hangman with dynamic messages and live updates.
- **Global Leaderboard:** Track user statistics (wins, losses, score) across all servers.
- **Rank Command:** Check your own or another user's current ranking and stats.
- **Word Database:** Words are drawn randomly from a MongoDB database collection.
- **Production Ready:** Includes robust error handling and PM2 configuration for background deployment.

## 🛠 Prerequisites
Before running the bot, ensure you have the following installed and set up:
- **Node.js** (v16.9.0 or higher required by Discord.js v14)
- **MongoDB** (A free cluster from MongoDB Atlas or a local instance)
- A **Discord Bot Token** from the [Discord Developer Portal](https://discord.com/developers/applications)

## ⚙️ Installation & Setup

1. **Clone the repository or download the project files.**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (you can use `.env.example` if available, or just create it manually) and add the following keys:
   ```env
   DISCORD_TOKEN=your_discord_bot_token_here
   MONGODB_URI=your_mongodb_connection_string_here
   ```

## 🎲 Database Seeding (Adding Words)
Before you can play, the database needs a list of words. We have provided a `seed.js` script to populate your database with words.
Run the following command once to insert the initial words into MongoDB:
```bash
node seed.js
```

## 💻 Running the Bot

### Development Mode
To run the bot normally in your terminal:
```bash
npm start
# or
node index.js
```

### Production Deployment (PM2)
For keeping the bot online 24/7 in a production environment (like a VPS), we recommend using PM2.
1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```
2. Start the bot using the provided ecosystem config:
   ```bash
   pm2 start ecosystem.config.js
   ```
3. (Optional) Make PM2 start on server boot:
   ```bash
   pm2 startup
   pm2 save
   ```

## 📜 Commands
- `/hangman` - Starts a new game of hangman in the current channel.
- `/rank` - Displays your current score, wins, losses, and rank (or check another user's rank).

## 📂 Project Structure
- `commands/` - Contains all the slash command logic (`hangman.js`, `rank.js`, etc.).
- `events/` - Discord event listeners (`ready.js`, `interactionCreate.js`).
- `models/` - Mongoose database schemas (`User.js`, `Word.js`).
- `db/` - Database connection initialization logic.
- `seed.js` - Script for seeding the database with playable words.
- `index.js` - The main entry point for the bot.
- `ecosystem.config.js` - PM2 production configuration file.
