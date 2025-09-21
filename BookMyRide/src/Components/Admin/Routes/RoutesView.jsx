import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RoutesView.css';
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
  TextField
} from '@mui/material';

const RoutesView = () => {
  const [routes, setRoutes] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [newRoute, setNewRoute] = useState({
    sourceLocation: '',
    destinationLocation: '',
    distance: ''
  });
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [errors, setErrors] = useState({}); // Validation errors

  // Fetch routes
  const fetchRoutes = () => {
    axios.get('http://localhost:3005/routes')
      .then(res => setRoutes(res.data.routes))
      .catch(err => console.error('Error fetching routes:', err));
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  // Validation function
  const validate = (route) => {
    const newErrors = {};
    if (!route.sourceLocation || route.sourceLocation.trim() === '') {
      newErrors.sourceLocation = 'Source location is required';
    }
    if (!route.destinationLocation || route.destinationLocation.trim() === '') {
      newErrors.destinationLocation = 'Destination location is required';
    }
    if (route.distance === '' || route.distance === null || isNaN(route.distance)) {
      newErrors.distance = 'Distance is required';
    } else if (route.distance <= 0) {
      newErrors.distance = 'Distance must be greater than 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add Route
  const handleOpenAdd = () => {
    setErrors({});
    setOpenAdd(true);
  };
  const handleCloseAdd = () => {
    setOpenAdd(false);
    setNewRoute({
      sourceLocation: '',
      destinationLocation: '',
      distance: ''
    });
    setErrors({});
  };
  const handleAdd = () => {
    if (!validate(newRoute)) return;
    axios.post('http://localhost:3005/add-route', newRoute)
      .then(res => {
        alert('Route added successfully');
        handleCloseAdd();
        fetchRoutes();
      })
      .catch(err => {
        console.error('Add route failed', err);
        alert('Failed to add route');
      });
  };

  // Edit Route
  const handleEdit = (route) => {
    setSelectedRoute({ ...route });
    setErrors({});
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedRoute(null);
    setErrors({});
  };
  const handleUpdate = () => {
    if (!validate(selectedRoute)) return;
    axios.put(`http://localhost:3005/update-route/${selectedRoute._id}`, selectedRoute)
      .then(res => {
        alert('Route updated successfully');
        handleCloseEdit();
        fetchRoutes();
      })
      .catch(err => {
        console.error('Update failed', err);
        alert('Failed to update route');
      });
  };

  // Delete Route
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3005/remove-route/${id}`)
      .then(res => {
        alert('Route deleted successfully');
        setRoutes(prev => prev.filter(route => route._id !== id));
      })
      .catch(err => {
        console.error('Delete failed', err);
        alert('Failed to delete route');
      });
  };

  return (
    <div className="route-container">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <Button variant="contained" color="primary" onClick={handleOpenAdd}>
          Add
        </Button>
      </div>

      <table className="route-table">
        <thead>
          <tr>
            <th>Source Location</th>
            <th>Destination Location</th>
            <th>Distance (km)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {routes.length > 0 ? (
            routes.map((route, idx) => (
              <tr key={idx}>
                <td>{route.sourceLocation}</td>
                <td>{route.destinationLocation}</td>
                <td>{route.distance}</td>
                <td>
                  <Tooltip title="Edit">
                    <IconButton sx={{ color: 'rgb(22, 111, 125)' }} onClick={() => handleEdit(route)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(route._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>No routes found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Route Dialog */}
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle className='dialog-header'>Add Route</DialogTitle>
        <DialogContent>
          <TextField
            label="Source Location"
            fullWidth
            margin="normal"
            value={newRoute.sourceLocation}
            onChange={(e) => setNewRoute({ ...newRoute, sourceLocation: e.target.value })}
            error={!!errors.sourceLocation}
            helperText={errors.sourceLocation}
          />
          <TextField
            label="Destination Location"
            fullWidth
            margin="normal"
            value={newRoute.destinationLocation}
            onChange={(e) => setNewRoute({ ...newRoute, destinationLocation: e.target.value })}
            error={!!errors.destinationLocation}
            helperText={errors.destinationLocation}
          />
          <TextField
            label="Distance (km)"
            fullWidth
            margin="normal"
            type="number"
            value={newRoute.distance}
            onChange={(e) => setNewRoute({ ...newRoute, distance: parseFloat(e.target.value) })}
            error={!!errors.distance}
            helperText={errors.distance}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} color="secondary">Cancel</Button>
          <Button onClick={handleAdd} variant="contained" color="primary">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Route Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle className='dialog-header'>Edit Route</DialogTitle>
        <DialogContent>
          {selectedRoute && (
            <>
              <TextField
                label="Source Location"
                fullWidth
                margin="normal"
                value={selectedRoute.sourceLocation}
                onChange={(e) => setSelectedRoute({ ...selectedRoute, sourceLocation: e.target.value })}
                error={!!errors.sourceLocation}
                helperText={errors.sourceLocation}
              />
              <TextField
                label="Destination Location"
                fullWidth
                margin="normal"
                value={selectedRoute.destinationLocation}
                onChange={(e) => setSelectedRoute({ ...selectedRoute, destinationLocation: e.target.value })}
                error={!!errors.destinationLocation}
                helperText={errors.destinationLocation}
              />
              <TextField
                label="Distance (km)"
                fullWidth
                margin="normal"
                type="number"
                value={selectedRoute.distance}
                onChange={(e) => setSelectedRoute({ ...selectedRoute, distance: parseFloat(e.target.value) })}
                error={!!errors.distance}
                helperText={errors.distance}
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

export default RoutesView;
