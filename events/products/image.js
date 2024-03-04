const mongoose = require("mongoose")
const Product = require("../../models/products/prod")
const Discord = require("discord.js")
const client = require("../..")

client.on("interactionCreate", async(interaction) => {
    const cId = interaction.customId
    
    if (interaction.isButton()) {
        if (cId === "product_image") {
            const modal = new Discord.ModalBuilder()
            .setCustomId("modal_image")
            .setTitle("Nome do Produto")
            
            const image = new Discord.TextInputBuilder()
            .setCustomId('input_image')
            .setLabel('Nome:')
            .setPlaceholder(`Apenas arquivos (.png, .jpg, .gif)`)
            .setStyle(Discord.TextInputStyle.Short)
            .setRequired(true)
            
            modal.addComponents(
                new Discord.ActionRowBuilder().addComponents(image)
                )

                await interaction.showModal(modal)
        }
    } else if (interaction.isModalSubmit()) {
        const id = interaction.message.embeds[0].title.trim().split(':')[1]

        if (cId === "modal_image") {
            const newInputImage = interaction.fields.getTextInputValue("input_image")
            const product = await Product.findOne({ id: id })

            if (!newInputImage.endsWith('.jpg') || !newInputImage.endsWith('.png') || !newInputImage.endsWith('.gif') ) return interaction.reply(`O link enviado não é valido! Extensões suportadas: *.png, .jpg, .gif*`)
            try {
                await product.updateOne({ image: newInputImage })
                interaction.reply(`Sucesso, a imagem foi setada com sucesso!`)
            } catch (error) {
                interaction.reply(`Ocorreu um erro ao tentar salvar os dados`)
            }
        }
    }
})