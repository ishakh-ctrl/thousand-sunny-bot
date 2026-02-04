const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Displays detailed information about the server.'),

  async execute(interaction) {
    const guild = interaction.guild;

    // Create an embed for server information
    const serverEmbed = new EmbedBuilder()
      .setColor('#5865F2')  // Set a nice blue color
      .setTitle(`✨ **${guild.name}** - Server Information`)
      .setThumbnail(guild.iconURL())  // Display server icon
      .setDescription(`Here’s the information about **${guild.name}**:`)
      .addFields(
        { name: '🌐 **Server Name**', value: guild.name, inline: true },
        { name: '👑 **Owner**', value: `<@${guild.ownerId}>`, inline: true },
        { name: '👥 **Total Members**', value: `${guild.memberCount}`, inline: true },
        { name: '📅 **Created On**', value: `${guild.createdAt.toDateString()}`, inline: true },
        { name: '🌍 **Region**', value: `${guild.preferredLocale}`, inline: true },
        { name: '🔒 **Verification Level**', value: `${guild.verificationLevel}`, inline: true },
        { name: '🔗 **Invite Link**', value: `[Click here](https://discord.gg/${1367833297966862366})`, inline: false },
      )
      .setFooter({ text: `Server ID: ${guild.id}`, iconURL: guild.iconURL() })
      .setTimestamp();

    // Send the embed message
    await interaction.reply({ embeds: [serverEmbed] });
  },
};
