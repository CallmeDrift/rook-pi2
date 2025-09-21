import { Router } from "express";
import { AuctionController } from "../controllers/AuctionController";

const router = Router();

export default function auctionRoutes(auctionController: AuctionController) {
  // Crear subasta
  router.post("/", auctionController.createAuction);

  // Listar subastas abiertas
  router.get("/", auctionController.listAuctions);

  // Obtener subasta por id
  router.get("/:id", auctionController.getAuction);

  // Pujar en subasta
  router.post("/:id/bid", auctionController.placeBid);

  // Compra rápida
  router.post("/:id/buy", auctionController.buyNow);

  // Obtener pujas de una subasta
  router.get("/:id/bids", auctionController.getBids);

  // Obtener usuario actual
  router.get("/me/:username", auctionController.getCurrentUser);

  // Subastas compradas por usuario
  router.get(
  "/history/sold/:username",
  auctionController.getSoldHistory.bind(auctionController)
);

  // Subastas vendidas por usuario
  router.get(
  "/history/purchased/:username",
  auctionController.getPurchasedHistory.bind(auctionController)
);

  return router;
}
