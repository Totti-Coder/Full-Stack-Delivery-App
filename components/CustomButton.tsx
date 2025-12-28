import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { CustomButtonProps } from '@/type'
import cn from "clsx";

const CustomButton = ({
    onPress, // Función que se ejecuta al tocar el botón
    title = "Click Here", // Texto del botón (valor por defecto)
    style, // Clases CSS adicionales para el botón
    textStyle, // Clases CSS adicionales para el texto
    leftIcon, // Icono opcional a la izquierda del texto
    isLoading = false, // Estado de carga (muestra spinner)
}: CustomButtonProps) => {
  return (
    <TouchableOpacity 
    className={cn("custom-btn", style)} 
    onPress={onPress} 
    disabled={isLoading}
    >
      <View className='flex-center flex-row gap-2'>
        {leftIcon}
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text className={cn("text-white paragraph-semibold", textStyle)}>
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  )
}
export default CustomButton