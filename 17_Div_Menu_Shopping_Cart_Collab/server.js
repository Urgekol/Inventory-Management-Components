import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl|| !supabaseKey) 
{
  console.error("Please set SUPABASE_URL and SUPABASE_KEY in .env");
  process.exit(1);
}

let supabase;
try 
{
  supabase = createClient(supabaseUrl, supabaseKey);
} 
catch (err) 
{
  console.error("Error creating Supabase client:", err?.message || err);
  process.exit(1);
}


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


// fetch all guitars
app.get("/api/guitars", async (req, res) => {
  try 
  {
    const { data, error } = await supabase
      .from("guitars_basic")
      .select(`
        id,
        "name of the guitar",
        price,
        guitars_image (id, guitar_id, image_url),
        guitars_colors (id, colour_code, quantity),
        guitars_specs (*),
        guitars_details (*)
      `);

    if (error) 
    {
      console.error("Supabase error:", error);

      return res.status(500).json({ error: error.message });
    }

    const formatted = (data || []).map((g) => ({
      id: g.id,
      name: g["name of the guitar"],
      price: g.price,
      images:
        g.guitars_image?.map((i) => ({
          id: i.id,
          guitar_id: i.guitar_id,
          url: i.image_url,
        })) || [],
      colors:
        g.guitars_colors?.map((c) => ({
          id: c.id,
          code: c.colour_code,
          quantity: c.quantity,
        })) || [],
      specs: g.guitars_specs || [],
      details: g.guitars_details || {},
    }));

    res.json(formatted);
  } 
  catch (err) 
  {
    console.error("API handler error:", err?.stack || err);
    res.status(500).json({ error: "Server error" });
  }
});


// fetch single guitar by slug
app.get("/api/guitars/:slug", async (req, res) => {
  try 
  {
    const { slug } = req.params;
    const guitarName = slug.replace(/-/g, " ");

    const { data, error } = await supabase
      .from("guitars_basic")
      .select(`
        id,
        "name of the guitar",
        price,
        guitars_image (id, guitar_id, image_url),
        guitars_colors (id, colour_code, quantity),
        guitars_specs (*),
        guitars_details (*)
      `)
      .ilike("name of the guitar", guitarName)
      .single();

    if (error || !data) 
    {
      return res.status(404).json({ error: "Guitar not found" });
    }

    const formatted = {
      id: data.id,
      name: data["name of the guitar"],
      price: data.price,
      images:
        data.guitars_image?.map((i) => ({
          id: i.id,
          guitar_id: i.guitar_id,
          url: i.image_url,
        })) || [],
      colors:
        data.guitars_colors?.map((c) => ({
          id: c.id,
          code: c.colour_code,
          quantity: c.quantity,
        })) || [],
      specs: data.guitars_specs || [],
      details: data.guitars_details || {},
    };

    res.json(formatted);
  } 
  catch (err) 
  {
    console.error("API /guitars/:slug error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// the slug route
app.get("/guitar/:id/:slug", (req, res, next) => {
  if (req.params.slug.includes(".")) return next();
  res.sendFile(path.join(__dirname, "public", "guitar.html"));
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
