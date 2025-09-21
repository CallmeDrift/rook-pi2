// src/domain/services/IAuctionService.ts
import { Auction } from "../models/Auction";
import { CreateAuctionInputDTO, CreateAuctionOutputDto } from "../../application/dto/CreateAuctionDTO";
import { User } from "../../../user/domain/models/User";

export interface IAuctionService {
  // Crear subasta usando username del vendedor
  createAuction(input: CreateAuctionInputDTO, username: string): Promise<CreateAuctionOutputDto>;

  // Pujar en subasta usando username del jugador
  placeBid(auctionId: string, username: string, amount: number): Promise<boolean>;

  // Compra rápida usando username
  buyNow(auctionId: string, username: string): Promise<boolean>;

  // Obtener subasta por ID
  getAuctionById(id: string): Promise<Auction | null>;

  // Listar subastas abiertas
  listOpenAuctions(): Promise<Auction[] | null>;

  // Obtener usuario actual por username
  getCurrentUser(username: string): Promise<User | null>;

  // Finalizar subasta
  finalizeAuction(auctionId: string, winnerId?: string): Promise<void>;

  // Historial de subastas compradas/vendidas
  getPurchasedAuctions(username: string): Promise<Auction[]>;
  getSoldAuctions(username: string): Promise<Auction[]>;
}
