import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import { CustomInputProps } from "@/type";
import cn from "clsx";

const CustomInput = ({
  placeholder = "Enter text", // Texto gris cuando el input está vacío
  value, // Valor actual del input
  onChangeText, // Función que se llama al escribir
  label,  // Etiqueta sobre el input
  secureTextEntry = false, // Para passwords (oculta el texto)
  keyboardType = "default", // Tipo de teclado a mostrar
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  return (
    <View className="w-full">
      <Text className="label">{label}</Text>
      <TextInput
        autoCapitalize="none" //  No pone mayúsculas automáticamente
        autoCorrect={false} // No corrige ortografía
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor="#888"
        className={cn(
          "input",
          isFocused ? "border-primary" : "border-gray-300"
        )}
      />
    </View>
  );
};

export default CustomInput;
