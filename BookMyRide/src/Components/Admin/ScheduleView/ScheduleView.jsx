import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Tooltip
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ScheduleView = () => {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // Form Data
  const [form, setForm] = useState({
    busId: "",
    routeId: "",
    departureTime: "",
    arrivalTime: "",
    fare: "",
    status: "Active",
  });

  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch Routes, Buses, Schedules
  const fetchSchedules = () => {
    axios.get("http://localhost:3005/schedules")
      .then(res => setSchedules(res.data.schedules))
      .catch(err => console.log(err));
  };

  const fetchBuses = () => {
    axios.get("http://localhost:3005/buses")
      .then(res => setBuses(res.data.buses))
      .catch(err => console.log(err));
  };

  const fetchRoutes = () => {
    axios.get("http://localhost:3005/routes")
      .then(res => setRoutes(res.data.routes))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchSchedules();
    fetchBuses();
    fetchRoutes();
  }, []);

  // Validation
  const validate = (data) => {
    const err = {};

    if (!data.busId) err.busId = "Select a bus";
    if (!data.routeId) err.routeId = "Select a route";
    if (!data.departureTime.trim()) err.departureTime = "Required";
    if (!data.arrivalTime.trim()) err.arrivalTime = "Required";
    if (!data.fare || data.fare <= 0) err.fare = "Invalid fare";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Add Dialog
  const openAddModal = () => {
    setForm({
      busId: "",
      routeId: "",
      departureTime: "",
      arrivalTime: "",
      fare: "",
      status: "Active",
    });
    setErrors({});
    setOpenAdd(true);
  };

  const closeAddModal = () => setOpenAdd(false);

  // Add
  const handleAddSchedule = () => {
    if (!validate(form)) return;

    axios.post("http://localhost:3005/add-schedule", form)
      .then(() => {
        alert("Schedule added");
        fetchSchedules();
        closeAddModal();
      })
      .catch(err => console.log(err));
  };

  // Edit modal
  const openEditModal = (schedule) => {
    setSelectedSchedule({ ...schedule });
    setErrors({});
    setOpenEdit(true);
  };

  const closeEditModal = () => setOpenEdit(false);

  // Update
  const handleUpdateSchedule = () => {
    if (!validate(selectedSchedule)) return;

    axios.put(`http://localhost:3005/update-schedule/${selectedSchedule._id}`, selectedSchedule)
      .then(() => {
        alert("Schedule updated");
        fetchSchedules();
        closeEditModal();
      })
      .catch(err => console.log(err));
  };

  // Delete (soft)
  const handleDelete = (id) => {
    axios.put(`http://localhost:3005/remove-schedule/${id}`)
      .then(() => {
        alert("Schedule set inactive");
        fetchSchedules();
      })
      .catch(err => console.log(err));
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 15 }}>
        <Button variant="contained" onClick={openAddModal}>Add</Button>
      </div>

      <table className="bus-table">
        <thead>
          <tr>
            <th>Bus</th>
            <th>Route</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Fare</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {schedules.length > 0 ? (
            schedules.map((s, i) => (
              <tr key={i}>
                <td>{s.busId?.name} ({s.busId?.vehicleNo})</td>
                <td>{s.routeId?.sourceLocation} → {s.routeId?.destinationLocation}</td>
                <td>{s.departureTime}</td>
                <td>{s.arrivalTime}</td>
                <td>₹{s.fare}</td>
                <td>{s.status}</td>

                <td>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => openEditModal(s)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(s._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="7" style={{ textAlign: "center" }}>No schedules found.</td></tr>
          )}
        </tbody>
      </table>

      {/* ADD MODAL */}
      <Dialog open={openAdd} onClose={closeAddModal}>
        <DialogTitle>Add Schedule</DialogTitle>
        <DialogContent>

          {/* BUS */}
          <TextField
            select
            label="Select Bus"
            fullWidth
            margin="normal"
            value={form.busId}
            onChange={(e) => setForm({ ...form, busId: e.target.value })}
            error={!!errors.busId}
            helperText={errors.busId}
          >
            {buses.map((bus) => (
              <MenuItem key={bus._id} value={bus._id}>
                {bus.name} ({bus.vehicleNo})
              </MenuItem>
            ))}
          </TextField>

          {/* ROUTE */}
          <TextField
            select
            label="Select Route"
            fullWidth
            margin="normal"
            value={form.routeId}
            onChange={(e) => setForm({ ...form, routeId: e.target.value })}
            error={!!errors.routeId}
            helperText={errors.routeId}
          >
            {routes.map((r) => (
              <MenuItem key={r._id} value={r._id}>
                {r.sourceLocation} → {r.destinationLocation}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Departure Time"
            type="time"
            fullWidth
            margin="normal"
            value={form.departureTime}
            onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
            error={!!errors.departureTime}
            helperText={errors.departureTime}
          />

          <TextField
            label="Arrival Time"
            type="time"
            fullWidth
            margin="normal"
            value={form.arrivalTime}
            onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })}
            error={!!errors.arrivalTime}
            helperText={errors.arrivalTime}
          />

          <TextField
            label="Fare"
            fullWidth
            margin="normal"
            type="number"
            value={form.fare}
            onChange={(e) => setForm({ ...form, fare: e.target.value })}
            error={!!errors.fare}
            helperText={errors.fare}
          />

          {/* STATUS DROPDOWN */}
          <TextField
            select
            label="Status"
            fullWidth
            margin="normal"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>

        </DialogContent>

        <DialogActions>
          <Button onClick={closeAddModal}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSchedule}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={openEdit} onClose={closeEditModal}>
        <DialogTitle>Edit Schedule</DialogTitle>
        <DialogContent>
          {selectedSchedule && (
            <>
              <TextField
                select
                label="Select Bus"
                fullWidth
                margin="normal"
                value={selectedSchedule.busId?._id || selectedSchedule.busId}
                onChange={(e) =>
                  setSelectedSchedule({ ...selectedSchedule, busId: e.target.value })
                }
                error={!!errors.busId}
                helperText={errors.busId}
              >
                {buses.map((bus) => (
                  <MenuItem key={bus._id} value={bus._id}>
                    {bus.name} ({bus.vehicleNo})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Select Route"
                fullWidth
                margin="normal"
                value={selectedSchedule.routeId?._id || selectedSchedule.routeId}
                onChange={(e) =>
                  setSelectedSchedule({ ...selectedSchedule, routeId: e.target.value })
                }
                error={!!errors.routeId}
                helperText={errors.routeId}
              >
                {routes.map((r) => (
                  <MenuItem key={r._id} value={r._id}>
                    {r.sourceLocation} → {r.destinationLocation}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Departure Time"
                type="time"
                fullWidth
                margin="normal"
                value={selectedSchedule.departureTime}
                onChange={(e) =>
                  setSelectedSchedule({ ...selectedSchedule, departureTime: e.target.value })
                }
                error={!!errors.departureTime}
                helperText={errors.departureTime}
              />

              <TextField
                label="Arrival Time"
                type="time"
                fullWidth
                margin="normal"
                value={selectedSchedule.arrivalTime}
                onChange={(e) =>
                  setSelectedSchedule({ ...selectedSchedule, arrivalTime: e.target.value })
                }
                error={!!errors.arrivalTime}
                helperText={errors.arrivalTime}
              />

              <TextField
                label="Fare"
                fullWidth
                margin="normal"
                type="number"
                value={selectedSchedule.fare}
                onChange={(e) =>
                  setSelectedSchedule({ ...selectedSchedule, fare: e.target.value })
                }
                error={!!errors.fare}
                helperText={errors.fare}
              />

              {/* STATUS DROPDOWN (FIXED) */}
              <TextField
                select
                label="Status"
                fullWidth
                margin="normal"
                value={selectedSchedule.status}
                onChange={(e) =>
                  setSelectedSchedule({ ...selectedSchedule, status: e.target.value })
                }
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>

            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeEditModal}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateSchedule}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ScheduleView;
