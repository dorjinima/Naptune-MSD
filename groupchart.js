const NEPTUNE_KEY = "neptuneGroupChartData";
let editingIndex = null;

// Toggle form display and reset if hiding
function toggleForm(formId) {
  const form = document.getElementById(formId);
  if (form.style.display === "block") {
    form.style.display = "none";
    resetForm();
  } else {
    form.style.display = "block";
  }
}

// Reset form inputs and editing state, show default tab
function resetForm() {
  const form = document.getElementById("groupChartForm");
  if (form) form.reset();
  editingIndex = null;
  clearAllTabs();
  showTab("serviceInclusionSection"); // default tab
}

// Clear all tab buttons and hide tab sections
function clearAllTabs() {
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
  document.querySelectorAll("#groupChart section[id]").forEach((sec) => (sec.style.display = "none"));
}

// Show specific tab content and mark button active
function showTab(tabId) {
  clearAllTabs();
  const tabSection = document.getElementById(tabId);
  if (tabSection) tabSection.style.display = "block";
  const tabButton = document.querySelector(`.tab-btn[data-target="${tabId}"]`);
  if (tabButton) tabButton.classList.add("active");
}

// Get all form input values as an object
function getFormData() {
  return {
    fileNo: document.getElementById("neptuneFileNo").value.trim(),
    groupName: document.getElementById("neptuneGroupName").value.trim(),
    company: document.getElementById("neptuneCompany").value.trim(),
    dateOfConfirmation: document.getElementById("neptuneDateofConfrmtn").value,
    noOfPaxReginal: document.getElementById("neptunenoofpaxreginal").value.trim(),
    noOfPaxInternational: document.getElementById("neptunenoofpaxinternational").value.trim(),
    adults: document.getElementById("neptuneAdults").value.trim(),
    kids: document.getElementById("neptuneKids").value.trim(),
    hotelCategory: document.getElementById("neptunehotelcatergory").value.trim(),
    roomBooking: document.getElementById("neptuneroombooking").value.trim(),
    durationOfTours: document.getElementById("neptuneDurationoftours").value.trim(),
    totalPax: document.getElementById("neptuneTotalPax").value.trim(),
    arrivalDate: document.getElementById("neptuneArrivalDate").value,
    arrivalTime: document.getElementById("neptuneArrivalTime").value,
    arrivalSector: document.getElementById("neptuneArrivalSector").value.trim(),
    arrivalPort: document.getElementById("neptuneArrivalPort").value.trim(),
    arrivalMode: document.getElementById("neptuneArrivalMode").value.trim(),
    departureDate: document.getElementById("neptuneDepartureDate").value,
    departureTime: document.getElementById("neptuneDepartureTime").value,
    departureSector: document.getElementById("neptuneDepartureSector").value.trim(),
    departurePort: document.getElementById("neptuneDeparturePort").value.trim(),
    departureMode: document.getElementById("neptuneDepartureMode").value.trim(),
    nights: document.getElementById("neptuneDurationoftours").value.trim(), // same as duration
    hotel: document.getElementById("neptunehotelcatergory").value.trim(), // same as hotel category
    guideName: document.getElementById("neptuneGuideName").value.trim(),
    guideContact: document.getElementById("neptuneGuideContact").value.trim(),
    guideProfessional: document.getElementById("neptuneGuideprofessional").value.trim(),
    guideLicense: document.getElementById("neptuneGuideLicense").value.trim(),
    guideStartDate: document.getElementById("neptuneGuideStartDate").value,
    guideEndDate: document.getElementById("neptuneGuideEndDate").value,
    vehicleType: document.getElementById("neptuneVehicleType").value.trim(),
    vehicleNo: document.getElementById("neptuneVehicleNo").value.trim(),
    driverName: document.getElementById("neptuneDriverName").value.trim(),
    driverContact: document.getElementById("neptuneDriverContact").value.trim(),
    vehicleStartDate: document.getElementById("neptuneVehicleStartDate").value,
    vehicleEndDate: document.getElementById("neptuneVehicleEndDate").value,
    remarkOfTours: document.getElementById("serviceInclusionSection"), // Placeholder if you want to add later
    servicesConfirmed: Array.from(document.querySelectorAll(".service-checkbox:checked")).map(cb => cb.value),
  };
}

