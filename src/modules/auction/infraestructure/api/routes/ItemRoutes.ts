// src/interfaces/http/routes/ItemRoutes.ts
import { Router } from "express";
import { ItemController } from "../controllers/ItemController";

export default (controller: ItemController) => {
  const router = Router();

  // Obtener un item específico
  router.get("/:username/:id", controller.getItem);

  // Listar todos los items de un usuario
  router.get("/:username", controller.listItems);

  return router;
};
