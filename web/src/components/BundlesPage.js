import React, {useState} from "react";
import BundleItem from "./BundleItem.js";
import Button from "./Button.js";

import styles from "./BundlesPage.module.css";
import { debounce } from "../utils.js";

export default function BundlesPage() {
    const [showSpoilers, setShowSpoilers] = useState(false);

    return (
        <div className={styles.bundlesPage}>
            <Button className={styles.spoilerButton} active={showSpoilers} onClick={() => setShowSpoilers(!showSpoilers)}>Spoilers are {showSpoilers?"shown":"hidden"}</Button>
            <h2>Vault of the Waves</h2>
            <div className={styles.vault}>
                <div className={styles.bundleWrapper}>
                    <h3>Spooky Bundle</h3>
                    <ul className={styles.bundle}>
                        <BundleItem id="spooky_1" type="water" item="Garden Mantis" />
                        <BundleItem id="spooky_2" type="water" item="Vampire Crab" />
                        <BundleItem id="spooky_3" type="water" item="Mutated Angler" />
                        <BundleItem id="spooky_4" type="water" item="Void Ray" />
                    </ul>
                </div>
                <div className={styles.bundleWrapper}>
                    <h3>Beach Bundle</h3>
                    <ul className={styles.bundle}>
                        <BundleItem id="beach_1" type="water" item="Green Pearl" />
                        <BundleItem id="beach_2" type="water" item="Stripeshell Snail" />
                        <BundleItem id="beach_3" type="water" item="Blue Marlin" />
                        <BundleItem id="beach_4" type="water" item="Sushi" />
                    </ul>
                </div>
                <div className={styles.bundleWrapper}>
                    <h3>Freshwater Bundle</h3>
                    <ul className={styles.bundle}>
                        <BundleItem id="freshwater_1" type="water" item="Inky Dragonfly" />
                        <BundleItem id="freshwater_2" type="water" item="Trout Dinner" quality />
                        <BundleItem id="freshwater_3" type="water" item="HydratePro Fertilizer" />
                        <BundleItem id="freshwater_4" type="water" item="Giant Goldfish" />
                    </ul>
                </div>
                <div className={styles.bundleWrapper}>
                    <h3>Magic Bundle</h3>
                    <ul className={styles.bundle}>
                        <BundleItem id="magic_1" type="water" item="Fisherman's Brew" />
                        <BundleItem id="magic_2" type="water" item="Enchanted Pupfish" />
                        <BundleItem id="magic_3" type="water" item="Shimmerfin" />
                        <BundleItem id="magic_4" type="water" item="Long Nosed Unicorn Fish" />
                    </ul>
                </div>
            </div>
        </div>
    );
}