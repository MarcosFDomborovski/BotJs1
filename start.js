const { spawn } = require("child_process")
const path = require("path")
const colors = require("colors")
require("./logger.js")

const botScript = path.join(__dirname, "index.js")

function startBot() {
    console.log(`${'o'.green} Iniciando o bot...`.white)
    const botProcess = spawn("node", [botScript], { stdio: "inherit"})

    botProcess.on("exit", (code) => {
        if(code !== 0){
            console.log(`${'o'.red} O bot foi encerrado com erro ${code}`.white + ` Reiniciando em 5 segundos...`.yellow)
            startBot()
        } else {
            console.log(`${'o'.green} O bot foi encerrado com sucesso!`.white)
        }
    })

    botProcess.on("error", (err) => {
        console.log(`${'o'.red} Erro ao iniciar processo do bot: ${err.message}`.white)
    })
}
startBot()