export const ENTITY_COMPLETED="completed";
export const ENTITY_GIFTED="gifted";
export const ENTITY_BUNDLE="bundle";
export const ENTITY_LIKES="likes";

export async function setLike(id, value) {
    await fetch(`${process.env.API_ROOT}/like/${id}`, {
        method: "PUT",
        body: JSON.stringify(value),
    })
}

export async function getLikes() {
    return await (await fetch(`${process.env.API_ROOT}/likes`)).json();
}

export async function setEntity(player, entity, id, value) {
    await fetch(`${process.env.API_ROOT}/player/${player}/${entity}/${id}`, {
        method: "PUT",
        body: JSON.stringify(value),
    })    
}

export async function getEntity(player, entity) {
    return await (await fetch(`${process.env.API_ROOT}/player/${player}/${entity}`)).json();
}
