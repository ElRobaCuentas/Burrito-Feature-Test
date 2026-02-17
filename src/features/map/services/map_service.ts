import { firebaseDatabase } from "../../../shared/config/firebase";
import { BurritoLocation } from "../types";

const BURRITO_LOCATION_PATH = '/ubicacion_burrito';

export const MapService = {

    subscribeToBusLocation: (onLocationUpdate: (location: BurritoLocation) => void) => {

        const ref = firebaseDatabase.ref(BURRITO_LOCATION_PATH);

        const onValueChange = ref.on('value', (snapshot) => {
            
            const data = snapshot.val();

            if (!data) return;

            const safeLocation: BurritoLocation = {
                latitude: data.latitude ?? 0,
                longitude: data.longitude ?? 0,
                heading: data.heading ?? 0,
                isActive: data.isActive ?? false,
                timestamp: data.timestamp ?? Date.now()
            };

            onLocationUpdate(safeLocation);
        });

        return () => ref.off('value',onValueChange);

    }




}