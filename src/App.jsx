import { useState } from 'react';
import BingoCard from './components/BingoCard';
import PatternSelector from './components/PatternSelector';
import { getPatternById, buildCellSet } from './data/patterns';

function App() {
  const [selectedPatternId, setSelectedPatternId] = useState('');

  const selectedPattern = getPatternById(selectedPatternId);
  const markedCells = selectedPattern ? buildCellSet(selectedPattern.cells) : new Set();

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

      {selectedPattern && (
        <p className="mt-4 text-sm text-gray-600">
          <span className="font-semibold">{selectedPattern.name}</span>
          {' '}&mdash; {selectedPattern.cells.length} cells
        </p>
      )}
    </div>
  );
}

export default App;
