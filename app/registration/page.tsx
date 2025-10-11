'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const { username, email, full_name, password } = formData;

    // Basic front-end validation
    if (!username || !email || !full_name || !password) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim().toLowerCase(),
          full_name: full_name.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        setSuccess(data.message || 'Registration successful!');
        setTimeout(() => router.push('/admin-login'), 1500); // Redirect after 1.5s
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-3xl font-bold mb-6">Register</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          placeholder="Username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="full_name"
          placeholder="Full Name"
          type="text"
          value={formData.full_name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </main>
  );
}
