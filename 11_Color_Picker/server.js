
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import namer from "color-namer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); 

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

app.post("/color", (req, res) => {
  try 
  {
    const { r, g, b, hex, name } = req.body;

    let finalHex = hex;
    let finalName = name;

    if (r !== undefined && g !== undefined && b !== undefined) 
    {
      finalHex = rgbToHex(r, g, b);
    }

    
    if (!finalName && finalHex) 
    {
      const match = namer(finalHex).ntc[0].name;
      finalName = match;
    }

    res.json({
      success: true,
      color: {
        rgb: [r, g, b],
        hex: finalHex,
        name: finalName || "Unknown"
      }
    });
  } 
  catch (err) 
  {
    console.error("Color processing error:", err);
    res.status(500).json({ success: false, error: "Failed to process color" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Color Picker backend running at http://localhost:${PORT}`);
});
