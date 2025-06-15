import { getAllEvents } from "@/services/event";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const EVENT_CATEGORIES = [
  { id: "all", name: "Tất cả" },
  { id: "upcoming", name: "Sắp diễn ra" },
  { id: "ongoing", name: "Đang diễn ra" },
  { id: "completed", name: "Đã kết thúc" },
];

function getStatusColor(status) {
  switch (status) {
    case "scheduled": return { bg: "#FFEBEE", color: "#FF6B6B" };
    case "ongoing": return { bg: "#E3FCEC", color: "#27AE60" };
    case "completed": return { bg: "#ECEFF1", color: "#95A5A6" };
    default: return { bg: "#ECEFF1", color: "#95A5A6" };
  }
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [selectedCategory, events]);

  function filterEvents() {
    if (selectedCategory === "all") {
      setFilteredEvents(events);
      return;
    }
    const now = new Date();
    let filtered = [];
    switch (selectedCategory) {
      case "upcoming":
        filtered = events.filter((event) => new Date(event.startTime) > now);
        break;
      case "ongoing":
        filtered = events.filter((event) => {
          const startTime = new Date(event.startTime);
          const endTime = new Date(event.endTime);
          return startTime <= now && endTime >= now;
        });
        break;
      case "completed":
        filtered = events.filter((event) => new Date(event.endTime) < now);
        break;
      default:
        filtered = events;
    }
    setFilteredEvents(filtered);
  }

  function fetchEvents() {
    setLoading(true);
    getAllEvents()
      .then(res => setEvents(res.data.data))
      .finally(() => setLoading(false));
  }

  if (loading) return <div style={{ textAlign: 'center', margin: '40px 0' }}>Đang tải...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 28, marginBottom: 24 }}>Danh sách sự kiện</h2>
      {/* Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {EVENT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '8px 18px',
              borderRadius: 20,
              border: '1px solid #E3E8F0',
              background: selectedCategory === cat.id ? '#FF6B6B' : '#fff',
              color: selectedCategory === cat.id ? '#fff' : '#333',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {cat.name}
          </button>
        ))}
        <button onClick={fetchEvents} style={{ marginLeft: 'auto', padding: '8px 18px', borderRadius: 20, border: '1px solid #E3E8F0', background: '#F8F9FA', color: '#333', fontWeight: 500, cursor: 'pointer' }}>Làm mới</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {filteredEvents.map(event => {
          const statusColor = getStatusColor(event.status);
          return (
            <div
              key={event._id}
              style={{
                width: 320,
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <img
                src={event.bannerUrl}
                alt={event.title}
                style={{ width: '100%', height: 180, objectFit: 'cover' }}
              />
              <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Status + Participants */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ background: statusColor.bg, color: statusColor.color, borderRadius: 12, padding: '2px 10px', fontSize: 12, fontWeight: 600, marginRight: 8 }}>{event.status?.toUpperCase()}</span>
                  <span style={{ color: '#4A60E8', fontWeight: 600, fontSize: 13 }}>
                    {event.registeredParticipants || 0}/{event.expectedParticipants}
                  </span>
                </div>
                <h3 style={{ fontSize: 20, margin: 0, marginBottom: 8 }}>{event.title}</h3>
                <p style={{ color: '#888', fontSize: 14, margin: 0, marginBottom: 8 }}>
                  {new Date(event.startTime).toLocaleString()} - {event.address}
                </p>
                {/* Contact */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  {event.contactPhone && (
                    <a href={`tel:${event.contactPhone}`} style={{ color: '#00B074', textDecoration: 'none', fontWeight: 500 }}>Gọi điện</a>
                  )}
                  {event.contactEmail && (
                    <a href={`mailto:${event.contactEmail}`} style={{ color: '#4A60E8', textDecoration: 'none', fontWeight: 500 }}>Email</a>
                  )}
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <Link to={`/events/${event._id}`} style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}>
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Events; 