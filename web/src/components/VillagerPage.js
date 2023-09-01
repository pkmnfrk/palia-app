import React from "react";

import Villager from "./Villager.js"
import villagers from "../villagers.js";

import styles from "./VillagerPage.module.css";

export default function VillagerPage() {
    return (
        <div className={styles.villagers}>
            {villagers.map(villager => (<Villager key={villager} name={villager} />))}
        </div>
    )
}