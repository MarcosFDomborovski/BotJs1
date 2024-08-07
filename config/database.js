const mongoose = require("mongoose")

class Database {
    constructor() {
        this.connection = null;
    }
    connect() {
        const mongo_url = "mongodb+srv://d4rknorris:lrGAdGrITE6RZkvN@bot-pastelaria.kmrif4b.mongodb.net/Pastelaria-Gypcoom?retryWrites=true&w=majority&appName=bot-pastelaria"
        console.log("Tentando se conectar com o banco de dados...")
        mongoose.connect(mongo_url).then(() => {
            console.log("✅ Conectado ao MongoDB com sucesso!")
            this.connection = mongoose.connection;
        }).catch(err => {
            console.error(err)
        })
    }
}
module.exports = Database;