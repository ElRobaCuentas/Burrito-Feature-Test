//archivo para manejar los tipos de permisos. Como YO quiero manejar los permisos (propios de mi). Alejado de que este usando los propios de React Native

/*
    ?1. 'undetermined': Acabas de instalar la app. 
    El usuario nunca ha visto la "ventanita emergente" (popup) pidiendo permiso. 
    Aquí es donde tu app debe mostrar el botón "Permitir ubicación" para lanzar el popup del sistema.

    ?2. 'granted': Éxito total. 
    El usuario le dio a "Permitir".
    Aquí debo mostrar el mapa, obetener coordenadas y ocultar cualquier pantalla de "pedir permisos"

    ?3. 'denied': "No, ahora no". 
    El usuario presionó "No permitir"
    - En este estado, todavía puedes volver a pedir el permiso. Si lanzas la función request(), el
    popus volverá a salir. 

    ?4. 'blocked': NO. "No y no molestes más. No volver a preguntar"
    - Si intentas pedir permiso de nuevo por código ( request() ), el sistema operativo bloquea el 
    popup automáticamente y no muestra nada. 

    *No puedes volver a pedir permiso "directo". Tienes que mostrar un botón que diga "Abrir ajustes"
    *para que el usuario lo active manualmente desla la configuración del teléfono. 

    ?5. 'limited': "Sí, pero no exacto"
    Tu app funciona pero con menos precisión. 
    !Dependiendo de tu app. Para el proyecto burrito si es necesario una ubicación EXACTA. 

    ?6. 'unavailable': Problema de hardware o Restricción del sistema. NO ESTA DISPONIBLE
    - "Pones pidiendo acceso a la cámara cuando el dispositivo no tiene cámara"
    - Hay un control propio del S.O que no permite el GPS. 


    Aquí debemos informar al usuario que su dispositivo no soporta la función. 
*/


export type PermissionStatus = 
    | 'granted'
    | 'denied'
    | 'blocked'
    | 'limited'
    | 'unavailable'
    | 'undetermined'

