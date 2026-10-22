const showcase = document.querySelector(".team-showcase");
const artTrack = showcase.querySelector(".team-showcase-art-track");
let currentArt = showcase.querySelector(".team-showcase-art-current");
let nextArt = showcase.querySelector(".team-showcase-art-next");
const memberName = showcase.querySelector(".team-showcase-member-name");
const spiderName = showcase.querySelector(".team-showcase-spider");
const ageBirthday = showcase.querySelector(".team-showcase-birthday-text");
const course = showcase.querySelector(".team-showcase-course");
const socialLinks = showcase.querySelector(".team-showcase-socials");
const memberButtons = document.querySelectorAll(".team-member-button");
const memberStrip = document.querySelector(".team-member-strip");
const memberProfile = document.querySelector(".team-member-profile");
const header = document.querySelector(".header-section");
const memberPfp = showcase.querySelector(".team-showcase-mp1-pfp");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const artTransitionDuration = 700;
const pfpExitDuration = 380;

let stripTimer;
let animationFrame;
let memberChangeTimer;
let pfpSwapTimer;
let pfpExitStartedAt = 0;
let artTransitionTimer;
let artTransitionFrame;
let selectionToken = 0;
let artTransitionActive = false;
let hangingArtworkResizeObserver;
let profileRevealObserver;

