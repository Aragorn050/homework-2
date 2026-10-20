import React, { useEffect } from 'react';
import { ImageBackground, Pressable, Text, StyleSheet, View, BackHandler, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { useFonts, CinzelDecorative_700Bold } from '@expo-google-fonts/cinzel-decorative';

export default function MenuScreen() {
    const router = useRouter();
    const bgm = useAudioPlayer(require('../../../assets/sounds/bgm.mp3'));
    const click = useAudioPlayer(require('../../../assets/sounds/click.mp3'));
    const [fontsLoaded] = useFonts({ CinzelDecorative_700Bold });

    useEffect(() => {
        const startMusic = async () => {
            await setAudioModeAsync({ playsInSilentMode: true });
            bgm.loop = true;
            bgm.volume = 0.5;
            bgm.play();
        };
        startMusic();
    }, []);

    const playClick = async () => {
        await click.seekTo(0);
        click.play();
    };

    const startGame = async (path: '/s2' | '/s3') => {
        await playClick();
        router.navigate(path);
    };

    const exitApp = async () => {
        await playClick();
        if (Platform.OS === 'android') BackHandler.exitApp();
        else Alert.alert('Exit', 'Please close the app manually (not supported on iOS / web).');
    };

    if (!fontsLoaded) return null;

    return (
        <ImageBackground source={require('../../../assets/images/start.jpg')} style={styles.bg} resizeMode="cover">
            <View style={styles.overlay}>
                <Text style={styles.logoSmall}>⚔ THE LEGEND OF ⚔</Text>
                <Text style={styles.logo}>Goblin{'\n'}Peak</Text>

                <Pressable style={styles.btn} onPress={() => startGame('/s2')}>
                    <Text style={styles.btnText}>New Game: Climb the mountain</Text>
                </Pressable>
                <Pressable style={styles.btn} onPress={() => startGame('/s3')}>
                    <Text style={styles.btnText}>New Game: Enter the forest</Text>
                </Pressable>
                <Pressable style={[styles.btn, styles.btnExit]} onPress={exitApp}>
                    <Text style={styles.btnText}>Exit</Text>
                </Pressable>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1 },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 20 },
    logoSmall: { fontFamily: 'CinzelDecorative_700Bold', fontSize: 14, color: '#f4d58d', letterSpacing: 2 },
    logo: { fontFamily: 'CinzelDecorative_700Bold', fontSize: 52, color: '#f4d58d', textAlign: 'center', marginBottom: 40, textShadowColor: '#000', textShadowRadius: 8 },
    btn: { backgroundColor: '#7b2d26', paddingVertical: 14, width: 300, borderRadius: 10, marginVertical: 8, borderWidth: 1, borderColor: '#f4d58d' },
    btnExit: { backgroundColor: '#333' },
    btnText: { color: '#fff', fontSize: 17, textAlign: 'center' },
});