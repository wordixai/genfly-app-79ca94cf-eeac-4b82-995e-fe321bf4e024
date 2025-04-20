import { useBoardStore } from '@/store/board-store';
import { Column } from '@/components/Column';
import { BoardHeader } from '@/components/BoardHeader';

export function Board() {
  const { board } = useBoardStore();
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <BoardHeader />
      
      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 h-full">
          {board.columns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              cards={column.cards}
            />
          ))}
        </div>
      </div>
    </div>
  );
}