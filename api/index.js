import express, {Router} from "express";
import {getLikes, getCompleted, setLike, setComplete, addListener, getGifted, setGifted} from "./dataStore.js";

const static_root = process.env.STATIC_ROOT ?? "../dist";

const app = express();

app.use(express.static(static_root));
app.use(express.text({limit: 256}));

const apiRouter = Router();

apiRouter.get("/likes", async (req, resp) => {
    try {
        const likes = await getLikes();
        resp.status(200);
        resp.json(likes);
    } catch(e) {
        console.error(e);
        resp.status(500);
        resp.json({
            error: e.message,
        });
    }
    resp.end();
})

apiRouter.put("/like/:id", async (req, resp) => {
    const value = req.body;
    try {
        await setLike(req.params.id, value);
        resp.status(204);
    } catch(e) {
        console.error(e);
        resp.status(500);
        resp.json({
            error: e.message,
        });
    }
    resp.end();
})

apiRouter.get("/completed/:playerId", async (req, resp) => {
    try {
        const completed = await getCompleted(req.params.playerId);
        resp.status(200);
        resp.json(completed);
    } catch(e) {
        console.error(e);
        resp.status(500);
        resp.json({
            error: e.message,
        });
    }
    resp.end();
})

apiRouter.put("/complete/:playerId/:id", async (req, resp) => {
    const value = (req.body === "true" ? true : (req.body === "false" ? false : null));

    try {
        if(value === null) {
            throw new Error("Invalid values");
        }
        await setComplete(req.params.playerId, req.params.id, value);
        resp.status(204);
    } catch(e) {
        console.error(e);
        resp.status(500);
        resp.json({
            error: e.message,
        });
    }
    resp.end();
})

apiRouter.get("/gifted/:playerId", async (req, resp) => {
    try {
        const gifted = await getGifted(req.params.playerId);
        resp.status(200);
        resp.json(gifted);
    } catch(e) {
        console.error(e);
        resp.status(500);
        resp.json({
            error: e.message,
        });
    }
    resp.end();
})

apiRouter.put("/gifted/:playerId/:id", async (req, resp) => {
    const value = (req.body === "true" ? true : (req.body === "false" ? false : null));

    try {
        if(value === null) {
            throw new Error("Invalid values");
        }
        await setGifted(req.params.playerId, req.params.id, value);
        resp.status(204);
    } catch(e) {
        console.error(e);
        resp.status(500);
        resp.json({
            error: e.message,
        });
    }
    resp.end();
})


function delay(timeMs) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeMs);
    })
}

apiRouter.get("/listen/:playerId", async (req, resp) => {
    resp.header("Cache-Control", "no-store");
    resp.contentType("text/event-stream");

    const undo = addListener(req.params.playerId, (event) => {
        resp.write(`event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`);
    });
    try {
        while(!req.socket.closed) {
            resp.write(":ping\n\n");
            await delay(180_000);
        }
    } finally {
        undo();
    }
    
    // console.log("connection closed");
})

app.use("/api", apiRouter);

const server = app.listen(5000, () => {
    console.log("Listening on port 5000");
});

process.on("SIGINT", () => {
    console.log("Interrupted, shutting down");
    server.close();
})
process.on("SIGTERM", () => {
    console.log("Terminated, shutting down");
    server.close();
})