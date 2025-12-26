const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const addGuitarBtn = document.getElementById("addGuitarBtn");

let selectedFiles = [];

fileInput.addEventListener("change", (e) => {

  selectedFiles = Array.from(e.target.files);
  preview.innerHTML = "";

  selectedFiles.forEach((file) => {

    const reader = new FileReader();
    reader.onload = (event) => {

      const img = document.createElement("img");
      img.src = event.target.result;
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});


addGuitarBtn.addEventListener("click", async () => {

  if (selectedFiles.length === 0) 
  {
    alert("Please select images first!");
    return;
  }

  const formData = new FormData();
  selectedFiles.forEach((file) => formData.append("images", file));

  try 
  {
    const response = await fetch("http://localhost:5000/api/add-guitar", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    
    if (response.ok) 
    {
      alert("Guitar images uploaded successfully!");
      console.log("Uploaded:", data);
    } 
    else 
    {
      alert("Upload failed: " + data.error);
    }
  } 
  catch (err) 
  {
    console.error("Error uploading:", err);
    alert("Error uploading images.");
  }
});
