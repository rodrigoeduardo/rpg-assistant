require("dotenv").config();
const { rollDices } = require("./utils");
const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const player = createAudioPlayer();

client.once("ready", () => {
  console.log("Bot is ready! 🤖🎲");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  }

  if (commandName === "roll") {
    const quantity = interaction.options.getInteger("quantity");
    const dice = interaction.options.getString("dice");
    const connection = getVoiceConnection(interaction.guildId);

    if (connection) {
      const rollSound = createAudioResource("./resources/roll.mp3");
      player.play(rollSound);
      connection.subscribe(player);
    }
    const reply = rollDices(interaction.user.id, quantity, dice);

    await interaction.reply(reply);
  }

  if (commandName === "start") {
    await interaction.reply("Let's roll! 🎲");

    if (!interaction.member.voice.channel) {
      await interaction.reply(
        "You need to be in a voice channel to use this command!"
      );
    }

    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
  }

  if (commandName === "end") {
    try {
      const connection = getVoiceConnection(interaction.guildId);
      connection.destroy();
      await interaction.reply("See you on the next adventure! 👋");
    } catch (err) {
      console.log(err);
      await interaction.reply("You haven't even invited me! 🤨");
    }
  }
});

client.login(process.env.BOT_TOKEN);
