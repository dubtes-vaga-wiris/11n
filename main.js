const languageToggle = document.getElementById("languageToggle");

let currentLanguage = "ca";
const translations = {};

async function loadTranslations() {
  const languages = ["ca", "es"];

  await Promise.all(
    languages.map(async (language) => {
      const response = await fetch(`assets/i18n/${language}.json`);

      if (!response.ok) {
        throw new Error(`Could not load ${language} translations`);
      }

      translations[language] = await response.json();
    })
  );
}

function setLanguage(language) {
  currentLanguage = language;

  const translation = translations[language];

  document.documentElement.lang = language;
  document.title = translation.pageTitle;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    const translatedText = translation[key];

    if (translatedText !== undefined) {
      element.innerHTML = translatedText;
    }
  });

  languageToggle.textContent = translation.langButton;
  languageToggle.setAttribute("aria-label", translation.languageLabel);
  languageToggle.setAttribute(
    "aria-pressed",
    language === "es" ? "true" : "false"
  );
}

async function init() {
  await loadTranslations();

  languageToggle.addEventListener("click", () => {
    setLanguage(currentLanguage === "ca" ? "es" : "ca");
  });

  setLanguage("ca");
}

init().catch(console.error);

// -----
// Modal
// -----

const contactModal = document.getElementById("contactModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalClose = document.getElementById("modalClose");

function openContactModal(type) {
  const translation = translations[currentLanguage];

  modalTitle.textContent = translation[`${type}ModalTitle`];
  modalText.textContent = translation[`${type}ModalText`];
  modalClose.textContent = translation.modalClose;

  contactModal.showModal();
}

document.querySelectorAll("[data-modal]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    openContactModal(button.dataset.modal);
  });
});

modalClose.addEventListener("click", () => {
  contactModal.close();
});

contactModal.addEventListener("click", (event) => {
  if (event.target === contactModal) {
    contactModal.close();
  }
});