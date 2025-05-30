import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { useState } from 'react'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from '../../assets/styles/auth.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");

    // Handle the submission of the sign-in form
    const onSignInPress = async () => {
        if (!isLoaded) return

        // Start the sign-in process using the email and password provided
        try {
        const signInAttempt = await signIn.create({
            identifier: emailAddress,
            password,
        })

        // If sign-in process is complete, set the created session as active
        // and redirect the user
        if (signInAttempt.status === 'complete') {
            await setActive({ session: signInAttempt.createdSessionId })
            router.replace('/')
        } else {
            // If the status isn't complete, check why. User might need to
            // complete further steps.
            console.error(JSON.stringify(signInAttempt, null, 2))
        }
        } catch (err) {
            if (err.errors?.[0]?.code === "form_password_incorrect") {
                setError("Contraseña incorrecta. Por favor, inténtalo de nuevo.");
            } else {
                setError("Error al iniciar sesión, por favor, inténtelo de nuevo.")
            }
        }
    }

    return (
        <KeyboardAwareScrollView style={{ flex: 1 }} contentContainerStyle= {{ flexGrow: 1 }} enableOnAndroid={true} enableAutomaticScroll={true} extraScrollHeight={30}>
            <View style={styles.container}>
                <Image source={require("../../assets/images/revenue-i1.png")} style={styles.illustration} />

                <Text style={styles.title}>Iniciar sesión</Text>

                {error ? (
                <View style={styles.errorBox}> 
                    <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity on Press={() => setError("")}>
                        <Ionicons name="close" size={20} color={COLORS.textLight} />
                    </TouchableOpacity>
                </View>
                ) : null}

                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Correo"
                    onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                />

                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    value={password}
                    placeholder="Contraseña"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />

                <TouchableOpacity style={styles.button} onPress={onSignInPress}>
                    <Text style={styles.buttonText}>Continuar</Text>
                </TouchableOpacity>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>¿No tienes una cuenta?{" "}</Text>
                    <Link href="/sign-up" asChild>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Registrate</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}