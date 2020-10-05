const instructions = [
    {
        image: './assets/textures/train_head.png',
        text:
            "This is the train! It's heavy, so it'll wear down any tracks it runs on.",
    },
    {
        image: './assets/textures/tracks_vertical.png',
        text:
            'This is a track! Pick one from the toolbar and place it wherever you want (or need) to!',
    },
    {
        image: './assets/textures/boulder.png',
        text:
            "This is a boulder! It can't be stopped, and will destroy any track it rolls over.",
    },
    {
        image: './assets/textures/tree_1.png',
        text:
            'This is a tree! They grow fast, breaking any tracks they grow through.',
    },
];

const InstructionBox = ({ image, text }) => (
    <div className="instruction-detail">
        <img className="instruction-image" src={image} />
        <p className="instruction-text">{text}</p>
    </div>
);

const InstructionDetails = () => (
    <div classname="instruction-container">
        {instructions.map(({ image, text }) => (
            <InstructionBox image={image} text={text} />
        ))}
    </div>
);

export default InstructionDetails;
