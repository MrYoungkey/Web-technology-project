import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [members, setMembers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [membershipType, setMembershipType] = useState('');

  useEffect(() => {
    if (loggedIn) {
      fetchMembers();
    }
  }, [loggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', { username, password });
      if (response.status === 200) {
        setLoggedIn(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
    setPassword('');
    setMembers([]);
    clearForm();
  };

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/members');
      setMembers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/members', {
        name,
        email,
        phoneNumber,
        membershipType,
      });
      setMembers((prevMembers) => [...prevMembers, response.data]);
      clearForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteMember = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/members/${id}`);
      setMembers((prevMembers) => prevMembers.filter((member) => member._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setPhoneNumber('');
    setMembershipType('');
  };

  return (
    <div>
      {loggedIn ? (
        <>
          <h2>Gym Management System</h2>
          <button onClick={handleLogout}>Logout</button>
          <form onSubmit={handleFormSubmit}>
            <h2>Add Member</h2>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label>Phone Number:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <label>Membership Type:</label>
            <input
              type="text"
              value={membershipType}
              onChange={(e) => setMembershipType(e.target.value)}
              required
            />
            <button type="submit">Add</button>
          </form>
          <h2>Members</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Membership Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id}>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.phoneNumber}</td>
                  <td>{member.membershipType}</td>
                  <td>
                    <button onClick={() => handleDeleteMember(member._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default App;