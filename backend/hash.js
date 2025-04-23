import bcrypt from 'bcrypt';

const generateHash = async () => {
  const password = 'mentor123';
  const hashed = await bcrypt.hash(password, 12);
  console.log("Hashed Password:", hashed);
};

generateHash();
