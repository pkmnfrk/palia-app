import React from "react";
import Item from "./Item.js";

import styles from "./BundleItem.module.css";

export default function BundleItem({children, quality}) {
    return (
        <li className={styles.bundleItem}>
            <Item className={styles.item} name={children} />
            <h4>{quality ? "⭐" : ""}{children}</h4>
            <p>Descriptive text</p>
        </li>
    )
}