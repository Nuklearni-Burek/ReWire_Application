import React, { useState, useEffect } from 'react';
import Cal from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayHoliday, setTodayHoliday] = useState(null);

  const year = new Date().getFullYear();

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/SI`);
        if (!response.ok) throw new Error('Failed to fetch holidays');
        const data = await response.json();
        setHolidays(data);

        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const foundToday = data.find(h => h.date === todayStr);
        setTodayHoliday(foundToday ? foundToday.localName : null);

      } catch (err) {
        console.error("Holiday fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, [year]);

  return (
    <div className="row mt-4">

      {/* LEFT — Calendar widget */}
      <div className="col-md-5 mb-4 d-flex flex-column align-items-center">
        <h4 className="fw-bold mb-3">Calendar</h4>
        <Cal onChange={setSelectedDate} value={selectedDate} />
        <p className="text-muted small mt-3">
          Selected: <strong>{selectedDate.toDateString()}</strong>
        </p>
      </div>

      {/* RIGHT — Holidays list */}
      <div className="col-md-7 mb-4">
        <h4 className="fw-bold mb-3">Slovenian Delivery Availability {year}</h4>

        {/* Shipping advisory banner */}
        {!loading && (
          todayHoliday ? (
            <div className="alert alert-warning border-start border-warning border-4 mb-4">
              <h6 className="fw-bold">⚠️ Shipping Advisory</h6>
              <p className="mb-0 small">Today is <strong>{todayHoliday}</strong>. Deliveries may be delayed.</p>
            </div>
          ) : (
            <div className="alert alert-success border-start border-success border-4 mb-4">
              <h6 className="fw-bold">🚚 Logistics Operational</h6>
              <p className="mb-0 small">Today is a working day. </p>
            </div>
          )
        )}

      </div>

    </div>
  );
}

export default Calendar;