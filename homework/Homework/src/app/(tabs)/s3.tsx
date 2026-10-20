import StoryScreen from '../../components/StoryScreen';

export default function S3() {
    return (
        <StoryScreen
            title="The Amber Forest"
            image={require('../../../assets/images/forest.jpg')}
            text="Giant dark trunks tower over you and golden light filters through the leaves. The path ends at a cave in the mountainside. A goblin guard is posted at the entrance, and he has seen you."
            choices={[{ label: 'Approach the cave', href: '/s5' }]}
        />
    );
}