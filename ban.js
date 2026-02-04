const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for banning')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!member) {
      return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
    }

    if (!member.bannable) {
      return interaction.reply({ content: '⚠️ I can’t ban that user.', ephemeral: true });
    }

    await member.ban({ reason });
    await interaction.reply(`⛔ ${target.tag} has been banned.\n📝 Reason: ${reason}`);
  }
};
