import React, { useState, useCallback } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useAudioPlayer } from 'expo-audio';
import StoryScreen from '../../components/StoryScreen';

export default function S5() {
    const click = useAudioPlayer(require('../../../assets/sounds/click.mp3'));
    const [player, setPlayer] = useState<number | null>(null);
    const [enemy, setEnemy] = useState<number | null>(null);
    const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null);

    // reset the battle every time the screen is opened
    useFocusEffect(
        useCallback(() => {
            setPlayer(null);
            setEnemy(null);
            setResult(null);
        }, [])
    );

    const roll = () => {
        click.seekTo(0);
        click.play();
        const p = Math.floor(Math.random() * 6) + 1;
        const e = Math.floor(Math.random() * 6) + 1;
        setPlayer(p);
        setEnemy(e);
        setResult(p > e ? 'win' : p < e ? 'lose' : 'draw');
    };

    const choices =
        result === 'win'
            ? [{ label: 'Climb to the summit', href: '/victory' as const }]
            : result === 'lose'
                ? [{ label: 'You died... Back to the menu', href: '/' as const }]
                : [];

    return (
        <StoryScreen
            title="The Goblin Guard"
            image={require('../../../assets/images/icon.jpg')}
            imageFit="contain"
            text="A goblin with a rusty sword and a round shield blocks the way to the summit. He grins. The fight is decided by the dice: whoever rolls higher wins. If you lose, you die."
            choices={choices}
        >
            <View style={styles.box}>
                {result !== 'win' && result !== 'lose' && (
                    <Button title="Roll the dice 🎲" onPress={roll} color="#7b2d26" />
                )}
                {player !== null && (
                    <Text style={styles.roll}>You: {player}   |   Goblin: {enemy}</Text>
                )}
                {result === 'draw' && <Text style={styles.msg}>Draw! Roll again.</Text>}
                {result === 'win' && <Text style={styles.msg}>You win! The goblin flees.</Text>}
                {result === 'lose' && <Text style={styles.msg}>The goblin wins. You are dead.</Text>}
            </View>
        </StoryScreen>
    );
}

const styles = StyleSheet.create({
    box: { marginBottom: 16, alignItems: 'center' },
    roll: { color: '#fff', fontSize: 22, marginTop: 12 },
    msg: { color: '#f4d58d', fontSize: 20, marginTop: 8 },
});