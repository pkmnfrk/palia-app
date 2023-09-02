import React from "react";

import styles from "./Button.module.css";

function calcStyles(active, disabled) {
    const ret = [
        styles.button,
    ];
    if(active) {
        ret.push(styles.active);
    }
    if(disabled) {
        ret.push(styles.disabled);
    }

    return ret.join(" ");
}

export default function Button({children, active, disabled, onClick}) {
    return (
        <button 
            className={calcStyles(active, disabled)}
            disabled={disabled}
            onClick={onClick}
            >{children}</button>
    )
}