import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import ColorThief from "colorthief";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import namer from "color-namer";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


const PORT = process.env.PORT || 5000;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;


const supabase = createClient(supabaseUrl, supabaseKey);

const upload = multer({ dest: path.join(__dirname, "uploads/") });


function rgbToHex(r, g, b) 
{
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}


app.post("/addGuitar", async (req, res) => {
  const { generalInfo, materialWarranty, specs, colors, imageUrl } = req.body;

  try 
  {
    const { data: latestBasic, error: latestError } = await supabase
      .from("guitars_basic")
      .select("id")
      .order("id", { ascending: false })
      .limit(1);

    if (latestError) 
      throw latestError;

    const newGuitarId = latestBasic.length > 0 ? latestBasic[0].id + 1 : 1;

    //start adding

    res.status(200).json({ success: true, message: "Guitar added successfully!" });
  }
  catch (err) 
  {
    console.error("Error adding guitar:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});



app.post("/upload", upload.single("image"), async (req, res) => {
  try 
  {
    if (!req.file) 
    {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const imagePath = path.resolve(req.file.path);


    const rgb = await ColorThief.getColor(imagePath);
    const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
    const colorName = namer(hex).ntc[0].name;


    fs.unlink(imagePath, (err) => {
      if (err) 
        console.error("Failed to delete temp file:", err);
    });

    return res.json({
      success: true,
      dominantColor: {
        rgb,
        hex,
        name: colorName,
      },
    });
  } 
  catch (err) 
  {
    console.error("Upload error:", err);
    return res.status(500).json({ success: false, message: "Color extraction failed" });
  }
});


app.post("/color", (req, res) => {
  try 
  {
    const { r, g, b, hex } = req.body;

    if (
      (r !== undefined && (isNaN(r) || r < 0 || r > 255)) ||
      (g !== undefined && (isNaN(g) || g < 0 || g > 255)) ||
      (b !== undefined && (isNaN(b) || b < 0 || b > 255))
    ) {
      return res.status(400).json({ success: false, message: "Invalid RGB values" });
    }

    const finalHex = hex || rgbToHex(r, g, b);
    const colorName = namer(finalHex).ntc[0].name || "Unknown";

    return res.json({
      success: true,
      color: {
        rgb: [r, g, b],
        hex: finalHex,
        name: colorName,
      },
    });
  } 
  catch (err) 
  {
    console.error("Color processing error:", err);
    return res.status(500).json({ success: false, message: "Failed to process color" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
