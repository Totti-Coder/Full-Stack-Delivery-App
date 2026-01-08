import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import {
  Button,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { images, offers } from "@/constants";
import React, { Fragment } from "react";
import cn from "clsx";
import CartButton from "@/components/CartButton";
import useAuthStore from "@/store/auth.store";

export default function Index() {
  const {user} = useAuthStore();

  console.log("USER: ", JSON.stringify(user, null, 2))
  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={offers}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ListHeaderComponent={() => (
          <View className="flex-between flex-row w-full my-5">
            <View className="flex-start">
              <Text className="small-bold  text-primary">DELIVER TO</Text>
              <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                <Text className="paragraph-bold text-dark-100">Spain</Text>
                <Image
                  source={images.arrowDown}
                  className="size-3"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <CartButton/>
          </View>
        )}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;
          return (
            <Pressable
              className={cn(
                "offer-card",
                isEven ? "flex-row-reverse" : "flex-row"
              )}
              style={{ backgroundColor: item.color }}
              android_ripple={{ color: "#fffff22" }}
            >
              {({ pressed }) => (
                <Fragment>
                  <View className="w-1/2 h-full">
                    <Image
                      source={item.image}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  </View>
                  <View
                    className={cn(
                      "offer-card__info",
                      isEven ? "pl-10" : "pr-10"
                    )}
                  >
                    <Text className="h1-bold text-white leading-tight">
                      {item.title}
                    </Text>
                    <Image
                      source={images.arrowRight}
                      className={cn(
                      "size-10",
                      // Sirve para voltear la flecha horizontalmente si quieres que apunte al otro lado
                      isEven ? "rotate-0" : "rotate-180")}
                      resizeMode="contain"
                      tintColor="#ffffff"
                    ></Image>
                  </View>
                </Fragment>
              )}
            </Pressable>
          );
        }}
        contentContainerClassName="pb-28 px-5"
      />
    </SafeAreaView>
  );
}
