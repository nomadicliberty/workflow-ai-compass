import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/send-report', async (req, res) => {
  const { userEmail, report, painPoint, techReadiness } = req.body;

  if (!userEmail || !report) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const emailHtml = `<p>This is where your email template HTML will go.</p>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Jason Henry <jason@nomadicliberty.com>',
        to: userEmail,
        bcc: 'jason@nomadicliberty.com',
        subject: 'Your Workflow AI Audit Results',
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
