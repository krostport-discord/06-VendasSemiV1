const mongoose = require("mongoose")
const Product = require("../../models/products/prod")
const Discord = require("discord.js")
const client = require("../..")

client.on("interactionCreate", async(interaction) => {
    const cId = interaction.customId
    
    if (interaction.isButton()) {
        if (cId === "product_desc") {
            const modal = new Discord.ModalBuilder()
            .setCustomId("modal_desc")
            .setTitle("Descrição do Produto")
            
            const desc = new Discord.TextInputBuilder()
            .setCustomId('input_desc')
            .setLabel('Descrição:')
            .setPlaceholder(`Nitro Gift barato e bom...`)
            .setMaxLength(1500)
            .setStyle(Discord.TextInputStyle.Paragraph)
            .setRequired(true)
            
            modal.addComponents(
                new Discord.ActionRowBuilder().addComponents(desc)
                )

                await interaction.showModal(modal)
        }
    } else if (interaction.isModalSubmit()) {
        const id = interaction.message.embeds[0].title.trim().split(':')[1]

        if (cId === "modal_desc") {
            const newInputDesc = interaction.fields.getTextInputValue("input_desc")
            const product = await Product.findOne({ id: id })
            
            try {
                await product.updateOne({ description: newInputDesc })
                
                interaction.reply(`Sucesso, a nova descrição do produto foi setada!`)
            } catch (error) {
                interaction.reply(`Ocorreu um erro ao tentar salvar os dados`)
            }
        }
    }
})