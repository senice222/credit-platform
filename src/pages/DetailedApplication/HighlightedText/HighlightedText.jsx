import PropTypes from 'prop-types'

const HighlightedText = ({ text }) => {
    const parts = text?.split(/(В работе|На уточнении|на уточнение)/g);

    return (
        <h3>
            {parts?.map((part, index) =>
                part === 'В работе' || part === 'На уточнении' || part === 'на уточнение' ? (
                    <span key={index} style={{ color: '#067647' }}>
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </h3>
    );
};

export default HighlightedText

HighlightedText.propTypes = {
    text: PropTypes.string,
}