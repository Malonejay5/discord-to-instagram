//import {Client, Collection, Events, GatewayIntentBits, Guild, SlashCommandBuilder} from 'discord.js'
//import fs from 'fs'
//import path from 'path'

const {Client, Collection, Events, GatewayIntentBits, Guild, SlashCommandBuilder} = require('discord.js')
const fs = require('fs')
const path = require('path')
const insta  = require('./instagram.js')
require('dotenv').config()

let token = process.env.TOKEN
const client = new Client({intents: [GatewayIntentBits.Guilds]})


client.once(Events.ClientReady, c => {
    console.log('Bot is ONLINE!')
    insta.checkLogin()
})

// loading command files from ./commands
client.commands = new Collection()
let commandsPath = path.join(__dirname, 'commands')
let commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
console.log(commandFiles)
for(let file of commandFiles){
    let filePath = path.join(commandsPath, file)
    let command = require(filePath)

    if('data' in command) {
        client.commands.set(command.data.name, command)
        console.log('Commands have Loaded successfully in "Discord.js"')
    } else {
        console.log('Commands doesnt exist...')
    }
}

client.on('interactionCreate', (interaction) => {
    
    if(interaction.commandName == 'post' && interaction.options.get('caption') !== null){
        interaction.reply(`🫡 File upload Complete! ${interaction.options.getAttachment('add-a-image').attachment}`)
        let image = interaction.options.getAttachment('add-a-image').attachment
        let caption = interaction.options.get('caption').value
        let customHashTags = interaction.options.get('hashtags').value
        console.log(`Post Created by ${interaction.user.username}`)
        insta.postToInsta(image, caption, customHashTags)

    } else if(interaction.options.get('caption') == null){
            interaction.reply('Please Add a Caption First!')
            
    } else if(interaction.options.get('hashtags') == null)  {
            interaction.reply('Please Add Hashtags First!')
    }
    
    
})


client.login(token)
