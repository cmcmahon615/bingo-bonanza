const patterns = [
  // Horizontal
  { id: 'h-row-0', name: 'Row 1 (Top)', category: 'Horizontal', cells: [[0,0],[0,1],[0,2],[0,3],[0,4]] },
  { id: 'h-row-1', name: 'Row 2', category: 'Horizontal', cells: [[1,0],[1,1],[1,2],[1,3],[1,4]] },
  { id: 'h-row-2', name: 'Row 3 (Middle)', category: 'Horizontal', cells: [[2,0],[2,1],[2,2],[2,3],[2,4]] },
  { id: 'h-row-3', name: 'Row 4', category: 'Horizontal', cells: [[3,0],[3,1],[3,2],[3,3],[3,4]] },
  { id: 'h-row-4', name: 'Row 5 (Bottom)', category: 'Horizontal', cells: [[4,0],[4,1],[4,2],[4,3],[4,4]] },

  // Vertical
  { id: 'v-col-0', name: 'Column B', category: 'Vertical', cells: [[0,0],[1,0],[2,0],[3,0],[4,0]] },
  { id: 'v-col-1', name: 'Column I', category: 'Vertical', cells: [[0,1],[1,1],[2,1],[3,1],[4,1]] },
  { id: 'v-col-2', name: 'Column N', category: 'Vertical', cells: [[0,2],[1,2],[2,2],[3,2],[4,2]] },
  { id: 'v-col-3', name: 'Column G', category: 'Vertical', cells: [[0,3],[1,3],[2,3],[3,3],[4,3]] },
  { id: 'v-col-4', name: 'Column O', category: 'Vertical', cells: [[0,4],[1,4],[2,4],[3,4],[4,4]] },

  // Diagonal
  { id: 'd-tlbr', name: 'Top-Left to Bottom-Right', category: 'Diagonal', cells: [[0,0],[1,1],[2,2],[3,3],[4,4]] },
  { id: 'd-trbl', name: 'Top-Right to Bottom-Left', category: 'Diagonal', cells: [[0,4],[1,3],[2,2],[3,1],[4,0]] },

  // Special
  { id: 's-corners', name: 'Four Corners', category: 'Special', cells: [[0,0],[0,4],[4,0],[4,4]] },
  { id: 's-blackout', name: 'Blackout', category: 'Special', cells: Array.from({ length: 25 }, (_, i) => [Math.floor(i / 5), i % 5]) },
  { id: 's-x', name: 'X Pattern', category: 'Special', cells: [[0,0],[0,4],[1,1],[1,3],[2,2],[3,1],[3,3],[4,0],[4,4]] },
  { id: 's-plus', name: 'Plus / Cross', category: 'Special', cells: [[0,2],[1,2],[2,0],[2,1],[2,2],[2,3],[2,4],[3,2],[4,2]] },

  //User Created
  { id: 'u-diamond', name: 'Diamond', category: 'Special', cells: [[0,2],[1,1],[2,0],[3,1],[4,2],[3,3],[2,4],[1,3]] },
  { id: 'u-t', name: 'T', category: 'Special', cells: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,2],[2,2],[3,2],[4,2]] },
];

export function buildCellSet(cells) {
  return new Set(cells.map(([row, col]) => `${row},${col}`));
}

export function getRegularPatterns() {
  return patterns.filter(p => ['Horizontal', 'Vertical', 'Diagonal'].includes(p.category));
}

export function getRegularPlusCornersPatterns() {
  return patterns.filter(p =>
    ['Horizontal', 'Vertical', 'Diagonal'].includes(p.category) || p.id === 's-corners'
  );
}

export function getSpecialPatterns() {
  return patterns.filter(p => p.category === 'Special');
}

export function getPatternById(id) {
  return patterns.find(p => p.id === id) || null;
}

export default patterns;
