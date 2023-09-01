import React from "react";
import { useSelector, useDispatch } from "react-redux";

import styles from "./Villager.module.css";
import VillagerLike from "./VillagerLike.js";
import { debounce } from "../utils.js";
import { setGifted } from "../features/giftedSlice.js";

import * as portraits from "./villagers/index.js";
import like from "./like.png";
import love from "./love.png";
import gift from "./gift.png";

export default function Villager({name}) {
    const id = name.toLowerCase().replace(/[^a-z]/g, '_');

    // const gifteds = useContext(GiftedContext);
    const isGifted = useSelector(state => !!state.gifted[id]);
    const dispatch = useDispatch();

    return (
        <div className={styles.villagerWrapper}>
            <section className={styles.villager + " " + (isGifted ? styles.gifted : "")}>
                <span className={styles.portraitWrapper} onClick={debounce(() => dispatch(setGifted(id, !isGifted)))}>
                    <img className={styles.portrait} src={portraits[id]} alt=""/>
                    {isGifted ? (<img className={styles.gift} src={gift} alt="Gifted" />) : null}
                </span>
                <h2 className={styles.villagerName}>{name}</h2>
                
                <img className={styles.icon} src={like} alt="Likes" />
                <VillagerLike id={id + "_1"} />

                <img className={styles.icon} src={like} alt="Likes" />
                <VillagerLike id={id + "_2"} />

                <img className={styles.icon} src={love} alt="Loves" />
                <VillagerLike id={id + "_3"} />
                
                <img className={styles.icon} src={love} alt="Loves" />
                <VillagerLike id={id + "_4"} />
                
            </section>
        </div>
    );
}