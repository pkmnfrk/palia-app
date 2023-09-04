import React, { useEffect, useState } from "react";
import {DateTime} from "luxon";


function now() {
    return DateTime.now().setZone("America/New_York");
}
export default function Clock() {
    const [time, setTime] = useState(now());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(now());
        }, 1000);

        return () => {
            clearInterval(timer);
        }
    }, [])

    return (<>{time.toLocaleString(DateTime.TIME_WITH_SECONDS)}</>)
}