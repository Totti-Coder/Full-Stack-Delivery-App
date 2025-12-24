import "./global.css"
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-green-100">
      <Text className="text-5xl text-center font-bold text-primary font-quicksand-bold">
        Bievenido a PabloEats
      </Text>
    </View>
  );
}