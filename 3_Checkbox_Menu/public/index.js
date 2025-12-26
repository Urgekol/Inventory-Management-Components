async function fetchShapes() 
{
  try 
  {
    const res = await fetch("/shapes");
    const { shapes } = await res.json(); 
    console.log(shapes);

    const shapeRange = document.querySelector(".face2");
    shapeRange.innerHTML = "";

    shapes.forEach((shape, index) => {
      if (shape.trim().length === 0) 
        return;

      const optionDiv = document.createElement("div");
      optionDiv.className = "option";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = `option${index + 1}`;

      const label = document.createElement("label");
      label.htmlFor = input.id;
      label.innerText = shape;

      optionDiv.appendChild(input);
      optionDiv.appendChild(label);

      shapeRange.appendChild(optionDiv);
    });
  } 
  catch (err) 
  {
    console.error("Error fetching Shape Range:", err.message);
  }
}

fetchShapes();


const arrowToggle = document.querySelector(".arrow_toggle");
const face2 = document.querySelector(".face2");

arrowToggle.addEventListener("click", () => {
    face2.classList.toggle("active");
    arrowToggle.classList.toggle("rotate");
});