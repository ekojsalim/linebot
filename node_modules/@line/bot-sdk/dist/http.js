"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const got = require("got");
const exceptions_1 = require("./exceptions");
const pkg = require("../package.json"); // tslint:disable-line no-var-requires
function parseJSON(raw) {
    try {
        return JSON.parse(raw);
    }
    catch (err) {
        throw new exceptions_1.JSONParseError(err.message, raw);
    }
}
function wrapError(err) {
    if (err instanceof got.RequestError) {
        throw new exceptions_1.RequestError(err);
    }
    else if (err instanceof got.ReadError) {
        throw new exceptions_1.ReadError(err);
    }
    else if (err instanceof got.HTTPError) {
        throw new exceptions_1.HTTPError(err);
    }
    // otherwise, just rethrow
    throw err;
}
const userAgent = `${pkg.name}/${pkg.version}`;
function stream(url, headers) {
    headers["User-Agent"] = userAgent;
    return got.stream(url, { headers });
}
exports.stream = stream;
function get(url, headers) {
    headers["User-Agent"] = userAgent;
    return got
        .get(url, { headers })
        .then((res) => parseJSON(res.body))
        .catch(wrapError);
}
exports.get = get;
function post(url, headers, body) {
    headers["Content-Type"] = "application/json";
    headers["User-Agent"] = userAgent;
    return got
        .post(url, {
        body: JSON.stringify(body),
        headers,
    })
        .then((res) => parseJSON(res.body))
        .catch(wrapError);
}
exports.post = post;
