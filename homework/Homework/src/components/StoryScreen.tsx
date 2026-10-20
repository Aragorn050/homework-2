import React from 'react';
import { Text, Image, ScrollView, Pressable, StyleSheet, ImageSourcePropType } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { useAudioPlayer } from 'expo-audio';
import { useFonts, CinzelDecorative_700Bold } from '@expo-google-fonts/cinzel-decorative';

export type Choice = { label: string; href: Href };

type Props = {
    title: string;
    image: ImageSourcePropType;
    imageFit?: 'cover' | 'contain';
    text: string;
    choices: Choice[];
    children?: React.ReactNode;
};

export default function StoryScreen({ title, image, imageFit = 'cover', text, choices, children }: Props) {
    const router = useRouter();
    const click = useAudioPlayer(require('../../assets/sounds/click.mp3'));
    const [fontsLoaded] = useFonts({ CinzelDecorative_700Bold });

    const go = (href: Href) => {
        click.seekTo(0);
        click.play();
        router.navigate(href);
    };

    if (!fontsLoaded) return null;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Image
                source={image}
                style={[styles.image, imageFit === 'contain' && styles.imageContain]}
                resizeMode={imageFit}
            />
            <Text style={styles.text}>{text}</Text>
            {children}
            {choices.map((c) => (
                <Pressable key={c.label} style={styles.btn} onPress={() => go(c.href)}>
                    <Text style={styles.btnText}>{c.label}</Text>
                </Pressable>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1423' },
    content: { padding: 20, paddingTop: 60, alignItems: 'center' },
    title: { fontFamily: 'CinzelDecorative_700Bold', fontSize: 28, color: '#f4d58d', marginBottom: 16, textAlign: 'center' },
    image: { width: '100%', maxWidth: 500, height: 240, borderRadius: 12, marginBottom: 16 },
    imageContain: { backgroundColor: '#fff' },
    text: { color: '#eee', fontSize: 17, lineHeight: 26, marginBottom: 20, maxWidth: 500 },
    btn: { backgroundColor: '#7b2d26', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 10, marginVertical: 6, width: '100%', maxWidth: 500, borderWidth: 1, borderColor: '#f4d58d' },
    btnText: { color: '#fff', fontSize: 16, textAlign: 'center' },
});