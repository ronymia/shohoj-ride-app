import {SignedIn, SignedOut, useUser} from "@clerk/expo";

import {Text, View} from "react-native";
import {Link} from "expo-router";

const Home =()=>{
    const {user}=useUser();

    return (
        <View className="flex-1 justify-center items-center">
            <SignedIn>
            <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
            </SignedIn>

            <SignedOut>
                <Link href={"/sign-in"} className="bg-red-500 px-4 py-2 rounded-md mt-4">
                    Sign Out
                </Link>
                <Link href={"/sign-up"} className="bg-blue-500 px-4 py-2 rounded-md mt-4">
                    Sign Up
                </Link>
            </SignedOut>
        </View>
    )
};


export default Home;