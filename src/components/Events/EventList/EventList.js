import './EventList.css';

import EventItem from './EventItem/EventItem';

const EventList = ({ events, authUserId, onViewDetail }) => {
    const eventItems = events.map((evnt) => (
        <EventItem
            key={evnt._id}
            eventId={evnt._id}
            title={evnt.title}
            authUserId={authUserId}
            creatorId={evnt.creator._id}
            price={evnt.price}
            date={evnt.date}
            onDetail={onViewDetail}
        />
    ));
    return <ul className="events__list">{eventItems}</ul>;
};

export default EventList;
