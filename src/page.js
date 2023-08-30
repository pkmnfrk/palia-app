import Villager from "./components/Villager.js"
import villagers from "./villagers.js";
import React, { useEffect, useState } from "react";
import { LikesContext, PlayerContext } from "./context.js";
import { setLike as storeLike, setComplete as storeComplete, getLikes, getCompleted } from "./dataStore.js";
import { v4 as uuid } from "uuid";

import styles from "./page.module.css";

export default function Home() {
  
  const [playerId, setPlayerId] = useState(null);
  const [likesState, setLikesState] = useState({});
  const [completeState, setCompleteState] = useState({});

  async function refresh(full) {
    console.log("current player id", playerId);
    const newLikes = await getLikes()
    setLikesState(newLikes);

    if(full) {
      const newCompleted = await getCompleted(playerId);
      setCompleteState(newCompleted);
    }
  }

  useEffect(() => {
    setPlayerId(getPlayerId())
  }, []);

  useEffect(() => {
    if(!playerId) return;
    refresh(true);
  }, [playerId])

  useEffect(() => {
    if(!playerId) return;

    console.log("Opening event source");
    const evtSource = new EventSource("/api/listen/" + playerId);
    evtSource.addEventListener("likes", (event) => {
      const data = JSON.parse(event.data);
      // console.log("New likes state:", data);
      setLikesState(data);
    });
    evtSource.addEventListener("complete", (event) => {
      const data = JSON.parse(event.data);
      // console.log("New complete state:", data);
      setCompleteState(data);
    })

    return () => {
      console.log("Closing event source");
      evtSource.close();
    }
  }, [playerId])

  function setLike(id, value) {
    console.log("setting", id, "to", value)
    storeLike(id, value);

    const newState = {
      ...likesState,
      [id]: value,
    }
    setLikesState(newState);
  }

  function setComplete(id, value) {
    storeComplete(playerId, id, value);

    const newState = {
      ...completeState,
      [id]: value,
    };
    console.log("Setting complete state to", newState);
    setCompleteState(newState);
  }

  // console.log("State is", completeState);
  if(!playerId) {
    return (
      <div>Loading...</div>
    )
  }
  return (
    <>
    <main>
      <h1>Palia Villager Tracker</h1>
      <LikesContext.Provider value={likesState}>
        <PlayerContext.Provider value={completeState}>
          {villagers.map(villager => (<Villager key={villager} name={villager} setLike={setLike} setComplete={setComplete} />))}
        </PlayerContext.Provider>
      </LikesContext.Provider>
    </main>
    <footer>
      <a href={`/?playerId=${playerId}`}>Link to your personalized page</a> - This is unique to you!<br />
      This is a fan project, not associated with Singularity 6. All images &copy; Singularity 6. Website &copy; 2023 Mike Caron
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