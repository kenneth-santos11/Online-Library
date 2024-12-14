require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 5000;

// Load Supabase environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Middleware
app.use(bodyParser.json());

// Register Endpoint
app.post('/api/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    // Create a new user in Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { firstName, lastName },
      },
    });

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: 'User registered successfully!', data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sign in the user using Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return res.status(401).json({ error: error.message });
    res.json({ message: 'Login successful', session: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
