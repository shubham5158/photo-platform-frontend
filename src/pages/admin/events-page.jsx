import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  createEventApi,
  getEventsApi,
  updateEventApi,
  deleteEventApi,
} from "../../api/Events.jsx";
import { toastSuccess, toastError } from "../../utils/toast.jsx";

const EventsPage = () => {
  // DATA
  const [events, setEvents] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  // SEARCH + PAGINATION
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // MODALS
  const [creating, setCreating] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [deleteEvent, setDeleteEvent] = useState(null);

  const [form, setForm] = useState({
    name: "",
    clientName: "",
    clientEmail: "",
    eventDate: "",
    location: "",
    basePricePerPhoto: 50,
    expiresAt: "",
  });

  const searchTimeoutRef = useRef(null);

  // LOAD EVENTS (search + pagination)
  const loadEvents = async (opts = {}) => {
    try {
      setLoadingList(true);

      const params = {
        search: opts.search ?? search,
        page: opts.page ?? page,
        limit,
      };

      const data = await getEventsApi(params);

      setEvents(Array.isArray(data.events) ? data.events : []);
      setTotal(data.total ?? 0);
      setPage(data.page ?? 1);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      toastError("Failed to load events");
    } finally {
      setLoadingList(false);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    loadEvents();
  }, []);

  // PAGE CHANGE
  useEffect(() => {
    loadEvents({ page });
  }, [page]);

  // SEARCH DEBOUNCE
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      loadEvents({ search, page: 1 });
    }, 400);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [search]);

  // FORM CHANGE
  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // CREATE EVENT
  const handleSubmit = async () => {
    try {
      await createEventApi({
        ...form,
        basePricePerPhoto: Number(form.basePricePerPhoto),
      });

      toastSuccess("Event created successfully!");

      setForm({
        name: "",
        clientName: "",
        clientEmail: "",
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

  // UPDATE EVENT
  const handleUpdateEvent = async () => {
    try {
      await updateEventApi(editEvent._id, editEvent);
      toastSuccess("Event updated successfully!");
      setEditEvent(null);
      loadEvents();
    } catch {
      toastError("Update failed");
    }
  };

  // DELETE EVENT
  const handleDeleteEvent = async () => {
    try {
      await deleteEventApi(deleteEvent._id);
      toastSuccess("Event deleted!");
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

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Events</h1>
          <p className="text-sm text-slate-600">
            Manage your events and client galleries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm w-[220px]"
          />

          {/* ADD EVENT */}
          <button
            onClick={() => setCreating(true)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800"
          >
            + Add Event
          </button>
        </div>
      </div>

      {/* EVENTS TABLE */}
      <section className="bg-white rounded-xl border p-6 shadow-sm">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-medium">Existing Events</h2>
          <p className="text-sm text-slate-600">
            {loadingList
              ? "Loading..."
              : `${total} events — page ${page} of ${totalPages}`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-slate-700">
                <th className="px-3 py-2 text-left">Event</th>
                <th className="px-3 py-2 text-left">Client</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Gallery Code</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loadingList ? (
                <tr>
                  <td colSpan="5" className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : events.length ? (
                events.map((e) => (
                  <tr key={e._id} className="border-b">
                    <td className="px-3 py-2">{e.name}</td>
                    <td className="px-3 py-2">{e.clientName}</td>
                    <td className="px-3 py-2">
                      {e.eventDate ? e.eventDate.slice(0, 10) : "-"}
                    </td>
                    <td className="px-3 py-2 font-mono">{e.galleryCode}</td>

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
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-slate-500">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-slate-600">
            Showing {events.length} of {total}
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1 || loadingList}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm">
              Page {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages || loadingList}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* === CREATE EVENT MODAL === */}
      {creating && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4"
          onClick={() => setCreating(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 md:p-7 overflow-y-auto max-h-[90vh] mt-10 mb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-5 text-slate-900 border-b pb-3">
              Create New Event
            </h2>

            <div className="space-y-4">
              {/* Event Name */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Event Name
                </label>
                <input
                  className="border w-full mt-1 px-3 py-2 rounded-md focus:ring-2 focus:ring-slate-700/30 outline-none"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              {/* Client Name */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Client Name
                </label>
                <input
                  className="border w-full mt-1 px-3 py-2 rounded-md focus:ring-2 focus:ring-slate-700/30 outline-none"
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                />
              </div>

              {/* Client Email */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Client Email
                </label>
                <input
                  type="email"
                  className="border w-full mt-1 px-3 py-2 rounded-md focus:ring-2 focus:ring-slate-700/30 outline-none"
                  name="clientEmail"
                  value={form.clientEmail}
                  onChange={handleChange}
                />
              </div>

              {/* Event Date */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Event Date
                </label>
                <input
                  type="date"
                  className="border w-full mt-1 px-3 py-2 rounded-md focus:ring-2 focus:ring-slate-700/30 outline-none"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Location
                </label>
                <input
                  className="border w-full mt-1 px-3 py-2 rounded-md focus:ring-2 focus:ring-slate-700/30 outline-none"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>

              {/* Base Price */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Base Price Per Photo (₹)
                </label>
                <input
                  type="number"
                  className="border w-full mt-1 px-3 py-2 rounded-md focus:ring-2 focus:ring-slate-700/30 outline-none"
                  name="basePricePerPhoto"
                  value={form.basePricePerPhoto}
                  onChange={handleChange}
                />
              </div>

              {/* Expires At */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Expires At
                </label>
                <input
                  type="date"
                  className="border w-full mt-1 px-3 py-2 rounded-md focus:ring-2 focus:ring-slate-700/30 outline-none"
                  name="expiresAt"
                  value={form.expiresAt}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setCreating(false)}
                className="px-4 py-2 rounded-md border text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === EDIT EVENT MODAL === */}
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

      {/* === DELETE EVENT MODAL === */}
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
