import { useState, useEffect } from 'react';
import BingoCard from './components/BingoCard';
import PatternSelector from './components/PatternSelector';
import { getPatternById, getRegularPatterns, getRegularPlusCornersPatterns, buildCellSet } from './data/patterns';
import useCustomPatterns from './hooks/useCustomPatterns';

const regularPatterns = getRegularPatterns();
const regularPlusCornersPatterns = getRegularPlusCornersPatterns();

function App() {
  const [selectedPatternId, setSelectedPatternId] = useState('');
  const [regularIndex, setRegularIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCells, setEditingCells] = useState(new Set());
  const [patternName, setPatternName] = useState('');
  const [saveAsSpecial, setSaveAsSpecial] = useState(false);

  const { customPatterns, savePattern, deletePattern } = useCustomPatterns();

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

  function handlePatternChange(value) {
    if (value === '__create__') {
      setIsEditing(true);
      setEditingCells(new Set());
      setPatternName('');
      setSaveAsSpecial(false);
      setSelectedPatternId('');
      return;
    }
    setSelectedPatternId(value);
  }

  function handleCellToggle(row, col) {
    const key = `${row},${col}`;
    setEditingCells((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  async function handleSave() {
    if (!patternName.trim() || editingCells.size === 0) return;
    const cells = Array.from(editingCells).map((key) => {
      const [r, c] = key.split(',').map(Number);
      return [r, c];
    });

    if (saveAsSpecial) {
      const res = await fetch('/__api/save-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: patternName.trim(), cells }),
      });
      const { id } = await res.json();
      setIsEditing(false);
      setSelectedPatternId(id);
    } else {
      const newId = savePattern(patternName.trim(), cells);
      setIsEditing(false);
      setSelectedPatternId(newId);
    }
  }

  function handleCancel() {
    setIsEditing(false);
    setSelectedPatternId('');
  }

  async function handleSaveToSpecial() {
    const custom = customPatterns.find((p) => p.id === selectedPatternId);
    if (!custom) return;
    const res = await fetch('/__api/save-pattern', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: custom.name, cells: custom.cells }),
    });
    const { id } = await res.json();
    deletePattern(selectedPatternId);
    setSelectedPatternId(id);
  }

  async function handleDelete() {
    if (isCustomPattern) {
      deletePattern(selectedPatternId);
    } else if (isUserSpecialPattern) {
      await fetch('/__api/delete-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedPatternId }),
      });
    }
    setSelectedPatternId('');
  }

  const isCustomPattern = selectedPatternId.startsWith('custom-');
  const isUserSpecialPattern = selectedPatternId.startsWith('u-');

  let markedCells;
  let displayPattern;

  if (isEditing) {
    markedCells = editingCells;
    displayPattern = null;
  } else if (isCustomPattern) {
    const custom = customPatterns.find((p) => p.id === selectedPatternId);
    markedCells = custom ? buildCellSet(custom.cells) : new Set();
    displayPattern = custom;
  } else if (isAnimated) {
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
        selectedPatternId={isEditing ? '' : selectedPatternId}
        onPatternChange={handlePatternChange}
        customPatterns={customPatterns}
      />

      {isEditing && (
        <p className="mt-3 text-sm text-indigo-600 font-medium">
          Click cells to toggle them on/off
        </p>
      )}

      <div className="mt-8">
        <BingoCard
          markedCells={markedCells}
          editable={isEditing}
          onCellToggle={handleCellToggle}
        />
      </div>

      {isEditing && (
        <div className="mt-4 flex flex-col items-center gap-3">
          <input
            type="text"
            value={patternName}
            onChange={(e) => setPatternName(e.target.value)}
            placeholder="Pattern name"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={saveAsSpecial}
              onChange={(e) => setSaveAsSpecial(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Save as Special pattern
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!patternName.trim() || editingCells.size === 0}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Pattern
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {displayPattern && !isAnimated && !isEditing && (
        <p className="mt-4 text-sm text-gray-600">
          <span className="font-semibold">{displayPattern.name}</span>
          {' '}&mdash; {displayPattern.cells.length} cells
        </p>
      )}

      {(isCustomPattern || isUserSpecialPattern) && !isEditing && (
        <div className="mt-2 flex gap-2">
          {isCustomPattern && (
            <button
              onClick={handleSaveToSpecial}
              className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded hover:bg-indigo-200"
            >
              Save to Special
            </button>
          )}
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded hover:bg-red-200"
          >
            Delete Pattern
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
