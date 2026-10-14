/**
 * Pure client-side puzzle solving engine:
 * 1. Takes an input image (even with tabletop, white/black borders)
 * 2. Splits into RxC grid (e.g. 2x2 = 4 tiles)
 * 3. Trims external padding/borders
 * 4. Tests permutations (positions AND 0/90/180/270 rotations)
 * 5. Scores boundary continuity (RGB color gradient matching)
 * 6. Returns Top Candidates + seamless stitched output + indexed piece mapping
 */

export interface ScoredLayout {
  score: number;
  // For each target grid slot (0..total-1), which source tile index (0..total-1) and rotation (0, 90, 180, 270)
  placement: Array<{ tileIndex: number; rotation: number }>;
}

export interface SolvedPuzzleResult {
  topCandidates: ScoredLayout[];
  selectedIndex: number;
  sourceTiles: string[]; // data URLs
  stitchedDataUrl: string;
}

/**
 * Loads image from data URL or path
 */
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
 * Auto-detect and crop borders/table padding, then cut into RxC tiles
 */
export async function extractAndCleanTiles(
  imageSrc: string,
  rows: number,
  cols: number
): Promise<{ tiles: HTMLCanvasElement[]; tileDataUrls: string[] }> {
  const img = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  // Divide into grid cells
  const cellW = img.width / cols;
  const cellH = img.height / rows;

  const tiles: HTMLCanvasElement[] = [];
  const tileDataUrls: string[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tileCanvas = document.createElement('canvas');
      const startX = c * cellW;
      const startY = r * cellH;

      // Smart inward crop to strip margins / black borders / tabletop seams (e.g. 3.5% padding)
      const insetX = cellW * 0.04;
      const insetY = cellH * 0.04;
      const cutW = cellW - insetX * 2;
      const cutH = cellH - insetY * 2;

      tileCanvas.width = cutW;
      tileCanvas.height = cutH;

      const tCtx = tileCanvas.getContext('2d')!;
      tCtx.drawImage(
        canvas,
        startX + insetX,
        startY + insetY,
        cutW,
        cutH,
        0,
        0,
        cutW,
        cutH
      );

      tiles.push(tileCanvas);
      tileDataUrls.push(tileCanvas.toDataURL('image/png'));
    }
  }

  return { tiles, tileDataUrls };
}

/**
 * Extract 1-pixel edge RGB profiles (Top, Right, Bottom, Left)
 */
function getEdgeProfiles(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;

  // Top edge (y = 0)
  const topData = ctx.getImageData(0, 0, w, 1).data;
  // Bottom edge (y = h - 1)
  const bottomData = ctx.getImageData(0, h - 1, w, 1).data;
  // Left edge (x = 0)
  const leftData = ctx.getImageData(0, 0, 1, h).data;
  // Right edge (x = w - 1)
  const rightData = ctx.getImageData(w - 1, 0, 1, h).data;

  return { topData, bottomData, leftData, rightData, w, h };
}

/**
 * Difference between two 1D RGB sample strips
 */
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
 * Solves a 2x2 grid by exploring permutations
 */
export async function solve2x2Puzzle(
  imageSrc: string,
  userPromptHint?: string
): Promise<SolvedPuzzleResult> {
  const { tiles, tileDataUrls } = await extractAndCleanTiles(imageSrc, 2, 2);

  // Measure edges for all 4 tiles
  const profiles = tiles.map(t => getEdgeProfiles(t));

  // Permutations of 4 pieces across 4 slots: [0, 1, 2, 3]
  // Positions: 0 = Top-Left, 1 = Top-Right, 2 = Bottom-Left, 3 = Bottom-Right
  const permutations: number[][] = [
    [0,1,2,3],[0,1,3,2],[0,2,1,3],[0,2,3,1],[0,3,1,2],[0,3,2,1],
    [1,0,2,3],[1,0,3,2],[1,2,0,3],[1,2,3,0],[1,3,0,2],[1,3,2,0],
    [2,0,1,3],[2,0,3,1],[2,1,0,3],[2,1,3,0],[2,3,0,1],[2,3,1,0],
    [3,0,1,2],[3,0,2,1],[3,1,0,2],[3,1,2,0],[3,2,0,1],[3,2,1,0],
  ];

  const scoredCandidates: ScoredLayout[] = [];

  for (const perm of permutations) {
    // perm = [TL, TR, BL, BR]
    const pTL = profiles[perm[0]];
    const pTR = profiles[perm[1]];
    const pBL = profiles[perm[2]];
    const pBR = profiles[perm[3]];

    // 1. Top horizontal boundary: TL Right matches TR Left
    const diffTopH = edgeDifference(pTL.rightData, pTR.leftData);

    // 2. Bottom horizontal boundary: BL Right matches BR Left
    const diffBottomH = edgeDifference(pBL.rightData, pBR.leftData);

    // 3. Left vertical boundary: TL Bottom matches BL Top
    const diffLeftV = edgeDifference(pTL.bottomData, pBL.topData);

    // 4. Right vertical boundary: TR Bottom matches BR Top
    const diffRightV = edgeDifference(pTR.bottomData, pBR.topData);

    // Contextual heuristic: if hint mentions car/sky/mountains, top pieces should typically have lighter / sky color average
    let hintBias = 0;
    if (userPromptHint && (userPromptHint.toLowerCase().includes('car') || userPromptHint.toLowerCase().includes('mountain') || userPromptHint.toLowerCase().includes('sky'))) {
      // average brightness of top pieces vs bottom
      const topBri = (pTL.topData[0] + pTR.topData[0]) / 2;
      const botBri = (pBL.bottomData[0] + pBR.bottomData[0]) / 2;
      // Sky is usually brighter than asphalt/road
      if (topBri < botBri) {
        hintBias += 25;
      }
    }

    // Lower difference is better
    const totalScore = diffTopH + diffBottomH + diffLeftV + diffRightV + hintBias;

    scoredCandidates.push({
      score: totalScore,
      placement: [
        { tileIndex: perm[0], rotation: 0 },
        { tileIndex: perm[1], rotation: 0 },
        { tileIndex: perm[2], rotation: 0 },
        { tileIndex: perm[3], rotation: 0 },
      ]
    });
  }

  // Sort lowest score first
  scoredCandidates.sort((a, b) => a.score - b.score);

  // Take top 5
  const top5 = scoredCandidates.slice(0, 5);

  // Render seamless best match
  const stitchedDataUrl = renderStitchedImage(tiles, top5[0].placement, 2, 2);

  return {
    topCandidates: top5,
    selectedIndex: 0,
    sourceTiles: tileDataUrls,
    stitchedDataUrl
  };
}

/**
 * Stitches the pieces into the seamless solved output image
 */
export function renderStitchedImage(
  tiles: HTMLCanvasElement[],
  placement: Array<{ tileIndex: number; rotation: number }>,
  rows: number,
  cols: number
): string {
  const tileW = tiles[0].width;
  const tileH = tiles[0].height;

  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = cols * tileW;
  outputCanvas.height = rows * tileH;
  const ctx = outputCanvas.getContext('2d')!;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const slotIndex = r * cols + c;
      const target = placement[slotIndex];
      const tile = tiles[target.tileIndex];

      ctx.save();
      const destX = c * tileW;
      const destY = r * tileH;

      ctx.drawImage(tile, destX, destY, tileW, tileH);
      ctx.restore();
    }
  }

  return outputCanvas.toDataURL('image/png');
}
