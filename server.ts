import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = createServer(app);
  
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Game State
  const players: Record<string, { id: string, position: [number, number, number], color: string, action: string, target: [number, number, number] | null }> = {};

  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ffffff", "#000000"];

  io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);
    
    // Assign a random color
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    players[socket.id] = {
      id: socket.id,
      position: [0, 0, 0],
      color: color,
      action: "idle",
      target: null
    };

    // Send current state to the new player
    socket.emit("init", players);
    
    // Broadcast new player to others
    socket.broadcast.emit("playerJoined", players[socket.id]);

    socket.on("move", (targetPosition: [number, number, number]) => {
      if (players[socket.id]) {
        players[socket.id].target = targetPosition;
        players[socket.id].action = "walking";
        io.emit("playerMoved", { id: socket.id, target: targetPosition });
      }
    });

    socket.on("positionUpdate", (position: [number, number, number]) => {
      if (players[socket.id]) {
        players[socket.id].position = position;
        // We don't broadcast this constantly to save bandwidth, 
        // clients interpolate based on 'target'
      }
    });

    socket.on("action", (action: string) => {
       if (players[socket.id]) {
         players[socket.id].action = action;
         io.emit("playerAction", { id: socket.id, action });
       }
    });

    socket.on("message", (message: string) => {
       if (players[socket.id]) {
         io.emit("playerMessage", { id: socket.id, message });
       }
    });

    socket.on("disconnect", () => {
      console.log("Player disconnected:", socket.id);
      delete players[socket.id];
      io.emit("playerLeft", socket.id);
    });
  });

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
