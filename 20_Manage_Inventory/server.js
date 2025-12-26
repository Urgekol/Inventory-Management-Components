import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 5000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);


function rgbToHex(r, g, b) 
{
  const toHex = x => x.toString(16).padStart(2, "0");
  return "#" + toHex(r) + toHex(g) + toHex(b);
}


app.post("/color", (req, res) => {

  try 
  {
    const { r, g, b, hex } = req.body;

    const finalHex =
      hex && /^#([0-9A-F]{6})$/i.test(hex)
        ? hex.toLowerCase()
        : rgbToHex(r, g, b).toLowerCase();

    return res.json({
      success: true,
      color: {
        hex: finalHex
      }
    });
  } 
  catch (err) 
  {
    console.error("Color processing error:", err);

    return res.status(500).json({ success: false });
  }
});


app.get("/api/inventory", async (req, res) => {

  try 
  {
    const { data: basic } = await supabase
      .from("guitars_basic")
      .select(`id, "name of the guitar", price`);

    const { data: images } = await supabase
      .from("guitars_image")
      .select("id, image_url");

    const { data: colors } = await supabase
      .from("guitars_colors")
      .select("id, colour_code, quantity");

    const result = basic.map(g => ({
      id: g.id,
      name: g["name of the guitar"],
      price: g.price,
      image_url: images.find(i => i.id === g.id)?.image_url || "",
      variants: colors.filter(c => c.id === g.id)
    }));

    res.json({ success: true, data: result });
  } 
  catch (err) 
  {
    console.log("GET ALL ERROR:", err);
    res.json({ success: false });
  }
});


app.get("/api/inventory/:id", async (req, res) => {

  const id = req.params.id;

  try 
  {
    const { data: basic } = await supabase
      .from("guitars_basic")
      .select("*")
      .eq("id", id)
      .single();

    const { data: details } = await supabase
      .from("guitars_details")
      .select("*")
      .eq("id", id)
      .single();

    const { data: specs } = await supabase
      .from("guitars_specs")
      .select("*")
      .eq("id", id)
      .single();

    const { data: colors } = await supabase
      .from("guitars_colors")
      .select("*")
      .eq("id", id);

    const { data: image } = await supabase
      .from("guitars_image")
      .select("image_url")
      .eq("id", id)
      .single();

    res.json({
      success: true,
      data: {
        id,
        name: basic["name of the guitar"],
        price: basic.price,
        image_url: image?.image_url || "",
        details,
        specs,
        colors
      }
    });
  } 
  catch (err) 
  {
    console.log("FETCH ONE ERROR:", err);
    res.json({ success: false });
  }
});


app.put("/api/inventory/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  try 
  {
    await supabase
      .from("guitars_basic")
      .update({
        "name of the guitar": body.name,
        price: body.price
      })
      .eq("id", id);

    await supabase.from("guitars_details").update(body.details).eq("id", id);
    await supabase.from("guitars_specs").update(body.specs).eq("id", id);

    await supabase.from("guitars_colors").delete().eq("id", id);

    for (const c of body.colors) 
    {
      await supabase.from("guitars_colors").insert({
        id: id,
        colour_code: c.colour_code,
        quantity: c.quantity
      });
    }

    res.json({ success: true });
  } 
  catch (err) 
  {
    console.log("UPDATE ERROR:", err);
    res.json({ success: false });
  }
});


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "manage.html"));
});


app.listen(port, () => {
  console.log("Server running on port " + port);
});
