import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) 
{
  console.error("Please set SUPABASE_URL and SUPABASE_KEY in .env");
  process.exit(1);
}

let supabase;
try 
{
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
} 
catch (err) 
{
  console.error("Error creating Supabase client:", err?.message || err);
  process.exit(1);
}

const app = express();

try 
{
  app.use(cors());
  app.use(express.json());

  app.use(express.static(path.join(__dirname, "public")));

  app.get("/api/guitars", async (req, res) => {
    try 
    {
      const { data, error } = await supabase
        .from("guitars_basic")
        .select(`
          id,
          "name of the guitar",
          price,
          guitars_image (id, image_url),
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
        images: g.guitars_image?.map((i) => ({
          id: i.id,
          url: i.image_url,
        })) || [],
        colors: g.guitars_colors?.map((c) => ({
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

  app.get("/", (req, res) => {
    
    res.sendFile(path.join(__dirname, "public", "guitar.html"));
  });
} 
catch (err) 
{
  console.error("CRASH while registering middleware/routes:", err?.stack || err);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
