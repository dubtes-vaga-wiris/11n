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

// Open modals
document.querySelectorAll("[data-modal-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const modalId = `modal-${button.dataset.modalOpen}`;
    const modal = document.getElementById(modalId);

    if (!modal) {
      console.error(`Modal not found: ${modalId}`);
      return;
    }

    modal.classList.add("active");
    document.body.classList.add("modal-open");
  });
});

// Close buttons
document.querySelectorAll("[data-modal-close]").forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");

    if (modal) {
      modal.classList.remove("active");
    }

    updateModalScroll();
  });
});

// Close when clicking outside the modal content
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("active");
      updateModalScroll();
    }
  });
});

// Close with Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal.active").forEach((modal) => {
      modal.classList.remove("active");
    });

    updateModalScroll();
  }
});

function updateModalScroll() {
  const hasOpenModal = document.querySelector(".modal.active");
  document.body.classList.toggle("modal-open", !!hasOpenModal);
}