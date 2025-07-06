// === Constants and State ===
const STORAGE_KEY = "hotelRecords";
let editIndex = null;

// === Wait until DOM is fully loaded ===
document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.querySelector(".submit-btn");
  if (saveBtn) {
    saveBtn.type = "button";  // Prevent form submit page refresh
    saveBtn.addEventListener("click", saveHotel);
  }

  const cancelBtn = document.querySelector(".cancel-btn");
  if (cancelBtn) {
    cancelBtn.type = "button";
    cancelBtn.addEventListener("click", cancelForm);
  }

  const searchInput = document.getElementById("searchByHotelName");
  if (searchInput) {
    searchInput.addEventListener("input", filterHotels);
  }

  loadHotels();
});

// === Toggle the visibility of hotel form ===
function toggleForm(id) {
  const form = document.getElementById(id);
  if (!form) return;
  form.style.display = form.style.display === "none" ? "block" : "none";
}

// === Toggle the visibility of rate section ===
function toggleRateSection() {
  const section = document.querySelector(".scroll-section");
  if (!section) return;
  section.style.display = section.style.display === "none" ? "block" : "none";
}

// === Clear the hotel form inputs and reset state ===
function clearForm() {
  const form = document.getElementById("hotelForm");
  if (!form) return;

  // Clear all input, textarea, select values
  form.querySelectorAll("input").forEach(input => input.value = "");
  form.querySelectorAll("textarea").forEach(textarea => textarea.value = "");
  form.querySelectorAll("select").forEach(select => select.selectedIndex = 0);

  // Hide rate section
  const rateSection = document.querySelector(".scroll-section");
  if (rateSection) rateSection.style.display = "none";

  editIndex = null;
}

// === Cancel button handler ===
function cancelForm() {
  clearForm();
  const form = document.getElementById("hotelForm");
  if (form) form.style.display = "none";
}

// === Save or update hotel data ===
function saveHotel(e) {
  e.preventDefault();
  console.log("Save button clicked");

  const form = document.getElementById("hotelForm");
  if (!form) {
    alert("Form not found.");
    return;
  }

  const inputs = form.querySelectorAll("input");
  const textareas = form.querySelectorAll("textarea");
  const selects = form.querySelectorAll("select");
  const rateInputs = form.querySelectorAll(".rate-table tbody tr td input");
  const rateSelect = form.querySelector(".rate-table tbody tr td select");

  // Build hotel data object from form inputs
  const hotel = {
    name: inputs[0]?.value.trim() || "",
    location: inputs[1]?.value.trim() || "",
    officialCategory: selects[0]?.value || "",
    ourCategory: inputs[2]?.value.trim() || "",
    personalEmail: inputs[3]?.value.trim() || "",
    departmentEmail: inputs[4]?.value.trim() || "",
    personalPhone: inputs[5]?.value.trim() || "",
    departmentPhone: inputs[6]?.value.trim() || "",
    remarks: textareas[0]?.value.trim() || "",
    rate: {
      nationality: rateSelect?.value || "",
      startDate: rateInputs[0]?.value || "",
      endDate: rateInputs[1]?.value || "",
      roomType: rateInputs[2]?.value || "",
      numRooms: rateInputs[3]?.value || "",
      EP: Array.from(rateInputs).slice(4, 9).map(i => i.value.trim()),
      CP: Array.from(rateInputs).slice(9, 14).map(i => i.value.trim()),
      MAP: Array.from(rateInputs).slice(14, 19).map(i => i.value.trim()),
      AP: Array.from(rateInputs).slice(19, 24).map(i => i.value.trim()),
    }
  };

  // Basic validation
  if (!hotel.name || !hotel.location) {
    alert("Hotel Name and Location are required.");
    return;
  }

  if (!confirm("Are you sure you want to save this hotel?")) {
    alert("Save cancelled.");
    return;
  }

  // Load existing records
  let records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  // Update or add new
  if (editIndex !== null) {
    records[editIndex] = hotel;
    editIndex = null;
  } else {
    records.push(hotel);
  }

  // Save back to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));

  alert("Hotel saved successfully!");

  // Reset form and UI
  cancelForm();
  loadHotels();
}

