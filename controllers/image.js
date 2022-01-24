import fetch from 'node-fetch';
const handleApiCall = (req, res) =>{

    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": "yurayurateiko",
        "app_id": "3a7ed23aacbd41269cf7d083a49be859"
      },
      "inputs": [
        {
          "data": {
            "image": {
              "url": `${req.body.input}`  
            }
          }
        }
      ]
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': process.env.API_CLARIFAI
      },
      body: raw
    };

    fetch("https://api.clarifai.com/v2/models/f76196b43bbd45c99b4f3cd8e8b40a8a/outputs", requestOptions)
      .then((response) => {
        return response.json();
        // res.json(response);
        // console.log('response', response);
        // const text = await response.text();
        // console.log('text', text);
      })
      .then(textRes => res.json(textRes))
}

const handleImage = (req, res, db)=>{
       
    const { id } = req.body

    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries=>{
            res.json(entries[0])  //寫[0]確保得到的是第一筆資料
        })
        .catch(err=>res.status(400).json('unable to get entries'))
}

export default {
    handleImage,
    handleApiCall,
}