const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('onboarding')
    .setDescription('Start onboarding system for Vertex Arcadia server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const guild = interaction.guild;

    // Roles to auto-create
    const roleNames = ['🌟 Owner', '🛡️ Staff', '👥 Member', '🎮 Gamer', '🎭 Events', '🔔 Ping All', '📢 Announcements'];

    for (const name of roleNames) {
      if (!guild.roles.cache.some(role => role.name === name)) {
        await guild.roles.create({ name, reason: 'Auto-created by /onboarding command' });
      }
    }

    const row = new ActionRowBuilder().addComponents(roleSelect);

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
