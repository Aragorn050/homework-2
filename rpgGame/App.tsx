import React, { useState} from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from 'expo-audio';

const TOTAL_POINTS = 10;
const BASE_STAT = 5;
const CLASSES = ['warrior', 'paladin', 'sorcerer'] as const;
const STATS = ['strength', 'stamina', 'agility', 'magic'] as const;

type HeroClass = (typeof CLASSES)[number];
type StatName = (typeof STATS)[number];
type Stats = Record<StatName, number>;

const C = {
    bg: '#1c1712',
    panel: '#2a231b',
    line: '#4a3d2e',
    text: '#efe3cc',
    muted: '#a89877',
    gold: '#d9a441',
    green: '#5f9e5a',
    amber: '#d9a441',
    red: '#b8433a',
    disabled: '#3a3228',
} as const;

type SoundButtonProps = {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    onSound: () => void;
    disabled?: boolean;
};

function SoundButton({ children, style, onPress, onSound, disabled }: SoundButtonProps) {
    return (
        <Pressable
            onHoverIn={onSound}
            onPressIn={onSound}
            onPress={onPress}
            disabled={disabled}
            style={style}
        >
            {children}
        </Pressable>
    );
}

export default function App() {
    const [heroClass, setHeroClass] = useState<HeroClass>(CLASSES[0]);
    const [name, setName] = useState<string>('');
    const [image, setImage] = useState<string | null>(null);
    const [added, setAdded] = useState<Stats>({
        strength: 0,
        stamina: 0,
        agility: 0,
        magic: 0,
    });
    const [modalVisible, setModalVisible] = useState<boolean>(false);


    const hoverPlayer = useAudioPlayer(require('./assets/hover.mp3'));

    const used = STATS.reduce((sum, s) => sum + added[s], 0);
    const remaining = TOTAL_POINTS - used;
    const isValid = remaining === 0 && name.trim().length > 0;

    const barColor = remaining > 5 ? C.green : remaining > 1 ? C.amber : C.red;

    const playHover = (): void => {
        try {
            hoverPlayer.seekTo(0);
            hoverPlayer.play();
        } catch (e) {
        }
    };

    const changeStat = (stat: StatName, delta: 1 | -1): void => {
        if (delta > 0 && remaining <= 0) return;
        if (delta < 0 && added[stat] <= 0) return;
        setAdded({ ...added, [stat]: added[stat] + delta });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const pickImage = async (): Promise<void> => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const generate = (): void => {
        if (!isValid) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Forge your hero</Text>

                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    onFocus={playHover}
                    placeholder="Enter hero name"
                    placeholderTextColor={C.muted}
                    maxLength={24}
                />

                <Text style={styles.label}>Class</Text>
                <View style={styles.pickerWrap}>
                    <Picker<HeroClass>
                        selectedValue={heroClass}
                        onValueChange={(v) => {
                            setHeroClass(v);
                            playHover();
                        }}
                        dropdownIconColor={C.gold}
                        style={styles.picker}
                    >
                        {CLASSES.map((c) => (
                            <Picker.Item
                                key={c}
                                label={c.charAt(0).toUpperCase() + c.slice(1)}
                                value={c}
                            />
                        ))}
                    </Picker>
                </View>

                <Text style={styles.label}>Portrait</Text>
                <SoundButton style={styles.portrait} onPress={pickImage} onSound={playHover}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.portraitImg} />
                    ) : (
                        <Text style={styles.muted}>Tap to choose a picture</Text>
                    )}
                </SoundButton>

                <View style={styles.row}>
                    <Text style={styles.label}>Points left</Text>
                    <Text style={[styles.label, { color: barColor }]}>
                        {remaining} / {TOTAL_POINTS}
                    </Text>
                </View>
                <View style={styles.barTrack}>
                    <View
                        style={[
                            styles.barFill,
                            {
                                width: `${(remaining / TOTAL_POINTS) * 100}%`,
                                backgroundColor: barColor,
                            },
                        ]}
                    />
                </View>

                {STATS.map((stat) => (
                    <View key={stat} style={styles.statRow}>
                        <Text style={styles.statName}>{stat}</Text>
                        <SoundButton
                            style={styles.btn}
                            onPress={() => changeStat(stat, -1)}
                            onSound={playHover}
                        >
                            <Text style={styles.btnText}>−</Text>
                        </SoundButton>
                        <Text style={styles.statValue}>
                            {BASE_STAT + added[stat]}
                            <Text style={styles.muted}> (+{added[stat]})</Text>
                        </Text>
                        <SoundButton
                            style={styles.btn}
                            onPress={() => changeStat(stat, 1)}
                            onSound={playHover}
                        >
                            <Text style={styles.btnText}>+</Text>
                        </SoundButton>
                    </View>
                ))}

                <SoundButton
                    style={[styles.generate, !isValid && styles.generateOff]}
                    onPress={generate}
                    onSound={playHover}
                    disabled={!isValid}
                >
                    <Text style={[styles.generateText, !isValid && { color: C.muted }]}>
                        Generate!
                    </Text>
                </SoundButton>
                {!isValid && (
                    <Text style={[styles.muted, { textAlign: 'center', marginTop: 8 }]}>
                        Spend all {TOTAL_POINTS} points and name your hero.
                    </Text>
                )}
            </ScrollView>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.backdrop}>
                    <View style={styles.card}>
                        {image && <Image source={{ uri: image }} style={styles.summaryImg} />}
                        <Text style={styles.summaryName}>{name.trim()}</Text>
                        <Text style={styles.summaryClass}>{heroClass}</Text>
                        {STATS.map((stat) => (
                            <View key={stat} style={styles.summaryRow}>
                                <Text style={styles.statName}>{stat}</Text>
                                <Text style={styles.statValue}>{BASE_STAT + added[stat]}</Text>
                            </View>
                        ))}
                        <SoundButton
                            style={[styles.generate, { marginTop: 20 }]}
                            onPress={() => setModalVisible(false)}
                            onSound={playHover}
                        >
                            <Text style={styles.generateText}>Close</Text>
                        </SoundButton>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: C.bg,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: { padding: 20, paddingBottom: 48 },
    title: { color: C.gold, fontSize: 30, fontWeight: '700', marginBottom: 12 },
    label: { color: C.text, fontSize: 15, fontWeight: '600', marginTop: 18, marginBottom: 6 },
    muted: { color: C.muted, fontSize: 14 },
    input: {
        backgroundColor: C.panel,
        borderWidth: 1,
        borderColor: C.line,
        borderRadius: 6,
        color: C.text,
        padding: 12,
        fontSize: 16,
    },
    pickerWrap: {
        backgroundColor: C.panel,
        borderWidth: 1,
        borderColor: C.line,
        borderRadius: 6,
        overflow: 'hidden',
    },
    picker: { color: C.text },
    portrait: {
        height: 160,
        width: 160,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: C.line,
        borderStyle: 'dashed',
        backgroundColor: C.panel,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    portraitImg: { width: '100%', height: '100%' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    barTrack: {
        height: 14,
        backgroundColor: C.panel,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: C.line,
        overflow: 'hidden',
    },
    barFill: { height: '100%', borderRadius: 7 },
    statRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
    statName: { color: C.text, fontSize: 16, flex: 1, textTransform: 'capitalize' },
    statValue: { color: C.text, fontSize: 16, minWidth: 80, textAlign: 'center' },
    btn: {
        width: 40,
        height: 40,
        borderRadius: 6,
        backgroundColor: C.panel,
        borderWidth: 1,
        borderColor: C.gold,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: { color: C.gold, fontSize: 22, fontWeight: '700' },
    generate: {
        backgroundColor: C.gold,
        borderRadius: 6,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 28,
    },
    generateOff: { backgroundColor: C.disabled },
    generateText: { color: C.bg, fontSize: 18, fontWeight: '700' },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        padding: 24,
    },
    card: {
        backgroundColor: C.panel,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: C.gold,
        padding: 24,
    },
    summaryImg: { width: 140, height: 140, borderRadius: 6, alignSelf: 'center', marginBottom: 14 },
    summaryName: { color: C.gold, fontSize: 26, fontWeight: '700', textAlign: 'center' },
    summaryClass: {
        color: C.muted,
        fontSize: 16,
        textAlign: 'center',
        textTransform: 'capitalize',
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: C.line,
    },
});