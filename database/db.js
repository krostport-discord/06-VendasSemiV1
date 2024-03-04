const config = require("../config.json")
const client = require("..")
const mongoose = require("mongoose")

client.on("ready", () => {
    mongoose.connect(`${config.mongodb_url}`).then(() => {
        console.log("MONGO ~ Conectado com sucesso")
    }).catch(err => {
        console.error('MONGO ~ Erro:\n', err)
        process.exit()
    })
})