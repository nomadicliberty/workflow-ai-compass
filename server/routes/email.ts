
import express from 'express';
import fetch from 'node-fetch';
import type { Request, Response } from 'express';
import { EMAIL_CONFIG } from '../config/constants';
import { generateReportHtml, generateAdminReportHtml } from '../utils/emailHelpers';

const router = express.Router();

router.post('/send-report', async (req: Request, res: Response) => {
  try {
    console.log('📧 Email send request received');
    const { userEmail, userName, report, painPoint, techReadiness } = req.body;

    if (!userEmail || !report) {
      console.error('❌ Missing required fields for email sending');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const resendApiKey = process.env.RESEND_API_KEY?.trim();
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY environment variable is not set');
      return res.status(500).json({ error: 'Email service configuration error' });
    }

    console.log('📄 Generating email HTML templates...');
    const customerEmailHtml = generateReportHtml(report, painPoint, techReadiness);
    const adminEmailHtml = generateAdminReportHtml(userEmail, userName, report, painPoint, techReadiness);

    console.log('📤 Sending customer email...');
    // Send customer email
    const customerResponse = await fetch(EMAIL_CONFIG.RESEND_API_URL, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_CONFIG.FROM_CUSTOMER,
        to: userEmail,
        subject: 'Your Workflow AI Audit Results',
        html: customerEmailHtml,
      }),
    });

    if (!customerResponse.ok) {
      const error = await customerResponse.json();
      console.error('❌ Customer email sending failed:', error);
      return res.status(500).json({ error: 'Failed to send customer email' });
    }

    console.log('✅ Customer email sent successfully');

    // Send admin email (don't fail if this fails)
    try {
      console.log('📤 Sending admin notification email...');
      await fetch(EMAIL_CONFIG.RESEND_API_URL, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: EMAIL_CONFIG.FROM_ADMIN,
          to: EMAIL_CONFIG.TO_ADMIN,
          subject: `New Workflow Audit - ${userName || 'No Name'} - ${userEmail}`,
          html: adminEmailHtml,
        }),
      });
      console.log('✅ Admin email sent successfully');
    } catch (adminError) {
      console.error('❌ Admin email error (non-fatal):', adminError);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Server error sending email:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
