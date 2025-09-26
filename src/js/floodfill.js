import { rgbaEquals } from './utils.js';

export function floodFill(context, x, y, fillColor, tolerance = 0, gradient = null) {
  const { width, height } = context.canvas;
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;
  const index = (Math.floor(y) * width + Math.floor(x)) * 4;
  const targetColor = [data[index], data[index + 1], data[index + 2], data[index + 3]];

  if (rgbaEquals(targetColor, fillColor, tolerance) || rgbaEquals(targetColor, fillColor, 0)) {
    return;
  }

  const stack = [[Math.floor(x), Math.floor(y)]];
  const visited = new Uint8Array(width * height);

  while (stack.length) {
    let [currentX, currentY] = stack.pop();
    let currentIndex = (currentY * width + currentX) * 4;

    while (currentX >= 0 && rgbaEquals(targetColor, data.slice(currentIndex, currentIndex + 4), tolerance)) {
      currentX -= 1;
      currentIndex -= 4;
    }

    currentX += 1;
    currentIndex += 4;

    let spanAbove = false;
    let spanBelow = false;

    while (currentX < width && rgbaEquals(targetColor, data.slice(currentIndex, currentIndex + 4), tolerance)) {
      const offset = currentY * width + currentX;
      if (!visited[offset]) {
        let color = fillColor;
        if (gradient) {
          const t = currentY / height;
          color = gradient(t);
        }
        data[currentIndex] = color[0];
        data[currentIndex + 1] = color[1];
        data[currentIndex + 2] = color[2];
        data[currentIndex + 3] = color[3];
        visited[offset] = 1;
      }

      if (currentY > 0) {
        const aboveOffset = (currentY - 1) * width + currentX;
        const aboveIndex = aboveOffset * 4;
        if (!spanAbove && rgbaEquals(targetColor, data.slice(aboveIndex, aboveIndex + 4), tolerance)) {
          stack.push([currentX, currentY - 1]);
          spanAbove = true;
        } else if (spanAbove && !rgbaEquals(targetColor, data.slice(aboveIndex, aboveIndex + 4), tolerance)) {
          spanAbove = false;
        }
      }

      if (currentY < height - 1) {
        const belowOffset = (currentY + 1) * width + currentX;
        const belowIndex = belowOffset * 4;
        if (!spanBelow && rgbaEquals(targetColor, data.slice(belowIndex, belowIndex + 4), tolerance)) {
          stack.push([currentX, currentY + 1]);
          spanBelow = true;
        } else if (spanBelow && !rgbaEquals(targetColor, data.slice(belowIndex, belowIndex + 4), tolerance)) {
          spanBelow = false;
        }
      }

      currentX += 1;
      currentIndex += 4;
    }
  }

  context.putImageData(imageData, 0, 0);
}
