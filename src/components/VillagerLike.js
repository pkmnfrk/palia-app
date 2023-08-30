import styles from "./Villager.module.css";
import { LikesContext, PlayerContext } from "../context.js";
import React, { useContext, useState } from "react";

export default function VillagerLike({id, setLike, setComplete}) {
    const likes = useContext(LikesContext);
    const like = likes && likes[id] ? likes[id] : "";

    const completes = useContext(PlayerContext);
    const complete = completes && completes[id] ? completes[id] : false;

    const [state, setState] = useState(() => null);

    // console.log("Complete is", completes, complete);

    return (
        <span className={styles.like}>
            <input id={id} type="text" defaultValue={like} onChange={(v) => {
                if(state) {
                    clearTimeout(state);
                }
                const timer = setTimeout(() => {
                    setState(null);
                    setLike(id, v.target.value);
                }, 500)
                setState(timer);
            }} />
            <input type="checkbox" checked={complete} onChange={(e) => {
                setComplete(id, e.target.checked);
            }}/>
        </span>
    )
}