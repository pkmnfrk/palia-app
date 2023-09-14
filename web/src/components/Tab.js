import React from "react";

import { debounce } from "../utils.js";

import styles from "./Tab.icss";

function calcStyles(className, active, icon) {
    const ret = [
        styles.tab,
    ];
    if(className) {
        ret.push(className);
    }

    if(active) {
        ret.push(styles.active);
    }

    if(icon) {
        ret.push(styles["icon-" + icon]);
    }

    return ret.join(" ");
}

export default function Tab({children, className, active, onClick, icon}) {
    return (
        <button 
            className={calcStyles(className, active, icon)}
            onClick={onClick ? debounce(onClick) : undefined}
            ><span className={styles.text}>{children}</span></button>
    )
}