import styles from "./Villager.module.css";
import VillagerLike from "./VillagerLike.js";
import React, { useContext } from "react";
import * as portraits from "./villagers/index.js";

import like from "./like.png";
import love from "./love.png";
import gift from "./gift.png";
import { GiftedContext } from "../context.js";
import { debounce } from "../utils.js";

export default function Villager({name, setLike, setComplete, setGifted}) {
    const id = name.toLowerCase().replace(/[^a-z]/g, '_');

    const gifteds = useContext(GiftedContext);
    const isGifted = !!gifteds[id];

    return (
        <div className={styles.villagerWrapper}>
            <section className={styles.villager + " " + (isGifted ? styles.gifted : "")}>
                <span className={styles.portraitWrapper} onClick={debounce(() => setGifted(id, !isGifted))}>
                    <img className={styles.portrait} src={portraits[id]} alt=""/>
                    {isGifted ? (<img className={styles.gift} src={gift} alt="Gifted" />) : null}
                </span>
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