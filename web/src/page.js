import Villager from "./components/Villager.js"
import villagers from "./villagers.js";
import React, { useEffect, useState } from "react";
import { LikesContext, CompletedContext, GiftedContext } from "./context.js";
import { setLike as storeLike, setComplete as storeComplete, getLikes, getCompleted, getGifted, setGifted as storeGifted } from "./dataStore.js";
import { v4 as uuid } from "uuid";
import { setAll as setLiked } from "./features/likesSlice.js";
import { setAll as setCompleted } from "./features/completedSlice.js";
import { setAll as setGifted } from "./features/giftedSlice.js";
import { setPlayerId } from "./features/playerSlice.js";
import { useSelector, useDispatch } from "react-redux";

import styles from "./page.module.css";

export default function Home() {
  const dispatch = useDispatch();
  const playerId = useSelector(state => state.player.id);

  async function refresh(full) {
    console.log("current player id", playerId);
    const newLikes = await getLikes()
    // setLikesState(newLikes);
    dispatch(setLiked(newLikes));

    if(full) {
      const newCompleted = await getCompleted(playerId);
      // setCompleteState(newCompleted);
      dispatch(setCompleted(newCompleted));
      const newGifted = await getGifted(playerId);
      // setGiftedState(newGifted);
      dispatch(setGifted(newGifted));
    }
  }

  useEffect(() => {
    dispatch(setPlayerId(getPlayerId()));
  }, []);

  useEffect(() => {
    if(!playerId) return;
    refresh(true);
  }, [playerId])

  useEffect(() => {
    if(!playerId) return;

    console.log("Opening event source");
    const evtSource = new EventSource(`${process.env.API_ROOT}/listen/${playerId}`);
    evtSource.addEventListener("likes", (event) => {
      const data = JSON.parse(event.data);
      // console.log("New likes state:", data);
      // setLikesState(data);
      setLiked(data);
    });
    evtSource.addEventListener("complete", (event) => {
      const data = JSON.parse(event.data);
      // console.log("New complete state:", data);
      dispatch(setCompleted(data));
    })
    evtSource.addEventListener("gifted", (event) => {
      const data = JSON.parse(event.data);
      // console.log("New gifted state:", data);
      dispatch(setGifted(data));
    })
    evtSource.addEventListener("weekly_reset", (event) => {
      refresh(true);
    })
    evtSource.addEventListener("daily_reset", (event) => {
      refresh(true);
    })
    evtSource.addEventListener("version", (event) => {
      const expected_version = event.data;
      const actual_version = process.env.CDNV;
      if(actual_version !== expected_version) {
        setTimeout(() => {
          window.location = window.location; //refresh
        }, 120_000); // wait a while for the server to stabilize
      }
    });

    return () => {
      console.log("Closing event source");
      evtSource.close();
    }
  }, [playerId])

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