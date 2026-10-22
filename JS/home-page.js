const header = document.querySelector(".header-section");
const introGate = document.querySelector(".intro-gate");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const carousel = document.querySelector(".mid-box-content");
const tpCarousel = document.querySelector(".third-box");

const updateHeaderOnScroll = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 40);
};

const revealSections = document.querySelectorAll(".scroll-reveal");
if (reduceMotion.matches || !("IntersectionObserver" in window)) {
  revealSections.forEach((section) => section.classList.add("is-visible"));
} else {
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealSections.forEach((section) => sectionObserver.observe(section));
}

let gateStarted = false;

const startGateAnimation = () => {
  if (gateStarted) return;
  gateStarted = true;

  if (reduceMotion.matches) {
    introGate.remove();
    return;
  }

  const coverHalves = introGate.querySelectorAll(".intro-gate-half");
  const finishedHalves = new Set();
  let finished = false;
  const finishGateAnimation = () => {
    if (finished) return;
    finished = true;
    window.clearTimeout(gateFallback);
    introGate.remove();
  };
  const gateFallback = window.setTimeout(finishGateAnimation, 3100);
  window.setTimeout(() => document.body.classList.add("page-ready"), 2400);

  coverHalves.forEach((half) => {
    half.addEventListener("transitionend", (event) => {
      if (event.target !== half || event.propertyName !== "transform") return;
      finishedHalves.add(half);
      if (finishedHalves.size === coverHalves.length) finishGateAnimation();
    }, { once: true });
  });

  introGate.classList.add("is-opening");
};

window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
updateHeaderOnScroll();

introGate.addEventListener("click", startGateAnimation);
introGate.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    startGateAnimation();
  }
});

const carouselRing = carousel.querySelector(".mid-box-ring");
const carouselPanels = carouselRing.querySelectorAll(".mid-box-panel");
let carouselRotation = 0;
let carouselIsAnimating = false;

const updateActiveCarouselPanel = () => {
  const activePanelIndex = ((Math.round(-carouselRotation / 90) + 1) % carouselPanels.length
    + carouselPanels.length) % carouselPanels.length;
  carouselPanels.forEach((panel, index) => {
    panel.classList.toggle("is-active", index === activePanelIndex);
  });
};

updateActiveCarouselPanel();

const moveCarousel = (direction) => {
  if (carouselIsAnimating) return;
  carouselIsAnimating = true;
  carousel.classList.add("is-animating");

  carouselRotation += direction === "next" ? -90 : 90;
  carouselRing.style.transform = `rotateY(${carouselRotation}deg)`;
  updateActiveCarouselPanel();

  window.setTimeout(() => {
    carouselIsAnimating = false;
    carousel.classList.remove("is-animating");
  }, reduceMotion.matches ? 20 : 900);
};

document.querySelector(".mid-box-arrow-left").addEventListener("click", () => {
  moveCarousel("previous");
});
document.querySelector(".mid-box-arrow-right").addEventListener("click", () => {
  moveCarousel("next");
});

const tpCarouselTrack = tpCarousel.querySelector(".third-box-track");
const tpCarouselPlay = tpCarousel.querySelector(".third-box-play");
let tpCarouselDirection = null;
let tpCarouselInterval = null;
let tpCarouselIsAnimating = false;
let tpCarouselSelectingImage = false;
let tpCarouselIntentTimeout = null;
let tpCarouselPendingDirection = null;

