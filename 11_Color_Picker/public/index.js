document.addEventListener("DOMContentLoaded", () => {

  const redRange = document.getElementById("redRange");
  const greenRange = document.getElementById("greenRange");
  const blueRange = document.getElementById("blueRange");

  const redVal = document.getElementById("redVal");
  const greenVal = document.getElementById("greenVal");
  const blueVal = document.getElementById("blueVal");

  const colorNameInput = document.getElementById("colorName");
  const hexInput = document.getElementById("hexCode");
  const preview = document.getElementById("colorPreview");
  const rgbText = document.getElementById("rgbText");

  const getColorBtn = document.getElementById("getColorBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  if (!redRange || !greenRange || !blueRange || !hexInput || !preview || !getColorBtn || !cancelBtn) 
  {
    console.error("One or more required elements are missing in the DOM.");
    return;
  }

  function rgbToHex(r, g, b) 
  {
    return (
      "#" +
      [r, g, b]
        .map(x => x.toString(16).padStart(2, "0"))
        .join("")
    );
  }

  function updatePreview() 
  {
    const r = parseInt(redRange.value);
    const g = parseInt(greenRange.value);
    const b = parseInt(blueRange.value);

    if (redVal) 
      redVal.textContent = r;

    if (greenVal) 
      greenVal.textContent = g;

    if (blueVal) 
      blueVal.textContent = b;

    const hex = rgbToHex(r, g, b);
    hexInput.value = hex;

    if (rgbText) 
      rgbText.textContent = `RGB(${r}, ${g}, ${b})`;

    preview.style.backgroundColor = hex;
  }

  [redRange, greenRange, blueRange].forEach(slider => {

    slider.addEventListener("input", updatePreview);
  });

  hexInput.addEventListener("input", () => {

    let hex = hexInput.value.trim();

    // auto-add '#' if missing
    if (!hex.startsWith("#")) 
      hex = "#" + hex;

    if (/^#([0-9A-F]{6})$/i.test(hex)) 
    {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;

      redRange.value = r;
      greenRange.value = g;
      blueRange.value = b;

      updatePreview();
    }
  });

  cancelBtn.addEventListener("click", () => {

    if (colorNameInput) 
      colorNameInput.value = "";

    redRange.value = 128;
    greenRange.value = 128;
    blueRange.value = 128;
    hexInput.value = "#808080";

    if (rgbText) 
      rgbText.textContent = "RGB(128, 128, 128)";

    preview.style.backgroundColor = "#808080";
  });

  getColorBtn.addEventListener("click", async () => {

    const r = parseInt(redRange.value);
    const g = parseInt(greenRange.value);
    const b = parseInt(blueRange.value);
    const hex = hexInput.value;
    const name = colorNameInput ? colorNameInput.value : "";

    try 
    {
      const res = await fetch("/color", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ r, g, b, hex, name })
      });

      const data = await res.json();

      if (data.success && data.color) 
      {
        const colorObj = {
          name: data.color.name,
          hex: data.color.hex,
          rgb: Array.isArray(data.color.rgb)
            ? data.color.rgb
            : typeof data.color.rgb === "string"
            ? data.color.rgb.split(",").map(v => v.trim())
            : [r, g, b]
        };

        console.log("Final Color Object:", colorObj);

        alert(
          `Color Detected:\n- Name: ${colorObj.name}\n- HEX: ${colorObj.hex}\n- RGB: ${colorObj.rgb.join(", ")}`
        );
      }
      else 
      {
        alert("Failed to process color");
      }
    } 
    catch (err) 
    {
      console.error("Error fetching color:", err);
      alert("An error occurred while fetching color. Please try again.");
    }
  });

  updatePreview();

});
