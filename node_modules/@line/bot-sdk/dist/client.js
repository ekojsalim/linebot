"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("./http");
const URL = require("./urls");
const util_1 = require("./util");
class Client {
    constructor(config) {
        if (!config.channelAccessToken) {
            throw new Error("no channel access token");
        }
        this.config = config;
    }
    pushMessage(to, messages) {
        return this.post(URL.push, {
            to,
            messages: util_1.toArray(messages),
        });
    }
    replyMessage(replyToken, messages) {
        return this.post(URL.reply, {
            replyToken,
            messages: util_1.toArray(messages),
        });
    }
    multicast(to, messages) {
        return this.post(URL.multicast, {
            to,
            messages: util_1.toArray(messages),
        });
    }
    getProfile(userId) {
        return this.get(URL.profile(userId));
    }
    getMessageContent(messageId) {
        return this.stream(URL.content(messageId));
    }
    leaveGroup(groupId) {
        return this.post(URL.leaveGroup(groupId));
    }
    leaveRoom(roomId) {
        return this.post(URL.leaveRoom(roomId));
    }
    authHeader() {
        return { Authorization: "Bearer " + this.config.channelAccessToken };
    }
    get(url) {
        return http_1.get(url, this.authHeader());
    }
    post(url, body) {
        return http_1.post(url, this.authHeader(), body);
    }
    stream(url) {
        return http_1.stream(url, this.authHeader());
    }
}
exports.default = Client;
