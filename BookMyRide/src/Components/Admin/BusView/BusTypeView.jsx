import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BusTypeView.css';
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

const BusTypeView = () => {
  const [busTypes, setBusTypes] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [newBusType, setNewBusType] = useState({ type: '', status: 'Active' });
  const [selectedBusType, setSelectedBusType] = useState(null);

  // Fetch bus types from backend
  const fetchBusTypes = () => {
    axios.get('http://localhost:3005/bus-types')
      .then(res => {
        setBusTypes(res.data.busTypes);
      })
      .catch(err => console.error('Error fetching bus types', err));
  };

  useEffect(() => {
    fetchBusTypes();
  }, []);

  // Add Bus Type
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => {
    setOpenAdd(false);
    setNewBusType({ type: '', status: 'Active' });
  };
  const handleAdd = () => {
    axios.post('http://localhost:3005/add-bus-type', newBusType)
      .then(res => {
        alert('Bus type added successfully');
        handleCloseAdd();
        fetchBusTypes();
      })
      .catch(err => {
        console.error('Add bus type failed', err);
        alert('Failed to add bus type');
      });
  };

  // Edit Bus Type
  const handleEdit = (bus) => {
    setSelectedBusType({ ...bus }); // clone selected bus type
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedBusType(null);
  };
  const handleUpdate = () => {
    axios.put(`http://localhost:3005/update-bus-type/${selectedBusType._id}`, selectedBusType)
      .then(res => {
        alert('Bus type updated successfully');
        handleCloseEdit();
        fetchBusTypes();
      })
      .catch(err => {
        console.error('Update failed', err);
        alert('Failed to update bus type');
      });
  };

  // Delete Bus Type
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3005/remove-bus-type/${id}`)
      .then(res => {
        alert('Bus type deleted successfully');
        setBusTypes(prev => prev.filter(bus => bus._id !== id));
      })
      .catch(err => {
        console.error('Delete failed', err);
        alert('Failed to delete bus type');
      });
  };

  return (
    <div className="bus-type-container">
      <h2>Bus Types</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <Button variant="contained" color="primary" onClick={handleOpenAdd}>
          Add
        </Button>
      </div>

      <table className="bus-type-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {busTypes.length > 0 ? (
            busTypes.map((bus, idx) => (
              <tr key={idx} className='align-items'>
                <td>{bus.type}</td>
                <td>{bus.status}</td>
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
              <td colSpan="3" style={{ textAlign: 'center' }}>
                No bus types found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Bus Type Dialog */}
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle className='dialog-header'>Add Bus Type</DialogTitle>
        <DialogContent>
          <TextField
            label="Type"
            fullWidth
            margin="normal"
            value={newBusType.type}
            onChange={(e) => setNewBusType({ ...newBusType, type: e.target.value })}
          />
          <Select
            fullWidth
            value={newBusType.status}
            onChange={(e) => setNewBusType({ ...newBusType, status: e.target.value })}
            style={{ marginTop: '16px' }}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} color="secondary">Cancel</Button>
          <Button onClick={handleAdd} variant="contained" color="primary">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Bus Type Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle className='dialog-header'>Edit Bus Type</DialogTitle>
        <DialogContent>
          {selectedBusType && (
            <>
              <TextField
                label="Type"
                fullWidth
                margin="normal"
                value={selectedBusType.type}
                onChange={(e) => setSelectedBusType({ ...selectedBusType, type: e.target.value })}
              />
              <Select
                fullWidth
                value={selectedBusType.status}
                onChange={(e) => setSelectedBusType({ ...selectedBusType, status: e.target.value })}
                style={{ marginTop: '16px' }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
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

export default BusTypeView;
