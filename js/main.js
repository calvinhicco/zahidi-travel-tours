const PHONE = "+263772668289";
const PHONE_ALT = "+263785816339";
const WHATSAPP = "https://wa.me/263772668289";

function toggleMenu() {
  document.getElementById("siteNav")?.classList.toggle("open");
}

function enquire(destination = "") {
  const msg = destination
    ? `Hello Zahidi, I would like to enquire about ${destination}.`
    : "Hello Zahidi, I would like to plan a trip.";
  window.open(`${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
}

function handleSearch(event) {
  event.preventDefault();
  const dest = event.target.destination?.value || "a holiday";
  enquire(dest);
}

function handleEnquireForm(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.name.value;
  const dest = form.interest.value;
  const note = form.message.value;
  const text = `Hello Zahidi, my name is ${name}. I am interested in ${dest}. ${note}`;
  window.open(`${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
  const ok = form.querySelector(".success");
  if (ok) ok.style.display = "block";
  form.reset();
}

function revealMedia(btn) {
  document.querySelectorAll(".media-item.hidden").forEach((el) => el.classList.remove("hidden"));
  btn.style.display = "none";
}

let galleryItems = [];
let galleryIndex = 0;
let swipeStartX = 0;

function setLightboxNav(show) {
  document.querySelectorAll(".lightbox-nav").forEach((el) => {
    el.style.display = show ? "grid" : "none";
  });
}

function showLightboxMedia(src, isVideo = false) {
  const box = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  const vid = document.getElementById("lightboxVid");
  if (!box) return;
  if (isVideo) {
    img.style.display = "none";
    vid.style.display = "block";
    vid.src = src;
    vid.play();
  } else {
    vid.pause();
    vid.style.display = "none";
    img.style.display = "block";
    img.src = src;
  }
  box.classList.add("open");
}

function collectGallery(el) {
  const grid = el?.closest(".media-grid, .flyer-grid");
  if (!grid) return [];
  return [...grid.querySelectorAll("[data-lightbox]")].map((node) => ({
    src: node.getAttribute("data-lightbox"),
    video: node.getAttribute("data-video") === "true",
  }));
}

function openLightbox(src, isVideo = false, el = null) {
  galleryItems = el ? collectGallery(el) : [];
  galleryIndex = galleryItems.findIndex((item) => item.src === src);
  if (galleryIndex < 0) galleryIndex = 0;
  setLightboxNav(galleryItems.length > 1);
  showLightboxMedia(src, isVideo);
}

function lightboxNav(dir) {
  if (galleryItems.length < 2) return;
  galleryIndex = (galleryIndex + dir + galleryItems.length) % galleryItems.length;
  const item = galleryItems[galleryIndex];
  showLightboxMedia(item.src, item.video);
}

document.addEventListener("click", (e) => {
  if (e.target.matches("#lightboxImg, #lightboxVid")) e.stopPropagation();
}, true);

function closeLightbox() {
  const box = document.getElementById("lightbox");
  const vid = document.getElementById("lightboxVid");
  box?.classList.remove("open");
  galleryItems = [];
  if (vid) {
    vid.pause();
    vid.removeAttribute("src");
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") lightboxNav(1);
  if (e.key === "ArrowLeft") lightboxNav(-1);
});

document.addEventListener("touchstart", (e) => {
  if (!document.getElementById("lightbox")?.classList.contains("open")) return;
  swipeStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", (e) => {
  if (!document.getElementById("lightbox")?.classList.contains("open")) return;
  const dx = e.changedTouches[0].screenX - swipeStartX;
  if (Math.abs(dx) > 50) lightboxNav(dx < 0 ? 1 : -1);
});
