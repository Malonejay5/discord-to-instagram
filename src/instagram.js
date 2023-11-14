//import Instagram, { IgApiClient } from 'instagram-private-api'
//import get from 'request-promise'
//import fs from 'fs'
//import dotenv from 'dotenv'

const {IgApiClient} = require('instagram-private-api')
const {get} = require('request-promise')
const fs = require('fs')
const hashTagGen = require('./getHashTags')
require('dotenv').config()


let hashTags = [
    '_tattoo', '_tattoos', '_tattooart', '_tattooartist', '_art', '_fkirons', '_sprektra', '_inkeeze', '_stencilstuff', '_calitattoos', '_californiatattoos', 
    '_portraittattoos', '_realistictattoos','_blackandgreytattoos', '_highdesert', '_hesperia', '_victorville', 
    '_applevalley'
]

let newHashtags = hashTags.toString().replaceAll('_', '#')
let hashTagsNoComma = newHashtags.toString().replaceAll(',', ' ')



let userName = process.env.USER_NAME
let passWord = process.env.PASSWORD


const ig = new IgApiClient()

let loginInsta = async () => {
    await ig.simulate.preLoginFlow()
    ig.state.generateDevice(userName)
    await ig.account.login(userName, passWord)
}

let checkLogin = async () => {
    console.log(userName)
    console.log(passWord)
    loginInsta()
    .then((res) => {
        if( res == '400 Bad Request'){
            console.log(res)
            
        } else {
            console.log('Instagram account logged in!')
        }
        
    })
}



let postToInsta = async (imgUrl, postCaption, keyWord) => {

    let hash = await hashTagGen.getHashTags(keyWord)
    
    await loginInsta()
    
   
    const imgBuffer = await get({
        url: imgUrl,
        encoding: null,
    })

    await ig.publish.photo({
        file: imgBuffer,
        caption: postCaption + '\n' + hash.toString().replaceAll(',', ' ') + ' ' + hashTagsNoComma
    })


}

exports.postToInsta = postToInsta
exports.checkLogin = checkLogin
//checkLogin()
