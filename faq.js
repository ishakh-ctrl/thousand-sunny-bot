const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('faq')
    .setDescription('Shows frequently asked questions'),
  async execute(interaction) {
    await interaction.reply('Here are the FAQs!');
  },
};