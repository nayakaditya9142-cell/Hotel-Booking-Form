const form = document.getElementById("bookingForm");
const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");
const room = document.getElementById("room");
const total = document.getElementById("total");
const username = document.getElementById("username");
const phone = document.getElementById("phone");
const guests = document.getElementById("guests");

// Minimum date
let today = new Date().toISOString().split("T")[0];
checkin.min = today;
checkout.min = today;

/* -------- PRICE CALCULATION -------- */

checkin.addEventListener("change", () => {
  checkout.min = checkin.value;
  calculatePrice();
});

checkout.addEventListener("change", calculatePrice);
room.addEventListener("change", calculatePrice);

function calculatePrice() {

  if (!checkin.value || !checkout.value || !room.value) {
    total.textContent = "₹0";
    return;
  }

  let start = new Date(checkin.value);
  let end = new Date(checkout.value);

  let days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    total.textContent = "₹0";
    return;
  }

  let price = days * Number(room.value);

  total.textContent = "₹" + price.toLocaleString("en-IN");
}

/* -------- FORM SUBMIT -------- */

form.addEventListener("submit", function(e){
  e.preventDefault();

  if(!username.value.trim()){
    alert("Please enter your name");
    return;
  }

  if(!phone.value.trim()){
    alert("Please enter your phone number");
    return;
  }

  if(Number(guests.value) <= 0){
    alert("Please add at least one guest");
    return;
  }

  if(total.textContent === "₹0"){
    alert("Please select valid dates and room");
    return;
  }

  // Save details
  localStorage.setItem("username", username.value);
  localStorage.setItem("phone", phone.value);
  localStorage.setItem("checkin", checkin.value);
  localStorage.setItem("checkout", checkout.value);
  localStorage.setItem("room", room.options[room.selectedIndex].text);
  localStorage.setItem("guests", guests.value);
  localStorage.setItem("price", total.textContent);

  window.location.href = "confirmation.html";
});
