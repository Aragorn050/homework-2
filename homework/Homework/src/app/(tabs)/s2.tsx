import StoryScreen from '../../components/StoryScreen';

export default function S2() {
    return (
        <StoryScreen
            title="The Mountain Path"
            image={require('../../../assets/images/start.jpg')}
            text="Under a sky full of stars you climb the winding stairs carved into the black mountain. At a fork, the left path runs along a crumbling cliff edge. The right one leads to a cave mouth, where you hear something snoring."
            choices={[
                { label: 'Take the cliff edge', href: '/s4' },
                { label: 'Sneak into the cave', href: '/s5' },
            ]}
        />
    );
}