const moveTpCarousel = (direction, onComplete = () => {}) => {
  if (tpCarouselIsAnimating) return;

  const images = tpCarouselTrack.querySelectorAll("img");
  if (images.length < 2) {
    onComplete();
    return;
  }

  tpCarouselIsAnimating = true;
  const trackStyles = window.getComputedStyle(tpCarouselTrack);
  const gap = parseFloat(trackStyles.columnGap);
  const step = images[0].getBoundingClientRect().width + gap;
  let fallbackTimeout;
  const onTransitionEnd = (event) => {
    if (event.target === tpCarouselTrack && event.propertyName === "transform") finish();
  };
  const finish = () => {
    if (!tpCarouselIsAnimating) return;
    tpCarouselTrack.removeEventListener("transitionend", onTransitionEnd);
    window.clearTimeout(fallbackTimeout);
    if (direction === "right") {
      tpCarouselTrack.append(tpCarouselTrack.firstElementChild);
    }
    tpCarouselTrack.style.transition = "none";
    tpCarouselTrack.style.transform = "translateX(0)";
    void tpCarouselTrack.offsetWidth;
    tpCarouselTrack.style.transition = "";
    tpCarouselIsAnimating = false;
    onComplete();
  };

  if (direction === "left") {
    tpCarouselTrack.prepend(tpCarouselTrack.lastElementChild);
    tpCarouselTrack.style.transition = "none";
    tpCarouselTrack.style.transform = `translateX(${-step}px)`;
    void tpCarouselTrack.offsetWidth;
    tpCarouselTrack.style.transition = "";
  }

  tpCarouselTrack.addEventListener("transitionend", onTransitionEnd);
  fallbackTimeout = window.setTimeout(finish, reduceMotion.matches ? 50 : 1100);
  tpCarouselTrack.style.transform = direction === "right"
    ? `translateX(${-step}px)`
    : "translateX(0)";
};

const centerTpCarouselImage = (image) => {
  if (tpCarouselSelectingImage) return;

  tpCarouselSelectingImage = true;
  window.clearTimeout(tpCarouselIntentTimeout);
  tpCarouselIntentTimeout = null;
  tpCarouselPendingDirection = null;
  setTpCarouselDirection(null);

  const centerIndex = Math.floor(tpCarouselTrack.children.length / 2);
  const moveSelectedImageToCenter = () => {
    if (tpCarouselIsAnimating) {
      window.setTimeout(moveSelectedImageToCenter, 50);
      return;
    }

    const imageIndex = Array.from(tpCarouselTrack.children).indexOf(image);
    if (imageIndex === centerIndex) {
      image.classList.remove("is-centering");
      void image.offsetWidth;
      image.classList.add("is-centering");
      tpCarouselSelectingImage = false;
      return;
    }

    moveTpCarousel(imageIndex > centerIndex ? "right" : "left", moveSelectedImageToCenter);
  };

  moveSelectedImageToCenter();
};

tpCarouselTrack.addEventListener("click", (event) => {
  const image = event.target instanceof Element ? event.target.closest("img") : null;
  if (image && tpCarouselTrack.contains(image)) centerTpCarouselImage(image);
});

tpCarouselPlay.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.assign("Team.html#team-members");
});

const setTpCarouselDirection = (direction) => {
  if (direction === tpCarouselDirection) return;
  tpCarouselDirection = direction;
  window.clearInterval(tpCarouselInterval);
  tpCarouselInterval = null;

  if (direction) {
    moveTpCarousel(direction);
    tpCarouselInterval = window.setInterval(
      () => moveTpCarousel(direction),
      reduceMotion.matches ? 1500 : 1800,
    );
  }
};

const requestTpCarouselDirection = (direction) => {
  if (!direction) {
    window.clearTimeout(tpCarouselIntentTimeout);
    tpCarouselIntentTimeout = null;
    tpCarouselPendingDirection = null;
    setTpCarouselDirection(null);
    return;
  }

  if (direction === tpCarouselDirection || direction === tpCarouselPendingDirection) return;

  window.clearTimeout(tpCarouselIntentTimeout);
  setTpCarouselDirection(null);
  tpCarouselPendingDirection = direction;
  tpCarouselIntentTimeout = window.setTimeout(() => {
    tpCarouselIntentTimeout = null;
    tpCarouselPendingDirection = null;
    setTpCarouselDirection(direction);
  }, 650);
};

tpCarousel.addEventListener("pointermove", (event) => {
  if (event.pointerType === "touch" || tpCarouselSelectingImage) return;
  const bounds = tpCarousel.getBoundingClientRect();
  const position = event.clientX - bounds.left;
  const direction = position <= bounds.width * 0.25
    ? "left"
    : position >= bounds.width * 0.75
      ? "right"
      : null;
  requestTpCarouselDirection(direction);
});

tpCarousel.addEventListener("pointerleave", () => {
  requestTpCarouselDirection(null);
});

document.querySelector("[data-scroll-top]").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: reduceMotion.matches ? "instant" : "smooth",
  });
});

