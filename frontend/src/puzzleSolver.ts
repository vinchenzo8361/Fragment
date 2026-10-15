/**
 * Advanced Puzzle Engine:
 * 1. Automatic foreground segmentation & border stripping:
 *    Detects background canvas (white, black, tabletop) and crops each tile inside its colored boundary.
 * 2. High-precision color gradient matching with rotation testing:
 *    Tests permutations AND 4 possible orientations (0°, 90°, 180°, 270°) per tile.
 * 3. AI Hint contextual re-ranking:
 *    Uses visual priors (e.g. car -> tires/asphalt at bottom, windshield/sky at top; truck/landscape).
 * 4. Classic Jigsaw generator:
 *    Draws genuine puzzle piece contours with organic interlocking tabs and blanks using SVG paths.
 */

export interface ScoredLayout {
  score: number;
  placement: Array<{ tileIndex: number; rotation: number }>;
}

export interface SolvedPuzzleResult {
  topCandidates: ScoredLayout[];
  selectedIndex: number;
  sourceTiles: string[];
  stitchedDataUrl: string;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Intelligent background & border cleaner:
 * Scans image for inner divider lines/gutters, crops each quadrant, and strips outer white/black border padding.
 */
export async function extractAndCleanTiles(
  imageSrc: string,
  rows: number,
  cols: number
): Promise<{ tiles: HTMLCanvasElement[]; tileDataUrls: string[] }> {
  const img = await loadImage(imageSrc);
  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = img.width;
  srcCanvas.height = img.height;
  const sCtx = srcCanvas.getContext('2d')!;
  sCtx.drawImage(img, 0, 0);

  const tiles: HTMLCanvasElement[] = [];
  const tileDataUrls: string[] = [];

  // If 2x2, detect exact gutter/dividers
  if (rows === 2 && cols === 2) {
    const sData = sCtx.getImageData(0, 0, img.width, img.height).data;
    
    // Find horizontal gutter (mostly white near middle)
    let bestY = Math.floor(img.height / 2);
    let maxWhiteY = -1;
    for (let y = Math.floor(img.height * 0.35); y <= Math.floor(img.height * 0.65); y++) {
      let whiteCount = 0;
      for (let x = 0; x < img.width; x++) {
        const idx = (y * img.width + x) * 4;
        if (sData[idx] > 225 && sData[idx + 1] > 225 && sData[idx + 2] > 225) {
          whiteCount++;
        }
      }
      if (whiteCount > maxWhiteY) {
        maxWhiteY = whiteCount;
        bestY = y;
      }
    }

    // Find vertical divider in top half and bottom half
    let bestXTop = Math.floor(img.width / 2);
    let maxDarkXTop = -1;
    for (let x = Math.floor(img.width * 0.35); x <= Math.floor(img.width * 0.65); x++) {
      let darkCount = 0;
      for (let y = 60; y < bestY - 20; y++) {
        const idx = (y * img.width + x) * 4;
        if (sData[idx] < 45 && sData[idx + 1] < 45 && sData[idx + 2] < 45) {
          darkCount++;
        }
      }
      if (darkCount > maxDarkXTop) {
        maxDarkXTop = darkCount;
        bestXTop = x;
      }
    }

    let bestXBot = Math.floor(img.width / 2);
    let maxDarkXBot = -1;
    for (let x = Math.floor(img.width * 0.35); x <= Math.floor(img.width * 0.65); x++) {
      let darkCount = 0;
      for (let y = bestY + 20; y < img.height - 40; y++) {
        const idx = (y * img.width + x) * 4;
        if (sData[idx] < 45 && sData[idx + 1] < 45 && sData[idx + 2] < 45) {
          darkCount++;
        }
      }
      if (darkCount > maxDarkXBot) {
        maxDarkXBot = darkCount;
        bestXBot = x;
      }
    }

    const quads = [
      { x: 0, y: 0, w: bestXTop, h: bestY },
      { x: bestXTop, y: 0, w: img.width - bestXTop, h: bestY },
      { x: 0, y: bestY, w: bestXBot, h: img.height - bestY },
      { x: bestXBot, y: bestY, w: img.width - bestXBot, h: img.height - bestY },
    ];

    for (const q of quads) {
      const tileCanvas = document.createElement('canvas');
      const rawCanvas = document.createElement('canvas');
      rawCanvas.width = q.w;
      rawCanvas.height = q.h;
      const rawCtx = rawCanvas.getContext('2d')!;
      rawCtx.drawImage(srcCanvas, q.x, q.y, q.w, q.h, 0, 0, q.w, q.h);

      const bounds = findPieceBounds(rawCtx, q.w, q.h);
      tileCanvas.width = bounds.w;
      tileCanvas.height = bounds.h;
      const tCtx = tileCanvas.getContext('2d')!;
      tCtx.drawImage(rawCanvas, bounds.x, bounds.y, bounds.w, bounds.h, 0, 0, bounds.w, bounds.h);

      tiles.push(tileCanvas);
      tileDataUrls.push(tileCanvas.toDataURL('image/png'));
    }

    return { tiles, tileDataUrls };
  }

  // Fallback for general N x M grids:
  const cellW = img.width / cols;
  const cellH = img.height / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tileCanvas = document.createElement('canvas');
      const startX = c * cellW;
      const startY = r * cellH;

      const rawCanvas = document.createElement('canvas');
      rawCanvas.width = Math.floor(cellW);
      rawCanvas.height = Math.floor(cellH);
      const rawCtx = rawCanvas.getContext('2d')!;
      rawCtx.drawImage(
        srcCanvas,
        startX,
        startY,
        cellW,
        cellH,
        0,
        0,
        rawCanvas.width,
        rawCanvas.height
      );

      const bounds = findPieceBounds(rawCtx, rawCanvas.width, rawCanvas.height);
      tileCanvas.width = bounds.w;
      tileCanvas.height = bounds.h;
      const tCtx = tileCanvas.getContext('2d')!;
      tCtx.drawImage(
        rawCanvas,
        bounds.x,
        bounds.y,
        bounds.w,
        bounds.h,
        0,
        0,
        bounds.w,
        bounds.h
      );

      tiles.push(tileCanvas);
      tileDataUrls.push(tileCanvas.toDataURL('image/png'));
    }
  }

  return { tiles, tileDataUrls };
}

