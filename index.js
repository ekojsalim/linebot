'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: 'lwPQ/vNSr81ipI9W2/zBzjM6rCtCZ8OPIBWTRwA0JOYLBr1f68Z5Dge9GZ4hPuIPbapk15iIyen6srVx2JBQqKrgTZ8MKMv0xjJOlpWqTKvIKEdpp6A7gxW0WxcxMRu533V+tzQzZrBs6TBKcNrhwgdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'b2f6b6972b491191bd93d1a9b4c19a06',
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

// event handler
function handleEvent(event) {
  function send(text) {
    const msg = { type: 'text', text: text };
    return client.replyMessage(event.replyToken, msg);
  }
  if (event.type !== 'message' || event.message.type !== 'text' ) {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
  let txt = event.message.text;
  if (txt === "!help") {
      send("Help not yet available");  
  }
  if (txt === "!about") {
    send("I'm a bot for 11A");
  }
  if(txt === "!HW") {
    return client.replyMessage({
      "type": "template",
      "altText": "Homeworks",
      "template": {
          "type": "carousel",
          "columns": [
              {
                "thumbnailImageUrl": "https://cdn.pixabay.com/photo/2015/03/10/22/47/pc-667863_640.png",
                "title": "IT HW",
                "text": "Paper",
                "actions": [
                    {
                        "type": "postback",
                        "label": "Remind Later",
                        "data": "action=buy&itemid=111"
                    }
                ]
              },
              {
                "thumbnailImageUrl": "https://i.pinimg.com/originals/51/60/9c/51609c5ad31c0b46db2f5bf3c6d34d7d.jpg",
                "title": "Math HW",
                "text": "Pg. 20, No. 1",
                "actions": [
                    {
                        "type": "postback",
                        "label": "Remind Later",
                        "data": "action=buy&itemid=222"
                    }
                ]
              }
          ]
      }
    })
  }
  if (txt === "!leave") {
    send("How about no");
  }
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
