const fs = require("fs");

module.exports = async (client) => {
  const SlashsArray = [];

  fs.readdir(`./commands`, (error, folder) => {
    folder.forEach((subfolder) => {
      fs.readdir(`./commands/${subfolder}/`, (error, files) => {
        files.forEach((files) => {
          if (!files?.endsWith(".js")) return;
          files = require(`../commands/${subfolder}/${files}`);
          if (!files?.name) return;
          client.slashCommands.set(files?.name, files);

          SlashsArray.push(files);
        });
      });
    });
  });
  client.on("ready", async () => {
    client.guilds.cache.forEach((guild) => guild.commands.set(SlashsArray));
  });
};

/* Products - Events */

require("./products/estoque")
require("./products/name")
require("./products/price")
require("./products/description")
require("./products/image")
require("./products/sync")

/* Sales - Events */
require("./sales/buy")