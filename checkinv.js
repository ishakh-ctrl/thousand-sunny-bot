const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/invites.json');

function loadInviteData() {
  if (!fs.existsSync(dataFile)) return {};
  return JSON.parse(fs.readFileSync(dataFile));
}

function saveInviteData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('myinvites')
    .setDescription('View your invite stats!'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    const inviteData = loadInviteData();

    const userStats = inviteData[guildId]?.[userId] || {
      total: 0,
      fake: 0,
      bonus: 0,
      leaves: 0,
    };

    const netInvites = userStats.total + userStats.bonus - userStats.leaves - userStats.fake;

    const embed = new EmbedBuilder()
      .setColor(0x00b0f4)
      .setTitle(`📨 Invite Stats for ${interaction.user.username}`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .addFields(
        { name: '✨ Total Invites', value: `${userStats.total}`, inline: true },
        { name: '🎁 Bonus Invites', value: `${userStats.bonus}`, inline: true },
        { name: '👻 Fake Invites', value: `${userStats.fake}`, inline: true },
        { name: '🚪 Leaves', value: `${userStats.leaves}`, inline: true },
        { name: '🏅 Net Invites', value: `${netInvites}`, inline: true },
      )
      .setFooter({ text: 'Invite tracking powered by YourBot' });

    await interaction.reply({ embeds: [embed] });
  },
};

