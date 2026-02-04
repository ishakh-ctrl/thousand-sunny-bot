const { SlashCommandBuilder } = require('discord.js');



module.exports = {
  data: new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Shows the server rules'),
  async execute(interaction) {
    await interaction.reply('Here are the server rules:\n1. Be respectful\n2. No spam\n3. Follow Discord TOS.');
  },
};