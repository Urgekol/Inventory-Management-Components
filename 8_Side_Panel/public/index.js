
document.querySelectorAll(".arrow_toggle").forEach(toggle => {
    toggle.addEventListener("click", () => {

        const face1 = toggle.closest(".face");
        const face2 = face1.nextElementSibling;
        const container_sidePanel = toggle.closest(".color_menu, .range_menu, .checkbox_menu");

        document.querySelectorAll(".color_menu, .range_menu, .checkbox_menu").forEach(menu => {

            const otherFace2 = menu.querySelector(".face + .face2, .face + div"); 
            const otherToggle = menu.querySelector(".arrow_toggle");

            if (otherFace2 && otherFace2 !== face2) 
            {
                otherFace2.classList.remove("active");
                otherFace2.style.maxHeight = null;   // reset height
                if (otherToggle) 
                {
                    otherToggle.classList.remove("rotate");
                }
            }
        });

        if (face2.classList.contains("active")) 
        {
            face2.classList.remove("active");
            face2.style.maxHeight = null;
            toggle.classList.remove("rotate");
        } 
        else 
        {
            face2.classList.add("active");
            face2.style.maxHeight = face2.scrollHeight + "px";
            toggle.classList.add("rotate");
        }
    });
});


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


async function fetchRangeMax() 
{
    const rangeMenu = document.querySelector(".range_menu");
    const rangeInput = rangeMenu.querySelectorAll(".range-input input");
    const progress = rangeMenu.querySelector(".slider .progress");
    const priceInput = rangeMenu.querySelectorAll(".price-input input");

    let priceGap = 10000;

    try 
    {
        const res = await fetch("/range");
        const { maximum_Value } = await res.json(); 

        document.querySelector(".input-min").max  = maximum_Value;
        document.querySelector(".input-max").max  = maximum_Value;
        document.querySelector(".input-max").value  = maximum_Value;

        document.querySelector(".range-min").max  = maximum_Value;
        document.querySelector(".range-max").max  = maximum_Value;
        document.querySelector(".range-max").value  = maximum_Value;

        let minVal = parseInt(document.querySelector(".input-min").value);
        let maxVal = parseInt(document.querySelector(".input-max").value);

        rangeInput[0].value = minVal;
        rangeInput[1].value = maxVal;

        progress.style.left  = (minVal / maximum_Value) * 100 + "%";
        progress.style.right = 100 - (maxVal / maximum_Value) * 100 + "%";

        rangeInput.forEach(input => {
            input.addEventListener("input", (e) => {
                let minVal = parseInt(rangeInput[0].value);
                let maxVal = parseInt(rangeInput[1].value);

                if ((maxVal - minVal) < priceGap) 
                {
                    if (e.target.classList.contains("range-min")) 
                    {
                        rangeInput[0].value = maxVal - priceGap;
                        minVal = maxVal - priceGap;
                    } 
                    else 
                    {
                        rangeInput[1].value = minVal + priceGap;
                        maxVal = minVal + priceGap;
                    }
                }

                priceInput[0].value = minVal;
                priceInput[1].value = maxVal;
                progress.style.left  = (minVal / maximum_Value) * 100 + "%";
                progress.style.right = 100 - (maxVal / maximum_Value) * 100 + "%";
            });
        });

        priceInput.forEach(input => {
            input.addEventListener("input", (e) => {
                let minVal = parseInt(priceInput[0].value);
                let maxVal = parseInt(priceInput[1].value);

                if ((maxVal - minVal) >= priceGap && maxVal <= maximum_Value) 
                {
                    if (e.target.classList.contains("input-min")) 
                    {
                        rangeInput[0].value = minVal;
                        progress.style.left = (minVal / maximum_Value) * 100 + "%";
                    } 
                    else 
                    {
                        rangeInput[1].value = maxVal;
                        progress.style.right = 100 - (maxVal / maximum_Value) * 100 + "%";
                    }
                }
            });
        });
    } 
    catch (err) 
    {
        console.log("Error in max price fetch", err.message);
    }
}

fetchRangeMax();


async function fetchShapes() 
{
  try 
  {
    const res = await fetch("/shapes");
    const { shapes } = await res.json();

    const shapeRange = document.querySelector(".body-shape_menu .face2");
    shapeRange.innerHTML = "";

    shapes.forEach((shape, index) => {

      if (!shape.trim()) 
        return;

      const optionDiv = document.createElement("div");
      optionDiv.className = "option";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = `shape_option_${index}`;

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


async function fetchMaterials() 
{
  try 
  {
    const res = await fetch("/materials");
    const { materials } = await res.json();

    const materialRange = document.querySelector(".top-material_menu .face2");
    materialRange.innerHTML = "";

    materials.forEach((material, index) => {

      if (!material.trim()) 
        return;

      const optionDiv = document.createElement("div");
      optionDiv.className = "option";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = `material_option_${index}`;

      const label = document.createElement("label");
      label.htmlFor = input.id;
      label.innerText = material;

      optionDiv.appendChild(input);
      optionDiv.appendChild(label);
      materialRange.appendChild(optionDiv);
    });
  } 
  catch (err) 
  {
    console.error("Error fetching Material Range:", err.message);
  }
}

fetchMaterials();


async function fetchBodyFinish() 
{
  try 
  {
    const res = await fetch("/bodyFinishes");
    const { bodyFinishes } = await res.json();

    const bodyFinishRange = document.querySelector(".body-finish_menu .face2");
    bodyFinishRange.innerHTML = "";

    bodyFinishes.forEach((bodyFinish, index) => {

      if (!bodyFinish.trim()) 
        return;

      const optionDiv = document.createElement("div");
      optionDiv.className = "option";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = `bodyFinish_option_${index}`;

      const label = document.createElement("label");
      label.htmlFor = input.id;
      label.innerText = bodyFinish;

      optionDiv.appendChild(input);
      optionDiv.appendChild(label);
      bodyFinishRange.appendChild(optionDiv);
    });
  } 
  catch (err) 
  {
    console.error("Error fetching Body Finish Range:", err.message);
  }
}

fetchBodyFinish();


async function fetchCase() 
{
  try 
  {
    const res = await fetch("/cases");
    const { cases } = await res.json();

    const caseRange = document.querySelector(".case_menu .face2");
    caseRange.innerHTML = "";

    cases.forEach((caseG, index) => {

      if (!caseG.trim()) 
        return;

      const optionDiv = document.createElement("div");
      optionDiv.className = "option";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = `case_option_${index}`;

      const label = document.createElement("label");
      label.htmlFor = input.id;
      label.innerText = caseG;

      optionDiv.appendChild(input);
      optionDiv.appendChild(label);
      caseRange.appendChild(optionDiv);
    });
  } 
  catch (err) 
  {
    console.error("Error fetching Case Range:", err.message);
  }
}

fetchCase();