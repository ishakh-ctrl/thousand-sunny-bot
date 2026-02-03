const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// 🔒 Bot credentials
client.login(process.env.TOKEN);
const CLIENT_ID = '1210165320443240500';
const GUILD_ID = '1367833297966862366'; // optional, will fallback

// 🔁 Load command files
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log('✅ Loading commands from:', commandsPath);
console.log('✅ Files found:', commandFiles);

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`⚠️ Command at ${filePath} is missing "data" or "execute"`);
  }
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

// 🚀 Register commands
(async () => {
  try {
    console.log(`🔄 Attempting to register ${commands.length} commands to guild ${GUILD_ID}...`);

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log('✅ Successfully registered guild commands.');
  } catch (error) {
    console.warn('⚠️ Guild command registration failed. Falling back to global...');
    console.error(error?.rawError || error);

    try {
      await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: commands }
      );
      console.log('✅ Successfully registered GLOBAL commands (may take ~1 hour to show).');
    } catch (globalError) {
      console.error('❌ Global command registration also failed:', globalError);
    }
  }
})();
