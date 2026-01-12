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
    fetchAuthenticatedUser: () => Promise<User | null>;
    
    // Método para limpiar el estado al cerrar sesión
    clearAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  setIsAuthenticated: (value) => set({isAuthenticated: value}),
  setUser: (user) => set({user}),
  setLoading: (value) => set({isLoading: value}),

  fetchAuthenticatedUser: async () => {
    set({isLoading: true});

    try {
      const userData = await getCurrentUser();

      if(userData) {
        set({isAuthenticated: true, user: userData });
        return userData;
      } else {
        set({ isAuthenticated: false, user: null});
        return null;
      }
      
    } catch(e){
      console.log("fetchAuthenticatedUser error", e);
      set({isAuthenticated: false, user: null});
      return null;
    } finally {
      set({isLoading:false});
    }
  },
  clearAuth: () => {
    set({
      isAuthenticated: false,
      user: null,
      isLoading: false
    });
  }
}));

export default useAuthStore;