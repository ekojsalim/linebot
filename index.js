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
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
  
  client.getProfile(event.user.userId).then((profile) => {
      const echo = { type: 'text', text: profile.userId };

    // use reply API
    return client.replyMessage(event.replyToken, echo);
  });
  // create a echoing text message
  // const echo = { type: 'text', text: event.message.text };

  // // use reply API
  // return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
