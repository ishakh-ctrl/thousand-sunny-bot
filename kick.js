const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');



module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to kick')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for kick')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) {
      return interaction.reply({ content: '❌ User not found in the server.', ephemeral: true });
    }

    if (!member.kickable) {
      return interaction.reply({ content: '⚠️ I can’t kick this user (maybe due to role hierarchy).', ephemeral: true });
    }

    await member.kick(reason);
    await interaction.reply(`👢 ${user.tag} has been kicked!\n📝 Reason: ${reason}`);
  }
};
