import { CreateUserParams, SignInParams, User } from "@/type";
import { Client, ID, Query } from "react-native-appwrite";
import { Account, Avatars, Databases, Storage } from "react-native-appwrite";

// Configuracion de Appwrite
export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  platform: "com.pablo.foodordering",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  userTableId: process.env.EXPO_PUBLIC_APPWRITE_USER_TABLE_ID,
  categoriesTableId: process.env.EXPO_PUBLIC_CATEGORIES_TABLE_ID,
  menuTableId: process.env.EXPO_PUBLIC_APPWRITE_MENU_TABLE_ID,
  customizationTableId: process.env.EXPO_PUBLIC_APPWRITE_CUSTOMIZATION_TABLE_ID,
  menuCustomizationTableId: process.env.EXPO_PUBLIC_MENU_CUSTOMIZATION_MENU_TABLE_ID,
  bucketId: process.env.EXPO_PUBLIC_BUCKET_ID,
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint!) // La dirección de tu servidor.
  .setProject(appwriteConfig.projectId!) // El ID del proyecto.
  .setPlatform(appwriteConfig.platform!); // El ID del app.

export const account = new Account(client); // Maneja todo lo técnico de los usuarios: crear cuenta, iniciar sesión, cerrar sesión y recuperar la contraseña.
export const databases = new Databases(client); // Maneja las tablas de la base de datos
export const avatars = new Avatars(client); // Es una utilidad que genera imágenes automáticamente
export const storage = new Storage(client);

// Registro de usuarios
export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    // Creacion de cuenta

    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw new Error("Failed to create account");

    // Iniciar sesión automáticamente despues de crear la cuenta
    const session = await signIn({ email, password });

    const avatarUrl = `${appwriteConfig.endpoint}/avatars/${encodeURIComponent(name)}`;

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
    // Creacion de la sesion
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error("Error signing in:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    // Funcion de Appwrite para comprobar si existe una sesion iniciada
    const currentAccount = await account.get();
    if (!currentAccount) throw Error();

    // Busca el perfil en la base de datos
    const currentUser = await databases.listDocuments<User>(
      appwriteConfig.databaseId!,
      appwriteConfig.userTableId!,
      // Filtra unicamente el usuario con el id que queremos
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];

  } catch (error) {

    console.log(error);
    throw new Error(error as string);
  }
};
