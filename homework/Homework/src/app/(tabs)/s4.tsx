import StoryScreen from '../../components/StoryScreen';

export default function S4() {
    return (
        <StoryScreen
            title="The Fall"
            image={require('../../../assets/images/forest.jpg')}
            text="The rock crumbles under your boots. You tumble down into the dark woods below, and your adventure ends here..."
            choices={[{ label: 'Return to the main menu', href: '/' }]}
        />
    );
}