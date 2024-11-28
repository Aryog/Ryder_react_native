import React from 'react';
import { Tabs } from "expo-router";
import { icons } from "@/constants";
import { Image, ImageSourcePropType, View } from "react-native";

const TabIcon = ({ source, focused }: { source: ImageSourcePropType; focused: boolean }) => {
	return (
		<View className={`flex-row justify-center items-center rounded-full w-full h-full ${focused ? 'bg-general-300' : ''}`}>
			<View className={`rounded-full w-12 h-12 items-center justify-center ${focused ? "bg-general-400" : ""}`}>
				<Image source={source} tintColor="white" resizeMode="contain" className="w-7 h-7" />
			</View>
		</View>
	);
};

const Layout = () => {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: 'white',
				tabBarInactiveTintColor: 'white',
				tabBarShowLabel: false,
				tabBarStyle: {
					backgroundColor: "#333333",
					borderRadius: 50,
					paddingBottom: 20,
					overflow: "hidden",
					marginHorizontal: 20,
					marginBottom: 20,
					height: 75,
					position: "absolute",
					left: 20,
					right: 20,
					bottom: 0,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					paddingHorizontal: 10
				}
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					headerShown: false,
					tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.home} />,
				}}
			/>
			<Tabs.Screen
				name="rides"
				options={{
					title: "Rides",
					headerShown: false,
					tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.list} />,
				}}
			/>
			<Tabs.Screen
				name="chat"
				options={{
					title: "Chat",
					headerShown: false,
					tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.chat} />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					headerShown: false,
					tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.profile} />,
				}}
			/>
		</Tabs>
	);
};

export default Layout;
