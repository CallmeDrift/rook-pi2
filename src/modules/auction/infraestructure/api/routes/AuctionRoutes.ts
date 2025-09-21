import { Router } from "express";
import { AuctionController } from "../controllers/AuctionController";

const router = Router();

export default function auctionRoutes(auctionController: AuctionController) {
  router.post("/", auctionController.createAuction);
  router.get("/", auctionController.listAuctions);
  router.post("/:id/bid", auctionController.placeBid);
  router.post("/:id/buy", auctionController.buyNow);
  router.get("/:id/bids", auctionController.getBids);
  router.get("/me", auctionController.getCurrentUser);
  router.get("/:id", auctionController.getAuction);
  router.get("/history/purchased/:userId", auctionController.getPurchasedAuctions);
  router.get("/history/sold/:userId", auctionController.getSoldAuctions);
  return router;
}
