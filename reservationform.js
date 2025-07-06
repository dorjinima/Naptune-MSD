 function saveForm() {
      const fields = [
        "fileNo", "groupName", "travelDate", "guideName", "guideContact",
        "driverName", "driverContact", "vehicleType", "acRequirements",
        "permits", "hotels", "specialRequirements", "otherNotes"
      ];
      const data = {};
      fields.forEach(id => {
        const el = document.getElementById(id);
        data[id] = el ? el.value : '';
      });
      localStorage.setItem("travelFormData", JSON.stringify(data));
      alert("✅ Form saved.");
    }