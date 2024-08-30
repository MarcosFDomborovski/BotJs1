const mongoose = require("mongoose")

class Database {
    constructor() {
        this.connection = null;
    }
    connect() {
        const mongo_url = process.env.DB_CONNECTION
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