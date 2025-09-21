// src/domain/models/Auction.ts
import NullObject from "../../../../shared/base/domain/interfaces/NullObject"
import { Bid } from "./Bid";
import { Item } from "../../../inventory/domain/models/Item";
import { AuctionStatus } from "./AuctionStatus";

export class Auction implements NullObject{
  // Propiedades
  private readonly id: string;
  private readonly title: string;
  private readonly description: string;
  private readonly startingPrice: number;
  private currentPrice: number;
  private readonly item: Item;
  private buyNowPrice: number | undefined;
  private status: AuctionStatus;
  private readonly createdAt: Date;
  private bids: Bid[];
  private highestBidderId: string | undefined;
  isNull:boolean
  constructor(AuctionInterface: AuctionInterface) {
    this.id = AuctionInterface.id;
    this.title = AuctionInterface.title;
    this.description = AuctionInterface.description;
    this.startingPrice = AuctionInterface.startingPrice;
    this.currentPrice = AuctionInterface.currentPrice;
    this.item = AuctionInterface.item;
    this.buyNowPrice = AuctionInterface.buyNowPrice;
    this.status = AuctionInterface.status;
    this.createdAt = AuctionInterface.createdAt;
    this.bids = AuctionInterface.bids;
    this.highestBidderId = AuctionInterface.highestBidderId;
    this.isNull = false
  }

  // Getters
  getId(): string { return this.id; }
  getTitle(): string { return this.title; }
  getDescription(): string { return this.description; }
  getStartingPrice(): number { return this.startingPrice; }
  getCurrentPrice(): number { return this.currentPrice; }
  getItem(): Item { return this.item; }
  getBuyNowPrice(): number | undefined { return this.buyNowPrice; }
  getStatus(): AuctionStatus { return this.status; }
  getCreatedAt(): Date { return this.createdAt; }
  getBids(): Bid[] { return this.bids; }
  getHighestBidderId(): string | undefined { return this.highestBidderId; }

  // Setters
  setCurrentPrice(price: number) {
    if (price < 0) throw new Error("El precio no puede ser negativo");
    this.currentPrice = price;
  }
  setBuyNowPrice(price: number | undefined) {
    if (price !== undefined && price < 0) throw new Error("El precio de compra rápida no puede ser negativo");
    this.buyNowPrice = price;
  }
  setStatus(status: AuctionStatus) { this.status = status; }
  setBids(bids: Bid[]) { this.bids = bids; }
  setHighestBidderId(id: string | undefined) { this.highestBidderId = id; }

  // Lógica de negocio
  placeBid(bid: Bid): boolean {
  if (this.status !== "OPEN") return false;
  if (bid.amount < this.currentPrice) return false;
  if (!bid.userId) throw new Error("Bid debe tener un userId válido");

  this.currentPrice = bid.amount;
  this.bids.push(bid);
  this.highestBidderId = bid.userId;
  return true;
}


  closeAsExpired(): void { this.status = "EXPIRED"; }

  markAsSold(userId: string): void {
    this.status = "SOLD";
    this.highestBidderId = userId;
  }

  buyNow(userId: string): boolean {
    if (this.buyNowPrice === undefined || this.status !== "OPEN") return false;
    this.currentPrice = this.buyNowPrice;
    this.markAsSold(userId);
    return true;
  }

  getWinnerId(): string | undefined { return this.highestBidderId; }

  getOwnerId(): string { return this.item.userId; }
}
export interface AuctionInterface {
    id: string
    title: string
    description: string
    startingPrice: number
    currentPrice: number
    item: Item
    buyNowPrice: number | undefined
    status: AuctionStatus
    createdAt: Date
    bids: Bid[]
    highestBidderId: string | undefined
}