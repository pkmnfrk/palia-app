import React from "react";
import BundleItem from "./BundleItem.js";

import styles from "./BundlesPage.module.css";

export default function BundlesPage() {
    return (
        <>
            <h2>Vault of the Waves</h2>
            <div className={styles.vault}>
                <div className={styles.bundleWrapper}>
                    <h3>Spooky Bundle</h3>
                    <ul className={styles.bundle}>
                        <BundleItem id="spooky_1">Garden Mantis</BundleItem>
                        <BundleItem id="spooky_2">Vampire Crab</BundleItem>
                        <BundleItem id="spooky_3">Mutated Angler</BundleItem>
                        <BundleItem id="spooky_4">Void Ray</BundleItem>
                    </ul>
                </div>
                <div className={styles.bundleWrapper}>
                    <h3>Beach Bundle</h3>
                    <ul className={styles.bundle}>
                        <BundleItem id="beach_1">Green Pearl</BundleItem>
                        <BundleItem id="beach_2">Stripeshell Snail</BundleItem>
                        <BundleItem id="beach_3">Blue Marlin</BundleItem>
                        <BundleItem id="beach_4">Sushi</BundleItem>
                    </ul>
                </div>
                <div className={styles.bundleWrapper}>
                    <h3>Freshwater Bundle</h3>
                    <ul className={styles.bundle}>
                        <BundleItem id="freshwater_1">Inky Dragonfly</BundleItem>
                        <BundleItem id="freshwater_2" quality>Trout Dinner</BundleItem>
                        <BundleItem id="freshwater_3">HydratePro Fertilizer</BundleItem>
                        <BundleItem id="freshwater_4">Giant Goldfish</BundleItem>
                    </ul>
                </div>
                <div className={styles.bundleWrapper}>
                    <h3>Magic Bundle</h3>
                    <ul className={styles.bundle}>
                        <BundleItem id="magic_1">Fisherman's Brew</BundleItem>
                        <BundleItem id="magic_2">Enchanted Pupfish</BundleItem>
                        <BundleItem id="magic_3">Shimmerfin</BundleItem>
                        <BundleItem id="magic_4">Long Nosed Unicorn Fish</BundleItem>
                    </ul>
                </div>
            </div>
        </>
    );
}