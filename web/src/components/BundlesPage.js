import React from "react";
import { useSelector, useDispatch } from "react-redux";
import BundleItem from "./BundleItem.js";
import Button from "./Button.js";

import styles from "./BundlesPage.module.css";
import { setBundleSpoilers } from "../features/playerSlice.js";

export default function BundlesPage() {
    const dispatch = useDispatch();
    const showSpoilers = useSelector(state => state.player.bundle_spoilers);

    return (
        <div className={styles.bundlesPage}>
            <Button className={styles.spoilerButton} active={showSpoilers} onClick={() => dispatch(setBundleSpoilers(!showSpoilers))}>Spoilers are {showSpoilers?"shown":"hidden"}</Button>
            <h2>Vault of the Waves</h2>
            <div className={styles.vault}>
                <div className={styles.bundleWrapper}>
                    <h3>Spooky Bundle</h3>
                    <ul className={styles.bundle}>
                        <BundleItem id="spooky_1" type="water" item="Garden Mantis" description="Kilima Village Coastline during morning and day (3:00am to 6:00pm)" />
                        <BundleItem id="spooky_2" type="water" item="Vampire Crab" description="Bahari Bay Flooded Fortress during evening and night (6:00pm to 3:00am)" />
                        <BundleItem id="spooky_3" type="water" item="Mutated Angler" description="Bahari Bay Pavel Mines using a Worm" />
                        <BundleItem id="spooky_4" type="water" item="Void Ray" description="Bahari Bay Pavel Mines using a Glow Worm" />
                    </ul>
                </div>
                <div className={styles.bundleWrapper}>
                    <h3>Beach Bundle</h3>
                    <ul className={styles.bundle}>
                        <BundleItem id="beach_1" type="water" item="Green Pearl" description="3% chance when opening an Unopened Oyster" />
                        <BundleItem id="beach_2" type="water" item="Stripeshell Snail" description="Bahari Bay Coastline at night (6:00pm to 3:00am)" />
                        <BundleItem id="beach_3" type="water" item="Blue Marlin" description="Bahari Bay Coastline using a Worm" />
                        <BundleItem id="beach_4" type="water" item="Sushi" description="Recipe found by fishing in Mirror Pond using a Glow Worm" />
                    </ul>
                </div>
                <div className={styles.bundleWrapper}>
                    <h3>Freshwater Bundle</h3>
                    <ul className={styles.bundle}>
                        <BundleItem id="freshwater_1" type="water" item="Inky Dragonfly" description="Bahari Bay rivers and ponds" />
                        <BundleItem id="freshwater_2" type="water" item="Trout Dinner" quality description="Recipe found in Einar's Cave (need Level 3 Friendship)" />
                        <BundleItem id="freshwater_3" type="water" item="HydratePro Fertilizer" description="Bought from General Store for 40 Gold"/>
                        <BundleItem id="freshwater_4" type="water" item="Giant Goldfish" description="Kilima Village or Bahari Bay ponds using a Glow Worm" />
                    </ul>
                </div>
                <div className={styles.bundleWrapper}>
                    <h3>Magic Bundle</h3>
                    <ul className={styles.bundle}>
                        <BundleItem id="magic_1" type="water" item="Fisherman's Brew" description="Recipe bought from Einar for 1000 Gold at Fishing Level 5" />
                        <BundleItem id="magic_2" type="water" item="Enchanted Pupfish" description="Kilima Village Fisherman's Lagoon using a Glow Worm" />
                        <BundleItem id="magic_3" type="water" item="Shimmerfin" description="Kilima Village Fisherman's Lagoon using a Worm" />
                        <BundleItem id="magic_4" type="water" item="Long Nosed Unicorn Fish" description="Bahari Bay Coastline using a Glow Worm during the day (6:00am to 6:00pm)"/>
                    </ul>
                </div>
            </div>
        </div>
    );
}