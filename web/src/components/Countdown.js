import React, { useEffect, useState } from "react";
import {DateTime, Interval} from "luxon";


function now() {
    return DateTime.now().setZone("America/New_York");
}

/**
 * 
 * @param {"hourly"|"daily"|"weekly"} type 
 * @param {DateTime} time 
 */
function formatCountdown(type, time) {
    let target;
    if(type == "hourly") {
        if(time.minute < 15) {
            target = time.startOf("hour").plus({minutes: 15});
        } else {
            target = time.endOf("hour").plus({minutes: 15});
        }
    } else if(type == "daily") {
        target = time.endOf("day");
    } else if(type == "weekly") {
        target = time.endOf("week");
    }

    const delta = target.diff(time);
    
    if(type == "weekly") {
        return delta.toFormat("d'd' hh'h' mm'm' ss's'");
    } else if(type == "daily") {
        return delta.toFormat("h'h' mm'm' ss's'");
    } else {
        return delta.toFormat("m'm' ss's'");
    }
}

export default function Countdown({type}) {
    const [time, setTime] = useState(now());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(now());
        }, 1000);

        return () => {
            clearInterval(timer);
        }
    }, [])

    return (<>{formatCountdown(type, time)}</>)
}