import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  createEventApi,
  getEventsApi,
  updateEventApi,
  deleteEventApi,
} from "../../api/Events.jsx";
import { toastSuccess, toastError } from "../../utils/toast.jsx";
import TableSkeleton from "../../components/ui/TableSkeleton.jsx";

const EventsPage = () => {
  /* ---------------- LIST STATE ---------------- */
  const [events, setEvents] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [saving, setSaving] = useState(false);

  /* ---------------- MODALS ---------------- */
  const [creating, setCreating] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [deleteEvent, setDeleteEvent] = useState(null);
  const [genderFilter, setGenderFilter] = useState("all");

  /* ---------------- FORM ---------------- */
  const [form, setForm] = useState({
    name: "",
    clientName: "",
    clientEmail: "",
    gender: "men",
    category: "",
    eventDate: "",
    location: "",
    basePricePerPhoto: 50,
    expiresAt: "",
  });

  const searchTimeoutRef = useRef(null);

  /* ---------------- LOAD EVENTS ---------------- */
  const loadEvents = useCallback(
    async (opts = {}) => {
      try {
        setLoadingList(true);

        const params = {
          search: opts.search ?? search,
          page: opts.page ?? page,
          limit,
          ...(genderFilter !== "all" && { gender: genderFilter }),
        };

        const data = await getEventsApi(params);

        setEvents(data.events || []);
        setTotal(data.total || 0);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
      } catch {
        toastError("Failed to load events");
      } finally {
        setLoadingList(false);
      }
    },
    [search, page, genderFilter] // ✅ FIX
  );

  useEffect(() => {
    setPage(1);
    loadEvents({ page: 1 });
  }, [genderFilter, loadEvents]);

  useEffect(() => {
    loadEvents({ page });
  }, [page]);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      loadEvents({ search, page: 1 });
    }, 400);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [search, loadEvents]);

  /* ---------------- FORM HANDLERS ---------------- */
  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  /* ---------------- CREATE ---------------- */
  const handleSubmit = async () => {
    if (saving) return;
    try {
      setSaving(true);
      await createEventApi({
        ...form,
        basePricePerPhoto: Number(form.basePricePerPhoto),
      });
      toastSuccess("Event created");
      setCreating(false);
      loadEvents({ page: 1 });
    } catch {
      toastError("Event creation failed");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- UPDATE ---------------- */
  const handleUpdateEvent = async () => {
    if (saving) return;
    try {
      setSaving(true);
      await updateEventApi(editEvent._id, editEvent);
      toastSuccess("Event updated successfully");
      setEditEvent(null);
      loadEvents();
    } catch {
      toastError("Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDeleteEvent = async () => {
    if (saving) return;
    try {
      setSaving(true);
      await deleteEventApi(deleteEvent._id);
      toastSuccess("Event deleted");
      setDeleteEvent(null);

      if (events.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        loadEvents();
      }
    } catch {
      toastError("Delete failed");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Events</h1>
          <p className="text-sm text-slate-600">
            Create events and automatically onboard clients
          </p>
        </div>

        <div className="flex gap-3">
          <input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm w-[220px]"
          />

          <div className="flex gap-2">
            {["all", "men", "women"].map((g) => (
              <button
                key={g}
                onClick={() => {
                  setGenderFilter(g);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded text-sm border ${
                  genderFilter === g
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                {g === "all" ? "All" : g === "men" ? "Men" : "Women"}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCreating(true)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm"
          >
            + Add Event
          </button>
        </div>
      </div>

      {/* TABLE */}
      <section className="bg-white rounded-xl border p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="px-3 py-2 text-left">Event</th>
                <th className="px-3 py-2 text-left">Client</th>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingList ? (
                <TableSkeleton rows={10} />
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-500">
                    No events found
                  </td>
                </tr>
              ) : (
                events.map((e) => (
                  <tr key={e._id} className="border-b">
                    <td className="px-3 py-2">{e.name}</td>
                    <td className="px-3 py-2">{e.clientName}</td>
                    <td className="px-3 py-2">
                      {e.gender} / {e.category}
                    </td>
                    <td className="px-3 py-2">{e.eventDate?.slice(0, 10)}</td>
                    <td className="px-3 py-2 space-x-3">
                      <Link
                        to={`/admin/events/${e._id}/photos`}
                        className="text-xs underline"
                      >
                        Photos
                      </Link>
                      <Link
                        to={`/admin/client-link/${e.galleryCode}`}
                        className="text-xs text-blue-600 underline"
                      >
                        QR Link
                      </Link>
                      <button
                        onClick={() => setEditEvent(e)}
                        className="text-xs text-green-600 underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteEvent(e)}
                        className="text-xs text-red-600 underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* CREATE MODAL */}
      {creating && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-6">Create Event</h2>

            <div className="grid gap-4">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Event Name
                </label>
                <input
                  name="name"
                  placeholder="e.g. Wedding Ceremony"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>

              {/* Client Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Client Name
                </label>
                <input
                  name="clientName"
                  placeholder="Client Full Name"
                  value={form.clientName}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>

              {/* Client Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Client Email
                </label>
                <input
                  name="clientEmail"
                  type="email"
                  placeholder="client@example.com"
                  value={form.clientEmail}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-slate-900 outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Login credentials will be sent to this email
                </p>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded bg-white focus:ring-2 focus:ring-slate-900 outline-none"
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category
                </label>
                <input
                  name="category"
                  placeholder="e.g. 55kg / Bikini"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Location
                </label>
                <input
                  name="location"
                  placeholder="Event Location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>

              {/* Base Price */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Base Price Per Photo (₹)
                </label>
                <input
                  type="number"
                  name="basePricePerPhoto"
                  value={form.basePricePerPhoto}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Gallery Expiry Date
                </label>
                <input
                  type="date"
                  name="expiresAt"
                  value={form.expiresAt}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setCreating(false)}
                disabled={saving}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-slate-900 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                {saving && (
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {saving ? "Creating..." : "Create Event"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editEvent && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/40 flex justify-center items-center z-50"
          onClick={() => setEditEvent(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Edit Event</h2>

            <div className="space-y-3">
              <label className="text-sm">Event Name</label>
              <input
                className="border w-full px-3 py-2 rounded"
                value={editEvent.name || ""}
                onChange={(e) =>
                  setEditEvent({ ...editEvent, name: e.target.value })
                }
              />

              <label className="text-sm">Client Name</label>
              <input
                className="border w-full px-3 py-2 rounded"
                value={editEvent.clientName || ""}
                onChange={(e) =>
                  setEditEvent({ ...editEvent, clientName: e.target.value })
                }
              />

              <label className="text-sm">Client Email</label>
              <input
                type="email"
                className="border w-full px-3 py-2 rounded"
                value={editEvent.clientEmail || ""}
                onChange={(e) =>
                  setEditEvent({ ...editEvent, clientEmail: e.target.value })
                }
              />

              <label className="text-sm">Event Date</label>
              <input
                type="date"
                className="border w-full px-3 py-2 rounded"
                value={editEvent.eventDate?.slice(0, 10) || ""}
                onChange={(e) =>
                  setEditEvent({ ...editEvent, eventDate: e.target.value })
                }
              />

              <label className="text-sm">Location</label>
              <input
                className="border w-full px-3 py-2 rounded"
                value={editEvent.location || ""}
                onChange={(e) =>
                  setEditEvent({ ...editEvent, location: e.target.value })
                }
              />

              <label className="text-sm">Base Price</label>
              <input
                type="number"
                className="border w-full px-3 py-2 rounded"
                value={editEvent.basePricePerPhoto || ""}
                onChange={(e) =>
                  setEditEvent({
                    ...editEvent,
                    basePricePerPhoto: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditEvent(null)}
                disabled={saving}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateEvent}
                disabled={saving}
                className="px-4 py-2 bg-slate-900 text-white rounded flex items-center gap-2"
              >
                {saving && (
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteEvent && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={() => setDeleteEvent(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-sm p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-red-600">
              Delete Event?
            </h2>
            <p className="text-sm text-slate-700 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteEvent(null)}
                disabled={saving}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteEvent}
                disabled={saving}
                className="px-4 py-2 bg-red-600 text-white rounded flex items-center gap-2"
              >
                {saving && (
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {saving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
