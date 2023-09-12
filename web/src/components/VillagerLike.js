import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setCompleted } from "../features/completedSlice.js";
import { setLike } from "../features/likesSlice.js";
import { giveGift } from "../features/giftedSlice.js";

import styles from "./Villager.module.css";

export default function VillagerLike({id, villager}) {
    const like = useSelector(state => state.likes[id] ?? "");
    const complete = useSelector(state => !!state.completed[id]);
    const dispatch = useDispatch();

    const [state, setState] = useState(() => null);

    const onCheckboxChange = (e) => {
        dispatch(setCompleted(id, e.target.checked));
        if(e.target.checked) {
            dispatch(giveGift(villager));
        }
    };
    
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
            <input id={id + "_complete"} type="checkbox" checked={complete} onChange={onCheckboxChange}/>
        </span>
    )
}