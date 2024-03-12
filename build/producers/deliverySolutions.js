"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// dsWebhook
const aws_sdk_1 = require("aws-sdk");
const eventBridge = new aws_sdk_1.EventBridge();
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const headers = event.headers;
    const body = JSON.parse(event.body || '');
    const busName = process.env.EVENTBRIDGE_BUS_NAME || 'default';
    const topic = body.event || 'unknown';
    console.log('dsWebhook', topic, body, headers);
    yield eventBridge.putEvents({
        Entries: [
            {
                Source: 'ds',
                DetailType: body.topic,
                Detail: JSON.stringify({ body, headers }),
                EventBusName: busName,
            },
        ],
    }).promise();
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Webhook processed successfully' }),
    };
});
exports.handler = handler;
//# sourceMappingURL=deliverySolutions.js.map