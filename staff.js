const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('staff')
    .setDescription('Displays information about the staff members.'),
  async execute(interaction) {
    await interaction.reply('Here is a list of staff members:\n- Founders\n- Co-owners\n- server manager\n- Gw hoster\n- Head admin\n- Admin\n- Head mod\n- mod');
  },
};