const memberProfiles = {
  0: {
    hobbies: "I love sleeping, listening to music, and playing games.",
    hobbyArt: ["MP-1-H1.jpg", "MP-1-H2.jpg", "MP-1-H3.jpg"],
    course: "Engineering",
    goals: "My dream is to travel the world.",
    facts: ["I sleep at 1:00 PM.", "My favorite color is blue.", "Sisig is my favorite food."],
    favorite: "Miles Morales is my favorite Spider-Man because he is brave, creative, and always willing to protect the people he loves. I admire how he learns to believe in himself and embrace his own unique abilities. His story reminds me that anyone can be a hero, no matter where they come from.",
    favoriteName: "MILES MORALES",
    favoriteArt: "images/member-artwork/MP-1-C.jpg",
    pfp: "images/MP1-PFP.png",
    courseArt: "images/MP1-F.jpg",
    courseArtAlt: "Miles Morales with friends at a pool",
    factsArt: "images/MP1-H.jpg",
    factsArtAlt: "Miles Morales playing billiards",
    motto: "Life is quite unexpected, you'll never know what could happen next",
    socials: {
      facebook: "https://www.facebook.com/jeremy.balatan.7",
      instagram: "https://www.instagram.com/itsurboy_emy/"
    },
    music: {
      video: "images/MP1-MUSIC.mp4",
      cover: "images/MP1-MUSICP.png",
      title: "Raining in Manila",
      artist: "Lola Amour"
    }
  },
  1: {
    hobbies: "Listening to music, exploring and learning new things, and cleaning.",
    hobbyArt: ["MP-2-H1.jpg", "MP-2-H2.jpg", "MP-2-H3.jpg"],
    course: "Civil Engineering",
    goals: "Be successful and rich, but also build a family at the perfect time.",
    facts: ["I hate coffee.", "I'm quiet when you first meet me; when I'm comfortable, I can be too loud.", "I love cleaning."],
    favorite: "My favorite character is Gwen Stacy. I like her costume; she's unique in her own way and true to herself, which makes her independent.",
    favoriteArt: "images/member-artwork/MP-2-C.jpg",
    pfp: "images/MP2-PFP.png",
    courseArt: "images/MP2-F.jpg",
    courseArtAlt: "Precious Lianna Diokno with friends",
    factsArt: "images/MP2-H.jpg",
    factsArtAlt: "Precious Lianna Diokno",
    motto: "Love the life you live, live the life you love",
    socials: {
      facebook: "https://www.facebook.com/lyana.dkno",
      instagram: "https://www.instagram.com/lyanadkn_/"
    },
    music: {
      video: "images/MP2-MUSIC.mp4",
      cover: "images/MP2-MUSICP.jpg",
      title: "All I Want Is You (feat. J. Cole)",
      artist: "Miguel"
    }
  },
  2: {
    hobbies: "I enjoy going out and trying different restaurants to taste new food.",
    hobbyArt: ["MP-3-H1.jpg", "MP-3-H2.jpg", "MP-3-H3.jpg"],
    course: "Nursing",
    goals: "My dream is to become rich, own many businesses, and live a successful life.",
    facts: ["I can sleep anytime.", "I'm clingy with people I'm close to.", "I get angry easily."],
    favorite: "My favorite character is Peni Parker because she is cute, cool, and different from other Spider-Man characters. I love that she has her robot to help her fight.",
    favoriteArt: "images/member-artwork/MP-3-C.jpg",
    pfp: "images/MP3-PFP.png",
    courseArt: "images/MP3-F.jpg",
    courseArtAlt: "Alexley Atienza",
    factsArt: "images/MP3-H.jpg",
    factsArtAlt: "Alexley Atienza",
    motto: "i can and i will",
    socials: {
      facebook: "https://www.facebook.com/alexley.atienza.2025",
      instagram: "https://www.instagram.com/atnzalx/"
    },
    music: {
      video: "images/MP3-MUSIC.mp4",
      cover: "images/MP3-MUSICP.jpg",
      title: "Wicked Games",
      artist: "The Weeknd"
    }
  },
  3: {
    hobbies: "Cooking, baking, drawing, graffiti, and playing online games.",
    hobbyArt: ["MP-4-H1.jpg", "MP-4-H2.jpg", "MP-4-H3.jpg"],
    course: "Medtech",
    goals: "To have a passion for what I truly love and be successful.",
    facts: ["I'm mixed: Chinese, Korean, and Filipino.", "My favorite color is purple.", "My favorite pastry to bake is cinnamon rolls."],
    favorite: "I chose Spider-Punk because I love his style and mantra. I would also like to have his style of clothing and way of speaking because I think it's so cool. I love doing graffiti too, so it just makes sense that he's my favorite Spider-Man.",
    favoriteArt: "images/member-artwork/MP-4-C.jpg",
    pfp: "images/MP4-PFP.png",
    courseArt: "images/MP4-F.jpg",
    courseArtAlt: "Haena Marasigan",
    factsArt: "images/MP4-H.jpg",
    factsArtAlt: "Haena Marasigan",
    motto: "receive without clinging; let go without regret.",
    socials: {
      facebook: "https://www.facebook.com/haenawoo28",
      instagram: "https://www.instagram.com/h._ena.__/"
    },
    music: {
      video: "images/MP4-MUSIC.mp4",
      cover: "images/MP4-MUSICP.jpg",
      title: "Special",
      artist: "SZA"
    }
  },
  4: {
    hobbies: "Playing volleyball, playing guitar, and listening to music.",
    hobbyArt: ["MP-5-H1.jpg", "MP-5-H2.jpg", "MP-5-H3.jpg"],
    course: "Information Technology",
    goals: "My dream is to succeed in life so I can treat my parents wherever they want to go and help people in need.",
    facts: ["I'm a fast learner.", "I don't love sauces.", "I play chess and solve Rubik's cubes."],
    favorite: "My favorite character is Spider-Man 2099 because of his strength, intelligence, and determination to protect the multiverse. Despite the heavy responsibilities he carries, he continues to fight for what he believes is right. I admire how he stays focused on his goals and is willing to make difficult decisions to protect others.",
    favoriteArt: "images/member-artwork/MP-5-C.jpg",
    pfp: "images/MP5-PFP.png",
    courseArt: "images/MP5-F.jpg",
    courseArtAlt: "Algren Comcom",
    factsArt: "images/MP5-H.jpg",
    factsArtAlt: "Algren Comcom",
    motto: "It is not you against other people; it is you against you.",
    socials: {
      facebook: "https://www.facebook.com/algrennathan.comcom",
      instagram: "https://www.instagram.com/grenwich_/"
    },
    music: {
      video: "images/MP5-MUSIC.mp4",
      cover: "images/MP5-MUSICP.jpg",
      title: "Sunflower",
      artist: "Post Malone, Swae Lee"
    }
  },
  5: {
    hobbies: "Reading, sleeping, photography, and playing basketball.",
    hobbyArt: ["MP-6-H1.jpg", "MP-6-H2.jpg", "MP-6-H3.jpg"],
    course: "Psychology",
    goals: "My dream is to give back to my family someday and have a stable future. My current goal is to graduate from senior high school with good grades, improve myself, and gain confidence.",
    facts: ["I can sleep anytime, anywhere.", "I get attached to people easily.", "I joined the basketball team with zero skills, but learned something new."],
    favorite: "My favorite character is Spider-Man Noir because of his dark aesthetic, vintage look, serious personality, sarcastic humor, and connection to photography and detective work.",
    favoriteArt: "images/member-artwork/MP-6-C.jpg",
    pfp: "images/MP6-PFP.png",
    courseArt: "images/MP6-F.jpg",
    courseArtAlt: "Rhonna Atienza",
    factsArt: "images/MP6-H.jpg",
    factsArtAlt: "Rhonna Atienza",
    motto: "leave the past, live for tomorrow",
    socials: {
      facebook: "https://www.facebook.com/rm.atienza.21#",
      instagram: "https://www.instagram.com/qrinzyx/"
    },
    music: {
      video: "images/MP6-MUSIC.mp4",
      cover: "images/MP6-MUSICP.jpg",
      title: "Fallen Star",
      artist: "The Neighbourhood"
    }
  },
  6: {
    hobbies: "I love sleeping, playing basketball, and playing games.",
    hobbyArt: ["MP-7-H1.jpg", "MP-7-H2.jpg", "MP-7-H3.jpg"],
    course: "Seaman",
    goals: "My dream is to travel the world.",
    facts: [
      "I love spending time with my friends.",
      "I enjoy learning new things.",
      "I have big dreams for my future."
    ],
    favorite: "Spider-Ham is one of my favorite Spider-Man characters because he is funny, playful, and full of personality. I love how he brings humor and fun to every situation while still being a hero. He shows that even in the middle of chaos, you can face challenges with courage and a smile.",
    favoriteName: "Spider-Ham",
    favoriteArt: "images/member-artwork/MP-7-C.jpg",
    pfp: "images/MP7-PFP.png",
    courseArt: "images/MP7-F.jpg",
    courseArtAlt: "Santino Almazan",
    factsArt: "images/MP7-H.jpg",
    factsArtAlt: "Santino Almazan",
    motto: "Dream big, work hard, stay humble, and never give up.",
    socials: {
      facebook: "https://www.facebook.com/santinomartin.almazan",
      instagram: "https://www.instagram.com/itzz_onits/"
    },
    music: {
      video: "images/MP7-MUSIC.mp4",
      cover: "images/MP7-MUSICP.jpg",
      title: "Syempre",
      artist: "Willie Revillame"
    }
  }
};

