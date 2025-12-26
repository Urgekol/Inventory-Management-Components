import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import ColorThief from "colorthief";
import { fileURLToPath } from "url";
import namer from "color-namer";

const app = express();
const PORT = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));


const upload = multer({ dest: "uploads/" });


app.post("/upload", upload.single("image"), async (req, res) => {
  try 
  {
    if (!req.file) 
    {
      return res.json({ success: false, message: "No file uploaded" });
    }

    const imagePath = path.resolve(req.file.path);
    const rgb = await ColorThief.getColor(imagePath);
    const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);

    
    const match = namer(hex).ntc[0].name;

    fs.unlinkSync(imagePath);

    return res.json({
      success: true,
      dominantColor: { rgb, hex, name: match }
    });
  } 
  catch (err) 
  {
    console.error("Upload error:", err);
    res.json({ success: false, message: "Color extraction failed" });
  }
});


app.post("/color", (req, res) => {

  try 
  {
    const { r, g, b, hex } = req.body;

    let finalHex = hex;

    if (r !== undefined && g !== undefined && b !== undefined) 
    {
      finalHex = rgbToHex(r, g, b);
    }

    
    let finalName = "Unknown";
    if (finalHex) 
    {
      const match = namer(finalHex).ntc[0].name;
      finalName = match || "Unknown";
    }

    res.json({
      success: true,
      color: {
        rgb: [r, g, b],
        hex: finalHex,
        name: finalName
      }
    });
  } 
  catch (err) 
  {
    console.error("Color processing error:", err);
    res.status(500).json({ success: false, error: "Failed to process color" });
  }
});

function rgbToHex(r, g, b) 
{
  return (
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
  );
}


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
