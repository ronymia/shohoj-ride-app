import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";

const Index = () => {
  const { isSignedIn, isLoaded } = useAuth();

  // Wait for Clerk to restore the persisted session before redirecting
  if (!isLoaded) return null;

  if (isSignedIn) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/welcome" />;
};

export default Index;
