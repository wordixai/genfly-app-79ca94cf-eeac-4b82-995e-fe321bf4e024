import { useState } from 'react';
import { Card as CardType } from '@/types';
import { useBoardStore } from '@/store/board-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Plus, X, Edit2 } from 'lucide-react';
import { TrelloCard } from '@/components/TrelloCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ColumnProps {
  id: string;
  title: string;
  cards: CardType[];
}

export function Column({ id, title, cards }: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  
  const { updateColumnTitle, deleteColumn, addCard } = useBoardStore();
  
  const handleTitleSave = () => {
    if (editedTitle.trim()) {
      updateColumnTitle(id, editedTitle);
    } else {
      setEditedTitle(title);
    }
    setIsEditing(false);
  };
  
  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      addCard(id, newCardTitle);
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };
  
  return (
    <Card className="w-72 shrink-0 bg-muted/50">
      <CardHeader className="p-3 space-y-0">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="flex items-center gap-1 w-full">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                autoFocus
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSave();
                  if (e.key === 'Escape') {
                    setEditedTitle(title);
                    setIsEditing(false);
                  }
                }}
                className="h-7 py-1"
              />
            </div>
          ) : (
            <CardTitle 
              className="text-sm font-medium cursor-pointer" 
              onClick={() => setIsEditing(true)}
            >
              {title}
            </CardTitle>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Title
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => deleteColumn(id)}
              >
                <X className="h-4 w-4 mr-2" />
                Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 pt-0 flex flex-col gap-2 max-h-[calc(100vh-12rem)] overflow-auto">
        {cards.map((card) => (
          <TrelloCard 
            key={card.id} 
            card={card} 
            columnId={id} 
          />
        ))}
        
        {isAddingCard ? (
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Enter card title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              autoFocus
              onBlur={() => {
                if (!newCardTitle.trim()) {
                  setIsAddingCard(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddCard();
                if (e.key === 'Escape') setIsAddingCard(false);
              }}
            />
            <div className="flex items-center gap-1">
              <Button 
                size="sm" 
                onClick={handleAddCard}
                disabled={!newCardTitle.trim()}
              >
                Add Card
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setIsAddingCard(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            className="flex items-center justify-start text-muted-foreground"
            onClick={() => setIsAddingCard(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add a card
          </Button>
        )}
      </CardContent>
    </Card>
  );
}