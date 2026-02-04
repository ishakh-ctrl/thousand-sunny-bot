const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timediff')
    .setDescription('Get the time difference between two message IDs (Snowflakes)')
    .addStringOption(option =>
      option.setName('messageid1')
        .setDescription('The first message ID')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('messageid2')
        .setDescription('The second message ID')
        .setRequired(true)
    ),

  async execute(interaction) {
    const id1 = interaction.options.getString('messageid1');
    const id2 = interaction.options.getString('messageid2');

    try {
      const discordEpoch = 1420070400000n;

      const time1 = (BigInt(id1) >> 22n) + discordEpoch;
      const time2 = (BigInt(id2) >> 22n) + discordEpoch;

      const diffMs = time1 > time2 ? time1 - time2 : time2 - time1;
      const diff = Number(diffMs);

      const seconds = Math.floor(diff / 1000) % 60;
      const minutes = Math.floor(diff / (1000 * 60)) % 60;
      const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      await interaction.reply({
        content: `⏱️ **Time Difference Between Messages:**\n> 📨 Message ID 1: \`${id1}\`\n> 📨 Message ID 2: \`${id2}\`\n\n**Difference:**\n• ${days} days\n• ${hours} hours\n• ${minutes} minutes\n• ${seconds} seconds`,
        ephemeral: false
      });

    } catch (err) {
      await interaction.reply({
        content: `❌ One or both message IDs are invalid. Please provide valid Discord Snowflakes.`,
        ephemeral: false
      });
    }
  }
};
