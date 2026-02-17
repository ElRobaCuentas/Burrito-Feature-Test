export interface BurritoLocation {
    latitude: number;   
    longitude: number;  
    heading: number;    
    isActive: boolean;  
    timestamp?: number;  
}


export interface MapRegion {
    latitude: number;
    longitude: number;
    latitudeDelta: number; // Zoom vertical
    longitudeDelta: number; // Zoom horizontal
}


