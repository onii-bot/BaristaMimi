import {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle
} from "discord.js";
import { addUser, isNewUser, xpGiver, timeCheck } from "./database.js";


const TOKEN = process.env.LEARN_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.login(TOKEN);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  setInterval(async ()=>{
    await timeCheck()
  },11000)
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    console.log("h");
  } else if (interaction.isStringSelectMenu()) {
    if (interaction.customId == "coffee") {
      if (await isNewUser(interaction.member.id)) {
        let xp = Math.floor(Math.random() * 5 + 1) + 5;
        if (Math.random() < 0.05) {
          xp = 30;
        }
        interaction.deferReply();
        setTimeout(() => {
          interaction.deleteReply();
          interaction.channel.send({
            content: `<@${interaction.member.id}> chose ${interaction.values[0]} and got ${xp}xp`,
          });
          xpGiver(interaction.member.id, xp);
          addUser(interaction.member.id);
        }, 1000);
      }
    }
  } else if (interaction.isButton()) {
    if (interaction.customId === "yes") {
      const actionRowComponent = new ActionRowBuilder().setComponents(
        new StringSelectMenuBuilder().setCustomId("coffee").setOptions([
          { label: "Cappuccino", value: "Cappuccino" },
          { label: "Espresso", value: "Espresso" },
          { label: "Caramel macchiato", value: "Caramel Macchiato" },
          { label: "Peppermint mocha", value: "Peppermint Mocha" },
          { label: "Caffè americano", value: "Caffe Americano" },
        ])
      );
      interaction.reply({ components: [actionRowComponent], ephemeral: true });
      interaction.message.delete();
    } else if (interaction.customId === "no") {
      interaction.reply({
        content: "Okey have a good day master",
        ephemeral: true,
      });
      interaction.message.delete();
    }
  }
});

client.on("messageCreate", async (message) => {
  // Barista channel to gm-gn here
  if (message.content.toLowerCase() === "gm" && message.channel.id === "1045517138137448479" && await isNewUser(message.author.id)) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("yes")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("no")
        .setLabel("No")
        .setStyle(ButtonStyle.Danger)
    );
    message
      .reply({
        content: "Good Morning!!, You want a coffee?",
        components: [row.toJSON()],
      })
      .then((message) => {
        setTimeout(() => {
          message
            .delete()
            .then((msg) =>
              console.log(`Deleted message from ${msg.author.username}`)
            )
            .catch((error) => console.log("message already deleted err"));
        }, 10000);
      });
  }
});

