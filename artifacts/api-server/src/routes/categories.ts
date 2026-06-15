import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, categoriesTable } from "@workspace/db";
import {
  CreateCategoryBody,
  UpdateCategoryParams,
  UpdateCategoryBody,
  UpdateCategoryResponse,
  DeleteCategoryParams,
  ListCategoriesResponse,
} from "@workspace/api-zod";

const router = Router();

router.get("/categories", async (req, res): Promise<void> => {
  const categories = await db.select().from(categoriesTable).orderBy(categoriesTable.name);
  res.json(ListCategoriesResponse.parse(categories));
});

router.post("/categories", async (req, res): Promise<void> => {
  const parsed = CreateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [category] = await db.insert(categoriesTable).values(parsed.data).returning();
  res.status(201).json(category);
});

router.patch("/categories/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateCategoryParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateCategoryBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [category] = await db.update(categoriesTable).set(parsed.data).where(eq(categoriesTable.id, params.data.id)).returning();
  if (!category) { res.status(404).json({ error: "Not found" }); return; }
  res.json(UpdateCategoryResponse.parse(category));
});

router.delete("/categories/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteCategoryParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(categoriesTable).where(eq(categoriesTable.id, params.data.id));
  res.status(204).send();
});

export default router;