const escapeMarkup = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[character]);

const setupProfileScrollReveal = () => {
  profileRevealObserver?.disconnect();
  profileRevealObserver = undefined;

  const profileGrid = memberProfile.querySelector(".profile-detail-grid");
  const revealItems = profileGrid ? [...profileGrid.children] : [];
  if (revealItems.length === 0) return;

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-profile-revealed"));
    return;
  }

  revealItems.forEach((item, index) => {
    item.classList.add("profile-scroll-reveal");
    item.style.setProperty("--profile-reveal-delay", `${Math.min(index * 50, 150)}ms`);
  });

  profileRevealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-profile-revealed");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });

  revealItems.forEach((item) => profileRevealObserver.observe(item));
};

const setupHangingArtwork = (hobbiesSection, prefix) => {
  const hanger = hobbiesSection.querySelector(`.${prefix}-hanging-art`);
  const stringSvg = hobbiesSection.querySelector(`.${prefix}-hanging-string`);
  const stringPath = stringSvg?.querySelector("path");
  const stringLine = stringSvg?.querySelector("line");
  const anchor = hobbiesSection.querySelector(`.${prefix}-hanging-anchor`);
  if (!hanger || !stringSvg || (!stringPath && !stringLine) || !anchor) return;
  const quote = prefix === "mp1" || prefix === "mp2" || prefix === "mp3" || prefix === "mp4" || prefix === "mp5" || prefix === "mp6" || prefix === "mp7"
    ? hobbiesSection.querySelector(`.${prefix}-hanging-quote`)
    : null;

  let anchorX;
  let pointerMoved = false;
  let sectionWidth = 0;
  let sectionHeight = 0;
  let hangerWidth = 0;
  const anchorRatio = prefix === "mp1" ? 0.18 : prefix === "mp4" ? 0.9 : prefix === "mp2" || prefix === "mp5" || prefix === "mp7" ? 0.82 : prefix === "mp3" ? 0.2 : prefix === "mp6" ? 0.1 : 0.88;
  const getAnchorX = (width) => prefix === "mp3"
    ? hangerWidth / 2 + 104
    : width * anchorRatio;
  const restLength = prefix === "mp1" || prefix === "mp2" || prefix === "mp4" || prefix === "mp5" || prefix === "mp7" ? 160 : 64;
  let ropeLength = restLength;
  let radialVelocity = 0;
  let angle;
  let angularVelocity = 0;
  let animationFrame;
  let previousFrameTime;
  const maxSwingAngle = Math.PI * 0.49;

  const refreshLayoutBounds = () => {
    const sectionBounds = hobbiesSection.getBoundingClientRect();
    sectionWidth = sectionBounds.width;
    sectionHeight = sectionBounds.height;
    hangerWidth = hanger.offsetWidth;
    anchorX = getAnchorX(sectionWidth);
  };

  const updateHangingString = (hangerX, hangerY) => {
    stringSvg.setAttribute("viewBox", `0 0 ${sectionWidth} ${sectionHeight}`);
    stringSvg.setAttribute("width", String(sectionWidth));
    stringSvg.setAttribute("height", String(sectionHeight));
    if (stringPath) {
      const deltaX = hangerX - anchorX;
      const deltaY = hangerY;
      const distance = Math.max(1, Math.hypot(deltaX, deltaY));
      const bend = hanger.classList.contains("is-dragging")
        ? Math.max(-54, Math.min(54, deltaX * 0.16 + angularVelocity * 5))
        : 0;
      const normalX = -deltaY / distance;
      const normalY = deltaX / distance;
      const firstControlX = anchorX + deltaX / 3 + normalX * bend;
      const firstControlY = deltaY / 3 + normalY * bend;
      const secondControlX = anchorX + deltaX * 2 / 3 + normalX * bend * 0.35;
      const secondControlY = deltaY * 2 / 3 + normalY * bend * 0.35;
      stringPath.setAttribute("d", `M ${anchorX} 0 C ${firstControlX} ${firstControlY}, ${secondControlX} ${secondControlY}, ${hangerX} ${hangerY}`);
    } else {
      stringLine.setAttribute("x1", String(anchorX));
      stringLine.setAttribute("y1", "0");
      stringLine.setAttribute("x2", String(hangerX));
      stringLine.setAttribute("y2", String(hangerY));
    }
    anchor.setAttribute("cx", String(anchorX));
    anchor.setAttribute("cy", "0");
  };

  const positionHanger = () => {
    const hangerX = anchorX + ropeLength * Math.sin(angle);
    const hangerY = ropeLength * Math.cos(angle);
    const maxLeft = Math.max(0, sectionWidth - hangerWidth);
    const clampedLeft = Math.min(maxLeft, Math.max(0, hangerX - hangerWidth / 2));
    const clampedTop = Math.max(24, hangerY);
    hanger.style.left = `${clampedLeft}px`;
    hanger.style.top = `${clampedTop}px`;
    hanger.style.right = "auto";
    hanger.style.transform = `rotate(${angle * 0.35}rad)`;
    updateHangingString(clampedLeft + hangerWidth / 2, clampedTop);
  };

  const stopSwing = () => {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = undefined;
    previousFrameTime = undefined;
  };

  const swing = (time) => {
    if (hanger.classList.contains("is-dragging")) return;
    if (previousFrameTime === undefined) previousFrameTime = time;
    const deltaTime = Math.min((time - previousFrameTime) / 1000, 0.032);
    previousFrameTime = time;

    const gravity = 1100;
    const damping = 3.4;
    const acceleration = -(gravity / ropeLength) * Math.sin(angle) - damping * angularVelocity;
    angularVelocity += acceleration * deltaTime;
    angle += angularVelocity * deltaTime;

    if (prefix === "mp1" || prefix === "mp2") {
      const stretch = ropeLength - restLength;
      radialVelocity += (-stretch * 32 - radialVelocity * 12) * deltaTime;
      ropeLength += radialVelocity * deltaTime;
      ropeLength = Math.max(90, Math.min(420, ropeLength));
    }

    if (Math.abs(angle) > maxSwingAngle) {
      angle = Math.sign(angle) * maxSwingAngle;
      angularVelocity *= -0.35;
    }
    if (
      Math.abs(angle) < 0.002
      && Math.abs(angularVelocity) < 0.015
      && Math.abs(ropeLength - restLength) < 0.5
      && Math.abs(radialVelocity) < 1
    ) {
      angle = 0;
      angularVelocity = 0;
      ropeLength = restLength;
      radialVelocity = 0;
      positionHanger();
      stopSwing();
      hobbiesSection.classList.remove("is-hanging-art-raised");
      return;
    }

    positionHanger();
    animationFrame = window.requestAnimationFrame(swing);
  };

  const startSwing = () => {
    stopSwing();
    animationFrame = window.requestAnimationFrame(swing);
  };

  const toggleQuote = () => {
    if (!quote) return;
    if (quote.open) {
      quote.close();
      return;
    }
    quote.showModal();
    hanger.setAttribute("aria-expanded", "true");
  };

  quote?.querySelector(`.${prefix}-hanging-quote-close`)?.addEventListener("click", () => quote.close());
  quote?.addEventListener("close", () => hanger.setAttribute("aria-expanded", "false"));
  quote?.addEventListener("click", (event) => {
    if (event.target === quote) quote.close();
  });

  refreshLayoutBounds();
  angle = 0;
  positionHanger();

  hanger.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    stopSwing();
    hanger.setPointerCapture(event.pointerId);
    hanger.dataset.dragX = String(event.clientX);
    hanger.dataset.dragY = String(event.clientY);
    pointerMoved = false;
    hanger.dataset.dragOffsetX = String(ropeLength * Math.sin(angle));
    hanger.dataset.dragOffsetY = String(ropeLength * Math.cos(angle));
    hanger.dataset.previousTime = String(event.timeStamp);
    hanger.dataset.previousAngle = String(angle);
    hanger.dataset.previousLength = String(ropeLength);
    hobbiesSection.classList.add("is-hanging-art-raised");
    hanger.classList.add("is-dragging");
  });

  hanger.addEventListener("pointermove", (event) => {
    if (!hanger.hasPointerCapture(event.pointerId)) return;
    if (Math.hypot(
      event.clientX - Number(hanger.dataset.dragX),
      event.clientY - Number(hanger.dataset.dragY)
    ) > 5) pointerMoved = true;
    const offsetX = Number(hanger.dataset.dragOffsetX)
      + event.clientX - Number(hanger.dataset.dragX);
    const offsetY = Math.max(30, Number(hanger.dataset.dragOffsetY)
      + event.clientY - Number(hanger.dataset.dragY));
    const nextLength = Math.max(90, Math.min(420, Math.hypot(offsetX, offsetY)));
    const nextAngle = Math.max(-maxSwingAngle, Math.min(
      maxSwingAngle,
      Math.atan2(offsetX, offsetY)
    ));
    const previousAngle = Number(hanger.dataset.previousAngle);
    const previousLength = Number(hanger.dataset.previousLength);
    const previousTime = Number(hanger.dataset.previousTime);
    const elapsed = Math.max(0.016, (event.timeStamp - previousTime) / 1000);
    angularVelocity = Math.max(-8, Math.min(8, (nextAngle - previousAngle) / elapsed));
    radialVelocity = Math.max(-700, Math.min(700, (nextLength - previousLength) / elapsed));
    angle = nextAngle;
    ropeLength = nextLength;
    hanger.dataset.previousAngle = String(nextAngle);
    hanger.dataset.previousLength = String(nextLength);
    hanger.dataset.previousTime = String(event.timeStamp);
    positionHanger();
  });

  const finishDragging = (event) => {
    if (hanger.hasPointerCapture(event.pointerId)) hanger.releasePointerCapture(event.pointerId);
    hanger.classList.remove("is-dragging");
    positionHanger();
    startSwing();
  };
  hanger.addEventListener("pointerup", finishDragging);
  hanger.addEventListener("pointercancel", finishDragging);
  hanger.addEventListener("click", () => {
    if (pointerMoved) {
      pointerMoved = false;
      return;
    }
    toggleQuote();
  });
  hanger.addEventListener("lostpointercapture", () => {
    if (!hanger.classList.contains("is-dragging")) return;
    hanger.classList.remove("is-dragging");
    positionHanger();
    startSwing();
  });
  hanger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleQuote();
      return;
    }
    const step = event.shiftKey ? 20 : 8;
    const direction = event.key === "ArrowLeft" || event.key === "ArrowDown"
      ? -1
      : event.key === "ArrowRight" || event.key === "ArrowUp"
        ? 1
        : 0;
    if (!direction) return;
    event.preventDefault();
    hobbiesSection.classList.add("is-hanging-art-raised");
    angle = Math.max(-maxSwingAngle, Math.min(
      maxSwingAngle,
      angle + direction * step / ropeLength
    ));
    angularVelocity = direction * 1.4;
    positionHanger();
    startSwing();
  });

  hangingArtworkResizeObserver?.disconnect();
  if ("ResizeObserver" in window) {
    hangingArtworkResizeObserver = new ResizeObserver(() => {
      refreshLayoutBounds();
      const hangerX = hanger.offsetLeft + hangerWidth / 2;
      const offsetX = hangerX - anchorX;
      angle = Math.asin(Math.max(-0.9, Math.min(0.9, offsetX / ropeLength)));
      positionHanger();
    });
    hangingArtworkResizeObserver.observe(hobbiesSection);
    hangingArtworkResizeObserver.observe(hanger);
  }
};

