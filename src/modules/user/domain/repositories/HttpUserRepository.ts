import { User } from "../../domain/models/User";
import { UserRepository } from "./UserRepository";
import axios from "axios";

/**
 * Implementación HTTP de UserRepository que devuelve instancias de User
 */
export class HttpUserRepository implements UserRepository {
  constructor(private readonly baseUrl: string) {}

  async findById(id: string): Promise<User | null> {
    try {
      const res = await fetch(`${this.baseUrl}/usuarios/${id}`);
      if (!res.ok) return null;
      const data = await res.json();
      return new User(data._id, data.nombreUsuario, data.creditos);
    } catch {
      return null;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const res = await fetch(`${this.baseUrl}/usuarios/${encodeURIComponent(username)}`);
      if (!res.ok) return null;
      const data = await res.json();
      return new User(data._id, data.nombreUsuario, data.creditos);
    } catch {
      return null;
    }
  }

  async findByToken(token: string): Promise<User | null> {
    try {
      const res = await axios.get(`${this.baseUrl}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      return data ? new User(data._id, data.nombreUsuario, data.creditos) : null;
    } catch {
      return null;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const res = await fetch(`${this.baseUrl}/usuarios`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.map((u: any) => new User(u._id, u.nombreUsuario, u.creditos));
    } catch {
      return [];
    }
  }

  async updateCredits(username: string, credits: number): Promise<User | null> {
  try {
    const res = await fetch(`${this.baseUrl}/usuarios/${encodeURIComponent(username)}/creditos`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credits }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return new User(data._id, data.nombreUsuario, data.creditos);
  } catch {
    return null;
  }
}


}
