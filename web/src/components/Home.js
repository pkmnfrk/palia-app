import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { setPlayerId } from "../features/playerSlice.js";
import { useSelector, useDispatch } from "react-redux";
import VillagerPage from "./VillagerPage.js";
import ChangelogPage from "./ChangelogPage.js";
import BundlesPage from "./BundlesPage.js";
import HelpPage from "./HelpPage.js";

import Button from "./Button.js";

import styles from "./Home.module.css";



export default function Home() {
    const dispatch = useDispatch();
    const playerId = useSelector(state => state.player.id);

    const [tab, setTab] = useState(getTab());

    useEffect(() => {
        dispatch(setPlayerId(getPlayerId()));
    }, []);

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
                <Button active={tab == "villagers"} onClick={() => changeTab("villagers")}>Villagers</Button>
                <Button active={tab == "bundles"} onClick={() => changeTab("bundles")}>Bundles</Button>
                <Button active={tab == "help"} onClick={() => changeTab("help")}>Help</Button>
                <Button active={tab == "changelog"} onClick={() => changeTab("changelog")}>Changelog</Button>
                <hr className={styles.divider}/>
                {tab == "villagers" ? <VillagerPage /> : null}
                {tab == "bundles" ? <BundlesPage /> : null}
                {tab == "help" ? <HelpPage /> : null}
                {tab == "changelog" ? <ChangelogPage /> : null}
            </main>
            <footer>
                <a href={`/?playerId=${playerId}`}>Link to your personalized page</a> - This is unique to you!<br />
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
  const cookies = document.cookie.split(';');

    for(const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if(name === "currentTab") {
            return value;
        }
    } 

    return "villagers";
}

function saveTab(tab) {
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    document.cookie = `currentTab=${tab}; expires=${expiry.toUTCString()}; path=/`;
}