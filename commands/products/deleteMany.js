const mongoose = require("mongoose")
const Product = require("../../models/products/prod")
const Discord = require("discord.js")

module.exports = {
    name: "delete-all",
    description: "🚫 Delete todos os produtos da database",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async(interaction, client) => {
        if (interaction.user.id != "1186786998292336701" ) return interaction.reply({ content: `:x: Você não pode utilizar este comando!`, ephemeral: true });
        await Product.deleteMany({}).then(() => {
            interaction.reply("Todos os produtos foram deletados com sucesso!")
        }).catch(err => {
            interaction.reply("Houve uma falha ao tentar deletar todos os produtos...")
            console.log(err)
        })
    }
}