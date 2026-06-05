import React, { useState, useEffect } from 'react';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayHoliday, setTodayHoliday] = useState(null); // Holds today's holiday if it exists

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // --- FETCH LIVE DATA FROM PUBLIC CALENDAR API ---
  useEffect(() => {
    const fetchHolidayData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/SI`);
        if (!response.ok) throw new Error('API network response failed');
        const data = await response.json();
        setHolidays(data);

        // --- CHECK IF TODAY IS A HOLIDAY ---
        const today = new Date();
        const formattedTodayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        const foundToday = data.find(h => h.date === formattedTodayStr);
        if (foundToday) {
          setTodayHoliday(foundToday.localName);
        } else {
          setTodayHoliday(null);
        }

      } catch (err) {
        console.error("Calendar API Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidayData();
  }, [year]);

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const blanks = Array(firstDayOfMonth).fill(null);
  const days = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
  const calendarGrid = [...blanks, ...days];

  const getHolidayName = (day) => {
    if (!day) return null;
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const targetDateStr = `${year}-${formattedMonth}-${formattedDay}`;

    const foundHoliday = holidays.find(h => h.date === targetDateStr);
    return foundHoliday ? foundHoliday.localName : null;
  };

  return (
    <div className="card shadow-sm p-4 mx-auto mb-5" style={{ maxWidth: '750px' }}>
      <h3 className="fw-bold text-center mb-1">Live Calendar Integration</h3>
      <p className="text-center small text-muted mb-4">
        {loading ? "🔄 Syncing with live API..." : "✅ Connected to national public holiday framework"}
      </p>

      {/* --- LIVE DELIVERY NOTIFICATION BLOCK --- */}
      {!loading && (
        todayHoliday ? (
          <div className="alert alert-warning border-start border-warning border-4 shadow-sm mb-4" role="alert">
            <h5 className="alert-heading fw-bold">⚠️ Shipping Advisory</h5>
            <p className="mb-0 small">
              Today is an official holiday (<strong>{todayHoliday}</strong>). Standard logistics networks are currently idle; orders placed today or packages in transit may experience delivery delays.
            </p>
          </div>
        ) : (
          <div className="alert alert-success border-start border-success border-4 shadow-sm mb-4" role="alert">
            <h5 className="alert-heading fw-bold">🚚 Logistics Operational</h5>
            <p className="mb-0 small">
              Today is a standard working business day. Fulfillment channels are proceeding on schedule with normal delivery timelines.
            </p>
          </div>
        )
      )}
      
      {/* HEADER CONTROLS */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="btn btn-primary btn-sm">&larr; Prev</button>
        <h4 className="fw-bold m-0">
          {monthNames[month]} {year}
        </h4>
        <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="btn btn-primary btn-sm">Next &rarr;</button>
      </div>

      {/* WEEKDAY LABELS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center', fontWeight: '700', opacity: 0.7, marginBottom: '10px' }}>
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>

      {/* DAYS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
        {calendarGrid.map((day, index) => {
          const holidayName = getHolidayName(day);
          const isToday = day && 
            new Date().getDate() === day && 
            new Date().getMonth() === month && 
            new Date().getFullYear() === year;
          
          return (
            <div 
              key={index} 
              style={{
                minHeight: '75px',
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: holidayName ? 'rgba(239, 68, 68, 0.12)' : (isToday ? 'rgba(13, 110, 253, 0.15)' : (day ? 'var(--bs-body-bg)' : 'transparent')),
                border: holidayName ? '2px solid #ef4444' : (isToday ? '2px solid #0d6efd' : (day ? '1px solid var(--bs-border-color)' : 'none')),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              {day && (
                <>
                  <span className={`fw-bold small ${isToday ? 'text-primary' : ''}`}>
                    {day} {isToday && <span className="badge bg-primary px-1 text-uppercase" style={{ fontSize: '0.55rem' }}>Today</span>}
                  </span>
                  {holidayName && (
                    <span 
                      style={{ 
                        fontSize: '0.62rem', 
                        color: '#dc2626', 
                        lineHeight: '1.2', 
                        fontWeight: '700',
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical'
                      }} 
                      title={holidayName}
                    >
                      🎉 {holidayName}
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;