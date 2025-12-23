import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  createEventApi,
  getEventsApi,
  updateEventApi,
  deleteEventApi,
} from "../../api/Events.jsx";
import { toastSuccess, toastError } from "../../utils/toast.jsx";

const EventsPage = () => {
  /* ---------------- LIST STATE ---------------- */
  const [events, setEvents] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  /* ---------------- MODALS ---------------- */
  const [creating, setCreating] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [deleteEvent, setDeleteEvent] = useState(null);

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
    [search, page]
  );

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

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
    try {
      await createEventApi({
        ...form,
        basePricePerPhoto: Number(form.basePricePerPhoto),
      });

      toastSuccess("Event created & client login credentials sent via email");

      setForm({
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

      setCreating(false);
      setPage(1);
      loadEvents({ page: 1 });
    } catch {
      toastError("Event creation failed");
    }
  };

  /* ---------------- UPDATE ---------------- */
  const handleUpdateEvent = async () => {
    try {
      await updateEventApi(editEvent._id, editEvent);
      toastSuccess("Event updated successfully");
      setEditEvent(null);
      loadEvents();
    } catch {
      toastError("Update failed");
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDeleteEvent = async () => {
    try {
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
              {events.map((e) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CREATE MODAL */}
      {creating && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Create Event</h2>

            <div className="grid gap-3">
              <input
                name="name"
                placeholder="Event Name"
                value={form.name}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />
              <input
                name="clientName"
                placeholder="Client Name"
                value={form.clientName}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />
              <input
                name="clientEmail"
                type="email"
                placeholder="Client Email"
                value={form.clientEmail}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>

              <input
                name="category"
                placeholder="Category (55kg / Bikini)"
                value={form.category}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />
              <input
                type="date"
                name="eventDate"
                value={form.eventDate}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />
              <input
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />
              <input
                type="number"
                name="basePricePerPhoto"
                value={form.basePricePerPhoto}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />
              <input
                type="date"
                name="expiresAt"
                value={form.expiresAt}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setCreating(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-slate-900 text-white px-4 py-2 rounded"
              >
                Create Event
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
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateEvent}
                className="px-4 py-2 bg-slate-900 text-white rounded"
              >
                Save Changes
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
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
