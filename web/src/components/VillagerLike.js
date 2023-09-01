import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setCompleted } from "../features/completedSlice.js";
import { setLike } from "../features/likesSlice.js";

import styles from "./Villager.module.css";

export default function VillagerLike({id}) {
    const like = useSelector(state => state.likes[id] ?? "");
    const complete = useSelector(state => !!state.completed[id]);
    const dispatch = useDispatch();

    const [state, setState] = useState(() => null);

    return (
        <span className={styles.like}>
            <input id={id} className={complete ? styles.completed : ""} type="text" defaultValue={like} onChange={(v) => {
                if(state) {
                    clearTimeout(state);
                }
                const timer = setTimeout(() => {
                    setState(null);
                    dispatch(setLike(id, v.target.value));
                }, 500)
                setState(timer);
            }} />
            <input type="checkbox" checked={complete} onChange={(e) => {
                dispatch(setCompleted(id, e.target.checked));
            }}/>
        </span>
    )
}