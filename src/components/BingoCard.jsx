const HEADERS = ['B', 'I', 'N', 'G', 'O'];

export default function BingoCard({ markedCells }) {
  return (
    <div className="inline-block">
      {/* Column headers */}
      <div className="grid grid-cols-5 gap-1 mb-1">
        {HEADERS.map((letter) => (
          <div
            key={letter}
            className="w-16 h-10 flex items-center justify-center text-xl font-bold text-indigo-700"
          >
            {letter}
          </div>
        ))}
      </div>

      {/* 5x5 grid */}
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: 25 }, (_, i) => {
          const row = Math.floor(i / 5);
          const col = i % 5;
          const isFree = row === 2 && col === 2;
          const isMarked = markedCells.has(`${row},${col}`);

          return (
            <div
              key={`${row},${col}`}
              className="w-16 h-16 relative flex items-center justify-center border border-gray-300 bg-white rounded-md text-sm font-medium text-gray-500"
            >
              {isFree && <span className="text-xs font-bold text-indigo-600">FREE</span>}
              {isMarked && (
                <div className="absolute inset-1 rounded-full bg-red-500/30 border-2 border-red-500" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
