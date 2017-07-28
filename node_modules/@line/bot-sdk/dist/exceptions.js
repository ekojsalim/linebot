"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SignatureValidationFailed extends Error {
    constructor(msg, signature) {
        super(msg);
        this.signature = signature;
    }
}
exports.SignatureValidationFailed = SignatureValidationFailed;
class JSONParseError extends Error {
    constructor(msg, raw) {
        super(msg);
        this.raw = raw;
    }
}
exports.JSONParseError = JSONParseError;
class RequestError extends Error {
    constructor(gotErr) {
        super(gotErr.message);
        this.code = gotErr.code;
        this.origin = gotErr;
    }
}
exports.RequestError = RequestError;
class ReadError extends Error {
    constructor(gotErr) {
        super(gotErr.message);
        this.origin = gotErr;
    }
}
exports.ReadError = ReadError;
class HTTPError extends Error {
    constructor(gotErr) {
        super(gotErr.message);
        this.statusCode = gotErr.statusCode;
        this.statusMessage = gotErr.statusMessage;
        this.origin = gotErr;
    }
}
exports.HTTPError = HTTPError;
