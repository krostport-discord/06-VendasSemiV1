const mongoose = require("mongoose")
const Product = require("../../models/products/prod")
const Discord = require("discord.js")
const client = require("../..")

client.on('interactionCreate', async(interaction) => {
    if (interaction.customId === "product_sync") {
        const id = interaction.message.embeds[0].title.trim().split(':')[1]
        const thisProduct = await Product.findOne({ id: id })

        const embed = new Discord.EmbedBuilder()
        .setTitle(`Configure o produto do ID: ${id}`)
        .setDescription(`
        🎨 *Para modificar os componentes do produto, utilize os botões abaixo!*

        **Nome do Produto:** \`${thisProduct.get('name')}\`
        **Descrição do Produto:** \`${thisProduct.get('description')}\`
        **Preço:**  \`${thisProduct.get('price')}\`

        **Estoque:** \`${thisProduct.get('stock').length}\`
        `)
        .setImage(`${thisProduct.get('image')}`)
        .setColor("#efff15")

        interaction.update({
            embeds: [embed]
        })
    }
})