const prayerBox = document.querySelector(".fourth-box");
const prayerCurtainTrigger = prayerBox.querySelector(".fourth-box-curtain-trigger");

prayerCurtainTrigger.addEventListener("click", () => {
  prayerBox.classList.add("is-opening");
  prayerCurtainTrigger.disabled = true;
});

const locationDialog = document.querySelector(".front-location-dialog");
const locationTrigger = document.querySelector(".front-location-trigger");
const locationClose = locationDialog.querySelector(".front-location-close");
const locationMapElement = document.querySelector("#front-location-map");
let locationCloseTimer;
let locationMap;

const initializeLocationMap = () => {
  if (locationMap) {
    locationMap.invalidateSize();
    return;
  }

  if (!window.L) {
    console.error("The location map could not load because the map library is unavailable.");
    locationMapElement.textContent = "The map could not be loaded. Please check your internet connection and try again.";
    return;
  }

  const coordinates = [13.883698158802721, 120.9133764205911];
  const markerIcon = window.L.divIcon({
    className: "front-location-leaflet-icon",
    html: '<span class="front-location-marker"><span class="front-location-marker-shape"><img src="images/branding/SPDY%20LOGO.png" alt=""></span></span>',
    iconSize: [56, 70],
    iconAnchor: [28, 70],
  });
  const memberLocations = [
    { name: "MP1", coordinates: [13.849321870446255, 120.91741058631031], image: "images/MP1-L.jpg" },
    { name: "MP2", coordinates: [13.877003430511047, 120.91535987698552], image: "images/MP2-L.jpg" },
    { name: "MP3", coordinates: [13.938742803292746, 120.81699329617732], image: "images/MP3-L.jpg" },
    { name: "MP4", coordinates: [13.879384934140203, 120.95148362584057], image: "images/MP4-L.jpg" },
    { name: "MP5", coordinates: [13.933047545419353, 120.86475023245707], image: "images/MP5-L.jpg" },
    { name: "MP6", coordinates: [13.883327762348083, 120.93624779542883], image: "images/MP6-L.avif" },
    { name: "MP7", coordinates: [13.884487925780345, 120.9236234251789], image: "images/MP7-L.jpg" },
  ];

  locationMap = window.L.map(locationMapElement).fitBounds(
    [coordinates, ...memberLocations.map(({ coordinates: memberCoordinates }) => memberCoordinates)],
    { padding: [48, 48], maxZoom: 15 },
  );
  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(locationMap);
  window.L.marker(coordinates, {
    icon: markerIcon,
    title: "SPDY location",
    alt: "SPDY location",
    keyboard: true,
  }).addTo(locationMap);
  memberLocations.forEach(({ name, coordinates: memberCoordinates, image }) => {
    const memberIcon = window.L.divIcon({
      className: "front-location-leaflet-icon front-location-member-icon",
      html: `<span class="front-location-marker front-location-member-marker"><span class="front-location-marker-shape"><img src="${image}" alt=""></span></span>`,
      iconSize: [44, 56],
      iconAnchor: [22, 56],
    });

    window.L.marker(memberCoordinates, {
      icon: memberIcon,
      title: `${name} location`,
      alt: `${name} location`,
      keyboard: true,
    }).addTo(locationMap);
  });
  window.setTimeout(() => locationMap.invalidateSize(), 460);
};

const closeLocationDialog = () => {
  if (!locationDialog.open) return;
  locationDialog.classList.remove("is-open");
  window.clearTimeout(locationCloseTimer);
  locationCloseTimer = window.setTimeout(
    () => locationDialog.close(),
    reduceMotion.matches ? 0 : 460,
  );
};

locationTrigger.addEventListener("click", () => {
  window.clearTimeout(locationCloseTimer);
  locationDialog.showModal();
  window.requestAnimationFrame(() => {
    locationDialog.classList.add("is-open");
    initializeLocationMap();
  });
});

locationClose.addEventListener("click", closeLocationDialog);
locationDialog.addEventListener("click", (event) => {
  if (event.target === locationDialog) closeLocationDialog();
});
locationDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeLocationDialog();
});
locationDialog.addEventListener("close", () => {
  locationDialog.classList.remove("is-open");
});
