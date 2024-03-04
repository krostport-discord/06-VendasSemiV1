const mongoose = require("mongoose")
const Product = require("../../models/products/prod")
const Discord = require("discord.js")
const client = require("../..")

client.on("interactionCreate", async(interaction) => {
    const cId = interaction.customId
    
    if (interaction.isButton()) {
        if (cId === "product_name") {
            const modal = new Discord.ModalBuilder()
            .setCustomId("modal_name")
            .setTitle("Nome do Produto")
            
            const name = new Discord.TextInputBuilder()
            .setCustomId('input_name')
            .setLabel('Nome:')
            .setPlaceholder(`Nitro Gift...`)
            .setStyle(Discord.TextInputStyle.Short)
            .setRequired(true)
            
            modal.addComponents(
                new Discord.ActionRowBuilder().addComponents(name)
                )

                await interaction.showModal(modal)
        }
    } else if (interaction.isModalSubmit()) {
        const id = interaction.message.embeds[0].title.trim().split(':')[1]

        if (cId === "modal_name") {
            const newInputName = interaction.fields.getTextInputValue("input_name")
            const product = await Product.findOne({ id: id })
            
            try {
                await product.updateOne({ name: newInputName })
                interaction.reply(`Sucesso, o novo nome do produto foi setado!`)
            } catch (error) {
                interaction.reply(`Ocorreu um erro ao tentar salvar os dados`)
            }
        }
    }
})