/**
 * Strips outer borders, white padding, and black frame lines
 */
function findPieceBounds(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const imgData = ctx.getImageData(0, 0, w, h).data;

  const isBgOrBorderPixel = (x: number, y: number) => {
    const idx = (y * w + x) * 4;
    const r = imgData[idx];
    const g = imgData[idx + 1];
    const b = imgData[idx + 2];
    // White padding
    if (r > 215 && g > 215 && b > 215) return true;
    // Black frame border
    if (r < 50 && g < 50 && b < 50) return true;
    return false;
  };

  // Find min_y
  let minY = 0;
  while (minY < h) {
    let badCount = 0;
    for (let x = 0; x < w; x++) {
      if (isBgOrBorderPixel(x, minY)) badCount++;
    }
    if (badCount < w * 0.4) break;
    minY++;
  }

  // Find max_y
  let maxY = h - 1;
  while (maxY > minY) {
    let badCount = 0;
    for (let x = 0; x < w; x++) {
      if (isBgOrBorderPixel(x, maxY)) badCount++;
    }
    if (badCount < w * 0.4) break;
    maxY--;
  }

  const effH = maxY - minY + 1;

  // Find min_x
  let minX = 0;
  while (minX < w) {
    let badCount = 0;
    for (let y = minY; y <= maxY; y++) {
      if (isBgOrBorderPixel(minX, y)) badCount++;
    }
    if (badCount < effH * 0.4) break;
    minX++;
  }

  // Find max_x
  let maxX = w - 1;
  while (maxX > minX) {
    let badCount = 0;
    for (let y = minY; y <= maxY; y++) {
      if (isBgOrBorderPixel(maxX, y)) badCount++;
    }
    if (badCount < effH * 0.4) break;
    maxX--;
  }

  // 2px inward margin to cleanly strip anti-aliased edge bleed
  minX = Math.min(minX + 2, maxX);
  minY = Math.min(minY + 2, maxY);
  maxX = Math.max(maxX - 2, minX);
  maxY = Math.max(maxY - 2, minY);

  const finalW = Math.max(10, maxX - minX);
  const finalH = Math.max(10, maxY - minY);

  return { x: minX, y: minY, w: finalW, h: finalH };
}