const renderMemberProfile = (button) => {
  const index = Number(button.dataset.index);
  const name = button.dataset.name;
  const details = memberProfiles[index];
  const theme = button.dataset.theme;
  const layoutTheme = theme === "mp5" ? "mp2" : theme;
  const favoriteName = escapeMarkup(details?.favoriteName || button.dataset.spider);
  const detailSections = details ? `
    <div class="profile-detail-grid">
      <section class="profile-detail-section profile-detail-section-hobbies" aria-labelledby="member-hobbies">
        <h2 id="member-hobbies">Hobbies</h2>
        <p>${escapeMarkup(details.hobbies)}</p>
        ${theme === "mp1" || theme === "mp2" || theme === "mp3" || theme === "mp4" || theme === "mp5" || theme === "mp6" || theme === "mp7" ? `
        <svg class="${layoutTheme}-hanging-string" aria-hidden="true" focusable="false">
          ${layoutTheme === "mp1" ? "<path></path>" : "<line></line>"}
          <circle class="${layoutTheme}-hanging-anchor" r="5"></circle>
        </svg>
        <figure class="${layoutTheme}-hanging-art" tabindex="0" role="group" aria-expanded="false" aria-label="Draggable hanging Spider-Man artwork. Drag to swing it, use arrow keys, or press Enter for a quote.">
          <img src="${theme === "mp1" ? "images/MP1-M.jpg" : theme === "mp2" ? "images/MP2-M.jpg" : theme === "mp3" ? "images/MP3-M.jpg" : theme === "mp4" ? "images/MP4-M.jpg" : theme === "mp5" ? "images/MP5-M.jpg" : theme === "mp6" ? "images/MP6-M.jpg" : theme === "mp7" ? "images/MP7-M.jpg" : "images/member-artwork/MP-6-C.jpg"}" alt="${theme.toUpperCase()} artwork hanging by a string">
        </figure>` : ""}
        ${theme === "mp1" || theme === "mp2" || theme === "mp3" || theme === "mp4" || theme === "mp5" || theme === "mp6" || theme === "mp7" ? `
        <dialog class="${layoutTheme}-hanging-quote" aria-label="${escapeMarkup(name)}'s motto">
          <p>${escapeMarkup(details.motto)}</p>
          <button class="${layoutTheme}-hanging-quote-close" type="button" aria-label="Close motto">×</button>
        </dialog>` : ""}
        <div class="profile-hobby-gallery" aria-label="Hobby photos">
          ${details.hobbyArt.map((art, index) => `
            <figure>
              <img src="images/member-artwork/${escapeMarkup(art)}" alt="${escapeMarkup(name)} hobby artwork ${index + 1}" loading="lazy" decoding="async">
            </figure>`).join("")}
        </div>
      </section>
      <div class="mp2-info-box mp2-info-box-pink mp2-course-goals">
        ${details.courseArt ? `
        <img class="${layoutTheme}-course-goals-artwork" src="${escapeMarkup(details.courseArt)}" alt="${escapeMarkup(details.courseArtAlt)}" loading="lazy" decoding="async">` : ""}
        <section class="profile-detail-section" aria-labelledby="member-course">
          <h2 id="member-course">Course</h2>
          <p>${escapeMarkup(details.course)}</p>
        </section>
        <section class="profile-detail-section" aria-labelledby="member-goals">
          <h2 id="member-goals">Dream &amp; Goals</h2>
          <p>${escapeMarkup(details.goals)}</p>
        </section>
      </div>
      <div class="mp2-info-box mp2-info-box-white mp2-fun-facts-box">
        <section class="profile-detail-section" aria-labelledby="member-facts">
          <h2 id="member-facts">3 Fun Facts</h2>
          <ul class="mp2-fun-facts">${details.facts.map((fact) => `<li>${escapeMarkup(fact)}</li>`).join("")}</ul>
        </section>
        ${details.music ? `
        <div class="mp1-music-player">
          <video class="mp1-music-video" src="${escapeMarkup(details.music.video)}" preload="none" playsinline aria-hidden="true" data-track-title="${escapeMarkup(details.music.title)}"></video>
          <img class="mp1-music-cover" src="${escapeMarkup(details.music.cover)}" alt="${escapeMarkup(details.music.title)} cover art by ${escapeMarkup(details.music.artist)}">
          <div class="mp1-music-details">
            <span class="mp1-music-title">${escapeMarkup(details.music.title)}</span>
            <span class="mp1-music-artist">${escapeMarkup(details.music.artist)}</span>
          </div>
          <div class="mp1-music-progress">
            <input class="mp1-music-seek" type="range" min="0" max="100" value="0" step="0.1" aria-label="Seek through ${escapeMarkup(details.music.title)}">
            <div class="mp1-music-times">
              <span class="mp1-music-current-time">0:00</span>
              <span class="mp1-music-duration">0:00</span>
            </div>
          </div>
          <div class="mp1-music-controls">
            <button class="mp1-music-skip-back" type="button" aria-label="Restart song">↶</button>
            <button class="mp1-music-toggle" type="button" aria-label="Play ${escapeMarkup(details.music.title)}" aria-pressed="false">
              <span class="mp1-music-icon" aria-hidden="true">▶</span>
            </button>
            <button class="mp1-music-skip-forward" type="button" aria-label="Skip ahead 10 seconds">+10</button>
          </div>
          <span class="mp1-music-status" role="status" aria-live="polite"></span>
        </div>
        <div class="mp1-music-divider" aria-hidden="true"></div>
        <img class="${layoutTheme}-fun-facts-artwork" src="${escapeMarkup(details.factsArt)}" alt="${escapeMarkup(details.factsArtAlt)}" loading="lazy" decoding="async">` : ""}
      </div>
      <div class="mp2-info-box mp2-info-box-pink mp2-favorite">
        <img class="profile-detail-artwork" src="${escapeMarkup(details.favoriteArt)}" alt="${favoriteName} artwork" loading="lazy" decoding="async">
        <section class="profile-detail-section profile-detail-section-favorite" aria-labelledby="member-favorite">
          <h2 id="member-favorite">Favorite Spider-Man: ${favoriteName}</h2>
          <p>${escapeMarkup(details.favorite)}</p>
        </section>
      </div>
      <a class="profile-card-back" href="#team-members">↑ Back to the team</a>
    </div>` : `
    <div class="profile-detail-grid">
      <a class="profile-card-back" href="#team-members">↑ Back to the team</a>
    </div>`;

  memberProfile.querySelector(".mp1-music-video")?.pause();
  memberProfile.className = `team-member-profile profile-page profile-theme-${theme}${theme === "mp5" ? " profile-theme-mp2" : ""}`;
  memberProfile.innerHTML = `
    <div class="profile-main">
      <section class="profile-card">
        <div class="profile-card-content">
          ${detailSections}
        </div>
      </section>
    </div>`;

  setupProfileScrollReveal();
  const musicVideo = memberProfile.querySelector(".mp1-music-video");
  const musicToggle = memberProfile.querySelector(".mp1-music-toggle");
  const musicIcon = memberProfile.querySelector(".mp1-music-icon");
  const musicSeek = memberProfile.querySelector(".mp1-music-seek");
  const musicCurrentTime = memberProfile.querySelector(".mp1-music-current-time");
  const musicDuration = memberProfile.querySelector(".mp1-music-duration");
  const musicStatus = memberProfile.querySelector(".mp1-music-status");
  const musicSkipBack = memberProfile.querySelector(".mp1-music-skip-back");
  const musicSkipForward = memberProfile.querySelector(".mp1-music-skip-forward");
  if (
    musicVideo
    && musicToggle
    && musicIcon
    && musicSeek
    && musicCurrentTime
    && musicDuration
    && musicStatus
    && musicSkipBack
    && musicSkipForward
  ) {
    const trackTitle = musicVideo.dataset.trackTitle;
    const formatMusicTime = (time) => {
      if (!Number.isFinite(time)) return "0:00";
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60).toString().padStart(2, "0");
      return `${minutes}:${seconds}`;
    };

    const updateMusicControl = (isPlaying) => {
      musicToggle.setAttribute("aria-label", `${isPlaying ? "Pause" : "Play"} ${trackTitle}`);
      musicToggle.setAttribute("aria-pressed", String(isPlaying));
      musicIcon.textContent = isPlaying ? "Ⅱ" : "▶";
    };

    const updateMusicProgress = () => {
      const duration = musicVideo.duration;
      musicSeek.value = Number.isFinite(duration) && duration > 0
        ? String((musicVideo.currentTime / duration) * 100)
        : "0";
      musicCurrentTime.textContent = formatMusicTime(musicVideo.currentTime);
      musicDuration.textContent = formatMusicTime(duration);
    };

    musicToggle.addEventListener("click", () => {
      musicStatus.textContent = "";
      if (musicVideo.paused) {
        musicVideo.play().catch((error) => {
          musicStatus.textContent = `Unable to play ${trackTitle}. Please try again.`;
          console.error(`Unable to play ${trackTitle}.`, error);
        });
      } else {
        musicVideo.pause();
      }
    });
    musicSkipBack.addEventListener("click", () => {
      musicVideo.currentTime = 0;
    });
    musicSkipForward.addEventListener("click", () => {
      musicVideo.currentTime = Math.min(musicVideo.currentTime + 10, musicVideo.duration || musicVideo.currentTime + 10);
    });
    musicSeek.addEventListener("input", () => {
      if (Number.isFinite(musicVideo.duration)) {
        musicVideo.currentTime = (Number(musicSeek.value) / 100) * musicVideo.duration;
      }
    });
    musicVideo.addEventListener("play", () => updateMusicControl(true));
    musicVideo.addEventListener("pause", () => updateMusicControl(false));
    musicVideo.addEventListener("timeupdate", updateMusicProgress);
    musicVideo.addEventListener("durationchange", updateMusicProgress);
    musicVideo.addEventListener("loadedmetadata", updateMusicProgress);
    musicVideo.addEventListener("ended", () => {
      updateMusicControl(false);
      updateMusicProgress();
    });
    musicVideo.addEventListener("error", () => {
      musicStatus.textContent = `${trackTitle} could not be loaded.`;
      console.error(`Unable to load ${musicVideo.currentSrc || musicVideo.src}.`, musicVideo.error);
    });
  }
  if (theme === "mp1" || theme === "mp2" || theme === "mp3" || theme === "mp4" || theme === "mp5" || theme === "mp6" || theme === "mp7") {
    setupHangingArtwork(
      memberProfile.querySelector(".profile-detail-section-hobbies"),
      layoutTheme
    );
  }
};

