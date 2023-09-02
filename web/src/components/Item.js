import React from "react";

import * as items from "./items/index.js";

import styles from "./Item.module.css";
import check from "./check.png";

export default function Item({name, className, overlay}) {
    const id = name.toLowerCase().replace(/[^a-z]/g, "_");

    let overlayElement = null;

    switch(overlay) {
        case "checked":
            overlayElement = <img src={check} className={styles.overlayChecked} alt="" />;
            break;
    }

    return (
        <span className={(className??"") + " " + styles.itemWrapper}>
            <img className={styles.item} src={items[id]} alt={name} />
            {overlayElement}
        </span>
    )
}