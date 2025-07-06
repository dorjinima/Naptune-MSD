const RESERVATION_CHAT_KEY = "chatbox_Operation"; // Central inbox for Operation role

let kingaReservations = JSON.parse(localStorage.getItem("kingaReservations")) || [];
let currentKingaPage = 1;
const kingaRecordsPerPage = 10;
let kingaEditIndex = null;

// Toggle reservation form
function kingaToggleForm() {
  const form = document.getElementById("kingaReservationForms");
  if (!form) return;
  form.style.display = form.style.display === "none" ? "block" : "none";
}

// Get form data with validation
function kingaGetFormData() {
  const fileNumber = document.getElementById("kingaFileNumber")?.value.trim();
  const groupName = document.getElementById("kingaGroupName")?.value.trim();
  const agencyName = document.getElementById("kingaAgencyName")?.value;
  const correspondentClient = document.getElementById("kingaCorrespondentClient")?.value.trim();
  const correspondentEmail = document.getElementById("kingaCorrespondentEmail")?.value.trim();
  const bookingWithHotel = document.getElementById("kingaBookingWithHotel")?.value;
  const sendTo = document.getElementById("kingaSendTo")?.value;
  const message = document.getElementById("kingaMessage")?.value.trim();

  if (!fileNumber || !groupName || !agencyName || !correspondentClient || !correspondentEmail || !bookingWithHotel || !sendTo || !message) {
    alert("Please fill in all fields.");
    return null;
  }

  return {
    fileNumber,
    groupName,
    agencyName,
    correspondentClient,
    correspondentEmail,
    bookingWithHotel,
    sendTo,
    message,
    timestamp: new Date().toISOString(),
  };
}

// Clear form inputs
function kingaClearForm() {
  const fields = [
    "kingaFileNumber",
    "kingaGroupName",
    "kingaAgencyName",
    "kingaCorrespondentClient",
    "kingaCorrespondentEmail",
    "kingaBookingWithHotel",
    "kingaSendTo",
    "kingaMessage"
  ];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  kingaEditIndex = null;
}

// Save new reservation and send message to Operation
function kingaSaveReservation() {
  const data = kingaGetFormData();
  if (!data) return;

  if (kingaEditIndex !== null) {
    kingaReservations[kingaEditIndex] = data;
    kingaEditIndex = null;
  } else {
    kingaReservations.push(data);
  }

  // Store message in role-based inbox
  const chatKey = `chatbox_${data.sendTo}`;
  const existingMessages = JSON.parse(localStorage.getItem(chatKey)) || [];
  existingMessages.push({
    ...data,
    status: "unread",
    sentAt: new Date().toISOString(),
    replies: []
  });
  localStorage.setItem(chatKey, JSON.stringify(existingMessages));
  localStorage.setItem("kingaReservations", JSON.stringify(kingaReservations));

  // Log plain message to Operation chat feed
  if (data.sendTo === "Operation") {
    const opChat = JSON.parse(localStorage.getItem(RESERVATION_CHAT_KEY)) || [];
    opChat.push({
      sender: "Reservation",
      message: data.message,
      time: new Date().toLocaleString()
    });
    localStorage.setItem(RESERVATION_CHAT_KEY, JSON.stringify(opChat));
  }

  alert(`📩 Message sent to ${data.sendTo.toUpperCase()}`);
  kingaClearForm();
  kingaToggleForm();
  kingaDisplayReservations();
}

// Edit reservation
function kingaEditData(index) {
  const r = kingaReservations[index];
  if (!r) return alert("Data not found.");
  kingaEditIndex = index;

  [
    ["kingaFileNumber", r.fileNumber],
    ["kingaGroupName", r.groupName],
    ["kingaAgencyName", r.agencyName],
    ["kingaCorrespondentClient", r.correspondentClient],
    ["kingaCorrespondentEmail", r.correspondentEmail],
    ["kingaBookingWithHotel", r.bookingWithHotel],
    ["kingaSendTo", r.sendTo],
    ["kingaMessage", r.message]
  ].forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });

  kingaToggleForm();
}

