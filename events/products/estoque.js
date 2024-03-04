const mongoose = require("mongoose")
const Product = require("../../models/products/prod")
const Discord = require("discord.js")
const client = require("../..")

client.on("interactionCreate", async(interaction) => {
    const cId = interaction.customId
    
    if (interaction.isButton()) {
        if (cId === "product_estoque") {
            const modal = new Discord.ModalBuilder()
            .setCustomId("modal_stock")
            .setTitle("Estoque")
            
            const stock = new Discord.TextInputBuilder()
            .setCustomId('input_estoque')
            .setLabel('Estoque:')
            .setPlaceholder(`account:password\naccount2:password2\naccount3:password3\n...`)
            .setStyle(Discord.TextInputStyle.Paragraph)
            .setRequired(true)
            
            modal.addComponents(
                new Discord.ActionRowBuilder().addComponents(stock)
                )

                await interaction.showModal(modal)
        }
    } else if (interaction.isModalSubmit()) {
        const id = interaction.message.embeds[0].title.trim().split(':')[1]

        if (cId === "modal_stock") {
            const newInputStock = interaction.fields.getTextInputValue("input_estoque");
            const trimmedStock = newInputStock.trim();
            
            const stockArray = trimmedStock.split("\n");
            const product = await Product.findOne({ id: id });
            
            try {
                product.get("stock").push(...stockArray);
                await product.updateOne({ stock: product.get("stock") });
            
                interaction.reply(`${interaction.user}: Sucesso, o estoque foi adicionado com sucesso ao produto!`);
            } catch (error) {
                interaction.reply(`Ocorreu um erro ao tentar salvar os dados`);
                console.log(error);
            }
            
        }
    }
})