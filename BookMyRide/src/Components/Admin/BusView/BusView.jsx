import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BusView.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";

const BusView = () => {
  const [buses, setBuses] = useState([]);
  const [busTypes, setBusTypes] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [newBus, setNewBus] = useState({
    name: "",
    typeId: "",
    totalSeats: "",
    vehicleNo: "",
    rc: "",
    status: "Active",
    image: null,
  });
  const [selectedBus, setSelectedBus] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch buses
  const fetchBuses = () => {
    axios
      .get("http://localhost:3005/buses")
      .then((res) => setBuses(res.data.buses))
      .catch((err) => console.error("Error fetching buses:", err));
  };

  // Fetch bus types
  const fetchBusTypes = () => {
    axios
      .get("http://localhost:3005/bus-types")
      .then((res) => {
        const activeTypes = res.data.busTypes.filter(
          (type) => type.status === "Active"
        );
        setBusTypes(activeTypes);
      })
      .catch((err) => console.error("Error fetching bus types", err));
  };

  useEffect(() => {
    fetchBuses();
    fetchBusTypes();
  }, []);

  // Validation
  const validate = (bus) => {
    const newErrors = {};
    if (!bus.name?.trim()) newErrors.name = "Bus name is required";
    if (!bus.typeId) newErrors.typeId = "Bus type is required";
    if (!bus.totalSeats || isNaN(bus.totalSeats) || bus.totalSeats <= 0)
      newErrors.totalSeats = "Total seats must be a positive number";
    if (!bus.vehicleNo?.trim()) newErrors.vehicleNo = "Vehicle number is required";
    if (!bus.rc?.trim()) newErrors.rc = "RC is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------ Add Bus ------------------
  const handleOpenAdd = () => {
    setErrors({});
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    setNewBus({
      name: "",
      typeId: "",
      totalSeats: "",
      vehicleNo: "",
      rc: "",
      status: "Active",
      image: null,
    });
  };

  const handleAdd = () => {
    if (!validate(newBus)) return;

    const formData = new FormData();
    for (let key in newBus) {
      formData.append(key, newBus[key]);
    }

    axios
      .post("http://localhost:3005/add-bus", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        alert("Bus added successfully");
        handleCloseAdd();
        fetchBuses();
      })
      .catch((err) => {
        console.error("Add bus failed", err);
        alert("Failed to add bus");
      });
  };

  // ------------------ Edit Bus ------------------
  const handleEdit = (bus) => {
    setSelectedBus({ ...bus, image: null });
    setErrors({});
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedBus(null);
  };

  const handleUpdate = () => {
    if (!validate(selectedBus)) return;

    const formData = new FormData();
    for (let key in selectedBus) {
      if (key !== "image") formData.append(key, selectedBus[key]);
    }
    if (selectedBus.image) formData.append("image", selectedBus.image);

    axios
      .put(
        `http://localhost:3005/update-bus/${selectedBus._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then(() => {
        alert("Bus updated successfully");
        handleCloseEdit();
        fetchBuses();
      })
      .catch((err) => {
        console.error("Update failed", err);
        alert("Failed to update bus");
      });
  };

  // ------------------ Delete / Inactivate Bus ------------------
  const handleDelete = (id) => {
    axios
      .put(`http://localhost:3005/remove-bus/${id}`)
      .then(() => {
        alert("Bus status updated to Inactive");
        setBuses((prev) =>
          prev.map((bus) =>
            bus._id === id ? { ...bus, status: "Inactive" } : bus
          )
        );
      })
      .catch((err) => {
        console.error("Deactivate failed", err);
        alert("Failed to update bus status");
      });
  };

  // ------------------ JSX ------------------
  return (
    <div className="bus-container">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Button variant="contained" onClick={handleOpenAdd}>
          Add Bus
        </Button>
      </div>

      <table className="bus-table">
        <thead>
          <tr>
            <th>Bus</th>
            <th>Type</th>
            <th>Total Seats</th>
            <th>Vehicle No</th>
            <th>RC</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {buses.length > 0 ? (
            buses.map((bus) => (
              <tr key={bus._id}>
                {/* Image + Name */}
                <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {bus.image ? (
                    <img
                      src={`http://localhost:3005/upload/${bus.image}`}
                      alt="bus"
                      style={{ width: 60, height: 60, borderRadius: 6, objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 6,
                        backgroundColor: "#eee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        color: "#999",
                      }}
                    >
                      No Image
                    </div>
                  )}
                  <span>{bus.name}</span>
                </td>

                <td>{busTypes.find((bt) => bt._id === bus.typeId)?.type}</td>
                <td>{bus.totalSeats}</td>
                <td>{bus.vehicleNo}</td>
                <td>{bus.rc}</td>
                <td>{bus.status}</td>

                <td>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleEdit(bus)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(bus._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: "center" }}>
                No buses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ------------------ Add Bus Dialog ------------------ */}
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>Add Bus</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={newBus.name}
            onChange={(e) => setNewBus({ ...newBus, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
          />
          <Select
            fullWidth
            value={newBus.typeId}
            onChange={(e) => setNewBus({ ...newBus, typeId: e.target.value })}
            displayEmpty
            margin="normal"
          >
            <MenuItem value="" disabled>
              Bus Type
            </MenuItem>
            {busTypes.map((type) => (
              <MenuItem key={type._id} value={type._id}>
                {type.type}
              </MenuItem>
            ))}
          </Select>
          {errors.typeId && (
            <p style={{ color: "red", fontSize: 12 }}>{errors.typeId}</p>
          )}
          <TextField
            label="Total Seats"
            fullWidth
            margin="normal"
            type="number"
            value={newBus.totalSeats}
            onChange={(e) =>
              setNewBus({ ...newBus, totalSeats: parseInt(e.target.value) })
            }
            error={!!errors.totalSeats}
            helperText={errors.totalSeats}
          />
          <TextField
            label="Vehicle No"
            fullWidth
            margin="normal"
            value={newBus.vehicleNo}
            onChange={(e) => setNewBus({ ...newBus, vehicleNo: e.target.value })}
            error={!!errors.vehicleNo}
            helperText={errors.vehicleNo}
          />
          <TextField
            label="RC"
            fullWidth
            margin="normal"
            value={newBus.rc}
            onChange={(e) => setNewBus({ ...newBus, rc: e.target.value })}
            error={!!errors.rc}
            helperText={errors.rc}
          />
          <Select
            fullWidth
            value={newBus.status}
            onChange={(e) => setNewBus({ ...newBus, status: e.target.value })}
            margin="normal"
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
          <input
            type="file"
            accept="image/*"
            style={{ marginTop: 16 }}
            onChange={(e) => setNewBus({ ...newBus, image: e.target.files[0] })}
          />
          {newBus.image && (
            <img
              src={URL.createObjectURL(newBus.image)}
              alt="preview"
              style={{ width: 100, height: 100, marginTop: 10, borderRadius: 8 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAdd} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* ------------------ Edit Bus Dialog ------------------ */}
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Edit Bus</DialogTitle>
        <DialogContent>
          {selectedBus && (
            <>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                value={selectedBus.name}
                onChange={(e) =>
                  setSelectedBus({ ...selectedBus, name: e.target.value })
                }
                error={!!errors.name}
                helperText={errors.name}
              />
              <Select
                fullWidth
                value={selectedBus.typeId}
                onChange={(e) =>
                  setSelectedBus({ ...selectedBus, typeId: e.target.value })
                }
                margin="normal"
              >
                {busTypes.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.type}
                  </MenuItem>
                ))}
              </Select>
              {errors.typeId && (
                <p style={{ color: "red", fontSize: 12 }}>{errors.typeId}</p>
              )}
              <TextField
                label="Total Seats"
                fullWidth
                margin="normal"
                type="number"
                value={selectedBus.totalSeats}
                onChange={(e) =>
                  setSelectedBus({
                    ...selectedBus,
                    totalSeats: parseInt(e.target.value),
                  })
                }
                error={!!errors.totalSeats}
                helperText={errors.totalSeats}
              />
              <TextField
                label="Vehicle No"
                fullWidth
                margin="normal"
                value={selectedBus.vehicleNo}
                onChange={(e) =>
                  setSelectedBus({ ...selectedBus, vehicleNo: e.target.value })
                }
                error={!!errors.vehicleNo}
                helperText={errors.vehicleNo}
              />
              <TextField
                label="RC"
                fullWidth
                margin="normal"
                value={selectedBus.rc}
                onChange={(e) =>
                  setSelectedBus({ ...selectedBus, rc: e.target.value })
                }
                error={!!errors.rc}
                helperText={errors.rc}
              />
              <Select
                fullWidth
                value={selectedBus.status}
                onChange={(e) =>
                  setSelectedBus({ ...selectedBus, status: e.target.value })
                }
                margin="normal"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
              <input
                type="file"
                accept="image/*"
                style={{ marginTop: 16 }}
                onChange={(e) =>
                  setSelectedBus({ ...selectedBus, image: e.target.files[0] })
                }
              />
              {selectedBus.image && typeof selectedBus.image === "object" ? (
                <img
                  src={URL.createObjectURL(selectedBus.image)}
                  alt="preview"
                  style={{ width: 100, height: 100, marginTop: 10, borderRadius: 8 }}
                />
              ) : selectedBus.image ? (
                <img
                  src={`http://localhost:3005/upload/${selectedBus.image}`}
                  alt="bus"
                  style={{ width: 100, height: 100, marginTop: 10, borderRadius: 8 }}
                />
              ) : null}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BusView;
