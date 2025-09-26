import { loadFavorites, saveFavorites } from './storage.js';

const BASE_COLORS = [
  '#000000',
  '#ffffff',
  '#f87171',
  '#ef4444',
  '#f97316',
  '#fbbf24',
  '#34d399',
  '#10b981',
  '#60a5fa',
  '#3b82f6',
  '#8b5cf6',
  '#a855f7',
  '#ec4899',
  '#f472b6',
  '#9ca3af',
  '#6b7280',
  '#facc15',
  '#fb923c',
  '#f59e0b',
  '#a3e635',
  '#22d3ee',
  '#2dd4bf',
  '#38bdf8',
  '#14b8a6'
];

export class ColorPicker {
  constructor({ basePaletteEl, favoritePaletteEl, activeColorEl, colorInput, addFavoriteBtn, onColorChange }) {
    this.basePaletteEl = basePaletteEl;
    this.favoritePaletteEl = favoritePaletteEl;
    this.activeColorEl = activeColorEl;
    this.colorInput = colorInput;
    this.addFavoriteBtn = addFavoriteBtn;
    this.onColorChange = onColorChange;
    this.favoriteColors = loadFavorites();
    this.activeColor = BASE_COLORS[2];
  }

  init() {
    this.renderPalette(BASE_COLORS, this.basePaletteEl, false);
    this.renderPalette(this.favoriteColors, this.favoritePaletteEl, true);
    this.setActiveColor(this.activeColor);

    this.basePaletteEl.addEventListener('click', (event) => {
      const swatch = event.target.closest('.color-swatch');
      if (swatch) {
        this.setActiveColor(swatch.dataset.color);
      }
    });

    this.favoritePaletteEl.addEventListener('click', (event) => {
      const swatch = event.target.closest('.color-swatch');
      if (swatch) {
        this.setActiveColor(swatch.dataset.color);
      }
    });

    this.colorInput.addEventListener('input', (event) => {
      this.setActiveColor(event.target.value);
    });

    this.addFavoriteBtn.addEventListener('click', () => {
      if (!this.favoriteColors.includes(this.activeColor) && this.favoriteColors.length < 12) {
        this.favoriteColors.push(this.activeColor);
        saveFavorites(this.favoriteColors);
        this.renderPalette(this.favoriteColors, this.favoritePaletteEl, true);
      }
    });
  }

  renderPalette(colors, container, removable) {
    container.innerHTML = '';
    colors.forEach((color, index) => {
      const swatch = document.createElement('button');
      swatch.className = 'color-swatch';
      swatch.style.background = color;
      swatch.type = 'button';
      swatch.setAttribute('aria-label', `Chọn màu ${color}`);
      swatch.dataset.color = color;

      if (removable) {
        swatch.addEventListener('contextmenu', (event) => {
          event.preventDefault();
          this.favoriteColors.splice(index, 1);
          saveFavorites(this.favoriteColors);
          this.renderPalette(this.favoriteColors, this.favoritePaletteEl, true);
        });
      }

      container.appendChild(swatch);
    });
  }

  setActiveColor(color) {
    this.activeColor = color;
    this.activeColorEl.style.background = color;
    this.colorInput.value = color;
    this.onColorChange?.(color);
  }

  getColor() {
    return this.activeColor;
  }
}
