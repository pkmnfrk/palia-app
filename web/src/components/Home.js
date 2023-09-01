import Villager from "./Villager.js"
import villagers from "../villagers.js";
import React, { useEffect } from "react";
import { v4 as uuid } from "uuid";
import { setPlayerId } from "../features/playerSlice.js";
import { useSelector, useDispatch } from "react-redux";

import styles from "./Home.module.css";

export default function Home() {
  const dispatch = useDispatch();
  const playerId = useSelector(state => state.player.id);

  useEffect(() => {
    dispatch(setPlayerId(getPlayerId()));
  }, []);

  if(!playerId) {
    return (
      <div>Loading...</div>
    )
  }
  return (
    <>
    <main>
      <h1>Palia Villager Tracker</h1>
      <div className={styles.villagers}>
        {villagers.map(villager => (<Villager key={villager} name={villager} />))}
      </div>
    </main>
    <footer>
      <a href={`/?playerId=${playerId}`}>Link to your personalized page</a> - This is unique to you!<br />
      This is a fan project, not associated with Singularity 6. All images &copy; Singularity 6. Website &copy; 2023 Mike Caron<br />
      Version {process.env.CDNV}
    </footer>
    </>
  )
}

let cachedPlayerId;

function getPlayerId() {
  if(cachedPlayerId) return cachedPlayerId;

  if(typeof document === "undefined") {
    throw new Error("Running client code on the server??");
  }

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