import { User } from "../models/User";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByToken(token: string): Promise<User | null>;
  updateCredits(id: string, credits: number): Promise<User | null>;
  findByUsername?(username: string): Promise<User | null>; // nuevo método opcional
  findAll?(): Promise<User[]>; // opcional si quieres listar todos
}
