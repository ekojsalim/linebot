'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const moment = require('moment');
const redis = require("redis");

//redis client
var red = redis.createClient(process.env.REDISCLOUD_URL, {no_ready_check: true});

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
  biology: "https://img.freepik.com/free-vector/biology-elements-design_1300-177.jpg?size=338&ext=jpg",
  physics: "https://img.freepik.com/free-vector/background-about-physics_1284-698.jpg?size=338&ext=jpg",
  religion: "https://cdn.dribbble.com/users/142196/screenshots/1094556/buddha.png",
  bi: "https://i.imgbox.com/lviJnYVp.jpg",
  pkn: "https://i.imgbox.com/bJfeoYQD.jpg",
  english: "https://i.imgbox.com/qS1Z7gla.jpg"
};

let tasks = [{
  lesson: "Biology",
  title:'Biology Quiz',
  text: 'Quiz Cells',
  date: moment("16-08-2017", "DD-MM-YYYY")}
  ,
  {
  lesson: "Religion",
  title:'Religion Quiz',
  text: 'Quiz Tiwah & Paritta',
  date: moment("24-08-2017", "DD-MM-YYYY")}
];
let agendaObject;
let agendaString = '';

function load() {
  
  tasks.filter((a) => {
    a.date.isAfter(moment())
  });

  tasks.sort((a,b) => {
    return a.date.isAfter(b.date);
  });

  //Reset the Global Data
  agendaObject = {
    "type": "template",
    "altText": "Agenda",
    "template": {
        "type": "carousel",
        "columns": []
    }
  };
  agendaString = '==AGENDA=='.concat("\n");

  tasks.forEach((a)=> {
    let tempObj = {
      "thumbnailImageUrl": imgUrl[a.lesson.toLowerCase()],
      "title": `${a.title} (${a.date.format("l")})`,
      "text": a.text,
      "actions": [{
                      "type": "postback",
                      "label": "Remind Later",
                      "data": "action=buy&itemid=111"
                  },],
    };
    agendaObject.template.columns.push(tempObj);
    agendaString = agendaString.concat(a.lesson + " - " + a.text + `(${a.date.format("dddd, Do MMMM")})`);
    agendaString = agendaString.concat("\n");
  });
}

load();

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
    return client.replyMessage(event.replyToken,[agendaObject, {type:"text", text: agendaString}]).catch((err)=> console.error(err));
    // send(agendaString);
  }
  if(txt.split(" ")[0] === "!add") {
    let x = event.message.text.split(" ").slice(1).join(" ").split(",=");

    if(x.length !== 4){
      return send("Invalid Syntax!");
    }

    let tempObj = {
      lesson: x[0],
      title: x[1],
      text: x[2],
      date: moment(x[3], "DD-MM-YYYY")
    };
    tasks.push(tempObj);
    load();
    return send("Successfully added an entry.");
  }
  if (txt === "!leave") {
    return send("How about no");
  }
  if (txt[0] === "!") {
    return send("Command Not Found!");
  }
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
