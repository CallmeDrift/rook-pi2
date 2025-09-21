// src/modules/auction/infraestructure/api/index.ts
import express from "express";
import http from "http";
import cors from "cors";
import { initAuctionSocket, setAuctionServiceForSocket } from "../sockets/auctionSocket";
import { env } from "../config/env";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

// --- Auctions ---
import auctionRoutes from "./routes/AuctionRoutes";
import { AuctionController } from "./controllers/AuctionController";
import { AuctionService } from "../../domain/services/AuctionService";
import { InMemoryAuctionRepository } from "../../domain/repositories/InMemoryAuctionRepository";
import { HttpItemRepository } from "../../../inventory/domain/repositories/HttpItemRepository";

// --- Items ---
import itemRoutes from "./routes/ItemRoutes";
import { ItemController } from "./controllers/ItemController";
import { ItemService } from "../../../inventory/domain/services/ItemService";

// --- Users ---
import { HttpUserRepository } from "../../../user/domain/repositories/HttpUserRepository";
import { UserController } from "./controllers/UserController";
import userRoutes from "./routes/UserRoutes";
import { UserService } from "../../../user/domain/services/UserService";

// ----------------------
// Instancias únicas
// ----------------------
const userRepo = new HttpUserRepository(env.userServiceUrl);
const itemRepo = new HttpItemRepository(env.itemServiceUrl);
const auctionRepo = new InMemoryAuctionRepository();

// Services
const auctionService = new AuctionService(auctionRepo, itemRepo, userRepo);
const itemService = new ItemService(itemRepo); // ya implementa IItemService correctamente
const userService = new UserService(userRepo);

// Controllers
const auctionController = new AuctionController(auctionService);
const itemController = new ItemController(itemService);
const userController = new UserController(userService);

// ----------------------
// Swagger / Docs
// ----------------------
const docsPath = path.join(process.cwd(), "docs");
const generalDoc = YAML.load(path.join(docsPath, "General.yaml"));
const auctionDoc = YAML.load(path.join(docsPath, "Auction.yaml"));
const itemDoc = YAML.load(path.join(docsPath, "Item.yaml"));
const userDoc = YAML.load(path.join(docsPath, "User.yaml"));

const swaggerDocument = {
  ...generalDoc,
  paths: {
    ...(auctionDoc.paths || {}),
    ...(itemDoc.paths || {}),
    ...(userDoc.paths || {}),
  },
  components: {
    schemas: {
      ...(auctionDoc.components?.schemas || {}),
      ...(itemDoc.components?.schemas || {}),
      ...(userDoc.components?.schemas || {}),
    },
  },
};

// ----------------------
// Configuración Express
// ----------------------
const app = express();

app.use((req, _res, next) => {
  console.log("[DEBUG] Method:", req.method, "URL:", req.url);
  next();
});

app.use(cors({
  origin: env.corsOrigin,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

// ----------------------
// Rutas
// ----------------------
app.use(env.apiPrefix + "/auctions", auctionRoutes(auctionController));
app.use(env.apiPrefix + "/items", itemRoutes(itemController));
app.use(env.apiPrefix + "/users", userRoutes(userController));

// ----------------------
// Server HTTP + Sockets
// ----------------------
const server = http.createServer(app);

setAuctionServiceForSocket(auctionService);
initAuctionSocket(server);

// ----------------------
// Levantar servidor
// ----------------------
server.listen(env.port, () => {
  console.log(`API Auctions running on port ${env.port}`);
});
