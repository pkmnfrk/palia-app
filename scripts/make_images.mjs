import { EOL } from "os";
import villagers from "../src/villagers.js";
import fs from "fs";

let content = "";
for(const villager of villagers) {
    const v = villager.toLowerCase().replace(/[^a-z]/g, '_');
    content += `import ${v}_i from "./${v}.png";${EOL}`;
    content += `export const ${v} = ${v}_i;${EOL}`;
}

fs.writeFileSync("./src/components/villagers/index.js", content, "utf-8");
