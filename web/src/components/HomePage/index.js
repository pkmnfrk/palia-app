import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { setPlayerId } from "features/playerSlice.js";
import { useSelector, useDispatch } from "react-redux";
import VillagerPage from "components/VillagerPage/index.js";
import ChangelogPage from "components/ChangelogPage/index.js";
import BundlesPage from "components/BundlesPage/index.js";
import HelpPage from "components/HelpPage/index.js";

import Tab from "components/Tab.js";

import styles from "./index.icss";

const validTabs = [
    "villagers",
    "bundles",
    "help",
    "changelog",
]

export default function Home() {
    const dispatch = useDispatch();
    const playerId = useSelector(state => state.player.id);

    const [tab, setTab] = useState(getTab());

    useEffect(() => {
        dispatch(setPlayerId(getPlayerId()));
    }, []);

    useEffect(() => {
        const handler = (e) => {
            setTab(getTab())
        };

        window.addEventListener("popstate", handler);

        return () => {
            window.removeEventListener("popstate", handler);
        }
    }, [])

    function changeTab(tab) {
        setTab(tab);
        saveTab(tab);
    }

    if(!playerId) {
        return (
            <div>Loading...</div>
        )
    }
    return (
        <>
            <main>
                <h1>Palia Tracker</h1>
                <div className={styles.tabBar}>
                    <Tab icon="villagers" active={tab == "villagers"} onClick={() => changeTab("villagers")}>Villagers</Tab>
                    <Tab icon="bundles" active={tab == "bundles"} onClick={() => changeTab("bundles")}>Bundles</Tab>
                    <Tab icon="help" active={tab == "help"} onClick={() => changeTab("help")}>Help</Tab>
                    <Tab icon="changelog" active={tab == "changelog"} onClick={() => changeTab("changelog")}>Changelog</Tab>
                </div>
                <div className={styles.pageWrapper}>
                    <div className={styles.page}>   
                        {tab == "villagers" ? <VillagerPage /> : null}
                        {tab == "bundles" ? <BundlesPage /> : null}
                        {tab == "help" ? <HelpPage /> : null}
                        {tab == "changelog" ? <ChangelogPage /> : null}
                    </div>
                </div>
            </main>
            <footer>
                <a href={`?playerId=${playerId}#${tab}`}>Link to your personalized page</a> - This is unique to you!<br />
                This is a fan project, not associated with Singularity 6. All images &copy; Singularity 6. Website &copy; 2023 Mike Caron<br />
                Version {process.env.VERSION} ({process.env.CDNV.substring(0, 8)})
            </footer>
        </>
    )
}

let cachedPlayerId;

function getPlayerId() {
    if(cachedPlayerId) return cachedPlayerId;

    // console.log("Looking up Player Id");
    if(document.location.search.indexOf("playerId") !== -1) {
        const parts = document.location.search.substring(1).split("&");
        for(const part of parts) {
            const [name, value] = part.split("=");
            if(name === "playerId") {
                cachedPlayerId = value;
            }
        }

    }

    if(!cachedPlayerId) {
        const cookies = document.cookie.split(';');

        for(const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if(name === "playerId") {
                cachedPlayerId = value;
            }
        }
    }

    if(!cachedPlayerId) {
        cachedPlayerId = uuid();
    }

    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    document.cookie = `playerId=${cachedPlayerId}; expires=${expiry.toUTCString()}; path=/`;
    cachedPlayerId = cachedPlayerId;
    console.log("Player ID is", cachedPlayerId);
    return cachedPlayerId;
}

function getTab() {
    let ret = null;
    if(window.location.hash) {
        ret = window.location.hash.substring(1);
    }

    if(validTabs.indexOf(ret) === -1) {
        ret = "villagers"
    }

    return ret;
}

function saveTab(tab) {
    history.pushState(null, "", "#" + tab);
}