require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const PREFIX = process.env.BOT_PREFIX || ".";

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setActivity(`${PREFIX}help`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    return message.reply("Pong!");
  }

  if (command === "help") {
    const embed = new EmbedBuilder()
      .setTitle("Bot Commands")
      .setDescription([
        ".ping",
        ".help",
        ".say <text>",
        ".kick @user",
        ".ban @user",
        ".clear <amount>",
      ].join("\n"));

    return message.reply({ embeds: [embed] });
  }

  if (command === "say") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply("You don't have permission.");
    }

    const text = args.join(" ");
    if (!text) return message.reply("Provide text.");

    await message.delete().catch(() => {});
    return message.channel.send(text);
  }

  if (command === "clear") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply("You don't have permission.");
    }

    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply("Amount must be 1-100.");
    }

    await message.channel.bulkDelete(amount, true);
    return message.channel.send(`Deleted ${amount} messages.`);
  }

  if (command === "kick") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply("You don't have permission.");
    }

    const member = message.mentions.members.first();
    if (!member) return message.reply("Mention a user.");

    await member.kick();
    return message.channel.send(`${member.user.tag} was kicked.`);
  }

  if (command === "ban") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply("You don't have permission.");
    }

    const member = message.mentions.members.first();
    if (!member) return message.reply("Mention a user.");

    await member.ban();
    return message.channel.send(`${member.user.tag} was banned.`);
  }
});

client.login(process.env.DISCORD_TOKEN);
