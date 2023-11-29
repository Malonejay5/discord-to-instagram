const {SlashCommandBuilder} = require('discord.js')
const instaPost = require('../instagram')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test_post')
        .setDescription('Automated Instagram Posting')
        .addSubcommand(subcommand => {
            return subcommand
            .setName('add-image')
            .setDescription('Add the image that youd like to post')
            .addAttachmentOption(option => {
                return option
                .setName('attachment-option')
                .setDescription('attachment description')
                .setRequired(true)
            })
            .addStringOption(captionCommand => {
                return captionCommand
                .setName('caption')
                .setDescription('add caption')
                .setRequired(true)
            })
            .addStringOption(option => {
                return option
                .setName('hashtag_keywords')
                .setDescription('Generate Hashtags based off a Keyword')
                .setRequired(true)
            })
        }),
        
   
}
