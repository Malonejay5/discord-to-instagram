const {SlashCommandBuilder} = require('discord.js')

module. exports = {
    data: new SlashCommandBuilder()
        .setName('hashtags')
        .setDescription('Generate Hashtags Based Off Of A Keyword')
        .addStringOption(option => {
            return option
            .setName('hashtag-gen')
            .setDescription('HashTag Generator')
            .setRequired(true)
        })
}
    
