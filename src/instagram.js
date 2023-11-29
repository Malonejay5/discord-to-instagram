const {IgApiClient} = require('instagram-private-api')
const {get} = require('request-promise')
const fs = require('fs')
const util = require('util')
const readFileAsync = util.promisify(fs.readFile)
const ref = require('instagram-id-to-url-segment')
//const shttps = require('socks-proxy-agent')
const hashTagGen = require('./hashtagGen')
const download = require('./downloadVideo')
const mp4 = require('./movToMp4')
const log = require('./logging')
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
let igProxy = process.env.IG_PROXY


const ig = new IgApiClient()

let sleep = async (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

let loginInsta = async () => {
    //await ig.simulate.preLoginFlow()
    ig.state.generateDevice(userName)
    await ig.account.login(userName, passWord)
    
}






let userInfo = async () => {
    ig.state.generateDevice(userName)
    let loggedInUser = await ig.account.login(userName, passWord)
    return loggedInUser
}

let checkLogin = async () => {
    console.log(userName)
    await loginInsta()
    .then((res) => {
        if( res == '400 Bad Request'){
            console.log(res)
            
        } else {
            console.log('Instagram account logged in!')
        }
        
    })
}

let getPostUrl = async (imgUrl) => {
    if(imgUrl.toString().split('?')[0].endsWith('.mov')){
        let loggedUser = await userInfo()
        let userFeed = ig.feed.user(loggedUser.pk)
        let firstPostPage = await userFeed.items()
        let firstPost = firstPostPage[0].code
        console.log('firstPost:', firstPost)
        //let idToUrl = ref.instagramIdToUrlSegment(firstPost.caption.media_id)

        let link = `https://www.instagram.com/p/${firstPost}`
        return link
    } else {
        let loggedUser = await userInfo()
        let userFeed = ig.feed.user(loggedUser.pk)
        let firstPostPage = await userFeed.items()
        let firstPost = firstPostPage[0]
        console.log('firstPost:', firstPost)
        let idToUrl = ref.instagramIdToUrlSegment(firstPost.caption.media_id)
        let link = `https://www.instagram.com/p/${idToUrl}`
        return link
    }
}



let postToInsta = async (imgUrl, postCaption, keyWord) => {

    let hash = await hashTagGen.getHashTags(keyWord)
    console.log(hash.toString().replaceAll(',', ' '))
    //let caption = postCaption + '\n' + hash.toString().replaceAll(',', ' ') + ' ' + hashTagsNoComma
    let allCaption = postCaption.toString() + '\n' + hash.toString().replaceAll(',', ' ') + hashTagsNoComma
    let videoPath = `${process.cwd()}/videos/${keyWord}.mov`
    let movToMp4Path = `${process.cwd()}/videos/output.mp4`
    //let coverPicPath = `${process.cwd()}/imgs/${keyWord}.jpg`
    try {
        if(imgUrl.toString().split('?')[0].endsWith('.jpg')){

            const imgBuffer = await get({
                url: imgUrl,
                encoding: null,
            })
    
            await ig.publish.photo({
                file: imgBuffer,
                caption: allCaption
        })
        } else if(imgUrl.toString().split('?')[0].endsWith('.mov') || imgUrl.toString().split('?')[0].endsWith('.mp4')){ // TAKES THE DISCORD URL FOR THE VIDEO
            
            await download.downloadVid(imgUrl.toString().split('?')[0], videoPath) // DOWNLOADS THE VIDEO
            //await mp4.getMp4(keyWord) // CONVERTS FROM .MOV FORMAT TO .MP4
            let vidBuffer = await readFileAsync(videoPath)
            console.log('Video Buffer Byte Length:', vidBuffer.byteLength)
            await mp4.coverpic(keyWord) // TAKES A SCREEN SHOT FROM VIDEO FOR COVERIMAGE

            await sleep(2222)
            
            let publish = await ig.publish.video({
                video: await readFileAsync(`${process.cwd()}/videos/${keyWord}.mov`),
                coverImage: await readFileAsync(`${process.cwd()}/imgs/${keyWord}.jpg`),
                caption: allCaption //postCaption + '\n' + hash.toString().replaceAll(',', ' ') + ' ' + hashTagsNoComma,
            })

            console.log('Video was posted!')
        }
           

    } catch (err) {
        console.error('Error posting video:', err)
        log.errLog.info(err.toString())

    } 


}


// SAVED COOKIES AND OTHER DATA FOR LOGGIN
let saveData = (data) => {
    fs.writeFile('./sessionData.json', JSON.stringify(data), ((err) => {
        if(err){ 
            console.log(err)
            log.errLog.info(err.toString())
        }
    }))
    
    return data
};

let fakeExists = () => { // CHECKS TO SEE IF DATA EXISTS
    return false
};

let fakeLoad = () => { // LOADS DATA
    return ''
};

(async () => {
    try{
        ig.state.generateDevice(userName);
    
        // PROXY SUPPORT SOCK5
    // ig.request.defaults.agentClass = shttps
    // ig.request.defaults.agentOptions = {
    //     hostname: igProxy.split(':')[0],
    //     port: igProxy.split(':')[1],
    //     username: igProxy.split(':')[2],
    //     password: igProxy.split(':')[3],
    //     protocol: 'socks:',
    // }

        ig.request.end$.subscribe(async () => {
            let serialized = await ig.state.serialize()
            delete serialized.constants;
            saveData(serialized)
        });
        if(fakeExists()) {
            await ig.state.deserialize(fakeLoad())
        }
        await ig.account.login(userName, passWord)
        
        console.log(`${userName} is logged in!`)
    } catch (err) {
        log.errLog.info(err.toString())
        console.log(`ERROR logging into IG account: ${err}`)

    }
})()

exports.postToInsta = postToInsta
exports.checkLogin = checkLogin
exports.getPostUrl = getPostUrl

