import React from "react";

import * as items from "./items/index.js";

import styles from "./Item.module.css";

export default function Item({name, className}) {
    const id = name.toLowerCase().replace(/[^a-z]/g, "_");

    return (
        <img className={(className??"") + " " + styles.item} src={items[id]} alt={name} />
    )
}