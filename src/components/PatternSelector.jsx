import { getGroupedPatterns } from '../data/patterns';

const groupedPatterns = getGroupedPatterns();
const categoryOrder = ['Horizontal', 'Vertical', 'Diagonal', 'Special'];

export default function PatternSelector({ selectedPatternId, onPatternChange }) {
  return (
    <select
      value={selectedPatternId}
      onChange={(e) => onPatternChange(e.target.value)}
      className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    >
      <option value="">Select a pattern</option>
      {categoryOrder.map((category) => (
        <optgroup key={category} label={category}>
          {groupedPatterns[category].map((pattern) => (
            <option key={pattern.id} value={pattern.id}>
              {pattern.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
