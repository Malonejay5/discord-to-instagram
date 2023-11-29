const axios = require('axios')
const fs = require('fs')
const log = require('./logging')




let downloadVid = async (vidUrl, destination) => {
    try {
        let req = await axios({
            method: 'GET',
            url: vidUrl,
            responseType: 'stream',
        })
        if(!req.data) {
            throw new Error('Empty Response Data...')
        }
        console.log('Video Saved ==>',destination)
        req.data.pipe(fs.createWriteStream(destination))

        return new Promise((resolve, reject) => {
            req.data.on('end', () => resolve())
            req.data.on('error', () => reject(error))
        })
    } catch (err) {
        console.error('Error Downloading Video:', err)
        log.errLog.info(err.toString())

    }
}

exports.downloadVid = downloadVid
