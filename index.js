'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const moment = require('moment');

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

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

let imgUrl = {
  it: "https://cdn.pixabay.com/photo/2015/03/10/22/47/pc-667863_640.png",
  math: "https://i.pinimg.com/originals/51/60/9c/51609c5ad31c0b46db2f5bf3c6d34d7d.jpg",
  biology: "http://img.freepik.com/free-vector/biology-elements-design_1300-177.jpg?size=338&ext=jpg",
  physics: "http://img.freepik.com/free-vector/background-about-physics_1284-698.jpg?size=338&ext=jpg",
  religion: "https://cdn.dribbble.com/users/142196/screenshots/1094556/buddha.png",
  bi: "https://i.imgbox.com/lviJnYVp.jpg",
  pkn: "https://i.imgbox.com/bJfeoYQD.jpg",
  english: "https://i.imgbox.com/qS1Z7gla.jpg"
}

let tasks = [{
lesson: "biology",
title:'Biology Quiz',
text: 'Quiz Cells',
date: moment("16-08-2017", "DD-MM-YYYY")
}];

tasks.sort((a,b) => {
return a.date.isAfter(b.date);
});

let agendaObject = {
  "type": "template",
  "altText": "Agenda",
  "template": {
      "type": "carousel",
      "columns": []
  }
};
let agendaString = '';
tasks.forEach((a)=> {
  let tempObj = {
    "thumbnailImageUrl": imgUrl[a.lesson],
    "title": `${a.title} ${a.date.format("MMM Do YY")}`,
    "text": a.text,
  };
  agendaObject.template.columns.push(tempObj);
  agendaString.concat(a.text);
  agendaString.concat("\n");
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
  let txt = event.message.text.toLowerCase();
  if (txt === "!help") {
      let helpString = 
      `Commands available:
      !about
      !agenda`;
      send(helpString);  
  }
  if (txt === "!about") {
    send("I'm a bot for 11A");
  }
  if(txt === "!agenda") {
    console.log(agendaObject);
    send(agendaString);
  }
  if (txt === "!leave") {
    send("How about no");
  }
  if (txt[0] === "!") {
    return send("404: Command not found!");
  }
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
