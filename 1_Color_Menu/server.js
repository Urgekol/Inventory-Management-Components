import "dotenv/config";
import express from "express";
import { createClient } from "@supabase/supabase-js";

const app = express();

const PORT = process.env.PORT || 5000;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

app.get("/colors", async (req, res) => {
  try
  {
    const { data, error } = await supabase
      .from("guitars_colors")
      .select("colour_code");

    if (error) 
      throw error;


    const uniqueColors = [...new Set(data.map(c => c.colour_code))];
    console.log(uniqueColors);
    

    res.json({ colors: uniqueColors });
  } 
  catch (err) 
  {
    res.status(500).json({ error: err.message });
  }
});

app.use(express.static("public")); 

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
