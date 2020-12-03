import React, { useState, useRef, useContext, useEffect } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';

import './Events.css';

const Events = () => {
    const [modal, setModal] = useState(false);
    const [events, setEvents] = useState([]);
    const titleEl = useRef();
    const priceEl = useRef();
    const dateEl = useRef();
    const descriptionEl = useRef();
    const contextType = useContext(AuthContext);

    const createEventHandler = () => {
        setModal(true);
    };

    useEffect(() => {
        console.log('useEf');
        fetchEvents();
    }, []);

    const fetchEvents = () => {
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
                const events = resData.data.events;
                setEvents(events);
            })
            .catch((err) => {
                console.log(err);
            });
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

        console.log(newEvent);

        const requestBody = {
            query: `
                mutation {
                    createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
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
                fetchEvents();
            })
            .catch((err) => {
                console.log(err);
            });

        setModal(!modal);
    };

    let modalBackdrop = null;
    if (modal) {
        modalBackdrop = (
            <React.Fragment>
                <Backdrop />
                <Modal
                    title="Add Event"
                    canCancel
                    canConfirm
                    onCancel={() => setModal(!modal)}
                    onConfirm={modalHandler}
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
            {modalBackdrop}
            {contextType.token && (
                <div className="events-control">
                    <p>Share your event!</p>
                    <button className="btn" onClick={createEventHandler}>
                        Create Event
                    </button>
                </div>
            )}
            <ul className="events__list">
                {events.map((evnt) => (
                    <li key={evnt._id} className="events__list-item">
                        {evnt.title}
                    </li>
                ))}
            </ul>
        </React.Fragment>
    );
};

export default Events;
