"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

/* for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener("click", openModal); */

//rewriting the for loop with forEach() that applies a certain function for every btn
btnsOpenModal.forEach((el) => {
  el.addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

const cookieMsg = document.createElement("div");
cookieMsg.classList.add("cookie-message");
const header = document.querySelector("header");
const footer = document.querySelector("footer");
cookieMsg.innerHTML =
  "We use cookies to improve functionality and usability, we appreciate your understanding.<button class = 'btn' id='btn--cookies'>Gotcha!!</button>";
footer.append(cookieMsg); // Now it works!

const cookieBtn = document.getElementById("btn--cookies");
cookieBtn.addEventListener("click", (el) => {
  el.target.parentElement.remove();
});

const btnScrollTo = document.querySelector(".btn--scroll-to");
const sectionOne = document.querySelector("#section--1");
btnScrollTo.addEventListener("click", (e) => {
  //the old way of applying smooth scrolling
  /*   const s1coords = sectionOne.getBoundingClientRect();
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: "smooth",
  }); */
  //A more modern way would be to apply this
  sectionOne.scrollIntoView({ behavior: "smooth" });
});

const navBar = document.querySelector(".nav");

navBar.addEventListener("click", function (el) {
  const target = el.target;

  // Check if the clicked element is a nav link
  if (target.classList.contains("nav__link")) {
    el.preventDefault(); // Stop default anchor behavior

    const href = target.getAttribute("href");
    if (href.startsWith("#")) {
      const section = document.querySelector(href);
      section.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Scroll to top if logo is clicked
  if (target.classList.contains("nav__logo")) {
    el.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

const tabContainer = document.querySelector(".operations__tab-container");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContent = document.querySelectorAll(".operations__content");

tabContainer.addEventListener("click", (ev) => {
  const myTarget = ev.target.closest(".operations__tab");

  // Guard clause
  if (!myTarget) return;

  // Remove active class from all tabs
  tabs.forEach((tab) => {
    tab.classList.remove("operations__tab--active");
  });
  tabsContent.forEach((tab) => {
    tab.classList.remove("operations__content--active");
  });

  // Add active class to clicked tab
  myTarget.classList.add("operations__tab--active");

  // Activate corresponding content area
  document
    .querySelector(`.operations__content--${myTarget.dataset.tab}`)
    .classList.add("operations__content--active");
});

//Adding obesity to nav section
navBar.addEventListener("mouseover", (ev) => {
  const target = ev.target;

  if (!target.classList.contains("nav__link")) return;

  const children = target.closest("nav").querySelectorAll(".nav__link");
  children.forEach((child) => {
    if (child !== target) {
      child.style.opacity = 0.5;
    }
  });
});

navBar.addEventListener("mouseout", (ev) => {
  const target = ev.target;

  if (!target.classList.contains("nav__link")) return;

  const children = target.closest("nav").querySelectorAll(".nav__link");
  children.forEach((child) => {
    if (child !== target) {
      child.style.opacity = 1;
    }
  });
});

//Making the Nav bar sticky using intersection observer API
document.addEventListener("DOMContentLoaded", () => {
  console.log("JS is running");
  if (window.innerWidth <= 768) {
    document.querySelector(".nav").classList.remove("sticky");
  }

  const header = document.querySelector(".header");
  const nav = document.querySelector(".nav");

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        console.log("Sticky applied");
        nav.classList.add("sticky");
      } else {
        console.log("Sticky removed");
        nav.classList.remove("sticky");
      }
    },
    {
      root: null,
      threshold: 0,
      rootMargin: "-80px",
    }
  );

  observer.observe(header);
});

//loading the sections just a little bit later than normal using intersection observer

function obsSections(entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target); // optional: stop observing after reveal
  });
}

const sections = document.querySelectorAll(".section");

const sectionObserver = new IntersectionObserver(obsSections, {
  root: null, // viewport
  threshold: 0.15, // fire when 15% of the element is visible
});

// Add the hidden class and observe
sections.forEach((section) => {
  section.classList.add("section--hidden");
  sectionObserver.observe(section);
});

//lazy loading images
const imgTargets = document.querySelectorAll("img[data-src]");
//console.log(imgTargets);

//create the image observer
function imgObserverFn(entries, observer) {
  let [entry] = entries;
  /*   console.log(entry); */
  if (!entry.isIntersecting) return;

  //replace the src attribute with the data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", (ev) => {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(imgObserverFn, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});
//loop over images and add the observer
imgTargets.forEach((img) => imgObserver.observe(img));

//slider
const slides = document.querySelectorAll(".slide");
const sliderBtnRight = document.querySelector(".slider__btn--right");
const sliderBtnLeft = document.querySelector(".slider__btn--left");
const maxSlide = slides.length - 1;
const dotsDiv = document.querySelector(".dots");
let currentSlide = 0;

//dots sliding
for (let i = 0; i <= maxSlide; i++) {
  dotsDiv.insertAdjacentHTML(
    "beforeend",
    `<button class='dots__dot' data-slide="${i}"></button>`
  );
}

const dotBtns = document.querySelectorAll(".dots__dot");
dotBtns.forEach((dot, i) => {
  dot.classList.remove("dots__dot--active");
  if (dot.dataset.slide == 0) dot.classList.add("dots__dot--active");
});

dotsDiv.addEventListener("click", (ev) => {
  let slideNum = ev.target.dataset.slide;
  goToSlide(slideNum);
  dotBtns.forEach((dot, i) => {
    dot.classList.remove("dots__dot--active");
  });
  ev.target.classList.add("dots__dot--active");
});

const goToSlide = function (slideIndex) {
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${100 * (index - slideIndex)}%)`;
  });
};
slides.forEach((slide, index) => {
  slide.style.transform = `translateX(${100 * index}%)`;
});
sliderBtnRight.addEventListener("click", () => {
  currentSlide = currentSlide === maxSlide ? 0 : currentSlide + 1;
  goToSlide(currentSlide);
  dotBtns.forEach((dot, i) => {
    dot.classList.remove("dots__dot--active");
    if (dot.dataset.slide == currentSlide)
      dot.classList.add("dots__dot--active");
  });
});
sliderBtnLeft.addEventListener("click", () => {
  currentSlide = currentSlide === 0 ? maxSlide : currentSlide - 1;
  goToSlide(currentSlide);
  dotBtns.forEach((dot, i) => {
    dot.classList.remove("dots__dot--active");
    if (dot.dataset.slide == currentSlide)
      dot.classList.add("dots__dot--active");
  });
});
