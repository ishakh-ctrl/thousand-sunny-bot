const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deleteallchannels')
    .setDescription('Deletes all channels in the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),  // Allows Administrators to use the command

  async execute(interaction) {
    // Check if the user has Administrator permissions
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
    }

    // Fetch the guild and confirm the action
    const guild = interaction.guild;

    // Defer the reply so we can delete the channels in the background
    await interaction.deferReply({ ephemeral: true });

    try {
      // Fetch all channels in the guild
      const channels = guild.channels.cache;

      let deletedChannels = 0;
      // Delete all channels (text, voice, and categories)
      for (const [id, channel] of channels) {
        // Skip channels that cannot be deleted (required for community servers)
        if (channel.name === 'rules' || channel.name === 'welcome') {
          continue;
        }

        try {
          // Deleting the channel
          await channel.delete({ reason: 'All channels deleted by an admin.' });
          deletedChannels++;
        } catch (error) {
          console.error(`Failed to delete channel ${channel.name}: ${error}`);
        }
      }

      // After deletion, send a follow-up message with the number of deleted channels
      await interaction.followUp({ content: `✅ All deletable channels have been deleted. ${deletedChannels} channels removed.` });
    } catch (error) {
      console.error(`Failed to delete channels: ${error}`);
      await interaction.followUp({ content: '❌ Something went wrong while trying to delete channels.' });
    }
  },
};
