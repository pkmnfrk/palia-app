import config from "config";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DateTime } from "luxon";

const table = config.get("table");
const dynamodb = DynamoDBDocument.from(new DynamoDBClient());

export async function update(key, field, value, expiry) {
    await dynamodb.update({
        Key: {id: key},
        TableName: table,
        UpdateExpression: "set #id = :value, expiry = :expiry",
        ExpressionAttributeValues: {
            ":value": value,
            ":expiry": expiry.toUnixInteger()
        },
        ExpressionAttributeNames: {
            "#id": field
        },
    });
}

export async function get(key) {
    const item = await dynamodb.get({
        TableName: table,
        Key: {id: key},
    });

    let ret = item.Item;

    if(ret && ret.expiry < DateTime.now().toUnixInteger()) {
        ret = null;
    }

    if(!ret) {
        ret = {};
    }

    return ret;
}