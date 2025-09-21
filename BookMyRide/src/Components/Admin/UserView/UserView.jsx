import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserView.css';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button
} from '@mui/material';

const UserView = () => {
  const [users, setUsers] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch user list from backend
  const fetchUsers = () => {
    axios.get('http://localhost:3005/view')
      .then(res => {
        setUsers(res.data.users);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = (id) => {
      axios.delete(`http://localhost:3005/removeUser/${id}`)
        .then((response) => {
          alert(response.data.message);
          setUsers(prev => prev.filter(user => user._id !== id));
        })
        .catch((error) => {
          console.error('Delete error:', error);
          alert('Failed to delete user');
        });
  };

  // Edit user data
  const handleEdit = (user) => {
    setSelectedUser({ ...user }); // clone user object
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedUser(null);
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:3005/updateUser/${selectedUser._id}`, selectedUser)
      .then(res => {
        alert("User updated successfully");
        setOpenEdit(false);
        fetchUsers();
      })
      .catch(err => {
        console.error("Update failed", err);
        alert("Failed to update user");
      });
  };

  return (
    <div className="user-view-container">
      {/* <h2>Users</h2> */}
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.mobile}</td>
                <td>{user.role}</td>
                <td>
                  <Tooltip title="Edit">
                    <IconButton sx={{ color: 'rgb(22, 111, 125)' }} onClick={() => handleEdit(user)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(user._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle className='dialog-header'>Edit User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
              />
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
              />
              <TextField
                label="Mobile"
                fullWidth
                margin="normal"
                value={selectedUser.mobile}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, mobile: e.target.value })
                }
              />
              <RadioGroup
                row
                value={selectedUser.role}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, role: e.target.value })
                }
              >
                <FormControlLabel value="User" control={<Radio />} label="User" />
                <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
              </RadioGroup>
            </>
          )}
        </DialogContent>
        <DialogActions className='dialog-buttons'>
          <Button onClick={handleCloseEdit} className="cancel">Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserView;
