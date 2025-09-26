import { CanvasManager } from './canvas.js';
import { ColorPicker } from './colorpicker.js';
import { HistoryManager } from './history.js';
import { debounce, formatPercentage } from './utils.js';
import { loadSession, saveSession } from './storage.js';

const galleryImages = [
  {
    id: 'mandala',
    title: 'Mandala thư giãn',
    src: 'assets/images/mandala.svg'
  },
  {
    id: 'landscape',
    title: 'Cảnh biển',
    src: 'assets/images/landscape.svg'
  },
  {
    id: 'animals',
    title: 'Bạn thú dễ thương',
    src: 'assets/images/animals.svg'
  }
];

class App {
  constructor() {
    this.canvasEl = document.getElementById('drawing-canvas');
    this.history = new HistoryManager();
    this.canvasManager = new CanvasManager(this.canvasEl, this.history, this.setStatus.bind(this));
    this.colorPicker = new ColorPicker({
      basePaletteEl: document.getElementById('base-palette'),
      favoritePaletteEl: document.getElementById('favorite-palette'),
      activeColorEl: document.getElementById('active-color'),
      colorInput: document.getElementById('color-picker'),
      addFavoriteBtn: document.getElementById('add-favorite'),
      onColorChange: this.handleColorChange.bind(this)
    });

    this.statusEl = document.getElementById('status-message');
    this.zoomLabel = document.getElementById('zoom-label');
    this.toolButtons = document.querySelectorAll('[data-tool]');
    this.fillToleranceInput = document.getElementById('fill-tolerance');
    this.brushSizeInput = document.getElementById('brush-size');
    this.gradientToggle = document.getElementById('gradient-toggle');
    this.zoomSlider = document.getElementById('zoom-slider');
    this.undoBtn = document.getElementById('undo');
    this.redoBtn = document.getElementById('redo');
    this.clearBtn = document.getElementById('clear-canvas');
    this.exportBtn = document.getElementById('export-image');
    this.saveBtn = document.getElementById('save-session');
    this.fileUpload = document.getElementById('file-upload');
    this.galleryDialog = document.getElementById('gallery-dialog');
    this.openGalleryBtn = document.getElementById('open-gallery');
    this.closeGalleryBtn = document.getElementById('close-gallery');
    this.galleryEl = document.getElementById('gallery');

    this.init();
    this.canvasManager.setColorPickedCallback((color) => this.colorPicker.setActiveColor(color));
  }

  init() {
    this.colorPicker.init();
    this.attachEventListeners();
    this.populateGallery();
    this.restoreSession();
  }

  attachEventListeners() {
    this.toolButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.toolButtons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
        this.canvasManager.setTool(button.dataset.tool);
        this.setStatus(`Đang chọn công cụ: ${button.textContent}`);
      });
    });

    this.fillToleranceInput.addEventListener('input', (event) => {
      this.canvasManager.setFillTolerance(Number(event.target.value));
    });

    this.brushSizeInput.addEventListener('input', (event) => {
      this.canvasManager.setBrushSize(Number(event.target.value));
    });

    this.gradientToggle.addEventListener('change', (event) => {
      this.canvasManager.setGradient(event.target.checked);
    });

    this.zoomSlider.addEventListener('input', (event) => {
      const zoomValue = Number(event.target.value);
      this.canvasManager.setZoom(zoomValue);
      this.zoomLabel.textContent = formatPercentage(zoomValue);
    });

    this.undoBtn.addEventListener('click', () => this.canvasManager.undo());
    this.redoBtn.addEventListener('click', () => this.canvasManager.redo());
    this.clearBtn.addEventListener('click', () => this.canvasManager.clear());

    this.exportBtn.addEventListener('click', () => {
      const dataUrl = this.canvasManager.exportImage('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'tomautranh.png';
      link.click();
      this.setStatus('Đã xuất ảnh PNG.');
    });

    const debouncedSave = debounce(() => this.persistSession(), 1000);

    ['pointerup', 'touchend'].forEach((eventName) => {
      this.canvasEl.addEventListener(eventName, () => {
        debouncedSave();
      });
    });

    this.saveBtn.addEventListener('click', () => {
      this.persistSession(true);
    });

    this.fileUpload.addEventListener('change', (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type) || file.size > 10 * 1024 * 1024) {
        this.setStatus('File không hợp lệ.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => this.canvasManager.loadImage(image);
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });

    this.openGalleryBtn.addEventListener('click', () => {
      this.galleryDialog.showModal();
    });

    this.closeGalleryBtn.addEventListener('click', () => this.galleryDialog.close());

    this.galleryEl.addEventListener('click', (event) => {
      const item = event.target.closest('[data-id]');
      if (!item) return;
      const image = new Image();
      image.onload = () => {
        this.canvasManager.loadImage(image);
        this.galleryDialog.close();
      };
      image.src = item.dataset.src;
    });

    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key.toLowerCase() === 'z') {
          this.canvasManager.undo();
          event.preventDefault();
        }
        if (event.key.toLowerCase() === 'y') {
          this.canvasManager.redo();
          event.preventDefault();
        }
      }
    });
  }

  populateGallery() {
    this.galleryEl.innerHTML = '';
    galleryImages.forEach((item) => {
      const card = document.createElement('button');
      card.className = 'gallery-item';
      card.dataset.id = item.id;
      card.dataset.src = item.src;
      card.innerHTML = `<img src="${item.src}" alt="${item.title}" loading="lazy" /><span>${item.title}</span>`;
      this.galleryEl.appendChild(card);
    });
  }

  handleColorChange(color) {
    this.canvasManager.setColor(color);
  }

  setStatus(message) {
    this.statusEl.textContent = message;
  }

  persistSession(showToast = false) {
    const snapshot = this.canvasManager.getSnapshot();
    if (!snapshot) return;
    const payload = {
      width: this.canvasEl.width,
      height: this.canvasEl.height,
      data: Array.from(snapshot.data)
    };
    const success = saveSession(payload);
    if (success && showToast) {
      this.setStatus('Đã lưu tạm vào thiết bị.');
    }
  }

  restoreSession() {
    const session = loadSession();
    if (!session) {
      this.loadDefaultImage();
      return;
    }
    const imageData = new ImageData(new Uint8ClampedArray(session.data), session.width, session.height);
    this.canvasEl.width = session.width;
    this.canvasEl.height = session.height;
    this.canvasManager.ctx.putImageData(imageData, 0, 0);
    this.canvasManager.pushHistory();
    this.setStatus('Đã khôi phục bản vẽ trước đó.');
  }

  loadDefaultImage() {
    const image = new Image();
    image.onload = () => this.canvasManager.loadImage(image);
    image.src = galleryImages[0].src;
  }
}

window.addEventListener('DOMContentLoaded', () => new App());