const playPfpEnter = () => {
  memberPfp.classList.remove("is-pfp-exiting", "is-pfp-entering");
  void memberPfp.offsetWidth;
  memberPfp.classList.add("is-pfp-entering");
};

const playPfpExit = () => {
  window.clearTimeout(pfpSwapTimer);
  memberPfp.classList.remove("is-pfp-entering");
  if (memberPfp.classList.contains("is-pfp-exiting")) return;
  void memberPfp.offsetWidth;
  memberPfp.classList.add("is-pfp-exiting");
  pfpExitStartedAt = performance.now();
};

const applyPfp = (button) => {
  const pfp = memberProfiles[Number(button.dataset.index)]?.pfp;
  const swapPfp = () => {
    memberPfp.classList.remove("is-pfp-exiting");
    if (pfp) {
      memberPfp.src = pfp;
    } else {
      memberPfp.removeAttribute("src");
    }
    memberPfp.alt = button.dataset.name;
    void memberPfp.offsetWidth;
    memberPfp.classList.add("is-pfp-entering");
  };
  window.clearTimeout(pfpSwapTimer);
  if (reduceMotion.matches) {
    memberPfp.classList.remove("is-pfp-exiting", "is-pfp-entering");
    swapPfp();
    return;
  }
  const remainingExitTime = Math.max(0, pfpExitDuration - (performance.now() - pfpExitStartedAt));
  pfpSwapTimer = window.setTimeout(swapPfp, remainingExitTime);
};

