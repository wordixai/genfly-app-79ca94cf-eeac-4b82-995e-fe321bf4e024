import { useState } from 'react';
import { Card as CardType } from '@/types';
import { useBoardStore } from '@/store/board-store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Edit2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TrelloCardProps {
  card: CardType;
  columnId: string;
}

export function TrelloCard({ card, columnId }: TrelloCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const [editedDescription, setEditedDescription] = useState(card.description || '');
  
  const { updateCard, deleteCard } = useBoardStore();
  
  const handleSave = () => {
    if (editedTitle.trim()) {
      updateCard(columnId, card.id, {
        title: editedTitle,
        description: editedDescription
      });
      setIsDialogOpen(false);
    }
  };
  
  return (
    <>
      <Card 
        className="cursor-pointer hover:bg-accent transition-colors"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardContent className="p-3 space-y-2">
          <div className="flex justify-between items-start gap-2">
            <p className="text-sm font-medium">{card.title}</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 -mt-1 -mr-1">
                  <Edit2 className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  setIsDialogOpen(true);
                }}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Card
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCard(columnId, card.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Card
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {card.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {card.description}
            </p>
          )}
          
          {card.labels && card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {card.labels.map((label, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                  {label}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Textarea
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="resize-none"
                rows={1}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Add a more detailed description..."
                className="resize-none"
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!editedTitle.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}