const { SlashCommandBuilder } = require('discord.js');



module.exports = {
  data: new SlashCommandBuilder()
    .setName('perks')
    .setDescription('View server perks'),
  async execute(interaction) {
    await interaction.reply('Server Perks:\n- Custom roles\n- Giveaways\n- Exclusive channels');
  },
};