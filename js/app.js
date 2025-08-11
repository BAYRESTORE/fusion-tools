// DOM references
const tabs = document.querySelectorAll("#tabs li.tab");
const filterSection = document.getElementById("filter");
const manualSection = document.getElementById("manual");
const imageCanvas = document.getElementById("imageCanvas");
const ctx = imageCanvas.getContext("2d");
const uploadInput = document.getElementById("uploadImage");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");
const printBtn = document.getElementById("printBtn");
const btnBack = document.getElementById("btnBack");

let originalImage = null;
let image = new Image();
let filtersState = {};

// Resize canvas to fit container
function resizeCanvas() {
  const rect = imageCanvas.parentElement.getBoundingClientRect();
  imageCanvas.width = rect.width;
  imageCanvas.height = rect.height - 100; // leave space for controls
  redrawImage();
}

window.addEventListener("resize", resizeCanvas);

// Tab switching logic
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const target = tab.getAttribute("data-tab");
    if (target === "filter") {
      filterSection.classList.add("active");
      manualSection.classList.remove("active");
    } else {
      manualSection.classList.add("active");
      filterSection.classList.remove("active");
    }
  });
});

// Render categories and controls in sidebar
function createControlElement(control, categoryName) {
  const wrapper = document.createElement("div");
  wrapper.className = "control-item";

  if (control.type === "range") {
    const label = document.createElement("label");
    label.textContent = control.label;
    label.htmlFor = control.prop;

    const input = document.createElement("input");
    input.type = "range";
    input.id = control.prop;
    input.min = control.min;
    input.max = control.max;
    input.value = control.default;

    input.addEventListener("input", () => {
      filtersState[control.prop] = input.value;
      applyFilters();
    });

    wrapper.appendChild(label);
    wrapper.appendChild(input);
  } else if (control.type === "toggle") {
    const label = document.createElement("label");
    label.textContent = control.label;
    label.htmlFor = control.prop;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = control.prop;
    input.checked = control.default;

    input.addEventListener("change", () => {
      filtersState[control.prop] = input.checked;
      applyFilters();
    });

    wrapper.appendChild(label);
    wrapper.appendChild(input);
  } else if (control.type === "button") {
    const button = document.createElement("button");
    button.textContent = control.label;
    button.addEventListener("click", () => {
      alert(`${control.label} clicked! (Fungsi belom diimplementasi)`);
    });

    wrapper.appendChild(button);
  } else if (control.type === "select") {
    const label = document.createElement("label");
    label.textContent = control.label;
    label.htmlFor = control.prop;

    const select = document.createElement("select");
    select.id = control.prop;

    control.options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      if (opt === control.default) option.selected = true;
      select.appendChild(option);
    });

    select.addEventListener("change", () => {
      filtersState[control.prop] = select.value;
      applyFilters();
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
  }

  return wrapper;
}

function renderCategory(category, container) {
  const categoryDiv = document.createElement("div");
  categoryDiv.className = "category";

  const header = document.createElement("div");
  header.className = "category-header";
  header.innerHTML = `<span class="arrow">▶</span> ${category.name}`;
  header.tabIndex = 0;
  header.setAttribute("role", "button");
  header.setAttribute("aria-expanded", "false");

  header.addEventListener("click", () => {
    const expanded = header.classList.toggle("expanded");
    header.setAttribute("aria-expanded", expanded);
    controlsDiv.style.display = expanded ? "block" : "none";
  });

  header.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      header.click();
      e.preventDefault();
    }
  });

  const controlsDiv = document.createElement("div");
  controlsDiv.className = "controls";
  controlsDiv.style.display = "none";

  category.controls.forEach((control) => {
    controlsDiv.appendChild(createControlElement(control, category.name));
  });

  categoryDiv.appendChild(header);
  categoryDiv.appendChild(controlsDiv);

  container.appendChild(categoryDiv);
}

