
function generateReferenceCode() 
{
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();

  return `REF-${datePart}-${randomPart}`;
}


document.addEventListener("DOMContentLoaded", () => {
  const refInput = document.getElementById("reference");
  
  refInput.value = generateReferenceCode();
});

document.getElementById("paymentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const paymentData = {
    phone: document.getElementById("phone").value.trim(),
    amount: document.getElementById("amount").value.trim(),
    date: document.getElementById("date").value,
    reference: document.getElementById("reference").value
  };

  console.log("Payment submitted:", paymentData);

  try 
  {
    const res = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });

    const data = await res.json();

    const resultBox = document.getElementById("result");

    if (res.ok) 
    {
      resultBox.innerHTML = `
        <p><strong>Payment Link Generated!</strong></p>
        <button onclick="window.location.href='${data.whatsappUrl}'">Open WhatsApp</button>
      `;
    } 
    else 
    {
      alert(data.error || "Failed to create payment link");
    }
  } 
  catch (err) 
  {
    console.error(err);
    alert("Something went wrong while generating payment link!");
  }
});
