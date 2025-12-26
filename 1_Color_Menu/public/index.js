async function fetchColors() 
{
  try 
  {
    const res = await fetch("/colors");
    const { colors } = await res.json();
    console.log(colors);

    const colorRange = document.querySelector(".color_range");

    colorRange.innerHTML = "";

    colors.forEach((color) => {
      const cleanColor = color.replace(";", "");

      const circle = document.createElement("div");
      circle.className = "color";
      circle.style.backgroundColor = cleanColor;

      colorRange.appendChild(circle);
    });
  } 
  catch (err) 
  {
    console.error("Error fetching colors:", err.message);
  }
}

fetchColors();


const arrowToggle = document.querySelector(".arrow_toggle");
const face2 = document.querySelector(".face2");

arrowToggle.addEventListener("click", () => {
    face2.classList.toggle("active");
    arrowToggle.classList.toggle("rotate");
});
