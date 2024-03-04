const mongoose = require("mongoose")
const Product = require("../../models/products/prod")
const Discord = require("discord.js")

module.exports = {
    name: "send",
    description: "🛒 Envie um produto para sua loja!",
    type: Discord.ApplicationCommandType.ChatInput,

    options: [
        {
            name: 'id',
            description: '🔘 Qual o ID desse produto?',
            type: Discord.ApplicationCommandOptionType.Number,
            required: true
        }
    ],

    run: async(interaction, client) => {
        const id = interaction.options.getNumber('id')
        const idExists = await Product.find({ id: id })
        
        if(idExists.length < 1) return interaction.reply({ content: `O id \`${id}\` informado não existe na database!`, ephemeral: true });
        const thisProduct = await Product.findOne({ id: id })

        const embed = new Discord.EmbedBuilder()
        .setTitle(`${thisProduct.get('name')} | ID: ${id}`)
        .setDescription(`
        \`\`\`${thisProduct.get('description')}\`\`\`

        \n 🪐 **Nome:** \`${thisProduct.get('name')}\`\n📦 **Estoque:** \`${thisProduct.get('stock').length}\`\n💵 **Preço:** \`R$${thisProduct.get('price')}\`
        `)
        .setImage(`${thisProduct.get('image')}`)
        .setColor("Blue")

        const row = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('sales_embed_buy')
            .setLabel("Comprar")
            .setEmoji("🛒")
            .setStyle(3)
        )

        interaction.reply({ content: "Produto enviado com sucesso!", ephemeral: true })
        interaction.channel.send({ embeds: [embed], components: [row] })
    }
}