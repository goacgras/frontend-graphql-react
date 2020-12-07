import './BookingControl.css';

const BookingControl = ({ activeOutputType, changeTabHandler }) => {
    return (
        <div className="booking-control">
            <button
                className={activeOutputType === 'list' ? 'active' : ''}
                onClick={changeTabHandler.bind(this, 'list')}
            >
                List
            </button>
            <button
                className={activeOutputType === 'chart' ? 'active' : ''}
                onClick={changeTabHandler.bind(this, 'chart')}
            >
                Chart
            </button>
        </div>
    );
};

export default BookingControl;
