require("dotenv").config();
const { rollDices } = require("./utils");
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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

    const reply = rollDices(interaction.user.id, quantity, dice);

    await interaction.reply(reply);
  }
});

client.login(process.env.BOT_TOKEN);
