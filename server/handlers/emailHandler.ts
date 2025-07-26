import fetch from 'node-fetch';
import type { Request, Response } from 'express';
import { generateReportHtml, generateAdminReportHtml } from '../utils/emailTemplates';

export const handleSendReport = async (req: Request, res: Response): Promise<void> => {
  const { userEmail, userName, report, painPoint, techReadiness } = req.body;

  if (!userEmail || !report) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  if (!resendApiKey) {
    console.error('❌ RESEND_API_KEY environment variable is not set');
    res.status(500).json({ error: 'Email service configuration error' });
    return;
  }

  console.log('📧 Preparing to send email with Resend API...');
  console.log('- User email:', userEmail);
  console.log('- User name:', userName || 'Not provided');
  console.log('- Has AI summary:', !!report.aiGeneratedSummary);

  const customerEmailHtml = generateReportHtml(report, painPoint, techReadiness);
  const adminEmailHtml = generateAdminReportHtml(userEmail, userName, report, painPoint, techReadiness);

  try {
    const customerResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Jason Henry <jason@nomadicliberty.com>',
        to: userEmail,
        subject: 'Your Workflow AI Audit Results',
        html: customerEmailHtml,
      }),
    });

    const adminResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Workflow Audit <jason@nomadicliberty.com>',
        to: 'jason@nomadicliberty.com',
        subject: `New Workflow Audit - ${userName || 'No Name'} - ${userEmail}`,
        html: adminEmailHtml,
      }),
    });

    if (!customerResponse.ok) {
      const error = await customerResponse.json();
      console.error('❌ Customer email error:', error);
      res.status(500).json({ error: 'Failed to send customer email' });
      return;
    }

    if (!adminResponse.ok) {
      const error = await adminResponse.json();
      console.error('❌ Admin email error:', error);
    }

    const result = await customerResponse.json();
    console.log('✅ Emails sent successfully:', result);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Server error sending email:', err);
    res.status(500).json({ error: 'Server error' });
  }
};