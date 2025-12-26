import "dotenv/config";
import express from "express";
import { createClient } from "@supabase/supabase-js";

const app = express();
const port = process.env.PORT;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);


// colors
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


// range 
app.get("/range", async (req, res) => {
  try 
  {
    const { data, error } = await supabase
      .from("guitars_basic")
      .select("price");

    if (error) 
      throw error;

    const prices = data.map(item => item.price);

    const max = Math.max(...prices);

    res.json({ maximum_Value: max });
  } 
  catch (err) 
  {
    res.status(500).json({ error: err.message });
  }
});


// checkbox
app.get("/shapes", async (req, res) => {
  try 
  {
    const { data, error } = await supabase
      .from("guitars_details")
      .select("Body_Shape");  

    if (error) 
      throw error;

    const uniqueShape = [...new Set(data.map(item => item.Body_Shape).filter(Boolean))];
    console.log("Unique Shapes:", uniqueShape);

    res.json({ shapes: uniqueShape });
  } 
  catch (err)
  {
    res.status(500).json({ error: err.message });
  }
});


app.use(express.static("public")); 


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
