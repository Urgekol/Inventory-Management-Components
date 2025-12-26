const carts = document.querySelectorAll('.cart');
const plus = document.querySelector(".plus");
const minus = document.querySelector(".minus");
const num = document.querySelector(".num");

let a = 1;
const minVal = 1;
const maxVal = 20;

function updateDisplay() {
  num.innerText = a < 10 ? "0" + a : a;
}

plus.addEventListener("click", () => {
  if (a < maxVal) 
  {
    a++;
    updateDisplay();
  }
});

minus.addEventListener("click", () => {
  if (a > minVal) 
  {
    a--;
    updateDisplay();
  }
});

// cart
carts.forEach(cart => {
  cart.addEventListener('click', () => {
    const hasCheck = cart.querySelector('i.fa-check');

    if (hasCheck) 
    {
      cart.innerHTML = `<img src="cart_logo.png" alt="cart" width="35" height="28">`;
    } 
    else 
    {
      cart.innerHTML = `<i class="fa-solid fa-check"></i>`;
      const tick = cart.querySelector('i');
      tick.style.width = '35px';
      tick.style.height = '28px';
      tick.style.fontSize = '28px';
      tick.style.display = 'inline-block';
      tick.style.textAlign = 'center';
      tick.style.color = 'green'; 
    }
  });
});

updateDisplay();
