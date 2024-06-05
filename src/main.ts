import en from "./locales/en.json";

const copyBtn = document.querySelector("#copy");
const copyLabel = document.querySelector("#copy .copy-label");
const langElem = document.querySelector("#lang");
const langIconElem = document.querySelector("#lang .lang-icon");
const langLabelElem = document.querySelector("#lang .lang-label");
const isEn = new URL(location.href).searchParams.get("lang") === "en";
const html = document.documentElement;

const fallback = (text: string) => {
  const isIos = navigator.userAgent.match(/ipad|iphone/i);
  const textarea = document.createElement("textarea");

  // create textarea
  textarea.value = text;

  // ios will zoom in on the input if the font-size is < 16px
  textarea.style.fontSize = "20px";
  document.body.appendChild(textarea);

  // select text
  if (isIos) {
    const range = document.createRange();
    range.selectNodeContents(textarea);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    textarea.setSelectionRange(0, 999999);
  } else {
    textarea.select();
  }

  // copy selection
  document.execCommand("copy");

  // cleanup
  document.body.removeChild(textarea);
};

document.querySelector("#scrolldown")?.addEventListener("click", () => {
  document.querySelector("#main")?.scrollIntoView({
    behavior: "smooth",
  });
});

copyBtn?.addEventListener("click", () => {
  if (!navigator.clipboard) {
    fallback("EUROAMINGO");
    return;
  }

  navigator.clipboard.writeText("EUROAMINGO");

  if (copyLabel) {
    copyLabel.innerHTML = isEn ? "Copied!" : "დაკოპირდა!";
  }
});

copyBtn?.addEventListener("blur", () => {
  if (copyLabel) {
    copyLabel.innerHTML = isEn ? "Copy" : "კოპირება";
  }
});

if (langElem && langIconElem && langLabelElem) {
  if (isEn) {
    html.lang = "en";
    langLabelElem.innerHTML = "Geo";
    langIconElem.classList.add("geo");
    langElem.setAttribute("href", "/");

    document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
      const localeKey = el.getAttribute("data-i18n");

      if (localeKey !== null) {
        el.innerHTML = en[localeKey as keyof typeof en];
      }
    });
  } else {
    langLabelElem.innerHTML = "Eng";
    langIconElem.classList.add("eng");
  }
}

html.classList.add("locales-loaded");
