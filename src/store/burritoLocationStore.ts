import { create } from 'zustand';
import { BurritoLocation } from '../features/map/types';
import { MapService } from '../features/map/services/map_service';

// ✅ NUEVO: Tres estados en lugar del booleano isBusOnline.
// La app solo puede medir la antigüedad del último timestamp recibido.
// No puede distinguir si el problema es el internet del bus o del estudiante.
// Por eso los nombres reflejan lo que realmente sabemos: qué tan fresco es el dato.
//
// < 7000ms  → 'stable' → dato fresco, bus enviando con normalidad
// 7000-10000ms → 'weak' → llevamos 2-3 ciclos sin dato nuevo, algo falla
// > 10000ms → 'lost'   → 3+ ciclos perdidos, conexión cortada
export type BusSignalStatus = 'stable' | 'weak' | 'lost';

const getSignalStatus = (timestampAge: number): BusSignalStatus => {
  if (timestampAge < 7000)  return 'stable';
  if (timestampAge < 10000) return 'weak';
  return 'lost';
};

interface BurritoStoreState {
  location: BurritoLocation | null;
  isConnecting: boolean;
  busSignalStatus: BusSignalStatus; // ✅ reemplaza isBusOnline: boolean

  actions: {
    startTracking: () => void;
    stopTracking: () => void;
  }
}

export const useBurritoStore = create<BurritoStoreState>((set) => {
  let stopBurritoLocationTracking: (() => void) | undefined;
  let onlineInterval: NodeJS.Timeout | undefined;

  return {
    location: null,
    isConnecting: false,
    busSignalStatus: 'lost', // Estado inicial: no tenemos dato todavía

    actions: {
      startTracking: () => {
        if (stopBurritoLocationTracking) {
          stopBurritoLocationTracking();
        }
        if (onlineInterval) {
          clearInterval(onlineInterval);
        }

        set({ isConnecting: true, location: null, busSignalStatus: 'lost' });

        stopBurritoLocationTracking = MapService.subscribeToBusLocation((newLocation) => {
          const now = Date.now();
          const busTime = newLocation?.timestamp || 0;

          set({
            location: newLocation,
            isConnecting: false,
            busSignalStatus: getSignalStatus(now - busTime)
          });
        });

        // Intervalo que revisa cada 2 segundos si el dato sigue siendo fresco.
        // Necesario porque Firebase no avisa cuando deja de recibir datos,
        // solo cuando recibe datos nuevos. Sin este intervalo, el status
        // quedaría en 'stable' para siempre aunque el bus desaparezca.
        onlineInterval = setInterval(() => {
          set((state) => {
            if (!state.location) return { busSignalStatus: 'lost' };
            const now = Date.now();
            const busTime = state.location?.timestamp || 0;
            return { busSignalStatus: getSignalStatus(now - busTime) };
          });
        }, 2000);
      },

      stopTracking: () => {
        if (stopBurritoLocationTracking) {
          stopBurritoLocationTracking();
          stopBurritoLocationTracking = undefined;
        }
        if (onlineInterval) {
          clearInterval(onlineInterval);
          onlineInterval = undefined;
        }
        set({ location: null, isConnecting: false, busSignalStatus: 'lost' });
      }
    }
  };
});