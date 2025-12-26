let purchasedArrayOfArray = []; 
let globalGuitarsData = [];

document.addEventListener("DOMContentLoaded", async () => {

  document.querySelectorAll(".arrow_toggle").forEach(toggle => {
    toggle.addEventListener("click", () => {

        const face1 = toggle.closest(".face");
        const face2 = face1.nextElementSibling;

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


  async function fetchGuitars()
  {
    try 
    {
      const res = await fetch("/api/guitars");

      if (!res.ok) 
        throw new Error("Network response not ok");

      const guitarsData = await res.json();
      const divContainer = document.querySelector(".div_contain");

      divContainer.innerHTML = "";

      guitarsData.forEach((guitar, guitarIndex) => {

        const card = document.createElement("div");
        card.className = "card";

        const colorCircles = (guitar.colors || [])
          .map(
            (c, idx) =>
              `<div class="color" 
                data-guitar-index="${guitarIndex}"
                data-color-index="${idx}"
                data-quantity="${c.quantity}" 
                style="background-color: ${c.code}; ${
                idx === 0 ? "border: 2px solid #000;" : "border: 2px solid transparent;"
              }"></div>`
          )
          .join("");

        card.innerHTML = `
          <div class="image_container">

            <div class="image">
              <img src="${guitar.images[0]?.url || "placeholder.jpg"}" 
                   alt="guitar" 
                   data-guitar-index="${guitarIndex}">
            </div>

          </div>

          <div class="banner">
            <span>Get a Carry Bag</span>
          </div>

          <div class="bottom">

            <div class="details"><span>${guitar.name || "Unknown"}</span></div>

            <div class="Color_heading"><span>Color</span>${colorCircles}</div>

            <div class="wrapper">

              <label for="quantity">Quantity:</label>

              <div class="quantity" data-guitar-index="${guitarIndex}">
                <span class="minus">-</span>
                <span class="num">01</span>
                <span class="plus">+</span>
              </div>

            </div>

            <div class="cart" data-guitar-index="${guitarIndex}">
              <img src="cart_logo.png" alt="cart" width="35px" height="24px">
            </div>

            <div class="price"><span>MRP&nbsp;&nbsp;</span><span>₹ ${guitar.price ?? "-"}</span></div>
          </div>
        `;

        divContainer.appendChild(card);
        purchasedArrayOfArray[guitarIndex] = new Array(guitar.colors.length).fill(false);
      });

      let quantities = guitarsData.map(() => 1);
      let selectedColors = guitarsData.map(() => 0);

      divContainer.addEventListener("click", (event) => {
        const target = event.target;

        // quantity handling
        const quantityBox = target.closest(".quantity");

        if (quantityBox) 
        {
          const guitarIndex = parseInt(quantityBox.dataset.guitarIndex, 10);
          const numEl = quantityBox.querySelector(".num");
          const currentColorIndex = selectedColors[guitarIndex];
          const maxVal = guitarsData[guitarIndex].colors[currentColorIndex]?.quantity || 1;

          // increase or decrease
          if (target.classList.contains("plus") && quantities[guitarIndex] < maxVal)
            quantities[guitarIndex]++;
          else if (target.classList.contains("minus") && quantities[guitarIndex] > 1)
            quantities[guitarIndex]--;


          numEl.innerText = quantities[guitarIndex] < 10 ? "0" + quantities[guitarIndex] : quantities[guitarIndex];

          
          const purchased = purchasedArrayOfArray[guitarIndex][currentColorIndex];
          if (purchased) 
          {
            const guitar = guitarsData[guitarIndex];
            const selectedColor = guitar.colors[currentColorIndex];
            const itemId = `${guitar.id}_${selectedColor.code}`;

            
            const existingItem = globalGuitarsData.find((item) => item.id === itemId);

            if (existingItem) 
            {
              existingItem.selectedQuantity = quantities[guitarIndex];
              existingItem.timestamp = new Date().toISOString(); 
            }

            
            localStorage.setItem("globalGuitarsData", JSON.stringify(globalGuitarsData));
            console.log("Updated Quantity in Global Data:", globalGuitarsData);
          }

          return;
        }

        // color selection
        const colorEl = target.closest(".color");

        if (colorEl) 
        {
          const guitarIndex = parseInt(colorEl.dataset.guitarIndex, 10);
          const colorIndex = parseInt(colorEl.dataset.colorIndex, 10);
          
          selectedColors[guitarIndex] = colorIndex;
          quantities[guitarIndex] = 1;        // reset to 1


          const allColors = divContainer.querySelectorAll(`.color[data-guitar-index="${guitarIndex}"]`);
          allColors.forEach((c) => (c.style.border = "2px solid transparent"));
          colorEl.style.border = "2px solid #000";

          
          const quantityBox = divContainer.querySelector(`.quantity[data-guitar-index="${guitarIndex}"] .num`);
          if (quantityBox) 
          {
            quantityBox.innerText = "01";
          }


          const cart = divContainer.querySelector(`.cart[data-guitar-index="${guitarIndex}"]`);
          const isPurchased = purchasedArrayOfArray[guitarIndex][colorIndex];
          cart.innerHTML = isPurchased
            ? `<i class="fa-solid fa-check" style="font-size:28px;width:35px;height:28px;text-align:center;display:inline-block;"></i>`
            : `<img src="cart_logo.png" alt="cart" width="35px" height="24px">`;

          return;
        }

        // cart handling (purchase toggle)
        const cartEl = target.closest(".cart");
        
        if (cartEl) 
        {
          const guitarIndex = parseInt(cartEl.dataset.guitarIndex, 10);
          const colorIndex = selectedColors[guitarIndex];
          const purchased = purchasedArrayOfArray[guitarIndex];
          const guitar = guitarsData[guitarIndex];
          const selectedColor = guitar.colors[colorIndex];

          purchased[colorIndex] = !purchased[colorIndex];

          if (purchased[colorIndex]) 
          {
            const itemData = {
              id: `${guitar.id}_${selectedColor.code}`, // unique per color
              guitarId: guitar.id,
              name: guitar.name,
              price: guitar.price,
              color: {
                code: selectedColor.code,
                quantity: selectedColor.quantity,
              },
              selectedQuantity: quantities[guitarIndex],
              images: guitar.images
            };

            globalGuitarsData.push(itemData);

            cartEl.innerHTML = `<i class="fa-solid fa-check" style="font-size:28px;width:35px;height:28px;text-align:center;display:inline-block;"></i>`;
          } 
          else 
          {
            globalGuitarsData = globalGuitarsData.filter(
              (item) => item.id !== `${guitar.id}_${selectedColor.code}`
            );
            cartEl.innerHTML = `<img src="cart_logo.png" alt="cart" width="35px" height="24px">`;
          }

          localStorage.setItem("globalGuitarsData", JSON.stringify(globalGuitarsData));

          console.log("Purchased Matrix:", purchasedArrayOfArray);
          console.log("Global Guitars Data:", globalGuitarsData);

          return;
        }

        // image click -> redirect
        const imageEl = target.closest(".image img");
        if (imageEl) 
        {
          const guitarIndex = parseInt(imageEl.dataset.guitarIndex, 10);
          const guitar = guitarsData[guitarIndex];
          const guitarSlug = (guitar.name || "unknown").toLowerCase().replace(/\s+/g, "-");

          window.location.href = `/guitar/${guitar.id}/${guitarSlug}`;
        }
      });
    } 
    catch (err) 
    {
      console.error("Error fetching guitars:", err);
      document.querySelector(".div_contain").innerHTML =
        `<p style="color:red">Failed to load guitars. Check server console.</p>`;
    }
  }

  fetchGuitars();


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

      const shapeRange = document.querySelector(".checkbox_menu .face2");
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
});
