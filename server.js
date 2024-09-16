const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/getAccessToken', async (req, res) => {
  try {
    const serviceAccountPath = path.join(__dirname, 'service_account.json'); // Adjust the path to your service account file
    if (!fs.existsSync(serviceAccountPath)) {
      return res.status(500).json({ error: 'Service account file not found' });
    }

    const serviceAccount = require(serviceAccountPath);

    const client = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/firebase.messaging']
    });

    await client.authorize();

    res.json({ accessToken: client.credentials.access_token });
  } catch (error) {
    console.error('Error getting access token:', error);
    res.status(500).json({ error: 'Error getting access token' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
