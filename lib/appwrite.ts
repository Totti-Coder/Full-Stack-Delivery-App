import { CreateUserParams, SignInParams } from "@/type";
import { Client, ID } from "react-native-appwrite";
import { Account, Avatars, Databases } from "react-native-appwrite";

// Configuracion de Appwrite
export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  platform: "com.pablo.foodordering",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  userTableId: process.env.EXPO_PUBLIC_APPWRITE_USER_TABLE_ID,
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!)
  .setPlatform(appwriteConfig.platform!);

export const account = new Account(client); // Autenticación
export const databases = new Databases(client); // Base de datos
export const avatars = new Avatars(client); // Generación de avatares

// Registro de usuarios
export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw new Error("Failed to create account");

    // Iniciar sesión automáticamente despues de crear la cuenta
    const session = await signIn({ email, password });

    const avatarUrl = avatars.getInitials(name).toString();

    // Crear documento de usuario en la base de datos
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.userTableId!,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        name,
        avatar: avatarUrl,
      }
    );

    return { account: newAccount, user: newUser, session };

    // Manejo de errores
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};


// Funcion de inicio de sesion
export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error("Error signing in:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};
