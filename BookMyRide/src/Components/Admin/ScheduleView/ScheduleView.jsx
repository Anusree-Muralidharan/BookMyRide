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
  Tooltip,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ScheduleView = () => {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [form, setForm] = useState({
    busId: "",
    routeId: "",
    departureTime: "",
    arrivalTime: "",
    availableDays: [],
    fare: "",
    status: "Active",
  });

  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [errors, setErrors] = useState({});

  /* ---------------- FETCH ---------------- */
  const fetchSchedules = () => {
    axios
      .get("http://localhost:3005/schedules")
      .then((res) => setSchedules(res.data.schedules))
      .catch((err) => console.log(err));
  };

  const fetchBuses = () => {
    axios
      .get("http://localhost:3005/buses")
      .then((res) => setBuses(res.data.buses))
      .catch((err) => console.log(err));
  };

  const fetchRoutes = () => {
    axios
      .get("http://localhost:3005/routes")
      .then((res) => setRoutes(res.data.routes))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchSchedules();
    fetchBuses();
    fetchRoutes();
  }, []);

  /* ---------------- TIME CONVERT HELPER ---------------- */
  const convertTimeToMinutes = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(":");
    return parseInt(hours) * 60 + parseInt(minutes);
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = (data) => {
    const err = {};
    const isEdit = !!data._id;

    if (!data.busId) err.busId = "Select bus";
    if (!data.routeId) err.routeId = "Select route";
    if (!data.departureTime) err.departureTime = "Required";
    if (!data.arrivalTime) err.arrivalTime = "Required";
    if (!data.availableDays || data.availableDays.length === 0)
      err.availableDays = "Select at least one day";
    if (!data.fare || data.fare <= 0) err.fare = "Invalid fare";

    if (
      data.departureTime &&
      data.arrivalTime &&
      data.arrivalTime <= data.departureTime
    ) {
      err.arrivalTime = "Arrival must be after departure";
    }

    if (
      data.busId &&
      data.departureTime &&
      data.arrivalTime &&
      data.availableDays &&
      data.availableDays.length > 0
    ) {
      const newStart = convertTimeToMinutes(data.departureTime);
      const newEnd = convertTimeToMinutes(data.arrivalTime);

      const conflict = schedules.some((schedule) => {
        const scheduleBusId = schedule.busId?._id || schedule.busId;
        const sameBus = scheduleBusId === data.busId;

        const sameDay =
          schedule.availableDays &&
          schedule.availableDays.some((day) =>
            data.availableDays.includes(day)
          );

        const notSameRecord = isEdit ? schedule._id !== data._id : true;

        const existingStart = convertTimeToMinutes(schedule.departureTime);
        const existingEnd = convertTimeToMinutes(schedule.arrivalTime);

        const overlap =
          newStart < existingEnd && newEnd > existingStart;

        return sameBus && sameDay && overlap && notSameRecord;
      });

      if (conflict) {
        err.departureTime =
          "This bus already has a schedule during this time on selected day";
      }
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ---------------- DAY HANDLER ---------------- */
  const handleDayChange = (day) => {
    if (form.availableDays.includes(day)) {
      setForm({
        ...form,
        availableDays: form.availableDays.filter((d) => d !== day),
      });
    } else {
      setForm({
        ...form,
        availableDays: [...form.availableDays, day],
      });
    }
  };

  const handleEditDayChange = (day) => {
    if (selectedSchedule.availableDays.includes(day)) {
      setSelectedSchedule({
        ...selectedSchedule,
        availableDays: selectedSchedule.availableDays.filter(
          (d) => d !== day
        ),
      });
    } else {
      setSelectedSchedule({
        ...selectedSchedule,
        availableDays: [...selectedSchedule.availableDays, day],
      });
    }
  };

  /* ---------------- ADD ---------------- */
  const openAddModal = () => {
    setForm({
      busId: "",
      routeId: "",
      departureTime: "",
      arrivalTime: "",
      availableDays: [],
      fare: "",
      status: "Active",
    });
    setErrors({});
    setOpenAdd(true);
  };

  const handleAddSchedule = () => {
    if (!validate(form)) return;

    axios
      .post("http://localhost:3005/add-schedule", form)
      .then(() => {
        alert("Schedule added");
        fetchSchedules();
        setOpenAdd(false);
      })
      .catch((err) => console.log(err));
  };

  /* ---------------- EDIT ---------------- */
  const openEditModal = (schedule) => {
    setSelectedSchedule({
      ...schedule,
      busId: schedule.busId?._id || schedule.busId,
      routeId: schedule.routeId?._id || schedule.routeId,
      availableDays: schedule.availableDays || [],
    });
    setErrors({});
    setOpenEdit(true);
  };

  const handleUpdateSchedule = () => {
    if (!validate(selectedSchedule)) return;

    axios
      .put(
        `http://localhost:3005/update-schedule/${selectedSchedule._id}`,
        selectedSchedule
      )
      .then(() => {
        alert("Schedule updated");
        fetchSchedules();
        setOpenEdit(false);
      })
      .catch((err) => console.log(err));
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = (id) => {
    axios
      .put(`http://localhost:3005/remove-schedule/${id}`)
      .then(() => {
        alert("Schedule set inactive");
        fetchSchedules();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 15 }}>
        <Button variant="contained" onClick={openAddModal}>
          Add
        </Button>
      </div>

      {/* ================= TABLE ================= */}
      <table className="bus-table">
        <thead>
          <tr>
            <th>Bus</th>
            <th>Route</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Days</th>
            <th>Fare</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {schedules.length ? (
            schedules.map((s, i) => (
              <tr key={i}>
                <td>{s.busId?.name} ({s.busId?.vehicleNo})</td>
                <td>{s.routeId?.sourceLocation} → {s.routeId?.destinationLocation}</td>
                <td>{s.departureTime}</td>
                <td>{s.arrivalTime}</td>
                <td>{s.availableDays?.join(", ")}</td>
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
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No schedules found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ================= ADD MODAL ================= */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth>
        <DialogTitle>Add Schedule</DialogTitle>
        <DialogContent>
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
            InputLabelProps={{ shrink: true }}
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
            InputLabelProps={{ shrink: true }}
            value={form.arrivalTime}
            onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })}
            error={!!errors.arrivalTime}
            helperText={errors.arrivalTime}
          />

          <div style={{ marginTop: 15 }}>
            <strong>Available Days</strong>
            {errors.availableDays && (
              <div style={{ color: "red" }}>{errors.availableDays}</div>
            )}
            <div>
              {weekDays.map((day) => (
                <FormControlLabel
                  key={day}
                  control={
                    <Checkbox
                      checked={form.availableDays.includes(day)}
                      onChange={() => handleDayChange(day)}
                    />
                  }
                  label={day}
                />
              ))}
            </div>
          </div>

          <TextField
            label="Fare"
            type="number"
            fullWidth
            margin="normal"
            value={form.fare}
            onChange={(e) => setForm({ ...form, fare: e.target.value })}
            error={!!errors.fare}
            helperText={errors.fare}
          />

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
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSchedule}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= EDIT MODAL ================= */}
      {selectedSchedule && (
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth>
          <DialogTitle>Edit Schedule</DialogTitle>
          <DialogContent>

            <TextField
              select
              label="Select Bus"
              fullWidth
              margin="normal"
              value={selectedSchedule.busId}
              onChange={(e) =>
                setSelectedSchedule({
                  ...selectedSchedule,
                  busId: e.target.value,
                })
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
              value={selectedSchedule.routeId}
              onChange={(e) =>
                setSelectedSchedule({
                  ...selectedSchedule,
                  routeId: e.target.value,
                })
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
              InputLabelProps={{ shrink: true }}
              value={selectedSchedule.departureTime}
              onChange={(e) =>
                setSelectedSchedule({
                  ...selectedSchedule,
                  departureTime: e.target.value,
                })
              }
              error={!!errors.departureTime}
              helperText={errors.departureTime}
            />

            <TextField
              label="Arrival Time"
              type="time"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={selectedSchedule.arrivalTime}
              onChange={(e) =>
                setSelectedSchedule({
                  ...selectedSchedule,
                  arrivalTime: e.target.value,
                })
              }
              error={!!errors.arrivalTime}
              helperText={errors.arrivalTime}
            />

            <div style={{ marginTop: 15 }}>
              <strong>Available Days</strong>
              {errors.availableDays && (
                <div style={{ color: "red" }}>{errors.availableDays}</div>
              )}
              <div>
                {weekDays.map((day) => (
                  <FormControlLabel
                    key={day}
                    control={
                      <Checkbox
                        checked={selectedSchedule.availableDays.includes(day)}
                        onChange={() => handleEditDayChange(day)}
                      />
                    }
                    label={day}
                  />
                ))}
              </div>
            </div>

            <TextField
              label="Fare"
              type="number"
              fullWidth
              margin="normal"
              value={selectedSchedule.fare}
              onChange={(e) =>
                setSelectedSchedule({
                  ...selectedSchedule,
                  fare: e.target.value,
                })
              }
              error={!!errors.fare}
              helperText={errors.fare}
            />

            <TextField
              select
              label="Status"
              fullWidth
              margin="normal"
              value={selectedSchedule.status}
              onChange={(e) =>
                setSelectedSchedule({
                  ...selectedSchedule,
                  status: e.target.value,
                })
              }
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>

          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdateSchedule}>
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default ScheduleView;