import { clamp, getPointerPosition, hexToRgba } from './utils.js';
import { floodFill } from './floodfill.js';

const TOOL = {
  BRUSH: 'brush',
  ERASER: 'eraser',
  BUCKET: 'bucket',
  EYEDROPPER: 'eyedropper',
  PAN: 'pan'
};

export class CanvasManager {
  constructor(canvas, historyManager, statusCallback) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true });
    this.history = historyManager;
    this.onStatus = statusCallback;
    this.onColorPicked = null;
    this.brushSize = 10;
    this.fillTolerance = 32;
    this.currentTool = TOOL.BRUSH;
    this.currentColor = '#f87171';
    this.isDrawing = false;
    this.zoom = 1;
    this.pan = { x: 0, y: 0 };
    this.lastPointer = null;
    this.activeImage = null;
    this.gradientEnabled = false;
    this.previousTool = TOOL.BRUSH;

    this.setupEvents();
    this.pushHistory();
    this.updateTransform();
  }

  setupEvents() {
    const pointerDown = (event) => {
      if (event.button === 1) {
        this.previousTool = this.currentTool;
        this.currentTool = TOOL.PAN;
      }
      this.canvas.setPointerCapture(event.pointerId);
      this.isDrawing = true;
      this.lastPointer = getPointerPosition(event, this.canvas);
      switch (this.currentTool) {
        case TOOL.BRUSH:
        case TOOL.ERASER:
          this.drawPoint(this.lastPointer);
          break;
        case TOOL.BUCKET:
          this.bucketFill(this.lastPointer);
          break;
        case TOOL.EYEDROPPER:
          const color = this.pickColor(this.lastPointer);
          this.onColorPicked?.(color);
          break;
        default:
          break;
      }
    };

    const pointerMove = (event) => {
      if (!this.isDrawing) return;
      const pointer = getPointerPosition(event, this.canvas);
      switch (this.currentTool) {
        case TOOL.BRUSH:
          this.drawStroke(pointer);
          break;
        case TOOL.ERASER:
          this.drawStroke(pointer, true);
          break;
        case TOOL.PAN:
          this.panCanvas(event.movementX, event.movementY);
          break;
        default:
          break;
      }
      this.lastPointer = pointer;
    };

    const pointerUp = (event) => {
      this.canvas.releasePointerCapture(event.pointerId);
      if (this.isDrawing && [TOOL.BRUSH, TOOL.ERASER, TOOL.BUCKET].includes(this.currentTool)) {
        this.pushHistory();
      }
      if (event.button === 1) {
        this.currentTool = this.previousTool ?? TOOL.BRUSH;
      }
      this.isDrawing = false;
      this.lastPointer = null;
    };

    this.canvas.addEventListener('pointerdown', pointerDown);
    this.canvas.addEventListener('pointermove', pointerMove);
    window.addEventListener('pointerup', pointerUp);
  }

  loadImage(image) {
    this.activeImage = image;
    const { width, height } = image;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.drawImage(image, 0, 0, width, height);
    this.pushHistory();
    this.onStatus?.('Đã tải tranh.');
  }

  setBrushSize(size) {
    this.brushSize = clamp(size, 1, 50);
  }

  setFillTolerance(value) {
    this.fillTolerance = clamp(value, 0, 128);
  }

  setGradient(enabled) {
    this.gradientEnabled = enabled;
  }

  setZoom(percentage) {
    this.zoom = clamp(percentage / 100, 0.25, 4);
    this.updateTransform();
  }

  panCanvas(dx, dy) {
    this.pan.x += dx / this.zoom;
    this.pan.y += dy / this.zoom;
    this.updateTransform();
  }

  setTool(tool) {
    this.currentTool = tool;
  }

  setColor(color) {
    this.currentColor = color;
  }

  setColorPickedCallback(callback) {
    this.onColorPicked = callback;
  }

  drawPoint({ x, y }) {
    this.ctx.save();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = this.currentTool === TOOL.ERASER ? '#ffffff' : this.currentColor;
    this.ctx.fillStyle = this.ctx.strokeStyle;
    this.ctx.lineWidth = this.brushSize;
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.brushSize / 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawStroke(pointer, erase = false) {
    if (!this.lastPointer) return;
    this.ctx.save();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = erase ? '#ffffff' : this.currentColor;
    this.ctx.lineWidth = this.brushSize;
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastPointer.x, this.lastPointer.y);
    this.ctx.lineTo(pointer.x, pointer.y);
    this.ctx.stroke();
    this.ctx.restore();
  }

  bucketFill(pointer) {
    const rgba = hexToRgba(this.currentColor);
    const gradient = this.gradientEnabled
      ? (t) => {
          const start = hexToRgba(this.currentColor);
          const end = [start[0] * 0.7, start[1] * 0.7, start[2] * 0.7, 255];
          return [
            Math.round(start[0] + (end[0] - start[0]) * t),
            Math.round(start[1] + (end[1] - start[1]) * t),
            Math.round(start[2] + (end[2] - start[2]) * t),
            255
          ];
        }
      : null;

    floodFill(this.ctx, pointer.x, pointer.y, rgba, this.fillTolerance, gradient);
  }

  pickColor(pointer) {
    const pixel = this.ctx.getImageData(Math.floor(pointer.x), Math.floor(pointer.y), 1, 1).data;
    const hex = `#${[pixel[0], pixel[1], pixel[2]]
      .map((value) => value.toString(16).padStart(2, '0'))
      .join('')}`;
    this.onStatus?.(`Đã chọn màu ${hex}`);
    this.currentColor = hex;
    return hex;
  }

  pushHistory() {
    const snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.history.push(snapshot);
  }

  undo() {
    const snapshot = this.history.undo();
    if (snapshot) {
      this.ctx.putImageData(snapshot, 0, 0);
      this.onStatus?.('Đã hoàn tác.');
    }
  }

  redo() {
    const snapshot = this.history.redo();
    if (snapshot) {
      this.ctx.putImageData(snapshot, 0, 0);
      this.onStatus?.('Đã làm lại.');
    }
  }

  clear(confirmClear = true) {
    if (!confirmClear || window.confirm('Bạn có chắc muốn xóa hết nội dung?')) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.activeImage) {
        this.ctx.drawImage(this.activeImage, 0, 0);
      }
      this.pushHistory();
      this.onStatus?.('Đã xóa canvas.');
    }
  }

  exportImage(type = 'image/png') {
    return this.canvas.toDataURL(type, 0.92);
  }

  getSnapshot() {
    return this.history.peek();
  }

  updateTransform() {
    this.canvas.style.transform = `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.zoom})`;
  }
}

export { TOOL };
