const {SlashCommandBuilder} = require('discord.js')
const instaPost = require('../instagram')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('post')
        .setDescription('Automated Instagram Posting')
        .addSubcommand(subcommand => {
            return subcommand
            .setName('add-image')
            .setDescription('Add the image that youd like to post')
            .addAttachmentOption(option => {
                return option
                .setName('attachment-option')
                .setDescription('attachment description')
            })
            .addStringOption(captionCommand => {
                return captionCommand
                .setName('caption')
                .setDescription('add caption')
            })
            .addStringOption(option => {
                return option
                .setName('hashtags')
                .setDescription('Add Custom Hashtags')
            })
        }),
        
   
}