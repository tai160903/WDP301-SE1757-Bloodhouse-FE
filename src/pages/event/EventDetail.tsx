import useAuth from "@/hooks/useAuth";
import { getEventById } from "@/services/event";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function getStatusColor(status) {
  switch (status) {
    case "scheduled":
      return { bg: "#FFEBEE", color: "#FF6B6B" };
    case "ongoing":
      return { bg: "#E3FCEC", color: "#27AE60" };
    case "completed":
      return { bg: "#ECEFF1", color: "#95A5A6" };
    default:
      return { bg: "#ECEFF1", color: "#95A5A6" };
  }
}

const mockParticipants = [
  // Demo avatar, thay bằng API nếu có
  { avatar: "https://randomuser.me/api/portraits/men/1.jpg", name: "A" },
  { avatar: "https://randomuser.me/api/portraits/women/2.jpg", name: "B" },
  { avatar: "https://randomuser.me/api/portraits/men/3.jpg", name: "C" },
];

const EventDetail: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
    getEventById(id || "")
      .then((res) => setEvent(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  function handleRegister() {
    setRegistering(true);
    setTimeout(() => {
      setIsRegistered(true);
      setRegistering(false);
      alert("Đăng ký thành công! (Demo)");
    }, 1000);
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    alert("Đã copy link sự kiện!");
  }

  if (loading)
    return (
      <div style={{ textAlign: "center", margin: "40px 0" }}>Đang tải...</div>
    );
  if (!event) return <div>Không tìm thấy sự kiện</div>;

  const statusColor = getStatusColor(event.status);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <img
          src={event.bannerUrl}
          alt={event.title}
          style={{ width: "100%", maxHeight: 320, objectFit: "cover" }}
        />
        <div style={{ padding: 24 }}>
          {/* Status + Participants */}
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 12 }}
          >
            <span
              style={{
                background: statusColor.bg,
                color: statusColor.color,
                borderRadius: 12,
                padding: "2px 10px",
                fontSize: 12,
                fontWeight: 600,
                marginRight: 8,
              }}
            >
              {event.status?.toUpperCase()}
            </span>
            <span style={{ color: "#4A60E8", fontWeight: 600, fontSize: 13 }}>
              {event.registeredParticipants || 0}/{event.expectedParticipants}
            </span>
            {/* Share button */}
            <button
              onClick={handleShare}
              style={{
                marginLeft: "auto",
                background: "#F8F9FA",
                border: "none",
                borderRadius: 8,
                padding: "4px 12px",
                cursor: "pointer",
                color: "#4A60E8",
                fontWeight: 500,
              }}
            >
              Chia sẻ
            </button>
          </div>
          {/* Avatars participants (demo) */}
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
          >
            {mockParticipants.map((p, idx) => (
              <img
                key={idx}
                src={p.avatar}
                alt={p.name}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "2px solid #fff",
                  marginLeft: idx === 0 ? 0 : -12,
                }}
              />
            ))}
            <span style={{ marginLeft: 12, color: "#4A60E8", fontWeight: 600 }}>
              +{event.registeredParticipants || 0} Going
            </span>
          </div>
          <h2 style={{ fontSize: 28, marginBottom: 8 }}>{event.title}</h2>
          <p
            style={{ color: "#888", fontSize: 15, margin: 0, marginBottom: 12 }}
          >
            {new Date(event.startTime).toLocaleString()} - {event.address}
          </p>
          {/* Contact */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {event.contactPhone && (
              <a
                href={`tel:${event.contactPhone}`}
                style={{
                  color: "#00B074",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Gọi điện
              </a>
            )}
            {event.contactEmail && (
              <a
                href={`mailto:${event.contactEmail}`}
                style={{
                  color: "#4A60E8",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Email
              </a>
            )}
          </div>
          <div style={{ margin: "16px 0" }}>
            <div dangerouslySetInnerHTML={{ __html: event.description }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 24 }}>
            <img
              src={event.createdBy?.avatar}
              alt={event.createdBy?.fullName}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: 12,
              }}
            />
            <div>
              <strong>Người tổ chức:</strong> {event.createdBy?.fullName}
            </div>
          </div>
          {/* Đăng ký tham gia */}
          {!isAuthenticated ? (
            <>
              <div
                style={{
                  marginTop: 32,
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <button
                  onClick={handleRegister}
                  disabled={!isAuthenticated}
                  style={{
                    background: isRegistered ? "#4CAF50" : "#FF6B6B",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 32px",
                    fontWeight: 600,
                    fontSize: 16,
                    cursor:
                      isRegistered || registering ? "not-allowed" : "pointer",
                    opacity: isRegistered || registering ? 0.7 : 1,
                  }}
                >
                  Đăng ký tham gia
                </button>
                <Link
                  to="/events"
                  style={{
                    color: "#1976d2",
                    textDecoration: "underline",
                    fontWeight: 500,
                  }}
                >
                  ← Quay lại danh sách
                </Link>
              </div>
              <div className="text-sm text-muted-foreground flex align-middle">
                <span className="text-red-600">*</span>
                Vui lòng đăng nhập để đăng ký sự kiện
              </div>
            </>
          ) : (
            <div
              style={{
                marginTop: 32,
                display: "flex",
                gap: 16,
                alignItems: "center",
              }}
            >
              <button
                onClick={handleRegister}
                disabled={isRegistered || registering}
                style={{
                  background: isRegistered ? "#4CAF50" : "#FF6B6B",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 32px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor:
                    isRegistered || registering ? "not-allowed" : "pointer",
                  opacity: isRegistered || registering ? 0.7 : 1,
                }}
              >
                {registering
                  ? "Đang đăng ký..."
                  : isRegistered
                  ? "Đã đăng ký"
                  : "Đăng ký tham gia"}
              </button>
              <Link
                to="/events"
                style={{
                  color: "#1976d2",
                  textDecoration: "underline",
                  fontWeight: 500,
                }}
              >
                ← Quay lại danh sách
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
