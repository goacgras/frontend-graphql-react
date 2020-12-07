import React, { useEffect, useState, useContext } from 'react';

import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingChart from '../components/Bookings/BookingChart/BookingChart';
import BookingControl from '../components/Bookings/BookingControl/BookingControl';

const Bookings = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [isActive, setIsActive] = useState(true);
    const [outputType, setOutputType] = useState('list');
    const contextType = useContext(AuthContext);

    useEffect(() => {
        const fetchBooking = () => {
            console.log('[FETCH BOOKING ACTIVE]');
            setIsLoading(true);
            const requestBody = {
                query: ` 
                    query {
                        bookings {
                            _id
                            createdAt
                            event {
                                _id
                                title
                                date
                                price
                            }
                        }
                    }
                `
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
                    if (isActive) {
                        const bookings = resData.data.bookings;
                        console.log('[FETCH BOOKING]: ', bookings);
                        setBookings(bookings);
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
        fetchBooking();

        return () => {
            setIsActive(false);
        };
    }, [contextType.token, isActive]);

    const deleteBookingHandler = (bookingId) => {
        setIsLoading(true);
        const requestBody = {
            query: ` 
                mutation CancelBooking($id: ID!) {
                    cancelBooking(bookingId: $id) {
                        _id
                        title
                    }
                }
            `,
            variables: {
                id: bookingId
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
                const copyBookings = [...bookings];
                const updatedBooking = copyBookings.filter((booking) => {
                    return booking._id !== bookingId;
                });

                setIsLoading(false);
                return setBookings(updatedBooking);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    const changeTabHandler = (outputType) => {
        if (outputType === 'list') {
            setOutputType('list');
        } else {
            setOutputType('chart');
        }
    };

    let content = <Spinner />;
    if (!isLoading) {
        content = (
            <React.Fragment>
                <BookingControl
                    activeOutputType={outputType}
                    changeTabHandler={changeTabHandler}
                />
                <div>
                    {outputType === 'list' ? (
                        <BookingList
                            bookings={bookings}
                            onDelete={deleteBookingHandler}
                        />
                    ) : (
                        <BookingChart bookings={bookings} />
                    )}
                </div>
            </React.Fragment>
        );
    }

    return <React.Fragment>{content}</React.Fragment>;
};

export default Bookings;
