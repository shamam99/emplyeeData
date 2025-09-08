"use strict";

// Minimal SSO simulation for handoff between pages.

const btn = document.getElementById("nafathBtn");
if (btn) {
  btn.addEventListener("click", async () => {
    btn.setAttribute("aria-busy", "true");
    try {
      const ssoPayload = {
        nationalId: "1114785114",
        fullName: "بيان محمد عبدالله آل هاشم",
        dob: "28/4/1999",
        mobile: "0500964481",
      };

      sessionStorage.setItem("ssoPayload", JSON.stringify(ssoPayload));
      window.location.assign("index.html");
    } finally {
      btn.removeAttribute("aria-busy");
    }
  });
}
