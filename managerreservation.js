const RESERVATION_CHAT_KEY = "chatbox_Operation"; // Shared key for Reservation → Operation

// Load reservation messages and search filter
document.addEventListener("DOMContentLoaded", () => {
  loadReservationMessages();

  const searchInput = document.getElementById("reservationChatSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const filter = searchInput.value.toLowerCase();
      filterReservationMessages(filter);
    });
  }
});

// Load and display messages for Operation inbox
function loadReservationMessages() {
  const messages = JSON.parse(localStorage.getItem(RESERVATION_CHAT_KEY)) || [];
  displayReservationMessages(messages);
}

// Display chat messages in chat box
function displayReservationMessages(messages) {
  const chatBox = document.getElementById("reservationChatMessages");
  if (!chatBox) return;
  chatBox.innerHTML = "";

  if (messages.length === 0) {
    chatBox.innerHTML = `<p style="color: gray; font-style: italic;">No messages yet.</p>`;
    return;
  }

  messages.forEach((msg) => {
    const msgDiv = document.createElement("div");
    msgDiv.className = "chat-message";
    msgDiv.style.marginBottom = "1rem";
    msgDiv.style.padding = "0.75rem";
    msgDiv.style.borderRadius = "8px";
    msgDiv.style.backgroundColor = "#ffffff";
    msgDiv.style.borderLeft = `4px solid ${msg.sender === "Reservation" ? "#3498db" : "#2ecc71"}`;

    msgDiv.innerHTML = `
      <strong>${msg.sender}:</strong> <span>${escapeHtml(msg.message)}</span><br/>
      <small style="color: gray;">${msg.time}</small>
    `;

    chatBox.appendChild(msgDiv);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send reply to Reservation as "Operation"
function sendReplyToReservation() {
  const replyInput = document.getElementById("reservationChatReply");
  if (!replyInput) return;

  const messageText = replyInput.value.trim();
  if (!messageText) return alert("Please type a reply.");

  const messages = JSON.parse(localStorage.getItem(RESERVATION_CHAT_KEY)) || [];

  messages.push({
    sender: "Operation",
    message: messageText,
    time: new Date().toLocaleString(),
  });

  localStorage.setItem(RESERVATION_CHAT_KEY, JSON.stringify(messages));

  replyInput.value = "";
  loadReservationMessages();

  const searchInput = document.getElementById("reservationChatSearchInput");
  if (searchInput) searchInput.value = "";
}

// Escape HTML special characters
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Filter search results in chat
function filterReservationMessages(filterText) {
  const messages = JSON.parse(localStorage.getItem(RESERVATION_CHAT_KEY)) || [];

  if (!filterText) {
    displayReservationMessages(messages);
    return;
  }

  const filtered = messages.filter(
    (msg) =>
      msg.message.toLowerCase().includes(filterText) ||
      msg.sender.toLowerCase().includes(filterText)
  );

  displayReservationMessages(filtered);
}

// Optional: Update chat live across tabs
window.addEventListener("storage", (event) => {
  if (event.key === RESERVATION_CHAT_KEY) {
    loadReservationMessages();
  }
});
