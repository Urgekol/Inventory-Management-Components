
let cartData = JSON.parse(localStorage.getItem("globalGuitarsData")) || [];

const cartBody = document.getElementById("cartBody");
const subtotalText = document.getElementById("subtotalText");


function renderCart() 
{
  cartBody.innerHTML = "";
  let total = 0;

  if (cartData.length === 0) 
  {
    cartBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-cart">Your cart is empty.</td>
      </tr>`;
    subtotalText.innerText = "Subtotal: ₹0";

    return;
  }

  cartData.forEach((item) => {

    const subtotal = item.selectedQuantity * item.price;
    total += subtotal;

    const imageUrl =
      item.images && item.images.length > 0
        ? item.images[0].url
        : "placeholder.jpg";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <div class="cart-item">
          <img src="${imageUrl}" alt="${item.name}" class="cart-img" />
          <span class="cart-item-name">${item.name}</span>
        </div>
      </td>
      <td>
        <div class="color-box" style="background-color: ${item.color.code};"></div>
      </td>
      <td class="quantity">${item.selectedQuantity}</td>
      <td>₹${item.price.toLocaleString()}</td>
      <td>₹${subtotal.toLocaleString()}</td>
      <td>
        <button class="delete-btn" onclick="deleteItem('${item.id}')">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    cartBody.appendChild(row);
  });

  subtotalText.innerText = `Subtotal: ₹${total.toLocaleString()}`;
}


function deleteItem(id) 
{
  const index = cartData.findIndex((item) => item.id === id);
  if (index !== -1) 
  {
    cartData.splice(index, 1);
    localStorage.setItem("globalGuitarsData", JSON.stringify(cartData));
    renderCart();
  }
}

renderCart();
