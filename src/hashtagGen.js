let getHash1 = async (keyWord) => {
  try {
      let link = 'https://hashtagy-generate-hashtags.p.rapidapi.com/v1/insta/tags';
      let req = await axios.get(link, {
          params: {
              keyword: keyWord,
              include_tags_info: 'true'
          },
          headers: {
              'X-RapidAPI-Key': apiKey,
              'X-RapidAPI-Host': 'hashtagy-generate-hashtags.p.rapidapi.com'
          }
      });

      let hashTagArray = [];
      let jsonData = JSON.stringify(req.data);
      let jsonParse = JSON.parse(jsonData).data;
      let hashTags = jsonParse['hashtags'];
      for (let i = 0; i < hashTags.length; i++) {
          if(i < 15){
            hashTagArray.push(`#${hashTags[i]['hashtag']}`);
          }
         
      }

      return hashTagArray;
  } catch (err) {
      console.log(err);
  }
}

let testing = async (keyWord) => {
  let hashtags = await getHash1(keyWord);
  console.log(hashtags);
}


exports.getHashTags = testing
