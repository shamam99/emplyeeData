document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("email");
  const statusSelect = document.getElementById("maritalStatus");
  const agreeCheckbox = document.getElementById("agreeTerms");
  const saveBtn = document.getElementById("saveBtn");

  function validateForm() {
    const emailFilled = emailInput.value.trim() !== "";
    const statusSelected = statusSelect.value !== "";
    const agreed = agreeCheckbox.checked;

    if (emailFilled && statusSelected && agreed) {
      saveBtn.disabled = false;
      saveBtn.classList.add("enabled");
    } else {
      saveBtn.disabled = true;
      saveBtn.classList.remove("enabled");
    }
  }

  emailInput.addEventListener("input", validateForm);
  statusSelect.addEventListener("change", validateForm);
  agreeCheckbox.addEventListener("change", validateForm);
});
