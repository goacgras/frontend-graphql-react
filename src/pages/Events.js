import React, { useState, useRef, useContext, useEffect } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../components/Events/EventList/EventList';

import './Events.css';
import Spinner from '../components/Spinner/Spinner';

const Events = () => {
    const [modal, setModal] = useState(false);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const titleEl = useRef();
    const priceEl = useRef();
    const dateEl = useRef();
    const descriptionEl = useRef();
    const contextType = useContext(AuthContext);

    // console.log(modal);

    useEffect(() => {
        const fetchEvents = () => {
            setIsLoading(true);
            const requestBody = {
                query: `
                    query {
                        events {
                            _id
                            title
                            description
                            date
                            price
                            creator {
                                _id
                                email
                            }
                        }
                    }
                `
            };

            fetch('http://localhost:5000/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => {
                    if (res.status !== 200 && res.status !== 201) {
                        throw new Error('Failed');
                    }
                    return res.json();
                })
                .then((resData) => {
                    if (isActive) {
                        const events = resData.data.events;
                        console.log('[FETCHING EVENTS]', events);
                        setEvents(events);
                        setIsLoading(false);
                    }
                })
                .catch((err) => {
                    if (isActive) {
                        console.log(err);
                        setIsLoading(false);
                    }
                });
        };

        fetchEvents();

        return () => {
            setIsActive(false);
        };
    }, [isActive]);

    const bookEventHandler = () => {
        if (!contextType.token) {
            setSelectedEvent(null);
            return;
        }
        const requestBody = {
            query: `
                mutation BookEvent($id: ID!){
                    bookEvent(eventId: $id){
                        _id
                        createdAt
                        updatedAt
                    }
                }

            `,
            variables: {
                id: selectedEvent._id
            }
        };

        fetch('http://localhost:5000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + contextType.token
            }
        })
            .then((res) => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed');
                }
                return res.json();
            })
            .then((resData) => {
                console.log(resData);
                setSelectedEvent(null);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const showDetailHandler = (eventId) => {
        const selectedEvent = events.find((el) => el._id === eventId);
        console.log('[SELECTED EVENT]', selectedEvent);
        return setSelectedEvent(selectedEvent);
    };

    const modalCancelHandler = () => {
        setModal(false);
        setSelectedEvent(null);
    };

    const createEventHandler = () => {
        setModal(true);
    };

    const modalHandler = () => {
        const title = titleEl.current.value;
        const price = +priceEl.current.value;
        const date = dateEl.current.value;
        const description = descriptionEl.current.value;

        if (
            title.trim().length === 0 ||
            price <= 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0
        ) {
            return;
        }

        const newEvent = { title, price, date, description };

        console.log('[NEW EVENT ADDED]', newEvent);

        const requestBody = {
            query: `
                mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!){
                    createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {
                        _id
                        title
                        description
                        date
                        price
                    }
                }
            `,
            variables: {
                title: title,
                description: description,
                price: price,
                date: date
            }
        };

        const token = contextType.token;
        fetch('http://localhost:5000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }
        })
            .then((res) => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed');
                }
                return res.json();
            })
            .then((resData) => {
                const eventsCopy = [...events];

                const newEvent = {
                    _id: resData.data.createEvent._id,
                    title: resData.data.createEvent.title,
                    description: resData.data.createEvent.description,
                    date: resData.data.createEvent.date,
                    price: resData.data.createEvent.price,
                    creator: {
                        _id: contextType.userId
                    }
                };

                eventsCopy.push(newEvent);
                return setEvents(eventsCopy);
            })
            .catch((err) => {
                console.log(err);
            });

        setModal(!modal);
    };

    let modalBackdrop = null;
    let backdropModal = null;
    if (modal || selectedEvent) {
        backdropModal = <Backdrop />;
    }
    if (modal) {
        modalBackdrop = (
            <React.Fragment>
                <Modal
                    title="Add Event"
                    canCancel
                    canConfirm
                    onCancel={modalCancelHandler}
                    onConfirm={modalHandler}
                    confirmText="confirm"
                >
                    <form>
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={titleEl}></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input
                                type="number"
                                id="price"
                                ref={priceEl}
                            ></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input
                                type="datetime-local"
                                id="date"
                                ref={dateEl}
                            ></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                rows="4"
                                ref={descriptionEl}
                            />
                        </div>
                    </form>
                </Modal>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            {backdropModal}
            {modalBackdrop}
            {selectedEvent && (
                <React.Fragment>
                    <Modal
                        title={selectedEvent.title}
                        canCancel
                        canConfirm
                        onCancel={modalCancelHandler}
                        onConfirm={bookEventHandler}
                        confirmText={contextType.token ? 'Book' : 'Confirm'}
                    >
                        <h1>{selectedEvent.title}</h1>
                        <h2>
                            ${selectedEvent.price} -{' '}
                            {new Date(selectedEvent.date).toLocaleDateString()}
                        </h2>
                        <p>{selectedEvent.description}</p>
                    </Modal>
                </React.Fragment>
            )}
            {contextType.token && (
                <div className="events-control">
                    <p>Share your event!</p>
                    <button className="btn" onClick={createEventHandler}>
                        Create Event
                    </button>
                </div>
            )}
            {isLoading ? (
                <Spinner />
            ) : (
                <EventList
                    events={events}
                    authUserId={contextType.userId}
                    onViewDetail={showDetailHandler}
                />
            )}
        </React.Fragment>
    );
};

export default Events;
