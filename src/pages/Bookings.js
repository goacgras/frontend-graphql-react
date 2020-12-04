import React, { useEffect, useState, useContext } from 'react';

import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';

const Bookings = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    // const [fetchingBooking, setFetchingBooking] = useState(true);
    const contextType = useContext(AuthContext);

    useEffect(() => {
        const fetchBooking = () => {
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
                    const bookings = resData.data.bookings;
                    console.log('[FETCH BOOKING]: ', bookings);
                    setBookings(bookings);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setIsLoading(false);
                });
        };
        fetchBooking();
    }, [contextType.token]);

    const deleteBookingHandler = (bookingId) => {
        setIsLoading(true);
        const requestBody = {
            query: ` 
                mutation {
                    cancelBooking(bookingId: "${bookingId}") {
                        _id
                        title
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

    return (
        <React.Fragment>
            {isLoading ? (
                <Spinner />
            ) : (
                <BookingList
                    bookings={bookings}
                    onDelete={deleteBookingHandler}
                />
            )}
        </React.Fragment>
    );
};

export default Bookings;
