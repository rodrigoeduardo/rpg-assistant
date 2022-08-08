require("dotenv").config();
const { SlashCommandBuilder, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Rolls a dice")
    .addIntegerOption((option) =>
      option
        .setName("quantity")
        .setDescription("The number of dices to roll")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("dice")
        .setDescription("The dice to roll and modifiers")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("start")
    .setDescription("Makes the bot join your voice channel"),
  new SlashCommandBuilder()
    .setName("end")
    .setDescription("Makes the bot leave your voice channel"),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

rest
  .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
  .then(() => console.log("Suscessfully registered application commands."))
  .catch(console.error);
