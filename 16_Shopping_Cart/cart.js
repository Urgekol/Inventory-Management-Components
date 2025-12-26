const cartData = [
  {
    id: "1_RED",
    guitarId: 1,
    name: "Fender Stratocaster",
    price: 1299,
    image: "#",
    color: { code: "#d32f2f", quantity: 10 },
    selectedQuantity: 1,
  },
  {
    id: "2_BLACK",
    guitarId: 2,
    name: "Gibson Les Paul",
    price: 1499,
    image: "#",
    color: { code: "#000000", quantity: 6 },
    selectedQuantity: 2,
  },
  {
    id: "3_SUNBURST",
    guitarId: 3,
    name: "Ibanez RG",
    price: 999,
    image: "#",
    color: { code: "#ffb74d", quantity: 5 },
    selectedQuantity: 1,
  },
];

const cartBody = document.getElementById("cartBody");
const subtotalText = document.getElementById("subtotalText");

function renderCart() 
{
  cartBody.innerHTML = "";
  let total = 0;

  if (cartData.length === 0) 
  {
    cartBody.innerHTML = `<tr><td colspan="6" class="empty-cart">Your cart is empty.</td></tr>`;
    subtotalText.innerText = "Subtotal: ₹0";

    return;
  }

  cartData.forEach(item => {

    const subtotal = item.selectedQuantity * item.price;
    total += subtotal;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <span>${item.name}</span>
        </div>
      </td>
      <td>
        <div class="color-box" style="background-color: ${item.color.code};"></div>
      </td>
      <td>${item.selectedQuantity}</td>
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
  const index = cartData.findIndex(item => item.id === id);
  if (index !== -1) 
  {
    cartData.splice(index, 1);
    renderCart();
  }
}

renderCart();
