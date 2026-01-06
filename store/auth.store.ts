import { getCurrentUser } from '@/lib/appwrite';
import { User } from '@/type';
import { create } from 'zustand';

// Definición del tipo de estado
type AuthState = {
   // Indica si existe un usuario autenticado en la aplicación
    isAuthenticated: boolean;
    // Objeto que contiene toda la información del usuario autenticado, o null si no hay sesión activa.
    user: User | null;
    // Booleano que indica si se está realizando una operación asíncrona de verificación de autenticación.
    isLoading: boolean;
    
    // Setter síncrono para modificar manualmente el estado de autenticación.
    setIsAuthenticated: (value: boolean) => void;
    // Setter síncrono para actualizar los datos del usuario.
    setUser: (value: User | null) => void;
    // Setter síncrono para controlar el estado de carga
    setLoading: (value: boolean) => void;

    // Método asíncrono que encapsula toda la lógica de verificación y obtención del usuario autenticado desde el backend.
    fetchAuthenticatedUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  setIsAuthenticated: (value) => set({isAuthenticated: value}),

  setUser: (user) => set({user}),
  setLoading: (value) => set({isLoading: value}),

  fetchAuthenticatedUser: async () => {
    // Establece el indicador de carga antes de la operación asíncrona, permitiendo que la UI muestre un spinner
    set({isLoading: true});

    try {
      // Realiza una llamada asíncrona a Appwrite a través de la función getCurrentUser()
        const userData = await getCurrentUser();

        // Si userData existe → actualiza el estado con el usuario y marca como autenticado
        if(userData) set({isAuthenticated: true, user: userData })
        // Si userData es null o undefined → limpia el estado 
        else set({ isAuthenticated: false, user: null})
      
      // Manejo de Errores
    } catch(e){
        console.log("fetchAuthenticatedUser error", e);
        // Limpia el estado de autenticación
        set({isAuthenticated: false, user: null})
    } finally {
      // Se ejecuta siempre, independientemente del resultado, desactivando el indicador de carga
        set({isLoading:false});
    }
  }
}));

export default useAuthStore;