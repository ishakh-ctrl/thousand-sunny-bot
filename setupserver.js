const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require('discord.js');

// Font style mappings
const fonts = {
  default: (text) => text,
  bold: (text) => text.split('').map(char => String.fromCodePoint(char.codePointAt(0) + 0x1D400 - 0x41)).join(''),
  italic: (text) => text.split('').map(char => String.fromCodePoint(char.codePointAt(0) + 0x1D434 - 0x41)).join(''),
  cursive: (text) => text.replace(/[A-Za-z]/g, c => {
    const base = c === c.toUpperCase() ? 0x1D49C : 0x1D4B6;
    return String.fromCodePoint(base + (c.toLowerCase().charCodeAt(0) - 97));
  }),
  smallcaps: (text) => text.toUpperCase().split('').map(char => String.fromCodePoint(char.codePointAt(0) + 0x1D00)).join(''),
  monospace: (text) => text.split('').map(char => `\`${char}\``).join(''),
  doubleStruck: (text) => text.split('').map(char => String.fromCodePoint(char.codePointAt(0) + 0x1D670 - 0x41)).join(''),
  fraktur: (text) => text.split('').map(char => String.fromCodePoint(char.codePointAt(0) + 0x1D504 - 0x41)).join(''),
  sansSerif: (text) => text.split('').map(char => String.fromCodePoint(char.codePointAt(0) + 0x1D5B0 - 0x41)).join(''),
  italicSansSerif: (text) => text.split('').map(char => String.fromCodePoint(char.codePointAt(0) + 0x1D5D0 - 0x41)).join(''),
  boldSansSerif: (text) => text.split('').map(char => String.fromCodePoint(char.codePointAt(0) + 0x1D670 - 0x41)).join(''),
  bubble: (text) => text.split('').map(char => String.fromCodePoint(char.codePointAt(0) + 0x1F170)).join(''),
  circled: (text) => text.split('').map(char => String.fromCodePoint(char.codePointAt(0) + 0x24C6)).join(''),
  script: (text) => text.replace(/[A-Za-z]/g, c => {
    const base = c === c.toUpperCase() ? 0x1D49C : 0x1D4B6;
    return String.fromCodePoint(base + (c.toLowerCase().charCodeAt(0) - 97));
  }),
  zigzag: (text) => text.split('').map((char, index) => (index % 2 === 0 ? char.toUpperCase() : char.toLowerCase())).join(''),
  reversed: (text) => text.split('').reverse().join(''),
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setupserver')
    .setDescription('Create roles and channels for your gaming community server.')
    .addStringOption(option =>
      option
        .setName('font')
        .setDescription('Choose a font style for channel and role names.')
        .setRequired(false)
        .addChoices(
          { name: 'Default', value: 'default' },
          { name: 'Bold', value: 'bold' },
          { name: 'Italic', value: 'italic' },
          { name: 'Cursive (Fancy)', value: 'cursive' },
          { name: 'Small Caps', value: 'smallcaps' },
          { name: 'Monospace', value: 'monospace' },
          { name: 'Double Struck', value: 'doubleStruck' },
          { name: 'Fraktur', value: 'fraktur' },
          { name: 'Sans Serif', value: 'sansSerif' },
          { name: 'Italic Sans Serif', value: 'italicSansSerif' },
          { name: 'Bold Sans Serif', value: 'boldSansSerif' },
          { name: 'Bubble', value: 'bubble' },
          { name: 'Circled', value: 'circled' },
          { name: 'Script', value: 'script' },
          { name: 'Zigzag', value: 'zigzag' },
          { name: 'Reversed', value: 'reversed' },
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    // Check if the user is the bot owner
    const botOwnerId = '928568973279244298'; // Replace with your Discord ID
    if (interaction.user.id !== botOwnerId) {
      return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
    }

    const guild = interaction.guild;
    const fontChoice = interaction.options.getString('font') || 'default';
    const stylize = fonts[fontChoice] || fonts.default;

    await interaction.reply({ content: `⚙️ Setting up your server with **${fontChoice}** font style...`, ephemeral: true });

    // Define the roles and their associated permissions
    const roles = [
      { name: '🌟 Owner', permissions: [PermissionFlagsBits.Administrator] },
      { name: '👑 Admin', permissions: [PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageGuild, PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers] },
      { name: '🛠️ Moderator', permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.MuteMembers, PermissionFlagsBits.KickMembers] },
      { name: '🚀 Booster', permissions: [] },
      { name: '🎮 Gamer', permissions: [] },
    ];

    // Create roles with selected font style and permissions
    for (const role of roles) {
      const styledName = stylize(role.name);
      if (!guild.roles.cache.some(existingRole => existingRole.name === styledName)) {
        await guild.roles.create({
          name: styledName,
          permissions: role.permissions,
          reason: 'Setup server roles',
        });
      }
    }

    const structure = {
      '📜 Info': ['📃・rules', '👋・welcome', '🎁・perks', '📢・announcements'],
      '💬 General': ['💬・chat', '🎨・media', '🤣・memes', '🤖・bot-commands'],
      '🎮 Games': ['🎯・valorant', '🕹️・fortnite', '🧱・minecraft', '🏴・opbr', '⚙️・roblox', '🎵・osu'],
      '🔊 Voice': ['🔊・General VC', '🎮・Gaming VC', '💤・AFK'],
      '🛡️ Staff': ['🛠️・staff-chat', '📂・logs', '🚨・reports'],
      '🎉 Giveaways': ['🎉・giveaways', '🎊・winners']
    };

    // Apply font style specifically to staff categories and channels
    for (const [categoryName, channels] of Object.entries(structure)) {
      const isStaffCategory = categoryName.includes('Staff');
      const styledCategory = isStaffCategory ? stylize(categoryName) : categoryName;
      let category = guild.channels.cache.find(c => c.name === styledCategory && c.type === ChannelType.GuildCategory);
      if (!category) {
        category = await guild.channels.create({
          name: styledCategory,
          type: ChannelType.GuildCategory,
          reason: 'Setup server category',
        });
      }

      for (const channelName of channels) {
        const isStaffChannel = channelName.includes('staff');
        const styledChannel = isStaffChannel ? stylize(channelName) : channelName;
        const isVoice = styledChannel.includes('VC') || styledChannel.includes('AFK');
        const type = isVoice ? ChannelType.GuildVoice : ChannelType.GuildText;

        if (!guild.channels.cache.some(c => c.name === styledChannel)) {
          await guild.channels.create({
            name: styledChannel,
            type,
            parent: category.id,
            reason: 'Setup server channels',
          });
        }
      }
    }

    await interaction.editReply({ content: '✅ Server setup complete with styled names and individual roles!' });
  },
};