// === Load and render hotels in table ===
function loadHotels() {
  const records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const tbody = document.querySelector(".hotel-records-table tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  records.forEach((hotel, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${hotel.name}</td>
      <td>${hotel.location}</td>
      <td>${hotel.officialCategory}</td>
      <td>${hotel.ourCategory}</td>
      <td>${hotel.personalPhone}, ${hotel.departmentPhone}</td>
      <td>${hotel.personalEmail}, ${hotel.departmentEmail}</td>
      <td>${hotel.rate.nationality}</td>
      <td>${hotel.rate.startDate} to ${hotel.rate.endDate}</td>
      <td>${hotel.rate.roomType}</td>
      <td>${hotel.rate.numRooms}</td>
      <td>${hotel.rate.MAP.join("/")}</td>
      <td>${hotel.rate.CP.join("/")}</td>
      <td>${hotel.rate.EP.join("/")}</td>
      <td>${hotel.rate.AP.join("/")}</td>
      <td>
        <button type="button" onclick="editHotel(${index})">Edit</button>
        <button type="button" onclick="deleteHotel(${index})">Delete</button>
      </td>`;
    tbody.appendChild(row);
  });
}

// === Load selected hotel data into form for editing ===
function editHotel(index) {
  const records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const hotel = records[index];
  if (!hotel) {
    alert("Hotel record not found.");
    return;
  }
  editIndex = index;

  const form = document.getElementById("hotelForm");
  if (!form) return;

  const inputs = form.querySelectorAll("input");
  const textareas = form.querySelectorAll("textarea");
  const selects = form.querySelectorAll("select");
  const rateInputs = form.querySelectorAll(".rate-table tbody tr td input");
  const rateSelect = form.querySelector(".rate-table tbody tr td select");

  inputs[0].value = hotel.name;
  inputs[1].value = hotel.location;
  selects[0].value = hotel.officialCategory;
  inputs[2].value = hotel.ourCategory;
  inputs[3].value = hotel.personalEmail;
  inputs[4].value = hotel.departmentEmail;
  inputs[5].value = hotel.personalPhone;
  inputs[6].value = hotel.departmentPhone;
  textareas[0].value = hotel.remarks;

  if (rateSelect) rateSelect.value = hotel.rate.nationality;
  if (rateInputs.length >= 24) {
    rateInputs[0].value = hotel.rate.startDate;
    rateInputs[1].value = hotel.rate.endDate;
    rateInputs[2].value = hotel.rate.roomType;
    rateInputs[3].value = hotel.rate.numRooms;

    hotel.rate.EP.forEach((val, i) => { rateInputs[4 + i].value = val || ""; });
    hotel.rate.CP.forEach((val, i) => { rateInputs[9 + i].value = val || ""; });
    hotel.rate.MAP.forEach((val, i) => { rateInputs[14 + i].value = val || ""; });
    hotel.rate.AP.forEach((val, i) => { rateInputs[19 + i].value = val || ""; });
  }

  // Show form and rate section
  form.style.display = "block";
  const rateSection = document.querySelector(".scroll-section");
  if (rateSection) rateSection.style.display = "block";
}

// === Delete hotel record ===
function deleteHotel(index) {
  let records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  if (!records[index]) {
    alert("Hotel not found.");
    return;
  }
  if (confirm(`Are you sure you want to delete ${records[index].name}?`)) {
    records.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    loadHotels();
  }
}

// === Filter hotels by name in table ===
function filterHotels() {
  const query = document.getElementById("searchByHotelName").value.toLowerCase();
  const rows = document.querySelectorAll(".hotel-records-table tbody tr");
  rows.forEach(row => {
    const name = row.children[0]?.textContent.toLowerCase() || "";
    row.style.display = name.includes(query) ? "" : "none";
  });
}
