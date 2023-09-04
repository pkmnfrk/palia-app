import config from "config";
import { DateTime } from "luxon";

const records = {};

export async function update(key, field, value, expiry) {
    if(!(key in records)) {
        records[key] = {};
    }

    records[key] = {
        ...records[key],
        [field]: value,
        expiry: expiry,
    };
}

export async function get(key) {
    let ret = records[key];

    if(ret && ret.expiry < DateTime.now().toUnixInteger()) {
        delete records[key];
        ret = null;
    }

    if(!ret) {
        ret = {};
    }

    return ret;
}

export function getNow() {
    return DateTime.now().setZone("America/New_York");
}