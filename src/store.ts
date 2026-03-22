import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

export type Task = 'find_desk' | 'working' | 'make_coffee' | 'write_email' | 'meeting' | 'meeting_active' | 'print_document' | 'it_room' | 'done';
export type UIState = 'none' | 'coffee' | 'email' | 'printer' | 'it';

export interface Player {
  id: string;
  position: [number, number, number];
  color: string;
  action: string;
  target: [number, number, number] | null;
  message: string | null;
}

interface GameState {
  socket: Socket | null;
  players: Record<string, Player>;
  myId: string | null;
  currentTask: Task;
  uiState: UIState;
  connect: () => void;
  movePlayer: (target: [number, number, number]) => void;
  updateLocalPosition: (position: [number, number, number]) => void;
  setAction: (action: string) => void;
  sendMessage: (message: string) => void;
  setTask: (task: Task) => void;
  setUiState: (ui: UIState) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  socket: null,
  players: {},
  myId: null,
  currentTask: 'find_desk',
  uiState: 'none',
  setTask: (task) => set({ currentTask: task }),
  setUiState: (ui) => set({ uiState: ui }),
  connect: () => {
    if (get().socket) return;
    
    // Connect to the same origin
    const socket = io();
    
    socket.on('connect', () => {
      set({ myId: socket.id, socket });
    });

    socket.on('init', (players: Record<string, Player>) => {
      set({ players });
    });

    socket.on('playerJoined', (player: Player) => {
      set((state) => ({
        players: { ...state.players, [player.id]: player }
      }));
    });

    socket.on('playerMoved', ({ id, target }: { id: string, target: [number, number, number] }) => {
      set((state) => {
        const player = state.players[id];
        if (!player) return state;
        if (id === state.myId) return state; // Ignore echo for local player
        return {
          players: {
            ...state.players,
            [id]: { ...player, target, action: 'walking' }
          }
        };
      });
    });

    socket.on('playerAction', ({ id, action }: { id: string, action: string }) => {
       set((state) => {
         const player = state.players[id];
         if (!player) return state;
         if (id === state.myId) return state; // Ignore echo for local player
         return {
           players: {
             ...state.players,
             [id]: { ...player, action }
           }
         };
       });
    });

    socket.on('playerMessage', ({ id, message }: { id: string, message: string }) => {
       set((state) => {
         const player = state.players[id];
         if (!player) return state;
         return {
           players: {
             ...state.players,
             [id]: { ...player, message }
           }
         };
       });
       // Clear message after 4 seconds
       setTimeout(() => {
         set((state) => {
           const player = state.players[id];
           if (!player || player.message !== message) return state;
           return {
             players: {
               ...state.players,
               [id]: { ...player, message: null }
             }
           };
         });
       }, 4000);
    });

    socket.on('playerLeft', (id: string) => {
      set((state) => {
        const newPlayers = { ...state.players };
        delete newPlayers[id];
        return { players: newPlayers };
      });
    });
  },
  movePlayer: (target: [number, number, number]) => {
    const { socket, myId } = get();
    if (socket && myId) {
      socket.emit('move', target);
      // Optimistic update
      set((state) => {
        const player = state.players[myId];
        if (!player) return state;
        return {
          players: {
            ...state.players,
            [myId]: { ...player, target, action: 'walking' }
          }
        };
      });
    }
  },
  updateLocalPosition: (position: [number, number, number]) => {
    const { socket, myId } = get();
    if (socket && myId) {
      socket.emit('positionUpdate', position);
      set((state) => {
        const player = state.players[myId];
        if (!player) return state;
        return {
          players: {
            ...state.players,
            [myId]: { ...player, position }
          }
        };
      });
    }
  },
  setAction: (action: string) => {
    const { socket, myId } = get();
    if (socket && myId) {
      socket.emit('action', action);
      set((state) => {
        const player = state.players[myId];
        if (!player) return state;
        return {
          players: {
            ...state.players,
            [myId]: { ...player, action }
          }
        };
      });
    }
  },
  sendMessage: (message: string) => {
    const { socket, myId } = get();
    if (socket && myId) {
      socket.emit('message', message);
      set((state) => {
        const player = state.players[myId];
        if (!player) return state;
        return {
          players: {
            ...state.players,
            [myId]: { ...player, message }
          }
        };
      });
      
      setTimeout(() => {
         set((state) => {
           const player = state.players[myId];
           if (!player || player.message !== message) return state;
           return {
             players: {
               ...state.players,
               [myId]: { ...player, message: null }
             }
           };
         });
       }, 4000);
    }
  }
}));
