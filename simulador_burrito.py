import firebase_admin
from firebase_admin import credentials, db
import time
import math

# --- 1. CONFIGURACIÓN ---
DB_URL = 'https://burritounmsm-default-rtdb.firebaseio.com/'
REF_PATH = 'ubicacion_burrito'

# AJUSTES DE VELOCIDAD
VELOCIDAD_SIMULADA = 0.4  # Tiempo entre micropuntos (más bajo = más rápido)
PASOS_POR_TRAMO = 12      # Suavidad del movimiento
TIEMPO_EN_PARADERO = 4    # <--- BAJAMOS A 4 SEGUNDOS

# --- 2. TUS PARADEROS ---
PARADEROS = {
    "Odontología": (-12.054874, -77.085864),
    "Plaza Cívica": (-12.056032, -77.084961),
    "Gimnasio": (-12.059645, -77.084506),
    "Comedor": (-12.060779, -77.082937),
    "Ing. Industrial": (-12.060286, -77.080576),
    "Puerta 2": (-12.059591, -77.079673),
    "F. de Derecho": (-12.057659, -77.080160),
    "Clínica": (-12.055556, -77.082098),
    "Puerta 7": (-12.054729, -77.083637),
    "Sistemas": (-12.053732, -77.085652),
}

# --- 3. RUTA COMPLETA ---
RUTA_BASE = [
    [-77.085864, -12.054874], [-77.085367, -12.054920], [-77.085305, -12.055082], 
    [-77.084775, -12.055352], [-77.084813, -12.055689], [-77.084961, -12.056032], 
    [-77.085145, -12.056323], [-77.085636, -12.057510], [-77.085652, -12.058127], 
    [-77.084908, -12.058541], [-77.084617, -12.058889], [-77.084506, -12.059645], 
    [-77.084215, -12.060934], [-77.082937, -12.060779], [-77.082306, -12.060690], 
    [-77.080576, -12.060286], [-77.079831, -12.060067], [-77.079673, -12.059591], 
    [-77.080160, -12.057659], [-77.080815, -12.056374], [-77.082098, -12.055556], 
    [-77.082908, -12.055496], [-77.083637, -12.054729], [-77.084986, -12.053903], 
    [-77.085652, -12.053732], [-77.086405, -12.053511], [-77.086606, -12.054744], 
    [-77.085864, -12.054874]
]

def simular():
    print("🚌 Simulador Burrito v3.0 | Moviendo suave y parando en estaciones...")
    cred = credentials.Certificate("serviceAccountKey.json") # Asegúrate que el nombre coincida
    firebase_admin.initialize_app(cred, {'databaseURL': DB_URL})
    bus_ref = db.reference(REF_PATH)

    ultimo_paradero_visitado = ""

    while True:
        for i in range(len(RUTA_BASE) - 1):
            p1, p2 = RUTA_BASE[i], RUTA_BASE[i + 1]
            
            for step in range(PASOS_POR_TRAMO):
                f = step / PASOS_POR_TRAMO
                curr_lng = p1[0] + (p2[0] - p1[0]) * f
                curr_lat = p1[1] + (p2[1] - p1[1]) * f

                paradero_actual = None
                for nombre, coord in PARADEROS.items():
                    dist = math.sqrt((curr_lat - coord[0])**2 + (curr_lng - coord[1])**2)
                    if dist < 0.00018: # Margen para detectar parada
                        paradero_actual = nombre
                        break

                # LÓGICA DE ENVÍO Y ESPERA
                if paradero_actual and paradero_actual != ultimo_paradero_visitado:
                    print(f"🛑 LLEGADA A: {paradero_actual} | Esperando {TIEMPO_EN_PARADERO}s...")
                    bus_ref.update({'latitude': PARADEROS[paradero_actual][0], 'longitude': PARADEROS[paradero_actual][1], 'speed': 0, 'timestamp': int(time.time()*1000)})
                    time.sleep(TIEMPO_EN_PARADERO)
                    ultimo_paradero_visitado = paradero_actual
                else:
                    # Si ya no estamos en el rango del paradero, limpiamos el "último visitado"
                    if not paradero_actual: ultimo_paradero_visitado = ""
                    
                    bus_ref.update({'latitude': curr_lat, 'longitude': curr_lng, 'speed': 20, 'timestamp': int(time.time()*1000)})
                    print(f"🛰️ En ruta: {round(curr_lat,4)}, {round(curr_lng,4)}")
                    time.sleep(VELOCIDAD_SIMULADA)

if __name__ == "__main__":
    try:
        simular()
    except KeyboardInterrupt:
        print("\n👋 Simulación detenida.")