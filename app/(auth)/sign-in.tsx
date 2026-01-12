import { View, Text, Button, Alert } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { signIn } from "@/lib/appwrite";
import * as Sentry from "@sentry/react-native";
import useAuthStore from "@/store/auth.store";

const SignIn = () => {
  // Variable que indica si el formulario se está enviando (loading state)
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Objeto que almacena los valores del formulario
  const [form, setForm] = useState({email: "", password: ""});

  // 
  const { fetchAuthenticatedUser } = useAuthStore();

  // Se ejecuta cuando el usuario hace click en "Sign In" manejando el proceso completo de login
  const submit = async () => {
    const {email,  password} = form; 
    // Validacion de campos
    if(!email || !password){
      return Alert.alert("Error", "Please enter a valid email address and password");
    }

    setIsSubmitting(true);

    try {
      // Iniciamos sesion en appwrite
      await signIn({email, password})
      // Sincronizamos los datos del usuario con el store de Zustand
      await fetchAuthenticatedUser();
      router.replace("/");

    } catch (error: any) {
      Alert.alert("Error", error.message);
      Sentry.captureException(error);
    } finally {
      setIsSubmitting(false);
    }

  }
  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({...prev, email: text}))}
        label="Email"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) => setForm((prev) => ({...prev, password: text}))}
        label="Password"
        secureTextEntry={true}
      />
      <CustomButton 
      title="Sign In"
      isLoading={isSubmitting}
      onPress={submit}
      />
      <View className="flex justify-center flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Don't have an account?
        </Text>
        <Link href="/sign-up" className="base-bold text-primary">
        Sign Up</Link>
      </View>
    </View>
  );
};

export default SignIn;
