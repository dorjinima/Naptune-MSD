  const USER1_KEY = "user1Accounts";
  let user1Data = JSON.parse(localStorage.getItem(USER1_KEY)) || [];

  document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("user1AddBtn");
    const formContainer = document.querySelector(".user1-form-container");
    const cancelBtn = formContainer.querySelector(".btn-danger");
    const saveBtn = document.getElementById("user1SaveBtn");
    const showPasswordCheckbox = document.getElementById("user1ShowPassword");
    const passwordInput = document.getElementById("user1Password");
    const togglePasswordBtn = document.getElementById("user1TogglePassword");
    const selectAllBtn = document.getElementById("user1SelectAll");
    const statusToggle = document.getElementById("user1StatusToggle");
    const statusText = document.getElementById("user1StatusText");

    // Toggle form
    addBtn.addEventListener("click", () => {
      formContainer.style.display = "block";
    });

    cancelBtn.addEventListener("click", () => {
      formContainer.style.display = "none";
      resetForm();
    });

    // Toggle password visibility
    togglePasswordBtn.addEventListener("click", () => {
      passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    });

    showPasswordCheckbox.addEventListener("change", () => {
      passwordInput.type = showPasswordCheckbox.checked ? "text" : "password";
    });

    // Toggle account status text
    statusToggle.addEventListener("change", () => {
      statusText.textContent = statusToggle.checked ? "Active" : "Inactive";
    });

    // Select all checkboxes
    selectAllBtn.addEventListener("click", () => {
      const checkboxes = formContainer.querySelectorAll(".permissions input[type='checkbox']");
      checkboxes.forEach(cb => cb.checked = true);
    });

    // Save user
    saveBtn.addEventListener("click", () => {
      const newUser = {
        fullName: document.getElementById("user1FullName").value.trim(),
        email: document.getElementById("user1Email").value.trim(),
        phone: document.getElementById("user1Phone").value.trim(),
        username: document.getElementById("user1Username").value.trim(),
        password: document.getElementById("user1Password").value.trim(),
        status: statusToggle.checked ? "Active" : "Inactive",
      };

      if (!newUser.fullName || !newUser.email || !newUser.username || !newUser.password) {
        alert("Please fill in all required fields.");
        return;
      }

      user1Data.push(newUser);
      localStorage.setItem(USER1_KEY, JSON.stringify(user1Data));
      renderUser1Table();
      formContainer.style.display = "none";
      resetForm();
    });

    function renderUser1Table() {
      const tbody = document.getElementById("user1TableBody");
      tbody.innerHTML = "";

      user1Data.forEach((user, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${user.fullName}</td>
          <td>${user.email}</td>
          <td>${user.phone}</td>
          <td>${user.username}</td>
          <td>${user.password}</td>
          <td>${user.status}</td>
          <td><button onclick="deleteUser1(${index})" class="btn btn-sm btn-danger">Delete</button></td>
        `;
        tbody.appendChild(row);
      });
    }

    window.deleteUser1 = function(index) {
      if (confirm("Are you sure you want to delete this user?")) {
        user1Data.splice(index, 1);
        localStorage.setItem(USER1_KEY, JSON.stringify(user1Data));
        renderUser1Table();
      }
    }

    function resetForm() {
      formContainer.querySelector("form")?.reset?.();
      formContainer.querySelectorAll("input").forEach(input => {
        if (input.type === "checkbox") input.checked = false;
        else input.value = "";
      });
      statusToggle.checked = true;
      statusText.textContent = "Active";
    }

    // Initial render
    renderUser1Table();
  });