// Display reservation list
function kingaDisplayReservations() {
  const tbody = document.getElementById("kingaReservationTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const start = (currentKingaPage - 1) * kingaRecordsPerPage;
  const end = start + kingaRecordsPerPage;
  const pageRecords = kingaReservations.slice(start, end);

  pageRecords.forEach((r, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${r.fileNumber}</td>
      <td>${r.groupName}</td>
      <td>${r.agencyName}</td>
      <td>${r.correspondentClient}</td>
      <td>${r.correspondentEmail}</td>
      <td>${r.bookingWithHotel}</td>
      <td>
        <button onclick="kingaEditData(${start + index})">✏️ Edit</button>
        <button onclick='kingaSendToOperation(${JSON.stringify(r).replace(/'/g, "\\'")})'>📤 Send to Operation</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  const pageInfo = document.getElementById("kingaPageInfo");
  if (pageInfo) {
    pageInfo.textContent = `Page ${currentKingaPage} of ${Math.ceil(kingaReservations.length / kingaRecordsPerPage)}`;
  }
}

// Send data to Operation task list
function kingaSendToOperation(data) {
  const transformed = {
    fileNumber: data.fileNumber,
    groupName: data.groupName,
    operationLead: data.correspondentClient,
    contact: data.correspondentEmail,
    guide: "",
    driver: "",
    vehicle: data.bookingWithHotel,
    remarks: data.message
  };

  let existing = JSON.parse(localStorage.getItem("TRANSFERRED_OPERATION_LIST")) || [];
  existing.push(transformed);
  localStorage.setItem("TRANSFERRED_OPERATION_LIST", JSON.stringify(existing));

  alert(`📤 Reservation "${data.fileNumber}" sent to Operations.`);
  window.scrollTo(0, 0);
}

// Display Operation chat inbox
function displayOperationChatMessages() {
  const messages = JSON.parse(localStorage.getItem(RESERVATION_CHAT_KEY)) || [];
  const chatBox = document.getElementById("operationChatBox");
  if (!chatBox) return;

  chatBox.innerHTML = "";

  if (messages.length === 0) {
    chatBox.innerHTML = "<p>No messages received yet.</p>";
    return;
  }

  messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = "chat-message";
    div.innerHTML = `
      <strong>From:</strong> ${msg.sender}<br>
      <strong>Message:</strong> ${msg.message}<br>
      <div class="chat-time">${msg.time}</div>
    `;
    chatBox.appendChild(div);
  });
}

// Pagination
function kingaPrevPage() {
  if (currentKingaPage > 1) {
    currentKingaPage--;
    kingaDisplayReservations();
  }
}

function kingaNextPage() {
  if (currentKingaPage * kingaRecordsPerPage < kingaReservations.length) {
    currentKingaPage++;
    kingaDisplayReservations();
  }
}

// DOM Initialization
window.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("kingaConfirmAndSendBtn");
  if (saveBtn) {
    saveBtn.textContent = "Confirm & Save";
    saveBtn.style.display = "inline-block";
    saveBtn.addEventListener("click", kingaSaveReservation);
  }

  // Search box
  document.getElementById("kingaSearchReservation")?.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = kingaReservations.filter((r) =>
      r.fileNumber.toLowerCase().includes(query)
    );
    const tbody = document.getElementById("kingaReservationTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    filtered.forEach((r, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${r.fileNumber}</td>
        <td>${r.groupName}</td>
        <td>${r.agencyName}</td>
        <td>${r.correspondentClient}</td>
        <td>${r.correspondentEmail}</td>
        <td>${r.bookingWithHotel}</td>
        <td><button onclick="kingaEditData(${index})">Edit</button></td>
      `;
      tbody.appendChild(row);
    });
  });

  // Receiver chat inbox listener
  document.getElementById("manageReservation")?.addEventListener("click", () => {
    displayOperationChatMessages();
    const section = document.getElementById("operationChatSection");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  });

  kingaDisplayReservations();
});
