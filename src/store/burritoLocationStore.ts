import { create } from 'zustand';
import { BurritoLocation } from '../features/map/types';
import { MapService } from '../features/map/services/map_service';

interface BurritoStoreState {
  location: BurritoLocation | null;
  isConnecting: boolean;
    
  //Agrupamos las acciones
  actions: {
    startTracking: () => void;
    stopTracking: () => void;
  }
}

export const useBurritoStore = create<BurritoStoreState>((set) => {
  let stopBurritoLocationTracking: (() => void) | undefined;

  return {
    location: null,
    isConnecting: false,

    actions: {
      startTracking: () => {
        if (stopBurritoLocationTracking) return;

        set({ isConnecting: true });

        stopBurritoLocationTracking = MapService.subscribeToBusLocation((newLocation) => {
          set({ 
            location: newLocation,
            isConnecting: false 
          });
        });
      },

      stopTracking: () => {
        if (stopBurritoLocationTracking) {
          stopBurritoLocationTracking();
          stopBurritoLocationTracking = undefined;
        }
        set({ location: null, isConnecting: false });
      }
    }
  };
});