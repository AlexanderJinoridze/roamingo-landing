import en from "./locales/en.json";

const nextSlideBtn = document.querySelector("#next-slide-btn");
const nextSlideBtnIcon = document.querySelector("#next-btn-icon");
const nextSlideBtnLabel = nextSlideBtn?.querySelector("span") ?? null;
const guideSlider = document.querySelector("#guide-slider");
const guideSlides = guideSlider?.querySelectorAll<HTMLElement>(".guide-item");
const copyBtn = document.querySelector("#copy");
const copyLabel = document.querySelector("#copy .copy-label");
const langElem = document.querySelector("#lang");
const langIconElem = document.querySelector("#lang .lang-icon");
const langLabelElem = document.querySelector("#lang .lang-label");
const isEn = new URL(location.href).searchParams.get("lang") === "en";
const html = document.documentElement;

let slideId = 0;

nextSlideBtn?.addEventListener("click", (e) => {
  slideId += 1;

  if (slideId > 3) {
    slideId = 0;
  }

  if (nextSlideBtnLabel) {
    if (slideId === 3) {
      nextSlideBtnLabel.innerHTML = isEn ? "Return" : "ახლიდან";
      nextSlideBtnIcon?.classList.add("refresh-icon");
      nextSlideBtnIcon?.classList.remove("arrow-icon");
    } else {
      nextSlideBtnLabel.innerHTML = isEn ? "Next" : "შემდეგი";
      nextSlideBtnIcon?.classList.remove("refresh-icon");
      nextSlideBtnIcon?.classList.add("arrow-icon");
    }
  }

  if (guideSlides) {
    guideSlides.forEach((el) => {
      el.style.transform = `translate(-${slideId * 100}%, 0%) scale(0.9)`;
      el.classList.remove("active");
    });
  }

  const activeSlide = guideSlider?.querySelector<HTMLElement>(
    `.guide-item:nth-of-type(${slideId + 1})`
  );

  if (activeSlide) {
    activeSlide.style.transform = `translate(-${slideId * 100}%, 0%) scale(1)`;
    activeSlide.classList.add("active");
  }
});

const fallback = (text: string) => {
  const isIos = navigator.userAgent.match(/ipad|iphone/i);
  const textarea = document.createElement("textarea");

  textarea.value = text;
  textarea.style.fontSize = "20px";
  document.body.appendChild(textarea);

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

  document.execCommand("copy");

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

    if (copyLabel) {
      copyLabel.innerHTML = isEn ? "Copied!" : "დაკოპირდა!";
    }

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
