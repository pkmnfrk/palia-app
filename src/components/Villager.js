import styles from "./Villager.module.css";
import VillagerLike from "./VillagerLike.js";
import React from "react";
import * as portraits from "./villagers/index.js";

import like from "./like.png";
import love from "./love.png";

export default function Villager({name, setLike, setComplete}) {
    const id = name.toLowerCase().replace(/[^a-z]/g, '_');
    return (
        <div className={styles.villagerWrapper}>
            <section className={styles.villager}>
                <img className={styles.portrait} src={portraits[id]} alt=""/>
                <h2 className={styles.villagerName}>{name}</h2>
                
                <img className={styles.icon} src={like} alt="Likes" />
                <VillagerLike id={id + "_1"} setLike={setLike} setComplete={setComplete} />

                <img className={styles.icon} src={like} alt="Likes" />
                <VillagerLike id={id + "_2"} setLike={setLike} setComplete={setComplete} />

                <img className={styles.icon} src={love} alt="Loves" />
                <VillagerLike id={id + "_3"} setLike={setLike} setComplete={setComplete} />
                
                <img className={styles.icon} src={love} alt="Loves" />
                <VillagerLike id={id + "_4"} setLike={setLike} setComplete={setComplete} />
                
            </section>
        </div>
    );
}