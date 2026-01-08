import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";

// Creo interfaces
interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[]; // list of customization names
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

// Nos aseguramos de que dummyData sea mejor interpretable
const data = dummyData as DummyData;

async function clearAll(tableId: string): Promise<void> {
    const list = await databases.listDocuments(
        appwriteConfig.databaseId!,
        tableId
    );

    await Promise.all(
        list.documents.map((doc) =>
            databases.deleteDocument(appwriteConfig.databaseId!, tableId, doc.$id)
        )
    );
}

async function clearStorage(): Promise<void> {
    const list = await storage.listFiles(appwriteConfig.bucketId!);

    await Promise.all(
        list.files.map((file) =>
            storage.deleteFile(appwriteConfig.bucketId!, file.$id)
        )
    );
}

async function uploadImageToStorage(imageUrl: string) {
    // Descarga la imagen desde la URL proporcionada.
    const response = await fetch(imageUrl);
    // Convertimos la imagen en datos binarios
    const blob = await response.blob();

    // Crea un objeto de metadatos para el archivo (nombre, tipo y tamaño).
    const fileObj = {
        name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
        type: blob.type,
        size: blob.size,
        uri: imageUrl,
    };

    // Subida el archivo binario al Bucket de Appwrite y le asigna un ID único.
    const file = await storage.createFile(
        appwriteConfig.bucketId!,
        ID.unique(),
        fileObj
    );
    // Una vez subida, pide la URL interna de Appwrite. Esa es la URL que finalmente se guardará en la base de datos.
    return storage.getFileViewURL(appwriteConfig.bucketId!, file.$id);
}

async function seed(): Promise<void> {
    // Limpiamos todo
    await clearAll(appwriteConfig.categoriesTableId!);
    await clearAll(appwriteConfig.customizationTableId!);
    await clearAll(appwriteConfig.menuTableId!);
    await clearAll(appwriteConfig.menuCustomizationTableId!);
    await clearStorage();

    // Creacion de categorias
    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
        const doc = await databases.createDocument(
            appwriteConfig.databaseId!,
            appwriteConfig.categoriesTableId!,
            ID.unique(),
            cat
        );
        categoryMap[cat.name] = doc.$id;
    }

    // Creacion de customizaciones
    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
        const doc = await databases.createDocument(
            appwriteConfig.databaseId!,
            appwriteConfig.customizationTableId!,
            ID.unique(),
            {
                name: cus.name,
                price: cus.price,
                type: cus.type,
            }
        );
        customizationMap[cus.name] = doc.$id;
    }

    // Creacion de los items del menu
    const menuMap: Record<string, string> = {};
    for (const item of data.menu) {
        const uploadedImage = await uploadImageToStorage(item.image_url);

        const doc = await databases.createDocument(
            appwriteConfig.databaseId!,
            appwriteConfig.menuTableId!,
            ID.unique(),
            {
                name: item.name,
                description: item.description,
                image_url: uploadedImage,
                price: item.price,
                rating: item.rating,
                calories: item.calories,
                protein: item.protein,
                categories: categoryMap[item.category_name],
            }
        );

        menuMap[item.name] = doc.$id;

        // Creacion de menu_customization
        for (const cusName of item.customizations) {
            await databases.createDocument(
                appwriteConfig.databaseId!,
                appwriteConfig.menuCustomizationTableId!,
                ID.unique(),
                {
                    menu: doc.$id,
                    customizations: customizationMap[cusName],
                }
            );
        }
    }

    console.log("✅ Seeding complete.");
}

export default seed;