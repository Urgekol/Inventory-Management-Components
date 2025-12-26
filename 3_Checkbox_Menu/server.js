import "dotenv/config";
import express from "express";
import { createClient } from "@supabase/supabase-js";

const app = express();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const port = process.env.PORT;

const supabase = createClient(supabaseUrl, supabaseKey);

app.get("/shapes", async (req, res) => {
  try
  {
    const { data, error } = await supabase
      .from("guitars_details")
      .select("Body_Shape");

    if (error) 
      throw error;


    const uniqueShape = [...new Set(data.map(item => item.Body_Shape))];
    console.log(uniqueShape);
    

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
