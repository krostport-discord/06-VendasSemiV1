const mongoose = require("mongoose")
const Product = require("../../models/products/prod")
const Discord = require("discord.js")

module.exports = {
    name: "config-product",
    description: "🛒 Configure um produto com o ID!",
    type: Discord.ApplicationCommandType.ChatInput,

    options: [
        {
            name: 'id',
            description: '🔘 Qual o ID do produto?',
            required: true,
            type: Discord.ApplicationCommandOptionType.Number,
        }
    ],

    run: async(interaction, client) => {
        const id = interaction.options.getNumber('id')
        const idExists = await Product.find({ id: id })

        if(idExists.length < 1) return interaction.reply({ content: `O id \`${id}\` informado não existe na database!`, ephemeral: true });

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

        const row = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('product_name')
            .setLabel("Nome")
            .setStyle(2),

            new Discord.ButtonBuilder()
            .setCustomId('product_desc')
            .setLabel("Descrição")
            .setStyle(2),

            new Discord.ButtonBuilder()
            .setCustomId('product_price')
            .setLabel("Preço")
            .setStyle(2),

            new Discord.ButtonBuilder()
            .setCustomId('product_image')
            .setLabel("Link da Imagem")
            .setStyle(2),

            new Discord.ButtonBuilder()
            .setCustomId('product_estoque')
            .setLabel("Estoque")
            .setStyle(3)
        )

        const sync = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('product_sync')
            .setLabel("Sincronizar")
            .setStyle(3)
        )

        interaction.reply({
            embeds: [embed],
            components: [row, sync]
        })
        
    }
}