import { ScrollView, View, Image, Text, Alert } from "react-native";
import { images, icons } from '@/constants';
import { useSignIn } from '@clerk/clerk-expo'
import InputField from "@/components/InputField";
import { useState, useCallback } from 'react';
import CustomButton from "@/components/CustomButton";
import { Link, useRouter } from "expo-router";
import OAuth from "@/components/OAuth";
const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/(root)/(tabs)/home')
        console.log("Signed in successfully");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      Alert.alert('Error', err.errors[0].longMessage)
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, form.email, form.password])

  return (<ScrollView className='flex-1 bg-white'>
    <View className='flex-1 bg-white'>
      <View className="relative w-full h-[250px]">
        <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
        <Text className='text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5'>Welcome 👋</Text>
      </View>
      <View className="p-5">
        <InputField label="Email" placeholder="Enter your email" icon={icons.email} value={form.email} onChangeText={(value: string) => setForm({ ...form, email: value })} />
        <InputField label="Password" placeholder="Enter your password" icon={icons.lock} value={form.password} secureTextEntry={true} onChangeText={(value: string) => setForm({ ...form, password: value })} />
        <CustomButton title="Sign In" onPress={onSignInPress} className="mt-6" />

        {/*OAuth*/}
        <OAuth />
        <Link href="/sign-up" className="text-lg text-center text-general-200 mt-10">
          <Text>Don't have an account? </Text>

          <Text className="text-primary-500">Sign Up</Text>
        </Link>
      </View>
      {/*Verification Modal*/}
    </View>
  </ScrollView>)
}
export default SignIn;
