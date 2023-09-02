import React from "react";

import { debounce } from "../utils.js";

import styles from "./Button.module.css";

function calcStyles(className, active, disabled) {
    const ret = [
        styles.button,
    ];
    if(className) {
        ret.push(className);
    }

    if(active) {
        ret.push(styles.active);
    }
    if(disabled) {
        ret.push(styles.disabled);
    }

    return ret.join(" ");
}

export default function Button({children, className, active, disabled, onClick}) {
    return (
        <button 
            className={calcStyles(className, active, disabled)}
            disabled={disabled}
            onClick={onClick ? debounce(onClick) : undefined}
            >{children}</button>
    )
}