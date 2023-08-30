
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DateTime } from "luxon";

const fakeOffset = (() => {
    return 0;
    // const realNow = DateTime.now().setZone("America/New_York");
    // const pretendTime = realNow.set({ hour: 23, minute: 59, second: 0, millisecond: 0});
    // return pretendTime.diff(realNow);
})();


const stage = process.env.STAGE ?? "dev";

const table = `palia-app-${stage}`;
const dynamodb = DynamoDBDocument.from(new DynamoDBClient());

const listeners = [];

let likes_cache = null;
let complete_cache = {};
let likes_cache_expiry = nextWeeklyRolloverDate();


let gifted_cache = {};
let gifted_cache_expiry = nextDailyRolloverDate()

function getNow() {
    return DateTime.now().setZone("America/New_York").plus({milliseconds: fakeOffset});
}

function nextDailyRolloverDate() {
    return getNow().plus({ days: 1}).startOf("day");
}

function nextWeeklyRolloverDate() {
    return getNow().plus({ weeks: 1 }).startOf("week");
}

function handleExpiry() {
    setInterval(checkCacheExpiries, 60_000);
}

function getToday() {
    return getNow().startOf("day").toISODate();
}

function getWeek() {
    return getNow().startOf("week").toISODate();
}

function checkCacheExpiries() {
    const now = getNow();
    if(likes_cache_expiry < now) {
        likes_cache = null;
        complete_cache = {};
        likes_cache_expiry = nextWeeklyRolloverDate();

        sendEvent(null, "weekly_reset", {});
    }

    if(gifted_cache_expiry < now) {
        gifted_cache = {};
        gifted_cache_expiry = nextDailyRolloverDate();

        sendEvent(null, "daily_reset", {});
    }
}

export async function setLike(id, value) {
    console.log("saving likes", id, value);

    const key = `root-likes-${getWeek()}`;
    await dynamodb.update({
        Key: {id: key},
        TableName: table,
        UpdateExpression: "set #id = :value, expiry = :expiry",
        ExpressionAttributeValues: {
            ":value": value,
            ":expiry": likes_cache_expiry.toUnixInteger()
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
    checkCacheExpiries();

    if(!likes_cache) {
        const key = `root-likes-${getWeek()}`;
        const item = await dynamodb.get({
            TableName: table,
            Key: {id: key},
        });

        let ret = item.Item;

        if(ret && ret.expiry < getNow().toUnixInteger()) {
            ret = null;
        }

        if(!ret) {
            ret = {};
        }

        delete ret.id;
        delete ret.expiry;

        likes_cache = ret;
    }

    return likes_cache;
}

export async function setComplete(player, id, value) {
    // console.log("saving completed", player, id, value);
    
    const key = `completed-${player}-${getWeek()}`;

    await dynamodb.update({
        Key: {id: key},
        TableName: table,
        UpdateExpression: "set #id = :value, expiry = :expiry",
        ExpressionAttributeValues: {
            ":value": value,
            ":expiry": likes_cache_expiry.toUnixInteger(),
        },
        ExpressionAttributeNames: {
            "#id": id
        },
    })

    const completed = await getCompleted(player);

    completed[id] = value;

    sendEvent(player, "complete", completed);
}


export async function setGifted(player, id, value) {
    // console.log("saving completed", player, id, value);
    
    const key = `gifted-${player}-${getToday()}`;

    await dynamodb.update({
        Key: {id: key},
        TableName: table,
        UpdateExpression: "set #id = :value, expiry = :expiry",
        ExpressionAttributeValues: {
            ":value": value,
            ":expiry": gifted_cache_expiry.toUnixInteger(),
        },
        ExpressionAttributeNames: {
            "#id": id
        },
    })

    const gifted = await getGifted(player);

    gifted[id] = value;

    sendEvent(player, "gifted", gifted);
}

async function getCachedItem(player, cache, key) {
    if(!cache[player]) {   
        const item = await dynamodb.get({
            TableName: table,
            Key: {id: key},
        });

        let ret = item.Item;

        if(ret && ret.expiry < getNow().toUnixInteger()) {
            ret = null;
        }

        if(!ret) {
            ret = {};
        }

        delete ret.id;
        delete ret.expiry;
        cache[player] = ret;
    }

    return cache[player];
}

export async function getCompleted(player) {
    checkCacheExpiries();
    const key = `completed-${player}-${getWeek()}`;

    return getCachedItem(player, complete_cache, key);
}

export function getGifted(player) {
    checkCacheExpiries();

    const key = `gifted-${player}-${getToday()}`;
    return getCachedItem(player, gifted_cache, key);
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

handleExpiry();
