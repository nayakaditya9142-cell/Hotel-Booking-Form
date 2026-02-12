const form = document.getElementById("bookingForm");
const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");
const room = document.getElementById("room");
const total = document.getElementById("total");
const username = document.getElementById("username");
const phone = document.getElementById("phone");
const guests = document.getElementById("guests");

// Minimum date setup
let today = new Date().toISOString().split("T")[0];
checkin.min = today;
checkout.min = today;

/* ---------------- PRICE CALCULATION ---------------- */

checkin.addEventListener("change", () => {
  checkout.min = checkin.value;
  calculatePrice();
});

checkout.addEventListener("change", calculatePrice);

room.addEventListener("change", () => {
  calculatePrice();
  setGuestLimit();
});

/* ---------------- CALCULATE PRICE ---------------- */

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

/* ---------------- ROOM CAPACITY LIMIT ---------------- */

function setGuestLimit() {

  let selectedRoom = room.options[room.selectedIndex].text;

  let maxLimit = 0;

  if (selectedRoom.includes("Single")) {
    maxLimit = 2;
  }
  else if (selectedRoom.includes("Double")) {
    maxLimit = 4;
  }
  else if (selectedRoom.includes("Suite")) {
    maxLimit = 4;
  }

  guests.max = maxLimit;

  if (guests.value > maxLimit) {
    guests.value = maxLimit;
  }
}

/* ---------------- REAL-TIME HARD LIMIT ---------------- */

guests.addEventListener("input", function() {

  let selectedRoom = room.options[room.selectedIndex].text;
  let maxLimit = 0;

  if (selectedRoom.includes("Single")) {
    maxLimit = 2;
  }
  else if (selectedRoom.includes("Double")) {
    maxLimit = 4;
  }
  else if (selectedRoom.includes("Suite")) {
    maxLimit = 4;
  }

  if (Number(guests.value) > maxLimit) {
    guests.value = maxLimit;
  }

  if (Number(guests.value) < 1) {
    guests.value = 1;
  }
});

/* ---------------- FORM SUBMIT ---------------- */

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

  let guestCount = Number(guests.value);

  if(guestCount <= 0){
    alert("Please add at least one guest");
    return;
  }

  if(total.textContent === "₹0"){
    alert("Please select valid dates and room");
    return;
  }

  let selectedRoom = room.options[room.selectedIndex].text;

  if(selectedRoom.includes("Single") && guestCount > 2){
    alert("Single room allows maximum 2 guests.");
    return;
  }

  if(selectedRoom.includes("Double") && guestCount > 4){
    alert("Double room allows maximum 4 guests.");
    return;
  }

  if(selectedRoom.includes("Suite") && guestCount > 4){
    alert("Suite allows maximum 4 guests.");
    return;
  }

  // Save booking details
  localStorage.setItem("username", username.value);
  localStorage.setItem("phone", phone.value);
  localStorage.setItem("checkin", checkin.value);
  localStorage.setItem("checkout", checkout.value);
  localStorage.setItem("room", selectedRoom);
  localStorage.setItem("guests", guestCount);
  localStorage.setItem("price", total.textContent);

  window.location.href = "confirmation.html";
});
