import { Bar as BarChart } from 'react-chartjs';

import './BookingChart.css';

const BOOKING_BUCKET = {
    cheap: {
        min: 0,
        max: 100
    },
    normal: {
        min: 100,
        max: 200
    },
    expensive: {
        min: 200,
        max: 1000000
    }
};

const BookingChart = ({ bookings }) => {
    const chartData = { labels: [], datasets: [] };
    let values = [];

    for (const bucket in BOOKING_BUCKET) {
        const filteredBookingCount = bookings.reduce((prev, current) => {
            if (
                current.event.price > BOOKING_BUCKET[bucket].min &&
                current.event.price < BOOKING_BUCKET[bucket].max
            ) {
                return prev + 1;
            } else {
                return prev;
            }
        }, 0);
        values.push(filteredBookingCount);
        chartData.labels.push(bucket);
        chartData.datasets.push({
            // label: 'My First dataset',
            fillColor: 'rgba(220,220,220,0.5)',
            strokeColor: 'rgba(220,220,220,0.8)',
            highlightFill: 'rgba(220,220,220,0.75)',
            highlightStroke: 'rgba(220,220,220,1)',
            data: values
        });
        values = [...values];
        values[values.length - 1] = 0;
    }

    return (
        <div className="booking-chart__barChart">
            <BarChart data={chartData} />
        </div>
    );
};

export default BookingChart;
