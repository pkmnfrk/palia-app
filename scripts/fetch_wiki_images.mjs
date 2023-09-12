import { EOL } from "os";
import https from "https";
import fs from "fs/promises";

import villagers from "../web/src/villagers.js";

let content = "";
for(const villager of villagers) {
    const v = villager.toLowerCase().replace(/[^a-z]/g, '_');
    const path = `./web/src/components/villagers/${v}.png`;
    if(!await fileExists(path)) {
        await saveWikiImage(villager + "_Profile", path);
    }

    content += `import ${v}_i from "./${v}.png";${EOL}`;
    content += `export const ${v} = ${v}_i;${EOL}`;
}

await fs.writeFile("./web/src/components/villagers/index.js", content, "utf-8");

const items = [
    "Garden Mantis",
    "Vampire Crab",
    "Mutated Angler",
    "Void Ray",
    "Green Pearl",
    "Stripeshell Snail",
    "Blue Marlin",
    "Sushi",
    "Inky Dragonfly",
    "Trout Dinner",
    "HydratePro Fertilizer",
    "Giant Goldfish",
    "Fisherman's Brew",
    "Enchanted Pupfish",
    "Shimmerfin",
    "Long Nosed Unicorn Fish",

    "Chapaa Masala",
    "Chopped Heat Root",
    "Stuffed Tomatoes",
    "Dari Cloves",

    "Emberseeker Medallion",

    "Paper Lantern Bug",
    "Bahari Glowbug",
    "Spitfire Cicada",
    "Firebreathing Dragonfly",

    "Radiant Sunfish",
    "Flametongue Ray",
    "Striped Sturgeon",
    "Dawnray",
];

content = "";
for(const item of items) {
    const v = item.toLowerCase().replace(/[^a-z]/g, '_');
    const path = `./web/src/components/items/${v}.png`;
    if(!await fileExists(path)) {
        try {
            await saveWikiImage(item, path)
        } catch(e) {
            console.log(e.message);
            content += `import ${v}_i from "./unknown.png";${EOL}`;
            content += `export const ${v} = ${v}_i;${EOL}`;
            continue;
        }
    }
    content += `import ${v}_i from "./${v}.png";${EOL}`;
    content += `export const ${v} = ${v}_i;${EOL}`;
}

await fs.writeFile("./web/src/components/items/index.js", content, "utf-8");

async function fileExists(file) {
    try {
        await fs.readFile(file);
        // console.log(file, "exists");
        return true;
    } catch(e) {
        console.log(file, "not exists");
        return false;
    }
}

function toWikiWord(x) {
    return encodeURIComponent(x.replace(/ /g, '_')).replace("'", "%27");
}

async function saveWikiImage(file, diskPath) {
    file = toWikiWord(file);
    const pageUrl = `https://palia.wiki.gg/wiki/File:${file}.png`;
    const pageData = await fetchData(pageUrl);
    const pageSrc = pageData.toString("utf-8");

    const regexp = new RegExp(`"(\/images\/[a-f0-9]\/[a-f0-9]+\/${file}\.png)"`);
    const imageUrlMatch = regexp.exec(pageSrc);
    if(imageUrlMatch) {
        const imageUrl = `https://palia.wiki.gg${imageUrlMatch[1]}`;
        const imageData = await fetchData(imageUrl);
        
        await fs.writeFile(diskPath, imageData);
    } else {
        //console.log("Can't find image reference with", regexp.toString())
        throw new Error(`Can't find image reference with ${regexp.toString()}`)
    }
}

function fetchData(url) {
    return new Promise((resolve, reject) => {
        https.get(url)
            .on("error", reject)
            .on("response", (resp) => {
                const chunks = [];
                resp
                    .on("data", (chunk) => {
                        chunks.push(chunk);
                    })
                    .on("end", () => {
                        resolve(Buffer.concat(chunks));
                    })
                    .on("error", reject);

            })
    })
    
}