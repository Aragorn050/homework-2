import StoryScreen from '../../components/StoryScreen';

export default function Victory() {
    return (
        <StoryScreen
            title="Victory!"
            image={require('../../../assets/images/start.jpg')}
            text="You reach the summit and place the golden crown on your head. The village below lights up in celebration. THE END."
            choices={[{ label: 'Play again', href: '/' }]}
        />
    );
}