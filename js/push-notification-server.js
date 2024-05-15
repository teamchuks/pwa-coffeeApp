const express = require('express');
const webpush = require('web-push');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure web-push with VAPID keys
const vapidKeys = {
  publicKey: 'BFgxZbP36JNCyaRVWmyQ0pl_M_cPA1QLzBSlvLV9faQQ_38zx9S_TBAHrhLuMGtDtIR2KcI8uNNm5uUqTlGU5cY',
  privateKey: 'FOpdJdovb7Nqxq8iLGZHJgMQhWufJdSjIX2IMwlTBo8',
};
webpush.setVapidDetails(
/*   'mailto:your-email@example.com', // Your email address */
  'mailto:chuksbestway2@gmail.com', // Your email address
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Endpoint for subscribing to push notifications
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  // Store the subscription details in your database
  // This is just a placeholder, replace it with your actual storage logic
  storeSubscription(subscription);
  res.status(201).json({});
});

// Endpoint for sending push notifications
app.post('/send-notification', async (req, res) => {
  const subscription = req.body.subscription;
  const payload = req.body.payload;
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Dummy function to store subscription details
function storeSubscription(subscription) {
  // Store the subscription details in your database
  // This is just a placeholder, replace it with your actual storage logic
}
