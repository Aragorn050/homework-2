import { Tabs } from 'expo-router';

export default function Layout() {
    return (
        <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
            <Tabs.Screen name="index" />
            <Tabs.Screen name="s2" />
            <Tabs.Screen name="s3" />
            <Tabs.Screen name="s4" />
            <Tabs.Screen name="s5" />
            <Tabs.Screen name="victory" />
        </Tabs>
    );
}