const got = require('got')
const fs = require('fs')
const { get } = require('request')

/// STILL WIP ////
const HashArray = []

let getHash = async (tag) => {
    
    let link = `https://apidisplaypurposes.com/tag/${tag}`

    let req = await got.get(link, {
        headers: {
            "authority": "apidisplaypurposes.com",
            "method": "GET",
            "path": `/tag/${tag}`,
            "scheme": "https",
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Api-Token": "7e30fc41ce785accff0d7a67dd59b9aa",
            "Dnt": "1",
            "Origin": "https://displaypurposes.com",
            "Referer": "https://displaypurposes.com/",
            "Sec-Ch-Ua": '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
            "Sec-Ch-Ua-Mobile": "?0",
            "Sec-Ch-Ua-Platform": '"Windows"',
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                    }
    })
    .then(async (res) => {
        //console.log(res.body)
        let jsonBody = JSON.parse(res.body).results
        for (let i = 0; i < jsonBody.length; i++){
            let responseTag = jsonBody[i]['tag']
            HashArray.push(`#${responseTag}`)
            
        }
        //console.log(HashArray)
        //console.log('hasharray',HashArray)
        return HashArray
    
    })
    
    .catch(async (err) => {
        return new Error('ERROR Please Try Again With A Different Tag...')
    })
    
    
}

//getHash('tigertattoo')

let testErr = async (tags) => {
    const hashTags = await getHash(tags)
    return HashArray

}

let testHash = async (tags) => {
    let hashtags = await testErr(tags)
    return hashtags
}

exports.getHash = testHash
