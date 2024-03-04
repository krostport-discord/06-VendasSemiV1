const Product = require("../../models/products/prod")
const Discord = require("discord.js")
const config = require("../../config.json")
const mongoose = require("mongoose")
const client = require("../..")

client.on("interactionCreate", async(interaction) => {
    
    if(interaction.isButton()) {
        const id = interaction.message.embeds[0].title.trim().split(':')[1]
        const product = await Product.findOne({ id: id })
        const cId = interaction.customId

        if(cId === "sales_embed_buy") {

            if (interaction.guild.channels.cache.some(ch => ch.name.endsWith(`-${interaction.user.id}`))) return interaction.reply({ content: ":x: Você já possui um carrinho aberto!", ephemeral: true });

            interaction.guild.channels.create({
                name: `🛒│carrinho-${interaction.user.id}`,
                parent: `${config.categoria_carrinho}`,
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: ['ViewChannel', 'SendMessages']
                    },
                    {
                        id: interaction.guild.roles.everyone.id,
                        deny: ['ViewChannel', 'SendMessages']
                    }
                ]
            }).then(ch => {
                {
                    /* Canal Criado */

                    const embedCartCreated = new Discord.EmbedBuilder()
                    .setDescription("✅ **|** Seu carrinho foi criado com sucesso! Use o botão abaixo para ir até ele!")
                    .setColor("Green")

                    const button = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                        .setLabel("Carrinho")
                        .setEmoji("🛒")
                        .setURL(`https://discord.com/channels/${interaction.guild.id}/${ch.id}`)
                        .setStyle(Discord.ButtonStyle.Link)
                    )

                    interaction.reply({
                        embeds: [embedCartCreated],
                        components: [button],
                        ephemeral: true
                    })
            }

                {
                    /* Enviando mensagem no canal criado */
                    const embed = new Discord.EmbedBuilder()
                    .setTitle('Sistema de Vendas')
                    .setColor('Blurple')
                    .setDescription(`
                    🪐 **|** *Ao apertar em continuar você concorda com todos os termos descritos em <#${config.canal_termos}>*!

                    📦 **Informações do produto:**
                    > 🔘 **Nome:** \`${product.get('name')}\`
                    > 💵 **Preço:** \`${product.get('price')}\`
                    > ⭐ **Estoque:** \`${product.get('stock').length}\`

                    🛒 **Informações do pedido:**
                    > 📦 **Quantidade:** \`1\`
                    > 💵 **Total a pagar:** \`R$${product.get('price')}\`
                    `)
                    .setFooter({ text: `${product.get('id')}` })

                    const row = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId("sales_cancel")
                        .setLabel("Cancelar")
                        .setStyle(Discord.ButtonStyle.Danger),

                        new Discord.ButtonBuilder()
                        .setCustomId("sales_continue")
                        .setLabel("Continuar")
                        .setStyle(3)
                    )

                    ch.send({
                        embeds: [embed],
                        components: [row]
                    })
                }

                
            })
        } else if (cId === "sales_cancel") {
            interaction.reply(`${interaction.user} o carrinho será fechado <t:${Math.floor(Date.now() / 1000 + 5)}:R>`)

            setTimeout(() => {
                interaction.channel.delete()
            }, 5000);
        } else if (cId === "sales_continue") {
            const thisId = await interaction.message.embeds[0].footer.text
            const productX = await Product.findOne({ id: thisId })
            interaction.message.delete()

            const embed = new Discord.EmbedBuilder()
            .setTitle("Sistema de Vendas")
            .setColor('Yellow')
            .setDescription(`
            ⭐ **|** **Para realizar a finalização da compra, você precisa enviar um pix para a chave** \`${config.pix.chave_pix} (${config.pix.tipo_chave})\` **no valor de R$${productX.get('price')}**!
            ✅ **|** **Após efetuar o pagamento ENVIE o COMPROVANTE aqui no chat!**

            🌍 **|** \`Confira outros métodos de pagamento pelos botões abaixo!\`
            `)
            .setFooter({ text: `${thisId}` })

            const row = new Discord.ActionRowBuilder().addComponents( 
                new Discord.ButtonBuilder()
                .setCustomId('qr')
                .setLabel("QR CODE")
                .setStyle(2),

                new Discord.ButtonBuilder()
                .setCustomId("copia_e_cola")
                .setLabel("Copia e Cola")
                .setStyle(2),

                new Discord.ButtonBuilder()
                .setCustomId("sales_cancel")
                .setLabel("Cancelar")
                .setStyle(4),

                new Discord.ButtonBuilder()
                .setCustomId("aprovar")
                .setLabel("Aprovar")
                .setStyle(3)
            )

            interaction.reply({
                embeds: [embed],
                components: [row]
            })
        } else if(cId === "qr") {
            

            interaction.channel.send({
                embeds: [
                    new Discord.EmbedBuilder()
                    .setImage(`${config.pix["qr_code-pix"]}`)
                    .setColor('LightGrey')
                ]
            })
        } else if (cId === "copia_e_cola") {
            interaction.channel.send({
                embeds: [
                    new Discord.EmbedBuilder()
                    .setDescription(`
                    \`\`\`${config.pix.chave_copia_e_cola}\`\`\`
                    `)
                    .setColor('LightGrey')
                ]
            })
        } else if (cId === "aprovar") {
            const thisId = await interaction.message.embeds[0].footer.text
            const memberId = `${interaction.channel.name}`.split("-")[1]
            const member = interaction.guild.members.cache.get(memberId)
            const product = await Product.findOne({ id: thisId })

            if(!interaction.member.roles.cache.find(role => role.id === `${config.aprovar_cargo}`)) return interaction.reply({ content: "Você não pode aprovar esse compra!", ephemeral: true });
            if(interaction.user.id === memberId) return interaction.reply({ content: "Você não pode aprovar sua propria compra!", ephemeral: true });

            interaction.message.delete()

            if(product.get("stock").length < 1) return interaction.reply({ content: ":x: Produto sem estoque", ephemeral: true });

            const index = Math.floor(Math.random() * product.get("stock").length);
            const productGet = product.get("stock")[index];
            
            product.get("stock").splice(index, 1);
            await product.updateOne({ stock: product.get("stock") });
    
            member.send({
                embeds: [
                    new Discord.EmbedBuilder()
                    .setTitle("Aprovado")
                    .setDescription(`✅ **|** Pagamento aprovado, o seu produto segue abaixo!\n\n📦 Produto: *${product.get('name')}\n\`\`\`${productGet}\`\`\`*`)
                    .setColor('LightGrey')
                ]
            })

            interaction.reply(`O produto foi enviado para o comprador! O canal será excluido <t:${Math.floor(Date.now() / 1000 + 15)}:R>`)
            setTimeout(() => {
                interaction.channel.delete()
            }, 15000);
        }
    }
})