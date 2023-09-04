import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import styles from "./Villager.module.css";
import VillagerLike from "./VillagerLike.js";
import { debounce } from "../utils.js";
import { setGifted } from "../features/giftedSlice.js";

import * as portraits from "./villagers/index.js";
import like from "./like.png";
import love from "./love.png";
import gift from "./gift.png";
import target from "./target.png";

function styleForState(state) {
    const ret = [
        styles.villager,
    ];
    if(state.targetted) {
        ret.push(styles.targetted);
    }
    if(state.gifted) {
        ret.push(styles.gifted);
    }
    return ret.join(" ");
}

export default function Villager({name}) {
    const id = name.toLowerCase().replace(/[^a-z]/g, '_');

    // const gifteds = useContext(GiftedContext);
    const giftedState = useSelector(state => state.gifted[id]) ?? {};
    const dispatch = useDispatch();

    const portraitRef = useRef(null);

    const onClick = (e) => {
        let newGifted = {
            ...giftedState,
            gifted: !giftedState.gifted,
        }
        
        dispatch(setGifted(id, newGifted));
    };

    const onContextMenu = (e) => {
        e.preventDefault();
        const newGifted = {
            ...giftedState,
            targetted: !giftedState.targetted,
        }
        dispatch(setGifted(id, newGifted));
    }

    const onTouchStart = (e) => {
        e.preventDefault();
        
        // alert("start");
    }
    

    const onTouchEnd = (e) => {
        // alert("end");
    }

    useEffect(() => {
        const el = portraitRef.current;
        if(el) {
            el.addEventListener("long-press", onContextMenu);
        }
        return () => {
            if(el) {
                el.removeEventListener("long-press", onContextMenu);
            }
        }
        
    })

    return (
        <div className={styles.villagerWrapper}>
            <section className={styleForState(giftedState)}>
                <span ref={portraitRef} className={styles.portraitWrapper}
                    onClick={debounce(onClick)}
                    onContextMenu={debounce(onContextMenu)}
                    data-long-press-delay="750"
                >
                    <img className={styles.portrait} src={portraits[id]} alt="" />
                    {giftedState.gifted ? (<img className={styles.gift} src={gift} alt="Gifted" />) : null}
                    {giftedState.targetted ? (<img className={styles.target} src={target} alt="Targetted" />) : null}
                </span>
                <h2 className={styles.villagerName}>{name}</h2>
                
                <img className={styles.icon} src={like} alt="Likes" />
                <VillagerLike id={id + "_1"} villager={id} />

                <img className={styles.icon} src={like} alt="Likes" />
                <VillagerLike id={id + "_2"} villager={id} />

                <img className={styles.icon} src={love} alt="Loves" />
                <VillagerLike id={id + "_3"} villager={id} />
                
                <img className={styles.icon} src={love} alt="Loves" />
                <VillagerLike id={id + "_4"} villager={id} />
                
            </section>
        </div>
    );
}