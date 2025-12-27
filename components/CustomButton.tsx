import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { CustomButtonProps } from '@/type'
import cn from "clsx";

const CustomButton = ({
    onPress,
    title = "Click me",
    style,
    textStyle,
    leftIcon,
    isLoading = false,
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