const axios = require('axios');
require('dotenv').config()

let apiKey = process.env.API_KEY

let getHash = async (keyWord) => {
    const options = {
        method: 'GET',
        url: 'https://hashtagy-generate-hashtags.p.rapidapi.com/v1/insta/tags',
        params: {
          keyword: keyWord,
          include_tags_info: 'true'
        },
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'hashtagy-generate-hashtags.p.rapidapi.com'
        }
      };
      
      try {
          const response = await axios.request(options);
          let jsonData = JSON.stringify(response.data)
          let jsonParse = JSON.parse(jsonData).data
          let hashTags = jsonParse['hashtags']['hashtag']
          //let jsonData = JSON.parse(response.data)
          console.log(hashTags);
      } catch (error) {
          console.error(error);
      }
}

getHash('travel')



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// let getHash = async (keyWord) => {
//     let link = 'https://hashtagy-generate-hashtags.p.rapidapi.com/v1/insta/tags'
//     let req = await axios.get(link,{
//         params: {
//             keyword: 'tattoo',
//         include_tags_info: 'true'
//         },
//         headers: {
//             'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
//             'X-RapidAPI-Host': 'hashtagy-generate-hashtags.p.rapidapi.com'
//         }
//     })
//     .then((res) => {
//         console.log(res.data)
//     })
//     .catch((err) => {
//         console.log(err)
//     })
// }


// getHash('tattoo')