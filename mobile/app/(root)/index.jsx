import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'

export default function Page() {
    const { user } = useUser();

    return (
        <View>
            <SignedIn>
                <Text>Hola {user?.emailAddresses[0].emailAddress}</Text>
                <SignOutButton />
            </SignedIn>
            <SignedOut>
                <Link href="/(auth)/sign-in">
                <Text>Iniciar sesión</Text>
                </Link>
                <Link href="/(auth)/sign-up">
                <Text>Registrarse</Text>
                </Link>
            </SignedOut>
        </View>
    )
}