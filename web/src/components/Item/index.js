import React from "react";

import * as items from "data/items/index.js";
import { debounce } from "utils.js";

import styles from "./index.module.css";
import check from "./check.png";


export default function Item({name, className, overlay, onClick}) {
    const id = name.toLowerCase().replace(/[^a-z]/g, "_");

    let overlayElement = null;

    switch(overlay) {
        case "checked":
            overlayElement = <img src={check} className={styles.overlayChecked} alt="" />;
            break;
    }

    return (
        <span className={(className??"") + " " + styles.itemWrapper} onClick={debounce(onClick)}>
            <img className={styles.item} src={items[id]} alt={name} />
            {overlayElement}
        </span>
    )
}