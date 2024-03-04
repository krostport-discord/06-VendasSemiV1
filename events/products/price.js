const mongoose = require("mongoose")
const Product = require("../../models/products/prod")
const Discord = require("discord.js")
const client = require("../..")

client.on("interactionCreate", async(interaction) => {
    const cId = interaction.customId
    
    if (interaction.isButton()) {
        if (cId === "product_price") {
            const modal = new Discord.ModalBuilder()
            .setCustomId("modal_price")
            .setTitle("Nome do Produto")
            
            const price = new Discord.TextInputBuilder()
            .setCustomId('input_price')
            .setLabel('Nome:')
            .setPlaceholder(`Nitro Gift...`)
            .setStyle(Discord.TextInputStyle.Short)
            .setRequired(true)
            
            modal.addComponents(
                new Discord.ActionRowBuilder().addComponents(price)
                )

                await interaction.showModal(modal)
        }
    } else if (interaction.isModalSubmit()) {
        const id = interaction.message.embeds[0].title.trim().split(':')[1]

        if (cId === "modal_price") {
            const newInputPrice = interaction.fields.getTextInputValue("input_price")
            const product = await Product.findOne({ id: id })

            if (newInputPrice.includes(",")) return interaction.reply(`O preço do produto não pode conter ", (Virgula)", para numeros quebrados use ". (Ponto Final)"!`);
            
            try {
                await product.updateOne({ price: newInputPrice })
                interaction.reply(`Sucesso, o novo preço do produto foi setado!`)
            } catch (error) {
                interaction.reply(`Ocorreu um erro ao tentar salvar os dados`)
            }
        }
    }
})