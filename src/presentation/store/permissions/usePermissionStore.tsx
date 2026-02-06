//vamos a crear nuestro gestor de zustand

import { create } from "zustand";
import { PermissionStatus } from "../../../infrastructure/interfaces/permissions";
import { checkLocationPermission, requestLocationPermission } from "../../../actions/permissions/location";



interface PermissionsState {

    locationStatus: PermissionStatus //para colocar todos los status de los permisos de la app

    //metodos
    requestLocationPermission: () => Promise<PermissionStatus>; //2. A diferencia de este cuando lo mande a llamar literalmente quiero preguntarle al usuario si me da permiso o no. 
    checkLocationPermission: ()  => Promise<PermissionStatus>;   //1. Si estamos en algun loading verificando el estado o entra por primera vez. A diferencia del request en este solo lo voy a verificar sin preguntar. Voy a verificar el estado del mismo

}


export const usePermissionStore = create<PermissionsState>()(set => ({

    locationStatus: 'undetermined',  //todavia no se si ya esta probado, si esta previamente probado, si la persona salió de la app, etc. Esto es al inicio de todo.¿, de acá parte la app. 

    requestLocationPermission: async() => {
        const status = await requestLocationPermission();

        //vamos a establecer el nuevo valor que nosotros tengamos despues de lo que sea que suceda al llamar a esa función (granted, denied, ...)
        //sea lo que sea voy a establecerlo llamando a la función set. Voy a establecer el locationStatus al status que tengo por ahi, es decir el: const status = await requestLocationPermission();

        set({ locationStatus: status})
        return status;
    },

    
    checkLocationPermission: async() => {
        const status = await checkLocationPermission();
        set({ locationStatus: status})
        return status;
    }

}))