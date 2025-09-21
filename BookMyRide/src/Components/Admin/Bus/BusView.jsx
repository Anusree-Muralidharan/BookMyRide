import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BusView.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem
} from '@mui/material';

const BusView = () => {
  const [buses, setBuses] = useState([]);
  const [busTypes, setBusTypes] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [newBus, setNewBus] = useState({
    name: '',
    typeId: '',
    totalSeats: '',
    vehicleNo: '',
    rc: ''
  });
  const [selectedBus, setSelectedBus] = useState(null);

  // Fetch buses
  const fetchBuses = () => {
    axios.get('http://localhost:3005/buses')
      .then(res => setBuses(res.data.buses))
      .catch(err => console.error('Error fetching buses:', err));
  };

  // Fetch bus types
  const fetchBusTypes = () => {
    axios.get('http://localhost:3005/bus-types')
      .then(res => setBusTypes(res.data.busTypes))
      .catch(err => console.error('Error fetching bus types:', err));
  };

  useEffect(() => {
    fetchBuses();
    fetchBusTypes();
  }, []);

  // Add Bus
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => {
    setOpenAdd(false);
    setNewBus({ name: '', typeId: '', totalSeats: '', vehicleNo: '', rc: '' });
  };
  const handleAdd = () => {
    axios.post('http://localhost:3005/add-bus', newBus)
      .then(res => {
        alert('Bus added successfully');
        handleCloseAdd();
        fetchBuses();
      })
      .catch(err => {
        console.error('Add bus failed', err);
        alert('Failed to add bus');
      });
  };

  // Edit Bus
  const handleEdit = (bus) => {
    setSelectedBus({ ...bus });
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedBus(null);
  };
  const handleUpdate = () => {
    axios.put(`http://localhost:3005/update-bus/${selectedBus._id}`, selectedBus)
      .then(res => {
        alert('Bus updated successfully');
        handleCloseEdit();
        fetchBuses();
      })
      .catch(err => {
        console.error('Update failed', err);
        alert('Failed to update bus');
      });
  };

  // Delete Bus
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3005/remove-bus/${id}`)
      .then(res => {
        alert('Bus deleted successfully');
        setBuses(prev => prev.filter(bus => bus._id !== id));
      })
      .catch(err => {
        console.error('Delete failed', err);
        alert('Failed to delete bus');
      });
  };

  return (
    <div className="bus-container">
      {/* <h2>Buses</h2> */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <Button variant="contained" color="primary" onClick={handleOpenAdd}>
          Add
        </Button>
      </div>

      <table className="bus-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Total Seats</th>
            <th>Vehicle No</th>
            <th>RC</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {buses.length > 0 ? (
            buses.map((bus, idx) => (
              <tr key={idx}>
                <td>{bus.name}</td>
                <td>{busTypes.find(bt => bt._id === bus.typeId)?.type}</td>
                <td>{bus.totalSeats}</td>
                <td>{bus.vehicleNo}</td>
                <td>{bus.rc}</td>
                <td>
                  <Tooltip title="Edit">
                    <IconButton sx={{ color: 'rgb(22, 111, 125)' }} onClick={() => handleEdit(bus)}>
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
              <td colSpan="6" style={{ textAlign: 'center' }}>No buses found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Bus Dialog */}
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle className='dialog-header'>Add Bus</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={newBus.name}
            onChange={(e) => setNewBus({ ...newBus, name: e.target.value })}
          />
          <Select
            fullWidth
            value={newBus.typeId || ''}
            aria-placeholder='Bus Type'
            displayEmpty                 
            onChange={(e) => setNewBus({ ...newBus, typeId: e.target.value })}
            style={{ marginTop: '16px' }}
          >
            <MenuItem value="" disabled selected>
              Bus Type
            </MenuItem> 
            {busTypes.map((type, idx) => (
              <MenuItem key={idx} value={type._id}>{type.type}</MenuItem>
            ))}
          </Select>
          <TextField
            label="Total Seats"
            fullWidth
            margin="normal"
            type="number"
            value={newBus.totalSeats}
            onChange={(e) => setNewBus({ ...newBus, totalSeats: parseInt(e.target.value) })}
          />
          <TextField
            label="Vehicle No"
            fullWidth
            margin="normal"
            value={newBus.vehicleNo}
            onChange={(e) => setNewBus({ ...newBus, vehicleNo: e.target.value })}
          />
          <TextField
            label="RC"
            fullWidth
            margin="normal"
            value={newBus.rc}
            onChange={(e) => setNewBus({ ...newBus, rc: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} color="secondary">Cancel</Button>
          <Button onClick={handleAdd} variant="contained" color="primary">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Bus Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle className='dialog-header'>Edit Bus</DialogTitle>
        <DialogContent>
          {selectedBus && (
            <>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                value={selectedBus.name}
                onChange={(e) => setSelectedBus({ ...selectedBus, name: e.target.value })}
              />
              <Select
                fullWidth
                value={selectedBus.typeId}
                onChange={(e) => setSelectedBus({ ...selectedBus, typeId: e.target.value })}
                style={{ marginTop: '16px' }}
              >
                {busTypes.map((type, idx) => (
                  <MenuItem key={idx} value={type._id}>{type.type}</MenuItem>
                ))}
              </Select>
              <TextField
                label="Total Seats"
                fullWidth
                margin="normal"
                type="number"
                value={selectedBus.totalSeats}
                onChange={(e) => setSelectedBus({ ...selectedBus, totalSeats: parseInt(e.target.value) })}
              />
              <TextField
                label="Vehicle No"
                fullWidth
                margin="normal"
                value={selectedBus.vehicleNo}
                onChange={(e) => setSelectedBus({ ...selectedBus, vehicleNo: e.target.value })}
              />
              <TextField
                label="RC"
                fullWidth
                margin="normal"
                value={selectedBus.rc}
                onChange={(e) => setSelectedBus({ ...selectedBus, rc: e.target.value })}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="secondary">Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BusView;
