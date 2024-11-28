import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import axios from 'axios'
import { icons } from '@/constants'

// Mapbox access token - you'll need to replace this with your own
const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

// TypeScript interface for location data
interface LocationData {
	latitude: number;
	longitude: number;
	address: string;
}

interface MapboxInputProps {
	icon?: any;
	initialLocation?: string;
	containerStyle?: string;
	textInputBackgroundColor?: string;
	handlePress: (location: LocationData) => void;
}

const MapboxPlacesAutocomplete: React.FC<MapboxInputProps> = ({
	icon,
	initialLocation,
	containerStyle,
	textInputBackgroundColor,
	handlePress
}) => {
	const [query, setQuery] = useState(initialLocation ?? '');
	const [suggestions, setSuggestions] = useState<any[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);

	// Nepal's approximate center coordinates
	const NEPAL_CENTER = {
		latitude: 28.1667,
		longitude: 84.25,
	};

	// Debounce function to limit API calls
	const debounce = (func: (...args: any[]) => void, delay: number) => {
		let timeoutId: NodeJS.Timeout;
		return (...args: any[]) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => func(...args), delay);
		};
	};

	// Fetch suggestions from Mapbox Geocoding API
	const fetchSuggestions = async (text: string) => {
		if (text.length < 3) {
			setSuggestions([]);
			return;
		}

		try {
			const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json`, {
				params: {
					access_token: MAPBOX_ACCESS_TOKEN,
					limit: 5,
					types: 'place,address,poi',

					// Restrict to Nepal
					country: 'NP',

					// Proximity bias to Nepal's center
					proximity: `${NEPAL_CENTER.longitude},${NEPAL_CENTER.latitude}`,

					// Optional: limit search radius (in meters)
					// Adjust this value as needed
					bbox: [
						80.0586, // West longitude
						26.3477, // South latitude
						88.2005, // East longitude
						30.4468  // North latitude
					]
				}
			});

			setSuggestions(response.data.features);
			setShowSuggestions(true);
		} catch (error) {
			console.error('Error fetching suggestions:', error);
			setSuggestions([]);
		}
	};

	// Debounced search function
	const debouncedSearch = debounce(fetchSuggestions, 300);

	// Handle text input change
	const handleTextChange = (text: string) => {
		setQuery(text);
		debouncedSearch(text);
	};

	// Handle selection of a suggestion
	const selectSuggestion = (item: any) => {
		setQuery(item.place_name);
		setShowSuggestions(false);

		// Convert to the expected location format
		handlePress({
			latitude: item.center[1],
			longitude: item.center[0],
			address: item.place_name
		});
	};

	return (
		<View className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle} mb-5`}>
			<View className="flex-1 relative z-50">
				<View
					className="flex-row items-center bg-white rounded-xl px-3 py-2"
					style={{
						backgroundColor: textInputBackgroundColor || 'white',
						shadowColor: "#d4d4d4",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.25,
						shadowRadius: 3.84,
						elevation: 5
					}}
				>
					<Image
						source={icon ? icon : icons.search}
						className="w-6 h-6 mr-2"
						resizeMode="contain"
					/>
					<TextInput
						value={query}
						onChangeText={handleTextChange}
						placeholder={initialLocation ?? "Search in Nepal"}
						placeholderTextColor="gray"
						className="flex-1 text-base font-semibold"
						style={{
							backgroundColor: textInputBackgroundColor || 'white',
						}}
					/>
				</View>

				{showSuggestions && suggestions.length > 0 && (
					<View
						className="absolute top-full mt-1 w-full bg-white rounded-xl"
						style={{
							shadowColor: "#d4d4d4",
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.25,
							shadowRadius: 3.84,
							elevation: 5,
							zIndex: 999
						}}
					>
						{suggestions.map((item) => (
							<TouchableOpacity
								key={item.id}
								onPress={() => selectSuggestion(item)}
								className="p-3 border-b border-gray-200"
							>
								<Text>{item.place_name}</Text>
							</TouchableOpacity>
						))}
					</View>
				)}
			</View>
		</View>
	);
};

export default MapboxPlacesAutocomplete;