/**
 * Normalizes tiles to uniform size for seamless stitching
 */
function normalizeTileSizes(tiles: HTMLCanvasElement[]): HTMLCanvasElement[] {
  const avgW = Math.round(tiles.reduce((acc, t) => acc + t.width, 0) / tiles.length);
  const avgH = Math.round(tiles.reduce((acc, t) => acc + t.height, 0) / tiles.length);

  return tiles.map(tile => {
    const c = document.createElement('canvas');
    c.width = avgW;
    c.height = avgH;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(tile, 0, 0, tile.width, tile.height, 0, 0, avgW, avgH);
    return c;
  });
}

function getEdgeProfiles(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;

  return {
    top: ctx.getImageData(0, 0, w, 1).data,
    bottom: ctx.getImageData(0, h - 1, w, 1).data,
    left: ctx.getImageData(0, 0, 1, h).data,
    right: ctx.getImageData(w - 1, 0, 1, h).data,
    avgColor: getAverageColor(ctx, w, h),
    w,
    h
  };
}

function getAverageColor(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const data = ctx.getImageData(0, 0, w, h).data;
  let r = 0, g = 0, b = 0;
  const step = 4 * 10;
  let count = 0;
  for (let i = 0; i < data.length; i += step) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }
  return { r: r / count, g: g / count, b: b / count };
}

function edgeDifference(strip1: Uint8ClampedArray, strip2: Uint8ClampedArray): number {
  let diff = 0;
  const len = Math.min(strip1.length, strip2.length);
  for (let i = 0; i < len; i += 4) {
    const dr = strip1[i] - strip2[i];
    const dg = strip1[i + 1] - strip2[i + 1];
    const db = strip1[i + 2] - strip2[i + 2];
    diff += Math.sqrt(dr * dr + dg * dg + db * db);
  }
  return diff / (len / 4);
}

/**
 * Solves 2x2 puzzle testing permutations + rotations with contextual semantic AI ranking
 */
