import { useState, useEffect } from 'react';
import BingoCard from './components/BingoCard';
import PatternSelector from './components/PatternSelector';
import { getPatternById, getRegularPatterns, getRegularPlusCornersPatterns, buildCellSet } from './data/patterns';

const regularPatterns = getRegularPatterns();
const regularPlusCornersPatterns = getRegularPlusCornersPatterns();

function App() {
  const [selectedPatternId, setSelectedPatternId] = useState('');
  const [regularIndex, setRegularIndex] = useState(0);

  const isAnimated = selectedPatternId === 'regular' || selectedPatternId === 'regular-corners';
  const animatedPatterns = selectedPatternId === 'regular-corners' ? regularPlusCornersPatterns : regularPatterns;

  useEffect(() => {
    if (!isAnimated) return;
    setRegularIndex(0);
    const interval = setInterval(() => {
      setRegularIndex((i) => (i + 1) % animatedPatterns.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [isAnimated, animatedPatterns]);

  let markedCells;
  let displayPattern;

  if (isAnimated) {
    displayPattern = animatedPatterns[regularIndex % animatedPatterns.length];
    markedCells = buildCellSet(displayPattern.cells);
  } else {
    displayPattern = getPatternById(selectedPatternId);
    markedCells = displayPattern ? buildCellSet(displayPattern.cells) : new Set();
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bingo Bonanza</h1>

      <PatternSelector
        selectedPatternId={selectedPatternId}
        onPatternChange={setSelectedPatternId}
      />

      <div className="mt-8">
        <BingoCard markedCells={markedCells} />
      </div>

      {displayPattern && !isAnimated && (
        <p className="mt-4 text-sm text-gray-600">
          <span className="font-semibold">{displayPattern.name}</span>
          {' '}&mdash; {displayPattern.cells.length} cells
        </p>
      )}
    </div>
  );
}

export default App;
