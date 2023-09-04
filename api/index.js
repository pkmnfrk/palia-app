import express, {Router} from "express";
import morgan from "morgan";
import {getLikes, setLike, getEntity, setEntity, addListener} from "./dataStore.js";
import cors from "cors";
import config from "config";

const app = express();
if(config.get("request_logging")) {
    app.use(morgan("combined"))
}
app.use(express.static(config.get("static_root"), {
    maxAge: "1d",
    immutable: true,
    setHeaders: setCustomCacheControl
}));
app.use(express.text({limit: 256}));

app.use(cors({
    origin: config.get("allowed_origins"),
    credentials: false,
    maxAge: 3600,
}))

app.set("etag", false);

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
    try {
        const value = JSON.parse(req.body);
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

const entityType = ":entity(completed|gifted|bundle)";

apiRouter.get(`/player/:playerId/${entityType}`, async (req, resp) => {
    try {
        const completed = await getEntity(req.params.playerId, req.params.entity);
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

apiRouter.put(`/player/:playerId/${entityType}/:id`, async (req, resp) => {
    try {
        const value = JSON.parse(req.body);
        await setEntity(req.params.playerId, req.params.entity, req.params.id, value);
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
        setTimeout(resolve, timeMs).unref();
    })
}

apiRouter.get("/listen/:playerId", async (req, resp) => {
    resp.header("Cache-Control", "no-store");
    resp.contentType("text/event-stream");

    const undo = addListener(req.params.playerId, (event) => {
        resp.write(`event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`);
    });
    try {
        const version = process.env.CDNV ?? "test";
        resp.write(`event: version\ndata: ${version}\n\n`);
        while(!req.socket.closed) {
            await delay(config.get("listener_ping_delay"));
            resp.write(":ping\n\n");
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

function setCustomCacheControl (res, path) {
    if (express.static.mime.lookup(path) === 'text/html') {
      // Custom Cache-Control for HTML files
      res.setHeader('Cache-Control', 'public, max-age=0')
    }
  }

let shuttingDown = false;

function shutdown() {
    if(shuttingDown) {
        console.log("Interrupted twice, forcibly dying");
        process.exit(1);
    } else {
        console.log("Interrupted, shutting down");
        shuttingDown = true;
        server.close();
        setTimeout(() => {
            console.log("Did not automatically shut down, forcing the issue");
            process.exit(1);
        }, 5_000);
    }
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)