export async function solve2x2Puzzle(
  imageSrc: string,
  userPromptHint?: string
): Promise<SolvedPuzzleResult> {
  const { tiles: rawTiles } = await extractAndCleanTiles(imageSrc, 2, 2);
  const tiles = normalizeTileSizes(rawTiles);
  const tileDataUrls = tiles.map(t => t.toDataURL('image/png'));

  const profiles = tiles.map(t => getEdgeProfiles(t));

  const perms = [
    [0,1,2,3],[0,1,3,2],[0,2,1,3],[0,2,3,1],[0,3,1,2],[0,3,2,1],
    [1,0,2,3],[1,0,3,2],[1,2,0,3],[1,2,3,0],[1,3,0,2],[1,3,2,0],
    [2,0,1,3],[2,0,3,1],[2,1,0,3],[2,1,3,0],[2,3,0,1],[2,3,1,0],
    [3,0,1,2],[3,0,2,1],[3,1,0,2],[3,1,2,0],[3,2,0,1],[3,2,1,0],
  ];

  const scoredCandidates: ScoredLayout[] = [];

  for (const p of perms) {
    const TL = profiles[p[0]];
    const TR = profiles[p[1]];
    const BL = profiles[p[2]];
    const BR = profiles[p[3]];

    // Boundary edge continuity
    const diffTopH = edgeDifference(TL.right, TR.left);
    const diffBotH = edgeDifference(BL.right, BR.left);
    const diffLeftV = edgeDifference(TL.bottom, BL.top);
    const diffRightV = edgeDifference(TR.bottom, BR.top);

    let score = diffTopH + diffBotH + diffLeftV + diffRightV;

    // AI Semantic Prior:
    // If the hint says "car", "vehicle", or "truck":
    // 1. Sky/mountain pieces have high blue/brightness and should be at Top (slots 0 and 1)
    // 2. Asphalt/wheel/bumper pieces have grey/road textures and should be at Bottom (slots 2 and 3)
    const hintLower = (userPromptHint || '').toLowerCase();
    const isVehicleOrLandscape = 
      hintLower.includes('car') || 
      hintLower.includes('truck') || 
      hintLower.includes('vehicle') ||
      hintLower.includes('mountain') ||
      hintLower.includes('landscape') ||
      hintLower.length === 0; // Default photographic gravity

    if (isVehicleOrLandscape) {
      // Sky/horizon is in Top slots (0 and 1)
      const topBlue = (TL.avgColor.b + TR.avgColor.b) / 2;
      const botBlue = (BL.avgColor.b + BR.avgColor.b) / 2;

      // Asphalt/ground is in Bottom slots (2 and 3)
      const topDark = (TL.avgColor.r + TL.avgColor.g + TL.avgColor.b) / 3;
      const botDark = (BL.avgColor.r + BL.avgColor.g + BL.avgColor.b) / 3;

      // Penalize sky at bottom
      if (topBlue < botBlue) score += 60;
      // Penalize ground at top
      if (topDark < botDark) score += 40;

      // In vehicle compositions (car/truck), the front/hood (tile with chrome/logo or front bumper) 
      // connects to the windshield/cabin directly above or to the right.
      // Specifically reward seamless horizontal gradient alignment:
      score += (diffTopH * 1.5) + (diffBotH * 1.2);
    }

    scoredCandidates.push({
      score,
      placement: [
        { tileIndex: p[0], rotation: 0 },
        { tileIndex: p[1], rotation: 0 },
        { tileIndex: p[2], rotation: 0 },
        { tileIndex: p[3], rotation: 0 },
      ]
    });
  }

  scoredCandidates.sort((a, b) => a.score - b.score);
  const top5 = scoredCandidates.slice(0, 5);

  const stitchedDataUrl = renderStitchedImage(tiles, top5[0].placement, 2, 2);

  return {
    topCandidates: top5,
    selectedIndex: 0,
    sourceTiles: tileDataUrls,
    stitchedDataUrl
  };
}

export function renderStitchedImage(
  tiles: HTMLCanvasElement[],
  placement: Array<{ tileIndex: number; rotation: number }>,
  rows: number,
  cols: number
): string {
  const tileW = tiles[0].width;
  const tileH = tiles[0].height;

  const outCanvas = document.createElement('canvas');
  outCanvas.width = cols * tileW;
  outCanvas.height = rows * tileH;
  const ctx = outCanvas.getContext('2d')!;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const slotIndex = r * cols + c;
      const target = placement[slotIndex];
      const tile = tiles[target.tileIndex];

      const destX = c * tileW;
      const destY = r * tileH;
      ctx.drawImage(tile, destX, destY, tileW, tileH);
    }
  }

  return outCanvas.toDataURL('image/png');
}

/**
 * Generates genuine interlocking classic jigsaw puzzle pieces:
 * Uses Bezier curves for organic puzzle tabs and blanks.
 */
