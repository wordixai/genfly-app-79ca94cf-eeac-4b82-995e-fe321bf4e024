import { useState } from 'react';
import { useBoardStore } from '@/store/board-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

export function BoardHeader() {
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const { board, addColumn } = useBoardStore();
  
  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      addColumn(newColumnTitle);
      setNewColumnTitle('');
    }
  };
  
  return (
    <div className="flex flex-col gap-4 p-4 bg-background border-b">
      <h1 className="text-2xl font-bold">{board.title}</h1>
      
      <div className="flex items-center gap-2">
        <Input
          placeholder="Add new column..."
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          className="max-w-xs"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddColumn();
            }
          }}
        />
        <Button onClick={handleAddColumn} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Column
        </Button>
      </div>
    </div>
  );
}