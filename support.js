const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('support')
    .setDescription('Provides support or help contact details.'),
  async execute(interaction) {
    await interaction.reply('Need help? Reach out to a mod or open a ticket in #support!');
  },
};