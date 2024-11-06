import staticPlugin from "@elysiajs/static";
import Elysia, { t } from "elysia";
import { nanoid } from "nanoid";
//@ts-expect-error
import { Database } from "bun:sqlite";

const db = new Database("./local.sqlite", { create: true });
db.exec(`
  CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    title TEXT,
    code TEXT,
    language TEXT
  );
`);

const app = new Elysia().use(
  staticPlugin({
    assets: "dist",
    prefix: "/",
  })
);

app.post(
  "/api/upload",
  async ({ body }) => {
    try {
      const { code, language, fileName } = body;
      const query = db.query(
        "INSERT INTO media (id, title, code, language) VALUES ($id, $title, $code, $language)"
      );
      const id = nanoid();
      const r = query.all({
        $id: id,
        $title: fileName,
        $code: code,
        $language: language,
      });
      return {
        id,
      };
    } catch (error) {
      return new Response("Something went wrong", { status: 500 });
    }
  },
  {
    body: t.Object({
      code: t.String(),
      language: t.String(),
      fileName: t.String(),
    }),
  }
);

app.get("/api/snippet", async ({ query: { id } }) => {
  if (!id) return new Response(null, { status: 400 });
  const query = db.query("SELECT * FROM media WHERE id = $id");
  const r = query.all({ $id: id });
  if (r.length < 1) return new Response("Not found", { status: 404 });
  return r[0];
});

app.listen(3000);

console.log(`App running at ${app.server?.url}`);
