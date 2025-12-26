const express = require("express");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


(async () => {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error("Supabase connection failed:", error.message);
    } 
    else 
    {
      console.log("Supabase connected. Buckets:", data.map((b) => b.name));
    }
  } 
  catch (err) 
  {
    console.error("Supabase connection error:", err.message);
  }
})();


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed!"), false);
  },
});

app.post("/api/add-guitar", upload.array("images", 10), async (req, res) => {

  try 
  {
    if (!req.files || req.files.length === 0) 
    {
      return res.status(400).json({ error: "No images provided" });
    }

    
    const { data: latestBasic, error: latestError } = await supabase
      .from("guitars_basic")
      .select("id")
      .order("id", { ascending: false })
      .limit(1);

    if (latestError) 
      throw latestError;

    const newGuitarId = latestBasic.length > 0 ? latestBasic[0].id + 1 : 1;

    
    const { data: guitarData, error: basicError } = await supabase
      .from("guitars_basic")
      .insert([
        {
          id: newGuitarId,
          "name of the guitar": "Just guitar", // ⚠️ make sure your column name has no spaces
          price: 1,
        },
      ])
      .select()
      .single();

    if (basicError) 
      throw basicError;

    
    const uploadPromises = req.files.map(async (file) => {
      const fileExtension = file.originalname.split(".").pop();
      const fileName = `${uuidv4()}.${fileExtension}`;

      
      const { error: uploadError } = await supabase.storage
        .from("guitars-images")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) 
        throw uploadError;

      
      const { data: urlData } = supabase.storage
        .from("guitars-images")
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      
      const { data: latestImage, error: latestImgError } = await supabase
        .from("guitars_image")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);

      if (latestImgError) 
        throw latestImgError;

      const newImageId = latestImage.length > 0 ? latestImage[0].id + 1 : 1;

      
      const { data: insertImage, error: insertError } = await supabase
        .from("guitars_image")
        .insert([
          {
            id: newImageId,
            guitar_id: newGuitarId,
            image_url: imageUrl,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      return {
        fileName,
        originalName: file.originalname,
        publicUrl: imageUrl,
        dbRecord: insertImage,
      };
    });

    const uploadResults = await Promise.all(uploadPromises);

    res.status(200).json({
      message: "Guitar and images uploaded successfully!",
      guitar: guitarData,
      images: uploadResults,
    });
  } 
  catch (error) 
  {
    console.error("Upload error:", error);
    res.status(500).json({
      error: "Failed to upload images",
      details: error.message,
    });
  }
});


app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});


app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
