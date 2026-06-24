const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../users.json');

const readUsers = () => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

const findUserByEmail = (email) => {
  const users = readUsers();
  return users.find(u => u.email === email);
};

const findUserById = (id) => {
  const users = readUsers();
  return users.find(u => u.id === id);
};

const addUser = (user) => {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
  return user;
};

module.exports = {
  readUsers,
  writeUsers,
  findUserByEmail,
  findUserById,
  addUser
};
