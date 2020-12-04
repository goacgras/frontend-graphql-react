import './EventItem.css';

const EventItem = ({
    eventId,
    title,
    authUserId,
    creatorId,
    price,
    date,
    onDetail
}) => {
    return (
        <li className="events__list-item">
            <div>
                <h1>{title}</h1>
                <h2>
                    ${price} - {new Date(date).toLocaleDateString()}
                </h2>
            </div>
            <div>
                {authUserId === creatorId ? (
                    <p>You are the owner</p>
                ) : (
                    <button
                        className="btn"
                        onClick={onDetail.bind(this, eventId)}
                    >
                        View details
                    </button>
                )}
            </div>
        </li>
    );
};

export default EventItem;