// Render all categories & controls on load
function renderAll() {
  filterData.filter.forEach((category) => renderCategory(category, filterSection));
  filterData.manual.forEach((category) => renderCategory(category, manualSection));
}

// Image loading & drawing
uploadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    image.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});

image.onload = () => {
  originalImage = image;
  resizeCanvas();
};

function redrawImage() {
  if (!originalImage) return;

  ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

  // Calculate aspect ratio fit
  const canvasRatio = imageCanvas.width / imageCanvas.height;
  const imageRatio = originalImage.width / originalImage.height;
  let drawWidth, drawHeight;

  if (canvasRatio > imageRatio) {
    drawHeight = imageCanvas.height;
    drawWidth = imageRatio * drawHeight;
  } else {
    drawWidth = imageCanvas.width;
    drawHeight = drawWidth / imageRatio;
  }

  const x = (imageCanvas.width - drawWidth) / 2;
  const y = (imageCanvas.height - drawHeight) / 2;

  ctx.drawImage(originalImage, x, y, drawWidth, drawHeight);
}

function applyFilters() {
  if (!originalImage) return;

  // Reset canvas and draw original image first
  ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

  // Use CSS filters applied on canvas (simple approach)
  let filterStr = "";

  // Hue
  if (filtersState.hue10) filterStr += `hue-rotate(${filtersState.hue10}deg) `;
  if (filtersState.hue20) filterStr += `hue-rotate(${filtersState.hue20}deg) `;

  // Sepia
  if (filtersState.sepia10) filterStr += `sepia(${filtersState.sepia10}%) `;
  if (filtersState.sepia20) filterStr += `sepia(${filtersState.sepia20}%) `;

  // Grayscale
  if (filtersState.grayscale) filterStr += `grayscale(100%) `;

  // Blur
  if (filtersState.gaussianBlur) filterStr += `blur(${filtersState.gaussianBlur}px) `;
  if (filtersState.motionBlur) filterStr += `blur(${filtersState.motionBlur}px) `; // motion blur mock

  // Adjust
  if (filtersState.brightness) filterStr += `brightness(${filtersState.brightness}%) `;
  if (filtersState.contrast) filterStr += `contrast(${filtersState.contrast}%) `;
  if (filtersState.saturation) filterStr += `saturate(${filtersState.saturation}%) `;

  // Restore - Sharpen & Noise reduction - mock effect, no real effect
  // Extender & Colorize buttons - alert on click, no real effect

  imageCanvas.style.filter = filterStr.trim();

  redrawImage();
}

// Reset button
resetBtn.addEventListener("click", () => {
  filtersState = {};
  // Reset semua slider dan controls ke default
  document.querySelectorAll("input[type=range], input[type=checkbox], select").forEach((el) => {
    if (el.type === "range") {
      el.value = el.defaultValue || 0;
      filtersState[el.id] = el.value;
    } else if (el.type === "checkbox") {
      el.checked = false;
      filtersState[el.id] = false;
    } else if (el.tagName.toLowerCase() === "select") {
      el.selectedIndex = 0;
      filtersState[el.id] = el.value;
    }
  });
  imageCanvas.style.filter = "none";
  redrawImage();
});

// Download button
downloadBtn.addEventListener("click", () => {
  if (!originalImage) return alert("Upload gambar dulu!");
  imageCanvas.toBlob((blob) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "fusion-tools-edited.png";
    a.click();
    URL.revokeObjectURL(a.href);
  });
});

// Print button
printBtn.addEventListener("click", () => {
  if (!originalImage) return alert("Upload gambar dulu!");
  const dataUrl = imageCanvas.toDataURL();
  const win = window.open();
  win.document.write(`<img src="${dataUrl}" style="max-width:100%"/>`);
  win.print();
  win.close();
});

// Back button
btnBack.addEventListener("click", () => {
  alert("Back ke dashboard atau halaman sebelumnya");
  // Implementasi navigasi sesuai aplikasi nyata nanti
});

// Inisialisasi default render
renderAll();
resizeCanvas();
