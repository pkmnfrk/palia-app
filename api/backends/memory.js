import config from "config";
import { DateTime } from "luxon";

const records = {};
const settings = config.get("memory");

const offset = (() => {
    let ret = 0;
    if(settings.secondsToMidnight) {
        const now = DateTime.now().setZone("America/New_York");
        const startTime = now.endOf("week").minus({seconds: settings.secondsToMidnight});
        ret = startTime.diff(now).as("seconds");
    }
    return ret;
})();

createFakeData();

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

function createFakeData() {
    if(!settings.addFakeData) return;

    const now = getNow();
    const today = now.startOf("day");
    const thisWeek = now.startOf("week");
    const playerId = "04b20d49-8169-4db3-a86a-f2d8422fbbec";

    records[`root-likes-${thisWeek.toISODate()}`] = {
        id: `root-likes-${thisWeek.toISODate()}`,
        ashura_1: "First",
        ashura_2: "Second",
        ashura_3: "Third",
        ashura_4: "Fourth???",
        expiry: thisWeek.plus({week: 1}).toUnixInteger(),
    }

    records[`completed-${playerId}-${thisWeek.toISODate()}`] = {
        id: `completed-${playerId}-${thisWeek.toISODate()}`,
        ashura_1: true,
        ashura_2: false,
        ashura_3: false,
        ashura_4: true,
        expiry: thisWeek.plus({week: 1}).toUnixInteger(),
    }

    records[`gifted-${playerId}-${today.toISODate()}`] = {
        id: `gifted-${playerId}-${today.toISODate()}`,
        ashura: true,
        auni: true,
        badruu: false,
        expiry: today.plus({day: 1}).toUnixInteger(),
    }
}

export function getNow() {
    const ret =  DateTime.now().setZone("America/New_York").plus({seconds: offset});
    return ret;
}