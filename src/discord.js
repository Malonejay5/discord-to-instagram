

const {Client, Collection, Events, GatewayIntentBits, Guild, SlashCommandBuilder} = require('discord.js')
const fs = require('fs')
const path = require('path')
const insta  = require('./instagram.js')
const hashTagGen = require('./hashtagGen.js')
const log = require('./logging')
require('dotenv').config()

let token = process.env.TOKEN

const client = new Client({intents: [GatewayIntentBits.Guilds]})

let sleep = async (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}


client.once(Events.ClientReady, c => {
    console.log('Bot is ONLINE!')
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
        console.log(`Command file ${file} has Loaded successfully registerd`)
    } else {
        console.log(`Command file ${file} doesnt exist...`)
    }
}

client.on('interactionCreate', async (interaction) => {
    
    if(interaction.commandName == 'post'){
        
        let image = interaction.options.getAttachment('attachment-option').attachment
        let caption = interaction.options.get('caption').value
        let customHashTags = interaction.options.get('hashtag_keywords').value
        await interaction.reply('Generating Hashtags and Posting on Instagram!')
        await insta.postToInsta(image, caption, customHashTags)
        await sleep(2222)
        let postUrl = await insta.getPostUrl(image)
        console.log(`Post Created by ${interaction.user.username}`)
        log.success.info(`Post Created by ${interaction.user.username}: ${postUrl}`)
        console.log('POSTURL', postUrl)
        await interaction.channel.send(`🫡 File upload Complete! ${postUrl}`)
        

    } else if (interaction.commandName == 'hashtags'){
        let keyword = interaction.options.get('hashtag-gen').value
        let hash = await hashTagGen.getHashTags(keyword)
        await interaction.reply(`Generating Hashtags for ${keyword} \n`)
        await interaction.channel.send(hash.toString().replaceAll(',', ' '))
    }
    
    
})



client.login(token)