// Load saved group data from localStorage and render table rows
function loadGroups() {
  const data = JSON.parse(localStorage.getItem(NEPTUNE_KEY)) || [];
  const tbody = document.getElementById("neptuneGroupChartList");
  tbody.innerHTML = "";

  data.forEach((item, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.fileNo || ""}</td>
      <td>${item.groupName || ""}</td>
      <td>${item.company || ""}</td>
      <td>${item.dateOfConfirmation || ""}</td>
      <td>${item.noOfPaxReginal || ""}</td>
      <td>${item.noOfPaxInternational || ""}</td>
      <td>${item.adults || ""}</td>
      <td>${item.kids || ""}</td>
      <td>${item.totalPax || ""}</td>
      <td>${item.roomBooking || ""}</td>
      <td>${item.arrivalDate || ""}</td>
      <td>${item.arrivalTime || ""}</td>
      <td>${item.arrivalPort || ""}</td>
      <td>${item.arrivalSector || ""}</td>
      <td>${item.arrivalMode || ""}</td>
      <td>${item.departureDate || ""}</td>
      <td>${item.departureTime || ""}</td>
      <td>${item.departurePort || ""}</td>
      <td>${item.departureSector || ""}</td>
      <td>${item.departureMode || ""}</td>
      <td>${item.nights || ""}</td>
      <td>${item.hotel || ""}</td>
      <td>${item.guideName || ""}</td>
      <td>${item.guideContact || ""}</td>
      <td>${item.guideProfessional || ""}</td>
      <td>${item.guideLicense || ""}</td>
      <td>${item.guideStartDate || ""}</td>
      <td>${item.guideEndDate || ""}</td>
      <td>${item.vehicleType || ""}</td>
      <td>${item.driverName || ""}</td>
      <td>${item.driverContact || ""}</td>
      <td>${item.vehicleStartDate || ""}</td>
      <td>${item.vehicleEndDate || ""}</td>
      <td>${item.serviceInclusionSection || ""}</td>
      <td>
        <button class="btn-edit" onclick="editGroup(${index})">Edit</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Save or update group record
function saveGroup(e) {
  e.preventDefault();

  const data = getFormData();

  if (!data.groupName) {
    alert("Group Name is required.");
    return;
  }

  let dataList = JSON.parse(localStorage.getItem(NEPTUNE_KEY)) || [];

  if (editingIndex !== null) {
    dataList[editingIndex] = data;
  } else {
    dataList.push(data);
  }

  localStorage.setItem(NEPTUNE_KEY, JSON.stringify(dataList));
  loadGroups();
  toggleForm("neptuneGroupChartForm");
  resetForm();
}

// Fill form with existing data for editing
function editGroup(index) {
  const dataList = JSON.parse(localStorage.getItem(NEPTUNE_KEY)) || [];
  if (!dataList[index]) {
    alert("Invalid record");
    return;
  }

  editingIndex = index;
  const data = dataList[index];

  // Fill inputs
  document.getElementById("neptuneFileNo").value = data.fileNo || "";
  document.getElementById("neptuneGroupName").value = data.groupName || "";
  document.getElementById("neptuneCompany").value = data.company || "";
  document.getElementById("neptuneDateofConfrmtn").value = data.dateOfConfirmation || "";
  document.getElementById("neptunenoofpaxreginal").value = data.noOfPaxReginal || "";
  document.getElementById("neptunenoofpaxinternational").value = data.noOfPaxInternational || "";
  document.getElementById("neptuneAdults").value = data.adults || "";
  document.getElementById("neptuneKids").value = data.kids || "";
  document.getElementById("neptunehotelcatergory").value = data.hotelCategory || "";
  document.getElementById("neptuneroombooking").value = data.roomBooking || "";
  document.getElementById("neptuneDurationoftours").value = data.durationOfTours || "";
  document.getElementById("neptuneTotalPax").value = data.totalPax || "";
  document.getElementById("neptuneArrivalDate").value = data.arrivalDate || "";
  document.getElementById("neptuneArrivalTime").value = data.arrivalTime || "";
  document.getElementById("neptuneArrivalSector").value = data.arrivalSector || "";
  document.getElementById("neptuneArrivalPort").value = data.arrivalPort || "";
  document.getElementById("neptuneArrivalMode").value = data.arrivalMode || "";
  document.getElementById("neptuneDepartureDate").value = data.departureDate || "";
  document.getElementById("neptuneDepartureTime").value = data.departureTime || "";
  document.getElementById("neptuneDepartureSector").value = data.departureSector || "";
  document.getElementById("neptuneDeparturePort").value = data.departurePort || "";
  document.getElementById("neptuneDepartureMode").value = data.departureMode || "";
  document.getElementById("neptuneGuideName").value = data.guideName || "";
  document.getElementById("neptuneGuideContact").value = data.guideContact || "";
  document.getElementById("neptuneGuideprofessional").value = data.guideProfessional || "";
  document.getElementById("neptuneGuideLicense").value = data.guideLicense || "";
  document.getElementById("neptuneGuideStartDate").value = data.guideStartDate || "";
  document.getElementById("neptuneGuideEndDate").value = data.guideEndDate || "";
  document.getElementById("neptuneVehicleType").value = data.vehicleType || "";
  document.getElementById("neptuneVehicleNo").value = data.vehicleNo || "";
  document.getElementById("neptuneDriverName").value = data.driverName || "";
  document.getElementById("neptuneDriverContact").value = data.driverContact || "";
  document.getElementById("neptuneVehicleStartDate").value = data.vehicleStartDate || "";
  document.getElementById("neptuneVehicleEndDate").value = data.vehicleEndDate || "";

  // Set service checkboxes
  document.querySelectorAll(".service-checkbox").forEach((cb) => {
    cb.checked = data.servicesConfirmed?.includes(cb.value) || false;
  });

  toggleForm("neptuneGroupChartForm");
  showTab("serviceInclusionSection");
}

// Filter table rows by group name search input
document.getElementById("searchByGroupName").addEventListener("input", (e) => {
  const filter = e.target.value.toLowerCase();
  const rows = document.querySelectorAll("#neptuneGroupChartList tr");

  rows.forEach((row) => {
    const groupName = row.children[2].textContent.toLowerCase();
    row.style.display = groupName.includes(filter) ? "" : "none";
  });
});

// Cancel button handler: hide form and reset
function neptuneCancelForm() {
  toggleForm("neptuneGroupChartForm");
  resetForm();
}

// On page load setup
document.addEventListener("DOMContentLoaded", () => {
  loadGroups();

  // Attach save button event
  const saveBtn = document.querySelector(".neptune-submit-btn");
  if (saveBtn) saveBtn.addEventListener("click", saveGroup);

  // Attach tab buttons event listeners
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      showTab(btn.dataset.target);
    });
  });

  showTab("serviceInclusionSection"); // default tab
});
