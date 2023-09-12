import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBundle } from "features/bundleSlice.js";

import Item from "components/Item/index.js";

import styles from "./BundleItem.module.css";

export default function BundleItem({id, item, quality, type, description}) {
    const dispatch = useDispatch();
    const completed = useSelector((state) => state.bundle[id] ?? false);
    const showSpoilers = useSelector(state => state.player.bundle_spoilers);

    return (
        <li id={id} className={styles.bundleItem + " " + styles[type]}>
            <Item className={styles.item} name={item} overlay={completed ? "checked" : null} onClick={() => dispatch(setBundle(id, !completed))}/>
            <h4>{quality ? "⭐" : ""}{item}</h4>
            {showSpoilers ? <p>{description}</p> : null}
        </li>
    )
}