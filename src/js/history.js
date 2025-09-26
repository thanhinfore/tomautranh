export class HistoryManager {
  constructor(limit = 50) {
    this.limit = limit;
    this.stack = [];
    this.position = -1;
  }

  push(state) {
    if (this.position < this.stack.length - 1) {
      this.stack = this.stack.slice(0, this.position + 1);
    }
    this.stack.push(state);
    if (this.stack.length > this.limit) {
      this.stack.shift();
    }
    this.position = this.stack.length - 1;
  }

  canUndo() {
    return this.position > 0;
  }

  canRedo() {
    return this.position < this.stack.length - 1;
  }

  undo() {
    if (!this.canUndo()) return null;
    this.position -= 1;
    return this.stack[this.position];
  }

  redo() {
    if (!this.canRedo()) return null;
    this.position += 1;
    return this.stack[this.position];
  }

  peek() {
    return this.stack[this.position] ?? null;
  }

  reset() {
    this.stack = [];
    this.position = -1;
  }
}
