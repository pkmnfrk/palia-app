import React from "react";

import Villager from "./Villager.js"
import villagers from "../villagers.js";

import styles from "./VillagerPage.module.css";
import { useSelector } from "react-redux";

export default function VillagerPage() {
    const myVillagers = [
        ...villagers,
    ];
    const giftedState = useSelector(state => state.gifted);

    myVillagers.sort((a, b) => {
        const aId = a.toLowerCase().replace(/[^a-z]/g, '_');
        const bId = b.toLowerCase().replace(/[^a-z]/g, '_');
        const aTargeted = giftedState[aId] === "target";
        const bTargeted = giftedState[bId] === "target";

        if(aTargeted !== bTargeted) {
            if(aTargeted) {
                return -1;
            } 
            return 1;
        }
        if(aId < bId) {
            return -1;
        } else if(bId > aId) {
            return 1;
        }
        return 0;
    });
    return (
        <div className={styles.villagers}>
            {myVillagers.map(villager => (<Villager key={villager} name={villager} />))}
        </div>
    )
}