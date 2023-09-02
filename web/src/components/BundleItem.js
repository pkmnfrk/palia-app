import React from "react";
import Item from "./Item.js";

import styles from "./BundleItem.module.css";

export default function BundleItem({item, quality, type}) {
    return (
        <li className={styles.bundleItem + " " + styles[type]}>
            <Item className={styles.item} name={item} />
            <h4>{quality ? "⭐" : ""}{item}</h4>
            <p>Descriptive text</p>
        </li>
    )
}