const finishArtTransition = () => {
  if (!artTransitionActive) return;
  window.clearTimeout(artTransitionTimer);
  window.cancelAnimationFrame(artTransitionFrame);
  artTransitionFrame = undefined;
  const outgoingArt = currentArt;
  currentArt = nextArt;
  nextArt = outgoingArt;
  artTrack.insertBefore(currentArt, artTrack.firstElementChild);
  currentArt.classList.replace("team-showcase-art-next", "team-showcase-art-current");
  nextArt.classList.replace("team-showcase-art-current", "team-showcase-art-next");
  nextArt.src = currentArt.src;
  artTrack.style.removeProperty("transform");
  showcase.classList.remove("is-transitioning");
  artTransitionActive = false;
};

const showMember = async (button, skipScroll = false) => {
  const token = ++selectionToken;

  const currentIndex = [...memberButtons].findIndex((memberButton) => memberButton.getAttribute("aria-pressed") === "true");
  const targetIndex = Number(button.dataset.index);
  if (targetIndex === currentIndex) return;
  window.clearTimeout(memberChangeTimer);

  if (!skipScroll && window.scrollY > 1) {
    window.scrollTo(0, 0);
  }

  if (token !== selectionToken) return;

  finishArtTransition();
  memberButtons.forEach((memberButton) => {
    const isActive = memberButton === button;
    memberButton.classList.toggle("is-active", isActive);
    memberButton.setAttribute("aria-pressed", String(isActive));
  });

  const slideRight = targetIndex < currentIndex;
  if (slideRight) {
    artTrack.insertBefore(nextArt, currentArt);
    artTrack.style.transform = "translateX(-50%)";
  } else {
    artTrack.insertBefore(currentArt, nextArt);
    artTrack.style.transform = "translateX(0)";
  }
  void artTrack.offsetWidth;
  showcase.classList.toggle("slide-right", slideRight);
  showcase.classList.toggle("slide-left", !slideRight);
  if (!reduceMotion.matches) playPfpExit();
  applyPfp(button);
  nextArt.src = button.dataset.art;
  showcase.dataset.theme = button.dataset.theme;
  showcase.classList.add("is-transitioning");
  artTransitionActive = true;
  if (reduceMotion.matches) {
    artTrack.style.removeProperty("transform");
  } else {
    artTransitionFrame = window.requestAnimationFrame(() => {
      if (artTransitionActive) artTrack.style.removeProperty("transform");
      artTransitionFrame = undefined;
    });
  }
  artTransitionTimer = window.setTimeout(finishArtTransition, reduceMotion.matches ? 0 : artTransitionDuration);
  showcase.classList.remove("is-entering");
  showcase.classList.add("is-changing");

  memberChangeTimer = window.setTimeout(() => {
    const memberDetails = memberProfiles[targetIndex];
    memberName.textContent = button.dataset.name;
    spiderName.textContent = button.dataset.spider;
    ageBirthday.textContent = button.dataset.description || button.dataset.ageBirthday;
    course.textContent = memberDetails.course;
    socialLinks.hidden = !memberDetails.socials;
    socialLinks.setAttribute("aria-label", `${button.dataset.name}'s social media`);
    if (memberDetails.socials) {
      socialLinks.querySelector('a[aria-label="Facebook"]').href = memberDetails.socials.facebook;
      socialLinks.querySelector('a[aria-label="Instagram"]').href = memberDetails.socials.instagram;
    }
    renderMemberProfile(button);
    showcase.classList.remove("is-changing");
    window.cancelAnimationFrame(animationFrame);
    animationFrame = window.requestAnimationFrame(() => {
      showcase.classList.add("is-entering");
    });
  }, reduceMotion.matches ? 0 : 120);
};

