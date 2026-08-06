let deferredInstallPrompt = null;

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function openInstallHelp() {
  const dialog = document.querySelector("[data-install-dialog]");
  if (!dialog) return;
  dialog.hidden = false;
  document.body.classList.add("install-dialog-open");
  dialog.querySelector("[data-install-close]")?.focus();
}

function closeInstallHelp() {
  const dialog = document.querySelector("[data-install-dialog]");
  if (!dialog) return;
  dialog.hidden = true;
  document.body.classList.remove("install-dialog-open");
}

async function requestInstall() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    document.querySelectorAll("[data-install-app]").forEach((button) => button.hidden = true);
    return;
  }
  openInstallHelp();
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  document.querySelectorAll("[data-install-app]").forEach((button) => button.hidden = false);
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  document.querySelectorAll("[data-install-app]").forEach((button) => button.hidden = true);
  closeInstallHelp();
});

document.addEventListener("DOMContentLoaded", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js", { scope: "/" }).catch(() => {});
  }

  const buttons = document.querySelectorAll("[data-install-app]");
  buttons.forEach((button) => {
    button.addEventListener("click", requestInstall);
    button.hidden = isStandalone() || (!isIos() && !deferredInstallPrompt);
  });

  document.querySelectorAll("[data-install-close]").forEach((button) => button.addEventListener("click", closeInstallHelp));
  document.querySelector("[data-install-dialog]")?.addEventListener("click", (event) => {
    if (event.target.matches("[data-install-dialog]")) closeInstallHelp();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeInstallHelp();
  });

  if (isIos() && !isStandalone()) {
    buttons.forEach((button) => button.hidden = false);
  }
});
