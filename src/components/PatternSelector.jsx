import { getSpecialPatterns } from '../data/patterns';

const specialPatterns = getSpecialPatterns();

export default function PatternSelector({ selectedPatternId, onPatternChange }) {
  return (
    <select
      value={selectedPatternId}
      onChange={(e) => onPatternChange(e.target.value)}
      className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    >
      <option value="">Select a pattern</option>
      <option value="regular">Regular</option>
      <option value="regular-corners">Regular + Four Corners</option>
      <optgroup label="Special">
        {specialPatterns.map((pattern) => (
          <option key={pattern.id} value={pattern.id}>
            {pattern.name}
          </option>
        ))}
      </optgroup>
    </select>
  );
}
