
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const stage = process.env.STAGE ?? "dev";

const table = `palia-app-${stage}`;
const dynamodb = DynamoDBDocument.from(new DynamoDBClient());

const listeners = [];

let likes_cache = null;
let likes_cache_expiry = null;

let complete_cache = {};
let complete_cache_expiry = null;

function nextRolloverDate() {
    const ret = new Date();
    ret.setDate(ret.getDate() + 1);
    ret.setUTCHours(4);
    ret.setUTCMinutes(0, 0, 0);
    return ret;
}

function pad(x) {
    x = `0${x}`;

    return x.substring(x.length - 2, x.length);
}

function getToday() {
    const ret = new Date();
    ret.setHours(0, 0, 0, 0);
    ret.setUTCMinutes(-ret.getTimezoneOffset()); //adjust to eastern time

    return `${ret.getUTCFullYear()}-${pad(ret.getUTCMonth() + 1)}-${pad(ret.getUTCDate())}`;
}

export async function setLike(id, value) {
    console.log("saving likes", id, value);

    const nextExpiry = nextRolloverDate();

    const key = `root-likes-${getToday()}`;
    await dynamodb.update({
        Key: {id: key},
        TableName: table,
        UpdateExpression: "set #id = :value, expiry = :expiry",
        ExpressionAttributeValues: {
            ":value": value,
            ":expiry": Math.floor(nextExpiry.getTime() / 1000)
        },
        ExpressionAttributeNames: {
            "#id": id
        },
    })

    await getLikes();

    likes_cache[id] = value;

    sendEvent(null, "likes", likes_cache);

    console.log("Saved");
}

export async function getLikes() {
    if(likes_cache && likes_cache_expiry && likes_cache_expiry > new Date()) {
        return likes_cache;
    }

    const key = `root-likes-${getToday()}`;
    const item = await dynamodb.get({
        TableName: table,
        Key: {id: key},
    });

    if(item.Item) {
        const ret = item.Item;
        delete ret.id;
        delete ret.expiry;

        likes_cache = ret;
        likes_cache_expiry = nextRolloverDate();
        // console.log("Fetched likes as", ret);
        return ret;
    }
    return {};
}

export async function setComplete(player, id, value) {
    // console.log("saving completed", player, id, value);
    
    const nextExpiry = nextRolloverDate();
    const key = `player-${player}-${getToday()}`;

    await dynamodb.update({
        Key: {id: key},
        TableName: table,
        UpdateExpression: "set #id = :value, expiry = :expiry",
        ExpressionAttributeValues: {
            ":value": value,
            ":expiry": Math.floor(nextExpiry.getTime() / 1000),
        },
        ExpressionAttributeNames: {
            "#id": id
        },
    })

    const completed = await getCompleted(player);

    completed[id] = value;

    sendEvent(player, "complete", completed);

    // console.log("Saved");
}

export async function getCompleted(player) {
    const now = new Date();
    if(!complete_cache || (complete_cache_expiry && complete_cache_expiry < now)) {
        complete_cache = {};
        complete_cache_expiry = nextRolloverDate();
    }

    if(!complete_cache[player]) {   
        const key = `player-${player}-${getToday()}`;
        const item = await dynamodb.get({
            TableName: table,
            Key: {id: key},
        });

        if(item.Item) {
            const ret = item.Item;
            delete ret.id;
            delete ret.expiry;
            // console.log("Completed for player", player, "is", ret);

            complete_cache[player] = ret;
        } else {
            complete_cache[player] = {};
        }
    }
    return complete_cache[player];
}

function sendEvent(player, type, data) {
    const event = {
        type,
        data,
    };
    for(const listener of listeners) {
        if(player && listener.player !== player) {
            continue;
        }

        listener(event);
    }
    
}

export function addListener(player, cb) {
    cb.player = player;
    listeners.push(cb);
    return () => {
        const ix = listeners.indexOf(cb);
        if(ix !== -1) {
            listeners.splice(ix, 1);
        }
    };
}
