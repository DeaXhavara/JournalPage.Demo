const themeSelector = document.getElementById("themeSelector");
const promptText = document.getElementById("promptText");
const journalEntry = document.getElementById("journalEntry");
const stickerCanvas = document.getElementById("stickerCanvas");
const trashBin = document.getElementById("trashBin");

const prompts = {
  safePlace: "Describe the place you feel safe to...",
  todaysDream: "What are your dreams and how do you feel about them?",
  futureLetter: "Write a letter to your future self..."
};

themeSelector.addEventListener("change", () => {
  const selected = themeSelector.value;
  promptText.textContent = prompts[selected] || "Let your imagination run free!";
});

function isOverTrash(x, y) {
  const rect = trashBin.getBoundingClientRect();
  return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;
}

function showTrashBin() {
  trashBin.classList.add("active");
}

function hideTrashBin() {
  trashBin.classList.remove("active", "hover");
}

function makeStickerDraggable(sticker) {
  sticker.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const clone = sticker.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.left = `${e.clientX - 20}px`;
    clone.style.top = `${e.clientY - 20}px`;
    clone.style.pointerEvents = "auto";
    clone.style.zIndex = 1000;
    clone.draggable = false;
    document.body.appendChild(clone);

    showTrashBin();

    const move = (event) => {
      const x = event.clientX;
      const y = event.clientY;
      clone.style.left = `${x - 20}px`;
      clone.style.top = `${y - 20}px`;

      if (isOverTrash(x, y)) {
        trashBin.classList.add("hover");
      } else {
        trashBin.classList.remove("hover");
      }
    };

    const drop = (event) => {
      const x = event.clientX;
      const y = event.clientY;

      if (isOverTrash(x, y)) {
        clone.remove();
        trashBin.classList.add("eaten");
        setTimeout(() => trashBin.classList.remove("eaten"), 300);
      } else {
        const canvasRect = stickerCanvas.getBoundingClientRect();
        if (
          x > canvasRect.left &&
          x < canvasRect.right &&
          y > canvasRect.top &&
          y < canvasRect.bottom
        ) {
          clone.style.left = `${x - canvasRect.left - 20}px`;
          clone.style.top = `${y - canvasRect.top - 20}px`;
          clone.style.position = "absolute";
          stickerCanvas.appendChild(clone);
          enableCanvasDrag(clone);
        } else {
          clone.remove();
        }
      }

      hideTrashBin();
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", drop);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", drop);
  });
}

function enableCanvasDrag(sticker) {
  sticker.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const offsetX = parseFloat(sticker.style.left);
    const offsetY = parseFloat(sticker.style.top);

    showTrashBin();

    const move = (event) => {
      const x = event.clientX;
      const y = event.clientY;
      sticker.style.left = `${offsetX + (x - startX)}px`;
      sticker.style.top = `${offsetY + (y - startY)}px`;

      if (isOverTrash(x, y)) {
        trashBin.classList.add("hover");
      } else {
        trashBin.classList.remove("hover");
      }
    };

    const drop = (event) => {
      const x = event.clientX;
      const y = event.clientY;

      if (isOverTrash(x, y)) {
        sticker.remove();
        trashBin.classList.add("eaten");
        setTimeout(() => trashBin.classList.remove("eaten"), 300);
      }

      hideTrashBin();
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", drop);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", drop);
  });
}

const shelfStickers = document.querySelectorAll(".sticker-shelf .sticker");
shelfStickers.forEach(makeStickerDraggable);
