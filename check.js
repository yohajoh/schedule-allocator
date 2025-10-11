import bcrypt from 'bcrypt';

// Simulate a user password
const plainPassword = '1234';

// Hash the password
bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) {
    return console.error('Error hashing password:', err);
  }

  console.log('Hashed password:', hash);

  // Now compare the plain password with the hash
  bcrypt.compare(plainPassword, hash, (err, result) => {
    if (err) {
      return console.error('Error comparing passwords:', err);
    }

    if (result) {
      console.log('✅ Passwords match!');
    } else {
      console.log('❌ Passwords do not match.');
    }
  });
});
