import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!isLoaded) return

        // Start sign-up process using email and password provided
        try {
        await signUp.create({
            emailAddress,
            password,
        })

        // Send user an email with verification code
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

        // Set 'pendingVerification' to true to display second form
        // and capture OTP code
        setPendingVerification(true)
        } catch (err) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2))
        }
    }

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return

        try {
        // Use the code the user provided to attempt verification
        const signUpAttempt = await signUp.attemptEmailAddressVerification({
            code,
        })

        // If verification was completed, set the session to active
        // and redirect the user
        if (signUpAttempt.status === 'complete') {
            await setActive({ session: signUpAttempt.createdSessionId })
            router.replace('/')
        } else {
            // If the status is not complete, check why. User may need to
            // complete further steps.
            console.error(JSON.stringify(signUpAttempt, null, 2))
        }
        } catch (err) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2))
        }
    }

    if (pendingVerification) {
        return (
        <>
            <Text>Verifica tu correo electrónico</Text>
            <TextInput
            value={code}
            placeholder="Ingresa tu código de verificación"
            onChangeText={(code) => setCode(code)}
            />
            <TouchableOpacity onPress={onVerifyPress}>
            <Text>Verificar</Text>
            </TouchableOpacity>
        </>
        )
    }

    return (
        <View>
        <>
            <Text>Registrarse</Text>
            <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Correo"
            onChangeText={(email) => setEmailAddress(email)}
            />
            <TextInput
            value={password}
            placeholder="Contraseña"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
            />
            <TouchableOpacity onPress={onSignUpPress}>
            <Text>Continuar</Text>
            </TouchableOpacity>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
            <Text>¿Ya tienes una cuenta?</Text>
            <Link href="/sign-in">
                <Text>Iniciar sesión</Text>
            </Link>
            </View>
        </>
        </View>
    )
}