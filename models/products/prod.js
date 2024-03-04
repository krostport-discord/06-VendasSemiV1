const client = require("../..");
const mongoose = require("mongoose")

const Prod = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    description: String,
    image: String,
    stock: Array
})

module.exports = mongoose.model("Products", Prod)