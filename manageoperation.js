const NAPTUNE_LOCAL_KEY = "naptuneOperations";
  let naptuneData = JSON.parse(localStorage.getItem(NAPTUNE_LOCAL_KEY)) || [];
  let naptuneCurrentPage = 1;
  const naptuneItemsPerPage = 5;

  // Toggle form visibility
  function toggleNaptuneOperationForm() {
    const form = document.getElementById("naptuneOperationForm");
    form.style.display = form.style.display === "none" ? "block" : "none";
  }

  // Handle "Other" vehicle type
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("naptuneVehicleType").addEventListener("change", function () {
      document.getElementById("naptuneVehicleOtherGroup").style.display = this.value === "Other" ? "block" : "none";
    });
    displayNaptuneOperationData();
  });

  // Preview button handler
  function previewNaptuneOperation() {
    alert("🔍 Preview:\n\n" + JSON.stringify(getNaptuneFormData(), null, 2));
  }

  // Confirm & Send button
  function confirmNaptuneOperation() {
    const data = getNaptuneFormData();

    // Save to local
    naptuneData.push(data);
    localStorage.setItem(NAPTUNE_LOCAL_KEY, JSON.stringify(naptuneData));

    // Send to Google Sheets
    fetch("1mJBt-sWskvqLH96VmVRmiiNNV3Catqc_2WdfC4RJM4g", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    .then(res => res.ok ? res.json() : Promise.reject("Fetch failed"))
    .then(result => {
      if (result.status === "success") {
        alert("✅ Data successfully sent to Google Sheet.");
        clearNaptuneForm();
        toggleNaptuneOperationForm();
        displayNaptuneOperationData();
      } else {
        alert("⚠️ Data failed to send.");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("🚫 Network error. Data saved locally.");
      displayNaptuneOperationData();
    });
  }

  // Extract form data
  function getNaptuneFormData() {
    const vehicleType = document.getElementById("naptuneVehicleType").value;
    const vehicleOther = document.getElementById("naptuneVehicleOther").value;
    return {
      fileNumber: document.getElementById("naptuneFileNumber").value.trim(),
      groupName: document.getElementById("naptuneGroupName").value.trim(),
      operationLead: document.getElementById("naptuneOperationLead").value.trim(),
      contact: document.getElementById("naptuneContact").value.trim(),
      guide: document.getElementById("naptuneAssignedGuide").value.trim(),
      driver: document.getElementById("naptuneAssignedDriver").value.trim(),
      vehicle: vehicleType === "Other" ? vehicleOther : vehicleType,
      remarks: document.getElementById("naptuneRemarks").value.trim()
    };
  }

  // Clear form inputs
  function clearNaptuneForm() {
    document.getElementById("naptuneFileNumber").value = "";
    document.getElementById("naptuneGroupName").value = "";
    document.getElementById("naptuneOperationLead").value = "";
    document.getElementById("naptuneContact").value = "";
    document.getElementById("naptuneAssignedGuide").value = "";
    document.getElementById("naptuneAssignedDriver").value = "";
    document.getElementById("naptuneVehicleType").value = "";
    document.getElementById("naptuneVehicleOther").value = "";
    document.getElementById("naptuneVehicleOtherGroup").style.display = "none";
    document.getElementById("naptuneRemarks").value = "";
  }

  // Display table with pagination
  function displayNaptuneOperationData() {
    const tableBody = document.getElementById("naptuneOperationTableBody");
    const searchValue = document.getElementById("naptuneSearchInput").value.toLowerCase();

    const filtered = naptuneData.filter(d =>
      d.fileNumber.toLowerCase().includes(searchValue)
    );

    const start = (naptuneCurrentPage - 1) * naptuneItemsPerPage;
    const end = start + naptuneItemsPerPage;
    const pageData = filtered.slice(start, end);

    tableBody.innerHTML = "";

    pageData.forEach(data => {
      tableBody.innerHTML += `
        <tr>
          <td>${data.fileNumber}</td>
          <td>${data.groupName}</td>
          <td>${data.operationLead}</td>
          <td>${data.contact}</td>
          <td>${data.guide}</td>
          <td>${data.driver}</td>
          <td>${data.vehicle}</td>
          <td>${data.remarks}</td>
          <td><button onclick="deleteNaptuneOperation('${data.fileNumber}')">🗑️ Delete</button></td>
        </tr>
      `;
    });

    document.getElementById("naptunePageInfo").textContent =
      `Page ${naptuneCurrentPage} of ${Math.ceil(filtered.length / naptuneItemsPerPage)}`;

    document.getElementById("naptunePrevBtn").disabled = naptuneCurrentPage === 1;
    document.getElementById("naptuneNextBtn").disabled = end >= filtered.length;
  }

  // Search input event
  document.getElementById("naptuneSearchInput").addEventListener("input", () => {
    naptuneCurrentPage = 1;
    displayNaptuneOperationData();
  });

  // Pagination
  function nextNaptuneOperationPage() {
    naptuneCurrentPage++;
    displayNaptuneOperationData();
  }

  function prevNaptuneOperationPage() {
    naptuneCurrentPage--;
    displayNaptuneOperationData();
  }

  // Delete operation by File Number
  function deleteNaptuneOperation(fileNumber) {
    if (confirm("Delete this operation?")) {
      naptuneData = naptuneData.filter(d => d.fileNumber !== fileNumber);
      localStorage.setItem(NAPTUNE_LOCAL_KEY, JSON.stringify(naptuneData));
      displayNaptuneOperationData();
    }
  }