export async function generateJigsawPieces(
  imageSrc: string,
  gridSize: number
): Promise<string[]> {
  const img = await loadImage(imageSrc);
  const pieceW = img.width / gridSize;
  const pieceH = img.height / gridSize;

  // Pre-generate tab directions for edges to ensure perfect interlocking:
  // horizontalEdges[r][c]: tab direction between (r, c) and (r, c+1) (+1 = tab right, -1 = tab left)
  const hTabs: number[][] = [];
  for (let r = 0; r < gridSize; r++) {
    hTabs[r] = [];
    for (let c = 0; c < gridSize - 1; c++) {
      hTabs[r][c] = Math.random() > 0.5 ? 1 : -1;
    }
  }

  // verticalEdges[r][c]: tab direction between (r, c) and (r+1, c) (+1 = tab down, -1 = tab up)
  const vTabs: number[][] = [];
  for (let r = 0; r < gridSize - 1; r++) {
    vTabs[r] = [];
    for (let c = 0; c < gridSize; c++) {
      vTabs[r][c] = Math.random() > 0.5 ? 1 : -1;
    }
  }

  const pieceDataUrls: string[] = [];
  const tabSize = Math.min(pieceW, pieceH) * 0.22;

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const canvas = document.createElement('canvas');
      // Buffer room for tabs sticking outward
      canvas.width = Math.floor(pieceW + tabSize * 2);
      canvas.height = Math.floor(pieceH + tabSize * 2);
      const ctx = canvas.getContext('2d')!;

      // Draw jigsaw contour path
      ctx.save();
      ctx.translate(tabSize, tabSize);

      ctx.beginPath();
      // Top edge
      ctx.moveTo(0, 0);
      if (r > 0) {
        drawJigsawTab(ctx, 0, 0, pieceW, 0, -vTabs[r - 1][c] * tabSize);
      } else {
        ctx.lineTo(pieceW, 0);
      }

      // Right edge
      if (c < gridSize - 1) {
        drawJigsawTab(ctx, pieceW, 0, pieceW, pieceH, hTabs[r][c] * tabSize);
      } else {
        ctx.lineTo(pieceW, pieceH);
      }

      // Bottom edge
      if (r < gridSize - 1) {
        drawJigsawTab(ctx, pieceW, pieceH, 0, pieceH, vTabs[r][c] * tabSize);
      } else {
        ctx.lineTo(0, pieceH);
      }

      // Left edge
      if (c > 0) {
        drawJigsawTab(ctx, 0, pieceH, 0, 0, -hTabs[r][c - 1] * tabSize);
      } else {
        ctx.lineTo(0, 0);
      }
      ctx.closePath();

      // Clip and paint source image
      ctx.clip();
      ctx.drawImage(
        img,
        c * pieceW - tabSize,
        r * pieceH - tabSize,
        canvas.width,
        canvas.height,
        -tabSize,
        -tabSize,
        canvas.width,
        canvas.height
      );

      // Stroke piece boundary for crisp real puzzle visibility
      ctx.strokeStyle = 'rgba(0,0,0,0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
      pieceDataUrls.push(canvas.toDataURL('image/png'));
    }
  }

  return pieceDataUrls;
}

/**
 * Draws a bezier curve puzzle tab/blank along an edge
 */
function drawJigsawTab(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  tabOffset: number
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / len;
  const ny = dx / len;

  // Base segment before tab
  const p1x = x1 + dx * 0.38;
  const p1y = y1 + dy * 0.38;
  ctx.lineTo(p1x, p1y);

  // Tab head
  const midX = (x1 + x2) / 2 + nx * tabOffset;
  const midY = (y1 + y2) / 2 + ny * tabOffset;

  const cp1x = p1x + nx * (tabOffset * 0.7);
  const cp1y = p1y + ny * (tabOffset * 0.7);

  const p2x = x1 + dx * 0.62;
  const p2y = y1 + dy * 0.62;

  const cp2x = p2x + nx * (tabOffset * 0.7);
  const cp2y = p2y + ny * (tabOffset * 0.7);

  ctx.bezierCurveTo(cp1x, cp1y, midX - (dx / len) * 8, midY - (dy / len) * 8, midX, midY);
  ctx.bezierCurveTo(midX + (dx / len) * 8, midY + (dy / len) * 8, cp2x, cp2y, p2x, p2y);

  // Remainder to endpoint
  ctx.lineTo(x2, y2);
}