const hideStripWhileScrolling = () => {
  memberStrip.classList.add("is-hidden");
  window.clearTimeout(stripTimer);
  stripTimer = window.setTimeout(() => {
    memberStrip.classList.remove("is-hidden");
  }, 1100);
};

const updateHeaderOnScroll = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 40);
};

const preloadedArtwork = new WeakSet();
const preloadMemberArtwork = (button) => {
  if (preloadedArtwork.has(button)) return;
  preloadedArtwork.add(button);

  const image = new Image();
  image.fetchPriority = "low";
  image.decoding = "async";
  image.src = button.dataset.art;
};

memberButtons.forEach((button) => {
  button.addEventListener("pointerenter", () => preloadMemberArtwork(button), { once: true });
  button.addEventListener("focus", () => preloadMemberArtwork(button), { once: true });
  button.addEventListener("click", () => showMember(button));
});

renderMemberProfile(memberButtons[0]);
playPfpEnter();

document.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href$=".html"]');
  if (!link) return;
  event.preventDefault();
  playPfpExit();
  window.setTimeout(() => {
    window.location.href = link.href;
  }, reduceMotion.matches ? 0 : pfpExitDuration);
});

window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  memberPfp.classList.remove("is-pfp-exiting");
  playPfpEnter();
});

window.addEventListener("scroll", hideStripWhileScrolling, { passive: true });
window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
window.addEventListener("wheel", hideStripWhileScrolling, { passive: true });
window.addEventListener("touchmove", hideStripWhileScrolling, { passive: true });
updateHeaderOnScroll();
