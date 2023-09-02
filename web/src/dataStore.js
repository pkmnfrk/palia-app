


export async function setLike(id, value) {
    await fetch(`${process.env.API_ROOT}/like/${id}`, {
        method: "PUT",
        body: value,
    })
}

export async function getLikes() {
    return await (await fetch(`${process.env.API_ROOT}/likes`)).json();
}

export async function setComplete(player, id, value) {
    await fetch(`${process.env.API_ROOT}/player/${player}/completed/${id}`, {
        method: "PUT",
        body: value ? "true" : "false",
    })
}

export async function getCompleted(player) {
    return await (await fetch(`${process.env.API_ROOT}/player/${player}/completed`)).json();
}

export async function setGifted(player, id, value) {
    await fetch(`${process.env.API_ROOT}/player/${player}/gifted/${id}`, {
        method: "PUT",
        body: value ? "true" : "false",
    })
}

export async function getGifted(player) {
    return await (await fetch(`${process.env.API_ROOT}/player/${player}/gifted`)).json();
}