const fs = require('fs')
const path = require('path')
const {Client, GatewayIntentBits, Collection, REST, Routes, SlashCommandBuilder} = require('discord.js')
require('dotenv').config()

const client = new Client({intents: [GatewayIntentBits.Guilds]})



let commands = []

// loading command files from ./commands
client.commands = new Collection()
let commandsPath = path.join(__dirname)
let commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
for(let file of commandFiles){
    let filePath = path.join(commandsPath, file)
    let command = require(filePath)

    if('data' in command) {
        commands.push(command.data.toJSON())
        client.commands.set(command.data.name, command)
    } else {
        console.log('Commands doesnt exist...')
    }
}

let rest = new REST({ version: '10'}).setToken(process.env.TOKEN)

module.exports = [
  (async () => {
    try {
     console.log('Registering Slash Commands...')
 
     await rest.put(
         Routes.applicationGuildCommands(
             process.env.CLIENT_ID,
             process.env.GUILD_ID
         ),
         { body: commands}
     )
 
     console.log('Slash Commands Registered!')
    } catch(err) {
     console.log(`ERROR Registering Slash Commands: ${err} `)
    }
 })()
]