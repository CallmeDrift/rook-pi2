import { Request, Response } from "express";
import { IAuctionService } from "../../../domain/services/IAuctionService";
import { AuctionMapper } from "../../../application/mappers/AuctionMapper";

export class AuctionController {
  constructor(private readonly auctionService: IAuctionService) {}

  createAuction = async (req: Request, res: Response) => {
    try {
      const username = req.body.username?.trim();
      if (!username) return res.status(400).json({ error: "Username no proporcionado" });

      const dto = await this.auctionService.createAuction(req.body, username);
      return res.status(201).json({ data: dto });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  };

  getAuction = async (req: Request, res: Response): Promise<Response> => {
    try {
      const auctionId = req.params["id"];
      if (!auctionId) return res.status(400).json({ error: "auctionId no proporcionado" });

      const auction = await this.auctionService.getAuctionById(auctionId);
      if (!auction) return res.status(404).json({ error: "Auction not found" });

      return res.json({ data: AuctionMapper.toDto(auction) });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  };

  listAuctions = async (_: Request, res: Response): Promise<Response> => {
    try {
      const auctions = await this.auctionService.listOpenAuctions() || [];
      return res.json({ data: auctions.map(a => AuctionMapper.toDto(a)) });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  };

  placeBid = async (req: Request, res: Response): Promise<Response> => {
    try {
      const username = req.body.username?.trim();
      if (!username) return res.status(400).json({ error: "Username no proporcionado" });

      const auctionId = req.params["id"];
      if (!auctionId) return res.status(400).json({ error: "auctionId no proporcionado" });

      const amount = req.body.amount;
      if (!amount) return res.status(400).json({ error: "Amount no proporcionado" });

      const success = await this.auctionService.placeBid(auctionId, username, amount);
      return res.json({ data: { success } });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  };

  buyNow = async (req: Request, res: Response) => {
    try {
      const username = req.body.username?.trim();
      if (!username) return res.status(400).json({ error: "Username no proporcionado" });

      const auctionId = req.params["id"];
      if (!auctionId) return res.status(400).json({ error: "auctionId no proporcionado" });

      const success = await this.auctionService.buyNow(auctionId, username);
      if (!success) return res.status(400).json({ error: "No se pudo realizar la compra rápida" });

      return res.status(200).json({ data: { success: true, message: "Compra rápida realizada correctamente" } });
    } catch (err: any) {
      if (err.message.includes("not found")) return res.status(404).json({ error: err.message });
      if (err.message.includes("Créditos insuficientes")) return res.status(403).json({ error: err.message });
      return res.status(500).json({ error: err.message });
    }
  };

  getBids = async (req: Request, res: Response) => {
    try {
      const auctionId = req.params["id"];
      if (!auctionId) return res.status(400).json({ error: "auctionId no proporcionado" });

      const auction = await this.auctionService.getAuctionById(auctionId);
      if (!auction) return res.status(404).json({ error: "Auction not found" });

      return res.json({ data: auction.getBids() || [] });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  };

getPurchasedHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username } = req.params;
      if (!username) {
        res.status(400).json({ error: "Username requerido" });
        return;
      }
      console.log("[getPurchasedHistory] username:", username);
      const history = await this.auctionService.getPurchasedAuctions(username);
      res.json(history);
    } catch (err) {
      console.error("[getPurchasedHistory] Error:", err);
      res.status(500).json({ error: "Error al obtener historial de compras" });
    }
  };

  getSoldHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username } = req.params;
      if (!username) {
        res.status(400).json({ error: "Username requerido" });
        return;
      }
      console.log("[getSoldHistory] username:", username);
      const history = await this.auctionService.getSoldAuctions(username);
      res.json(history);
    } catch (err) {
      console.error("[getSoldHistory] Error:", err);
      res.status(500).json({ error: "Error al obtener historial de ventas" });
    }
  };





  getCurrentUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const username = req.body.username?.trim();
      if (!username) return res.status(400).json({ error: "Username no proporcionado" });

      const user = await this.auctionService.getCurrentUser(username);
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

      return res.json({ data: user });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  };
}


