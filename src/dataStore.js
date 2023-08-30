

export async function setLike(id, value) {
    await fetch(`/api/like/${id}`, {
        method: "PUT",
        body: value,
    })
}

export async function getLikes() {
    return await (await fetch("/api/likes")).json();
}

export async function setComplete(player, id, value) {
    await fetch(`/api/complete/${player}/${id}`, {
        method: "PUT",
        body: value ? "true" : "false",
    })
}

export async function getCompleted(player) {
    return await (await fetch(`/api/completed/${player}`)).json();
}