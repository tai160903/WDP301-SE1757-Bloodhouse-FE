import React, { useState, useEffect } from "react";
import {
  getBloodGroups,
  getBloodComponents,
  getBloodCompabilities,
  BloodCompability,
} from "../../../services/bloodCompatibility/index";

export default function BloodCompatibility() {
  const [bloodGroups, setBloodGroups] = useState<
    { _id: string; name: string }[]
  >([]);
  const [bloodComponents, setBloodComponents] = useState<
    { _id: string; name: string }[]
  >([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("");
  const [selectedComponent, setSelectedComponent] = useState<string>("");
  const [result, setResult] = useState<BloodCompability | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchData() {
      try {
        const groups = await getBloodGroups();
        const components = await getBloodComponents();
        setBloodGroups(groups);
        setBloodComponents(components);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Lỗi tải dữ liệu");
      }
    }
    fetchData();
  }, []);

  const handleCheckCompatibility = async () => {
    if (!selectedBloodGroup || !selectedComponent) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const compability = await getBloodCompabilities(
        selectedBloodGroup,
        selectedComponent
      );
      setResult(compability);
    } catch (err: any) {
      setError(err.message || "Lỗi khi kiểm tra tương thích");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .btn-check-compatibility {
          width: 100%;
          padding: 16px;
          font-size: 18px;
          font-weight: 700;
          border-radius: 10px;
          border: none;
          color: #fff;
          cursor: pointer;
          background-color: #dc2626; /* đỏ tươi */
          box-shadow: 0 6px 12px rgba(220, 38, 38, 0.5);
          transition: background-color 0.3s, box-shadow 0.3s;
        }
        .btn-check-compatibility.disabled {
          background-color: #fca5a5; /* đỏ nhạt khi disable */
          cursor: not-allowed;
          box-shadow: none;
        }
        .btn-check-compatibility:not(.disabled):hover {
          background-color: #b91c1c; /* đỏ đậm khi hover */
          box-shadow: 0 8px 16px rgba(185, 28, 28, 0.6);
        }
        select:focus {
          border-color: #dc2626 !important; /* đỏ cho select khi focus */
          outline: none;
          box-shadow: 0 0 6px rgba(220, 38, 38, 0.5);
        }
      `}</style>

      <div
        style={{
          maxWidth: 600,
          margin: "40px auto",
          padding: 32,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundColor: "#fff",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          border: "1px solid #eaeaea",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 40,
            color: "#1a1a1a",
            fontWeight: "700",
            fontSize: 28,
            letterSpacing: "0.02em",
          }}
        >
          Kiểm tra tương thích nhóm máu
        </h2>

        <div style={{ marginBottom: 28 }}>
          <label
            htmlFor="bloodGroupSelect"
            style={{
              fontWeight: "700",
              color: "#444",
              display: "block",
              marginBottom: 10,
              fontSize: 16,
            }}
          >
            Nhóm máu
          </label>
          <select
            id="bloodGroupSelect"
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 8,
              border: "1.5px solid #ddd",
              fontSize: 16,
              transition: "border-color 0.3s",
              outline: "none",
            }}
          >
            <option value="">-- Chọn nhóm máu --</option>
            {bloodGroups.map((bg) => (
              <option key={bg._id} value={bg._id}>
                {bg.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 32 }}>
          <label
            htmlFor="componentSelect"
            style={{
              fontWeight: "700",
              color: "#444",
              display: "block",
              marginBottom: 10,
              fontSize: 16,
            }}
          >
            Thành phần máu
          </label>
          <select
            id="componentSelect"
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 8,
              border: "1.5px solid #ddd",
              fontSize: 16,
              transition: "border-color 0.3s",
              outline: "none",
            }}
          >
            <option value="">-- Chọn thành phần máu --</option>
            {bloodComponents.map((bc) => (
              <option key={bc._id} value={bc._id}>
                {bc.name}
              </option>
            ))}
          </select>
        </div>

        <button
          disabled={!selectedBloodGroup || !selectedComponent || loading}
          onClick={handleCheckCompatibility}
          className={`btn-check-compatibility ${
            !selectedBloodGroup || !selectedComponent || loading
              ? "disabled"
              : ""
          }`}
        >
          {loading ? "Đang kiểm tra..." : "Kiểm tra tương thích"}
        </button>

        {error && (
          <p
            style={{
              marginTop: 28,
              color: "#ef4444",
              fontWeight: "700",
              textAlign: "center",
              fontSize: 15,
            }}
          >
            {error}
          </p>
        )}

        {result && (
          <div
            style={{
              marginTop: 36,
              padding: 28,
              backgroundColor: "#f9fafb",
              borderRadius: 12,
              boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                marginBottom: 20,
                color: "#111827",
                fontWeight: "700",
                fontSize: 22,
              }}
            >
              Kết quả tương thích
            </h3>

            <p
              style={{
                fontSize: 17,
                color: "#374151",
                marginBottom: 18,
                lineHeight: 1.5,
              }}
            >
              {result.bloodCompability}
            </p>

            <div style={{ marginBottom: 20 }}>
              <strong
                style={{
                  fontSize: 16,
                  color: "#4b5563",
                }}
              >
                Có thể hiến máu cho:
              </strong>
              {result.canDonateTo.length > 0 ? (
                <ul
                  style={{
                    marginTop: 8,
                    paddingLeft: 22,
                    color: "#374151",
                    fontSize: 15,
                    lineHeight: 1.5,
                  }}
                >
                  {result.canDonateTo.map((group) => (
                    <li key={group._id} style={{ marginBottom: 5 }}>
                      {group.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  style={{
                    fontStyle: "italic",
                    color: "#6b7280",
                    marginTop: 6,
                  }}
                >
                  Không có
                </p>
              )}
            </div>

            <div>
              <strong
                style={{
                  fontSize: 16,
                  color: "#4b5563",
                }}
              >
                Có thể nhận máu từ:
              </strong>
              {result.canReceiveFrom.length > 0 ? (
                <ul
                  style={{
                    marginTop: 8,
                    paddingLeft: 22,
                    color: "#374151",
                    fontSize: 15,
                    lineHeight: 1.5,
                  }}
                >
                  {result.canReceiveFrom.map((group) => (
                    <li key={group._id} style={{ marginBottom: 5 }}>
                      {group.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  style={{
                    fontStyle: "italic",
                    color: "#6b7280",
                    marginTop: 6,
                  }}
                >
                  Không có
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
