"use strict";

const qs = (s, el = document) => el.querySelector(s);

// run after DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  const nationalId = qs('#nationalId');
  const fullName   = qs('#fullName');
  const dob        = qs('#dob');
  const mobile     = qs('#mobile');

  try {
    const raw = sessionStorage.getItem("ssoPayload");
    if (raw) {
      const p = JSON.parse(raw);
      if (nationalId && p.nationalId) nationalId.value = p.nationalId;
      if (fullName && p.fullName)     fullName.value   = p.fullName;
      if (dob && p.dob)               dob.value        = p.dob;
      if (mobile && p.mobile)         mobile.value     = p.mobile;

      const headerName = qs('#employeeName');
      if (headerName && p.fullName) headerName.textContent = p.fullName;
      sessionStorage.setItem("employeeName", p.fullName || "");
    }
  } catch(e) { /* ignore */ }

  const form    = qs('#employeeForm');
  if (!form) return; 

  const consent = qs('#consent');
  const saveBtn = qs('#saveBtn');
  const toast   = qs('#toast'); 
  const email   = qs('#email');
  const marital = qs('#marital');
  const consentBlock = qs('#consentBlock');
  const formErrors = qs('#formErrors');

  // mark read-only fields for a11y
  document.querySelectorAll('[data-readonly] .am-ro, .form-control[readonly], .form-select[readonly]')
    .forEach(i => i.setAttribute('aria-readonly', 'true'));

  // --- validation ---
  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());

  const setInvalid = (el, invalid) => {
    el.classList.toggle('--error', invalid);
    el.classList.toggle('is-invalid', invalid);
    el.setAttribute('aria-invalid', String(invalid));
  };

  const setError = (el, boxId, msg='') => {
    setInvalid(el, !!msg);
    const box = qs('#' + boxId);
    if (box) box.textContent = msg;
  };

  function validateEmail() {
    const ok = isEmail(email.value);
    setError(email, 'emailError', ok ? '' : 'الرجاء إدخال بريد إلكتروني صحيح مثل name@example.com');
    return ok;
  }

  function validateMarital() {
    const ok = Boolean(marital.value);
    setInvalid(marital, !ok);
    return ok;
  }

  let attemptedSubmit = false;
  function validateConsent() {
    const ok = !!consent.checked;
    consentBlock?.classList.toggle('--error', !ok && attemptedSubmit);
    return ok;
  }

  function toggleSave() {
    const canSave = validateEmail() && validateMarital() && consent.checked;
    saveBtn.disabled = !canSave;
  }

  // live validation
  email?.addEventListener('input',  () => { validateEmail();  toggleSave(); });
  email?.addEventListener('blur',   () => { validateEmail();  toggleSave(); });
  marital?.addEventListener('change', () => { validateMarital(); toggleSave(); });
  consent?.addEventListener('change', () => { validateConsent(); toggleSave(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    attemptedSubmit = true;

    const ok = validateEmail() && validateMarital() && validateConsent();
    if (!ok) {
      if (formErrors) formErrors.textContent = 'تحقق من الحقول المظللة بالأحمر ثم حاول مرة أخرى.';
      toggleSave();
      return;
    }

    // Construct payload for backend
    const payload = {
      nationalId: nationalId?.value || '',
      fullName:   fullName?.value   || '',
      email:      email?.value      || '',
      dob:        dob?.value        || '',
      marital:    marital?.value    || '',
      mobile:     mobile?.value     || '',
      consent:    true
    };

    // Simulated save
    saveBtn.disabled = true;
    const oldText = saveBtn.textContent;
    saveBtn.textContent = '... جاري الحفظ';
    try {
      // TODO:  API

      await new Promise(r => setTimeout(r, 700));
      window.location.assign('success.html');
    } finally {
      saveBtn.textContent = oldText;
    }
  });

  toggleSave();
});
