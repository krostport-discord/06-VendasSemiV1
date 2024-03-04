const mongoose = require("mongoose")
const Product = require("../../models/products/prod")
const Discord = require("discord.js")

module.exports = {
    name: "create-product",
    description: "🛒 Crie um produto para sua loja!",
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

        if(idExists.length >= 1) return interaction.reply({ content: `O id \`${id}\` informado já existe na database!`, ephemeral: true });
        
        const createReleaseProduct = new Product({
            id,
            name: "Configure isto...",
            price: "10.00",
            description: "Configure isto...",
            image: "https://cdn.discordapp.com/attachments/1209190368353062982/1213504833466671164/Title.png?ex=65f5b772&is=65e34272&hm=05a626eaf8bfe36fcb5b2f03cba12bdc6375d511fef1f2c1b86fce1deebe9659&",
            stock: []
        })

        await createReleaseProduct.save()

        const thisProduct = await Product.findOne({ id: id })
        const embed = new Discord.EmbedBuilder()    
        .setTitle(`Informações do produto | ID: ${id}`)
        .setDescription(`
        **Nome do Produto:** \`${thisProduct.get('name')}\`
        **Descrição do Produto:** \`${thisProduct.get('description')}\`
        **Preço:**  \`${thisProduct.get('price')}\`
        `)
        .setImage(`${thisProduct.get('image')}`)
        .setColor("#efff15")
        .setFooter({ text: "Para configurar use: /config-product [id]" })

        interaction.reply({
            embeds: [embed]
        })
    }
}