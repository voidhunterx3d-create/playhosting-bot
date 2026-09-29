const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Web server listener to trick Render + UptimeRobot into staying awake
app.get('/', (req, res) => {
    res.send('SMP Bot Status: Listening and Alive');
});
app.listen(PORT, () => {
    console.log(`Web application active on port ${PORT}`);
});

// 2. The Minecraft Bot Configuration
function createBot() {
    const bot = mineflayer.createBot({
        host: 'theelexiconsmp.play.hosting', // Your server address
        port: 25565,                         // Standard default port
        username: 'SMP_247_Watcher',
        version: '1.21.11'                   // Locked into your server version
    });

    bot.on('spawn', () => {
        console.log('Success: Bot logged into theelexiconsmp!');
        
        // 🔑 PASSWORD PLUGIN LOGIN COMMAND
        // Replace 'YOUR_BOT_PASSWORD' with a real password you want the bot to use
        bot.chat('/register YOUR_BOT_PASSWORD YOUR_BOT_PASSWORD'); 
        bot.chat('/login YOUR_BOT_PASSWORD'); 

        // Anti-AFK Routine: Tells the bot to jump once a minute to prevent kick timers
        setInterval(() => {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
        }, 60000);
    });

    // Reconnection safeguard if the server kicks the profile or restarts
    bot.on('end', () => {
        console.log('Bot disconnected. Attempting to rejoin in 15 seconds...');
        setTimeout(createBot, 15000);
    });

    bot.on('error', (err) => console.log('Runtime Error: ', err));
}

createBot();
