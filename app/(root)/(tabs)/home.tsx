import CustomButton from "@/components/CustomButton";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import { useFetch } from "@/libs/fetch";
import { useLocationStore } from "@/store";
import { Ride } from "@/types/type";
import { useAuth, useUser } from "@clerk/expo";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ReactNativeModal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";

// const recentRides = [
//   {
//     ride_id: "1",
//     origin_address: "Kathmandu, Nepal",
//     destination_address: "Pokhara, Nepal",
//     origin_latitude: "27.717245",
//     origin_longitude: "85.323961",
//     destination_latitude: "28.209583",
//     destination_longitude: "83.985567",
//     ride_time: 391,
//     fare_price: "19500.00",
//     payment_status: "paid",
//     driver_id: 2,
//     user_id: "1",
//     created_at: "2024-08-12 05:19:20.620007",
//     driver: {
//       driver_id: "2",
//       first_name: "David",
//       last_name: "Brown",
//       profile_image_url:
//         "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
//       car_image_url:
//         "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
//       car_seats: 5,
//       rating: "4.60",
//     },
//   },
//   {
//     ride_id: "2",
//     origin_address: "Jalkot, MH",
//     destination_address: "Pune, Maharashtra, India",
//     origin_latitude: "18.609116",
//     origin_longitude: "77.165873",
//     destination_latitude: "18.520430",
//     destination_longitude: "73.856744",
//     ride_time: 491,
//     fare_price: "24500.00",
//     payment_status: "paid",
//     driver_id: 1,
//     user_id: "1",
//     created_at: "2024-08-12 06:12:17.683046",
//     driver: {
//       driver_id: "1",
//       first_name: "James",
//       last_name: "Wilson",
//       profile_image_url:
//         "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
//       car_image_url:
//         "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
//       car_seats: 4,
//       rating: "4.80",
//     },
//   },
//   {
//     ride_id: "3",
//     origin_address: "Zagreb, Croatia",
//     destination_address: "Rijeka, Croatia",
//     origin_latitude: "45.815011",
//     origin_longitude: "15.981919",
//     destination_latitude: "45.327063",
//     destination_longitude: "14.442176",
//     ride_time: 124,
//     fare_price: "6200.00",
//     payment_status: "paid",
//     driver_id: 1,
//     user_id: "1",
//     created_at: "2024-08-12 08:49:01.809053",
//     driver: {
//       driver_id: "1",
//       first_name: "James",
//       last_name: "Wilson",
//       profile_image_url:
//         "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
//       car_image_url:
//         "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
//       car_seats: 4,
//       rating: "4.80",
//     },
//   },
//   {
//     ride_id: "4",
//     origin_address: "Okayama, Japan",
//     destination_address: "Osaka, Japan",
//     origin_latitude: "34.655531",
//     origin_longitude: "133.919795",
//     destination_latitude: "34.693725",
//     destination_longitude: "135.502254",
//     ride_time: 159,
//     fare_price: "7900.00",
//     payment_status: "paid",
//     driver_id: 3,
//     user_id: "1",
//     created_at: "2024-08-12 18:43:54.297838",
//     driver: {
//       driver_id: "3",
//       first_name: "Michael",
//       last_name: "Johnson",
//       profile_image_url:
//         "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
//       car_image_url:
//         "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
//       car_seats: 4,
//       rating: "4.70",
//     },
//   },
// ];

const Home = () => {
  const { user } = useUser();
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const {
    data: recentRides,
    loading,
    error,
  } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);

  const { signOut } = useAuth();
  const handleSignOut = () => setShowSignOutModal(true);
  const confirmSignOut = async () => {
    setShowSignOutModal(false);
    await signOut();
    router.replace("/(auth)/sign-in");
  };
  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);

    router.push("/(root)/find-ride");
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      // let location = await Location.getCurrentPositionAsync({});
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      // try {
      //   const address = await Location.reverseGeocodeAsync({
      //     latitude: location.coords?.latitude!,
      //     longitude: location.coords?.longitude!,
      //   });

      //   setUserLocation({
      //     latitude: location.coords?.latitude,
      //     longitude: location.coords?.longitude,
      //     address: `${address[0].name}, ${address[0].region}`,
      //   });
      // } catch (error) {
      //   console.error("Geocoding failed:", error);
      //   setUserLocation({
      //     latitude: location.coords?.latitude,
      //     longitude: location.coords?.longitude,
      //     address: "Current Location",
      //   });
      // }
      try {
        // Use Google's Geocoding API as Nominatim is returning an HTML error page or getting blocked
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.EXPO_PUBLIC_PLACES_API_KEY}`,
        );
        const data = await res.json();

        if (data.results && data.results.length > 0) {
          setUserLocation({
            latitude,
            longitude,
            address: data.results[0].formatted_address,
          });
        } else {
          setUserLocation({
            latitude,
            longitude,
            address: "Current Location",
          });
        }
      } catch (error) {
        console.error("Geocoding failed:", error);
        setUserLocation({
          latitude,
          longitude,
          address: "Current Location",
        });
      }
    })();
  }, []);

  // console.log({ isSignedIn, isLoaded, user });

  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={recentRides?.slice(0, 5)}
        renderItem={({ item }) => <RideCard ride={item} />}
        className={`px-5`}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No recent rides found</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-2xl font-JakartaExtraBold">
                Welcome {user?.firstName}👋
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="justify-center items-center w-10 h-10 rounded-full bg-white"
              >
                <Image source={icons.out} className="w-4 h-4" />
              </TouchableOpacity>
            </View>

            <GoogleTextInput
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              handlePress={handleDestinationPress}
            />

            <>
              <Text className="text-xl font-JakartaBold mt-5 mb-3">
                Your current location
              </Text>
              <View className="flex flex-row items-center bg-transparent h-[300px]">
                <Map />
              </View>
            </>

            <Text className="text-xl font-JakartaBold mt-5 mb-3">
              Recent Rides
            </Text>
          </>
        }
      />
      {/* SIGN OUT CONFIRMATION MODAL */}
      <ReactNativeModal
        isVisible={showSignOutModal}
        onBackdropPress={() => setShowSignOutModal(false)}
        onBackButtonPress={() => setShowSignOutModal(false)}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View className="bg-white px-7 py-9 rounded-2xl items-center">
          <Image
            source={icons.out}
            className="w-14 h-14 mb-4"
            tintColor="#e11d48"
            resizeMode="contain"
          />
          <Text className="text-2xl font-JakartaExtraBold text-center mb-2">
            Sign Out
          </Text>
          <Text className="text-gray-500 font-Jakarta text-center mb-6">
            Are you sure you want to sign out of your account?
          </Text>
          <CustomButton
            title="Yes, Sign Out"
            onPress={confirmSignOut}
            className="w-full mb-3 bg-rose-600"
          />
          <CustomButton
            title="Cancel"
            onPress={() => setShowSignOutModal(false)}
            className="w-full bg-neutral-100"
            textVariant="primary"
          />
        </View>
      </ReactNativeModal>
    </SafeAreaView>
  );
};

export default Home;
