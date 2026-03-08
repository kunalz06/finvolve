"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "requests"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        data.sort((a, b) => {
          const ta = a.timestamp?.toDate?.() || new Date(a.timestamp || 0);
          const tb = b.timestamp?.toDate?.() || new Date(b.timestamp || 0);
          return tb - ta;
        });
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this request?")) return;
    try {
      await deleteDoc(doc(db, "requests", id));
      setRequests((prev) => prev.filter((r) => r.id !== id));
      if (selectedRequest?.id === id) setSelectedRequest(null);
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp?.toDate?.() || new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            {requests.length} project request{requests.length !== 1 ? "s" : ""} received
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">No requests yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {requests.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                formatDate={formatDate}
                onView={() => setSelectedRequest(req)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedRequest && (
        <RequestModal
          req={selectedRequest}
          formatDate={formatDate}
          onClose={() => setSelectedRequest(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

/* ─── Card Component ─────────────────────────────────────────── */
function RequestCard({ req, formatDate, onView, onDelete }) {
  const truncated =
    req.description && req.description.length > 120
      ? req.description.slice(0, 120) + "..."
      : req.description;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
      {/* Top row: badge + date */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
          {req.service || req.type || "General"}
        </span>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <CalendarIcon />
          {formatDate(req.timestamp)}
        </span>
      </div>

      {/* Contact info */}
      <div className="space-y-1">
        <p className="font-semibold text-gray-800 flex items-center gap-2">
          <PersonIcon />
          {req.name || "Unknown"}
        </p>
        {req.email && (
          <p className="text-sm text-purple-500 flex items-center gap-2">
            <EmailIcon />
            {req.email}
          </p>
        )}
        {req.phone && (
          <p className="text-sm text-green-500 flex items-center gap-2">
            <PhoneIcon />
            {req.phone}
          </p>
        )}
      </div>

      {/* Timeline + Budget */}
      {(req.timeline || req.budget) && (
        <div className="flex items-center gap-6 text-sm text-gray-600">
          {req.timeline && (
            <span className="flex items-center gap-1">
              <CalendarIcon />
              {req.timeline}
            </span>
          )}
          {req.budget && (
            <span className="flex items-center gap-1 text-green-600 font-medium">
              <DollarIcon />
              {req.budget}
            </span>
          )}
        </div>
      )}

      {/* Description preview */}
      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Description
        </p>
        <p className="text-sm text-gray-600 italic">
          &quot;{truncated || "No description provided"}&quot;
        </p>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex gap-2 mt-auto">
        {/* VIEW — explicit purple button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors"
        >
          <EyeIcon />
          View
        </button>

        {/* DELETE */}
        <button
          type="button"
          onClick={(e) => onDelete(req.id, e)}
          className="flex-1 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl py-2.5 text-sm font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/* ─── Modal Component ────────────────────────────────────────── */
function RequestModal({ req, formatDate, onClose, onDelete }) {
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              {req.service || req.type || "General"}
            </span>
            <span className="text-xs text-gray-400">
              {formatDate(req.timestamp)}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 space-y-5">

          {/* Contact */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Contact Information
            </h3>
            <p className="font-semibold text-gray-900 text-lg flex items-center gap-2">
              <PersonIcon />
              {req.name || "Unknown"}
            </p>
            {req.email && (
              <p className="text-purple-500 flex items-center gap-2 text-sm">
                <EmailIcon />
                <a href={`mailto:${req.email}`} className="hover:underline">
                  {req.email}
                </a>
              </p>
            )}
            {req.phone && (
              <p className="text-green-500 flex items-center gap-2 text-sm">
                <PhoneIcon />
                <a href={`tel:${req.phone}`} className="hover:underline">
                  {req.phone}
                </a>
              </p>
            )}
          </div>

          {/* Project Details */}
          {(req.timeline || req.budget) && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Project Details
              </h3>
              <div className="flex gap-4">
                {req.timeline && (
                  <div className="flex-1 bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">Timeline</p>
                    <p className="font-semibold text-blue-600">{req.timeline}</p>
                  </div>
                )}
                {req.budget && (
                  <div className="flex-1 bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">Budget</p>
                    <p className="font-semibold text-green-600">{req.budget}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Full Description — always shown, never truncated */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Full Description
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 min-h-[80px]">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                {req.description || "No description provided"}
              </p>
            </div>
          </div>

          {/* Company (if present) */}
          {req.company && (
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Company
              </h3>
              <p className="text-gray-700 text-sm">{req.company}</p>
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl py-3 text-sm font-medium transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={(e) => onDelete(req.id, e)}
            className="flex-1 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl py-3 text-sm font-medium transition-colors"
          >
            Delete Request
          </button>
        </div>

      </div>
    </div>
  );
}

/* ─── Icons ──────────────────────────────────────────────────── */
const EyeIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const PersonIcon = () => (
  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const EmailIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const PhoneIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const CalendarIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const DollarIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
