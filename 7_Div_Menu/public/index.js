let purchasedArrayOfArray = []; 
let globalGuitarsData = [];

document.addEventListener("DOMContentLoaded", async () => {
  async function fetchGuitars()
  {
    try 
    {
      const res = await fetch("/api/guitars");
      if (!res.ok) throw new Error("Network response not ok");

      const guitarsData = await res.json();
      const container = document.querySelector(".container");
      container.innerHTML = "";

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
          <div class="banner"><span>Get a Carry Bag</span></div>
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

        container.appendChild(card);
        purchasedArrayOfArray[guitarIndex] = new Array(guitar.colors.length).fill(false);
      });

      let quantities = guitarsData.map(() => 1);
      let selectedColors = guitarsData.map(() => 0);

      container.addEventListener("click", (event) => {
        const target = event.target;

        // quantity handling
        const quantityBox = target.closest(".quantity");
        if (quantityBox) {
          const guitarIndex = parseInt(quantityBox.dataset.guitarIndex, 10);
          const numEl = quantityBox.querySelector(".num");
          const currentColorIndex = selectedColors[guitarIndex];
          const maxVal = guitarsData[guitarIndex].colors[currentColorIndex]?.quantity || 1;

          // increase or decrease
          if (target.classList.contains("plus") && quantities[guitarIndex] < maxVal)
          {
            quantities[guitarIndex]++;
          }
          else if (target.classList.contains("minus") && quantities[guitarIndex] > 1)
          {
            quantities[guitarIndex]--;
          }

          // update display
          numEl.innerText = quantities[guitarIndex] < 10 ? "0" + quantities[guitarIndex] : quantities[guitarIndex];

          // if already purchased, update quantity in globalGuitarsData
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
              existingItem.timestamp = new Date().toISOString(); // optional: track change
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
          quantities[guitarIndex] = 1; // reset to 1

          
          const allColors = container.querySelectorAll(`.color[data-guitar-index="${guitarIndex}"]`);
          allColors.forEach((c) => (c.style.border = "2px solid transparent"));
          colorEl.style.border = "2px solid #000";

          
          const quantityBox = container.querySelector(`.quantity[data-guitar-index="${guitarIndex}"] .num`);

          if (quantityBox) 
          {
            quantityBox.innerText = "01";
          }

          const cart = container.querySelector(`.cart[data-guitar-index="${guitarIndex}"]`);
          const isPurchased = purchasedArrayOfArray[guitarIndex][colorIndex];
          cart.innerHTML = isPurchased
            ? `<i class="fa-solid fa-check" style="font-size:28px;width:35px;height:28px;text-align:center;display:inline-block;"></i>`
            : `<img src="cart_logo.png" alt="cart" width="35px" height="24px">`;

          return;
        }

        // purchase toggle
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
      document.querySelector(".container").innerHTML =
        `<p style="color:red">Failed to load guitars. Check server console.</p>`;
    }
  }

  fetchGuitars();
});
