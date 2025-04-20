import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Board, Column, Card } from '@/types';

interface BoardState {
  board: Board;
  addColumn: (title: string) => void;
  updateColumnTitle: (columnId: string, title: string) => void;
  deleteColumn: (columnId: string) => void;
  addCard: (columnId: string, title: string) => void;
  updateCard: (columnId: string, cardId: string, card: Partial<Card>) => void;
  deleteCard: (columnId: string, cardId: string) => void;
  moveCard: (fromColumnId: string, toColumnId: string, cardId: string) => void;
}

// Initialize with a sample board
const initialBoard: Board = {
  id: uuidv4(),
  title: 'My Trello Board',
  columns: [
    {
      id: uuidv4(),
      title: 'To Do',
      cards: [
        {
          id: uuidv4(),
          title: 'Learn React',
          description: 'Study React fundamentals and hooks',
          labels: ['learning']
        },
        {
          id: uuidv4(),
          title: 'Build a Trello Clone',
          description: 'Create a Trello clone with React',
          labels: ['project']
        }
      ]
    },
    {
      id: uuidv4(),
      title: 'In Progress',
      cards: [
        {
          id: uuidv4(),
          title: 'Setup development environment',
          description: 'Install necessary tools and dependencies',
          labels: ['setup']
        }
      ]
    },
    {
      id: uuidv4(),
      title: 'Done',
      cards: []
    }
  ]
};

export const useBoardStore = create<BoardState>((set) => ({
  board: initialBoard,
  
  addColumn: (title: string) => set((state) => {
    const newColumn: Column = {
      id: uuidv4(),
      title,
      cards: []
    };
    
    return {
      board: {
        ...state.board,
        columns: [...state.board.columns, newColumn]
      }
    };
  }),
  
  updateColumnTitle: (columnId: string, title: string) => set((state) => {
    const updatedColumns = state.board.columns.map(column => 
      column.id === columnId ? { ...column, title } : column
    );
    
    return {
      board: {
        ...state.board,
        columns: updatedColumns
      }
    };
  }),
  
  deleteColumn: (columnId: string) => set((state) => {
    const filteredColumns = state.board.columns.filter(column => column.id !== columnId);
    
    return {
      board: {
        ...state.board,
        columns: filteredColumns
      }
    };
  }),
  
  addCard: (columnId: string, title: string) => set((state) => {
    const newCard: Card = {
      id: uuidv4(),
      title,
      description: '',
      labels: []
    };
    
    const updatedColumns = state.board.columns.map(column => 
      column.id === columnId 
        ? { ...column, cards: [...column.cards, newCard] } 
        : column
    );
    
    return {
      board: {
        ...state.board,
        columns: updatedColumns
      }
    };
  }),
  
  updateCard: (columnId: string, cardId: string, updatedCard: Partial<Card>) => set((state) => {
    const updatedColumns = state.board.columns.map(column => 
      column.id === columnId 
        ? { 
            ...column, 
            cards: column.cards.map(card => 
              card.id === cardId 
                ? { ...card, ...updatedCard } 
                : card
            ) 
          } 
        : column
    );
    
    return {
      board: {
        ...state.board,
        columns: updatedColumns
      }
    };
  }),
  
  deleteCard: (columnId: string, cardId: string) => set((state) => {
    const updatedColumns = state.board.columns.map(column => 
      column.id === columnId 
        ? { 
            ...column, 
            cards: column.cards.filter(card => card.id !== cardId) 
          } 
        : column
    );
    
    return {
      board: {
        ...state.board,
        columns: updatedColumns
      }
    };
  }),
  
  moveCard: (fromColumnId: string, toColumnId: string, cardId: string) => set((state) => {
    // Find the card to move
    const fromColumn = state.board.columns.find(col => col.id === fromColumnId);
    if (!fromColumn) return state;
    
    const cardToMove = fromColumn.cards.find(card => card.id === cardId);
    if (!cardToMove) return state;
    
    // Remove card from source column
    const sourceColumnUpdated = {
      ...fromColumn,
      cards: fromColumn.cards.filter(card => card.id !== cardId)
    };
    
    // Add card to target column
    const updatedColumns = state.board.columns.map(column => {
      if (column.id === fromColumnId) {
        return sourceColumnUpdated;
      }
      
      if (column.id === toColumnId) {
        return {
          ...column,
          cards: [...column.cards, cardToMove]
        };
      }
      
      return column;
    });
    
    return {
      board: {
        ...state.board,
        columns: updatedColumns
      }
    };
  })
}));