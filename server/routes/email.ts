import { RequestHandler } from "express";
import { EmailTemplate, EmailLog, User, Session } from "../models/index.js";
import { connectToDatabase } from "../database/connection.js";

// Ensure database connection
async function ensureDbConnection() {
  await connectToDatabase();
}

// Check admin authorization
async function checkAdminAuth(req: any): Promise<boolean> {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) return false;
  
  try {
    const session = await Session.findOne({ 
      token,
      expiresAt: { $gt: new Date() }
    }).populate('userId');
    
    return session && (session.userId as any)?.role === 'admin';
  } catch {
    return false;
  }
}

// Personalize email content
function personalizeContent(content: string, user: any): string {
  return content
    .replace(/{firstName}/g, user.firstName || '')
    .replace(/{lastName}/g, user.lastName || '')
    .replace(/{email}/g, user.email || '')
    .replace(/{company}/g, user.company || '');
}

// Mock email sending function (replace with actual email service)
async function sendEmailViaProvider(to: string, subject: string, body: string): Promise<{ success: boolean; error?: string }> {
  // This is a mock implementation. In production, integrate with:
  // - SendGrid
  // - Mailgun  
  // - AWS SES
  // - SMTP server
  
  console.log(`[EMAIL] Sending to: ${to}`);
  console.log(`[EMAIL] Subject: ${subject}`);
  console.log(`[EMAIL] Body: ${body.substring(0, 100)}...`);
  
  // Simulate random success/failure for demo
  const success = Math.random() > 0.1; // 90% success rate
  
  if (success) {
    return { success: true };
  } else {
    return { success: false, error: "SMTP connection failed" };
  }
}

// GET /api/email/templates - Get all email templates
export const getEmailTemplates: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const isAdmin = await checkAdminAuth(req);
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const templates = await EmailTemplate.find({}).sort({ createdAt: -1 });
    
    const templatesResponse = templates.map(template => ({
      id: template._id.toString(),
      name: template.name,
      subject: template.subject,
      body: template.body,
      isActive: template.isActive,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt
    }));
    
    res.json({ success: true, templates: templatesResponse });
  } catch (error) {
    console.error("Error fetching email templates:", error);
    res.status(500).json({ error: "Failed to fetch email templates" });
  }
};

// POST /api/email/templates - Create new email template
export const createEmailTemplate: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const isAdmin = await checkAdminAuth(req);
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { name, subject, body } = req.body;
    
    if (!name || !subject || !body) {
      return res.status(400).json({ error: "Name, subject, and body are required" });
    }

    const newTemplate = new EmailTemplate({
      name,
      subject,
      body,
      isActive: true
    });

    await newTemplate.save();
    
    const templateResponse = {
      id: newTemplate._id.toString(),
      name: newTemplate.name,
      subject: newTemplate.subject,
      body: newTemplate.body,
      isActive: newTemplate.isActive,
      createdAt: newTemplate.createdAt,
      updatedAt: newTemplate.updatedAt
    };

    res.status(201).json({ success: true, template: templateResponse });
  } catch (error) {
    console.error("Error creating email template:", error);
    res.status(500).json({ error: "Failed to create email template" });
  }
};

// PUT /api/email/templates/:id - Update email template
export const updateEmailTemplate: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const isAdmin = await checkAdminAuth(req);
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const templateId = req.params.id;
    const updateData = req.body;

    const updatedTemplate = await EmailTemplate.findByIdAndUpdate(
      templateId,
      {
        ...updateData,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedTemplate) {
      return res.status(404).json({ error: "Template not found" });
    }
    
    const templateResponse = {
      id: updatedTemplate._id.toString(),
      name: updatedTemplate.name,
      subject: updatedTemplate.subject,
      body: updatedTemplate.body,
      isActive: updatedTemplate.isActive,
      createdAt: updatedTemplate.createdAt,
      updatedAt: updatedTemplate.updatedAt
    };

    res.json({ success: true, template: templateResponse });
  } catch (error) {
    console.error("Error updating email template:", error);
    res.status(500).json({ error: "Failed to update email template" });
  }
};

// DELETE /api/email/templates/:id - Delete email template
export const deleteEmailTemplate: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const isAdmin = await checkAdminAuth(req);
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const templateId = req.params.id;

    const deletedTemplate = await EmailTemplate.findByIdAndDelete(templateId);

    if (!deletedTemplate) {
      return res.status(404).json({ error: "Template not found" });
    }

    res.json({ success: true, message: "Template deleted successfully" });
  } catch (error) {
    console.error("Error deleting email template:", error);
    res.status(500).json({ error: "Failed to delete email template" });
  }
};

// POST /api/email/send - Send email to users and custom emails
export const sendEmail: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const isAdmin = await checkAdminAuth(req);
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { userIds = [], customEmails = [], subject, body, templateId } = req.body;

    if ((!userIds || userIds.length === 0) && (!customEmails || customEmails.length === 0)) {
      return res.status(400).json({ error: "At least one recipient is required" });
    }

    if (!subject || !body) {
      return res.status(400).json({ error: "Subject and body are required" });
    }

    // Get registered users
    const targetUsers = await User.find({ _id: { $in: userIds }, isActive: true });
    
    // Combine all email addresses
    const allEmailAddresses = [
      ...targetUsers.map((user: any) => user.email),
      ...customEmails
    ];

    const emailLog = new EmailLog({
      to: allEmailAddresses,
      subject,
      body,
      status: 'pending',
      templateId: templateId || undefined
    });

    let successCount = 0;
    let failureCount = 0;
    const errors: string[] = [];

    // Send emails to registered users (with personalization)
    for (const user of targetUsers) {
      try {
        const personalizedSubject = personalizeContent(subject, user);
        const personalizedBody = personalizeContent(body, user);

        const result = await sendEmailViaProvider(
          user.email,
          personalizedSubject,
          personalizedBody
        );

        if (result.success) {
          successCount++;
        } else {
          failureCount++;
          errors.push(`${user.email}: ${result.error}`);
        }
      } catch (error) {
        failureCount++;
        errors.push(`${user.email}: ${error}`);
      }
    }

    // Send emails to custom email addresses (without personalization)
    for (const email of customEmails) {
      try {
        const result = await sendEmailViaProvider(
          email,
          subject,
          body
        );

        if (result.success) {
          successCount++;
        } else {
          failureCount++;
          errors.push(`${email}: ${result.error}`);
        }
      } catch (error) {
        failureCount++;
        errors.push(`${email}: ${error}`);
      }
    }

    // Update email log status
    if (failureCount === 0) {
      emailLog.status = 'sent';
    } else if (successCount === 0) {
      emailLog.status = 'failed';
      emailLog.error = errors.join('; ');
    } else {
      emailLog.status = 'sent'; // Partial success
      emailLog.error = `Partial delivery: ${errors.join('; ')}`;
    }

    await emailLog.save();

    res.json({
      success: true,
      message: `Email sent to ${successCount} recipient(s)`,
      stats: {
        total: allEmailAddresses.length,
        successful: successCount,
        failed: failureCount
      }
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};

// GET /api/email/logs - Get email logs
export const getEmailLogs: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const isAdmin = await checkAdminAuth(req);
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { limit = 100 } = req.query;
    
    const logs = await EmailLog.find({})
      .sort({ sentAt: -1 })
      .limit(Number(limit))
      .populate('templateId');
    
    const logsResponse = logs.map(log => ({
      id: log._id.toString(),
      to: log.to,
      subject: log.subject,
      body: log.body,
      status: log.status,
      templateId: log.templateId ? (log.templateId as any)._id.toString() : undefined,
      templateName: log.templateId ? (log.templateId as any).name : undefined,
      error: log.error,
      sentAt: log.sentAt
    }));

    res.json({ success: true, logs: logsResponse });
  } catch (error) {
    console.error("Error fetching email logs:", error);
    res.status(500).json({ error: "Failed to fetch email logs" });
  }
};

// GET /api/email/settings - Get email settings (placeholder)
export const getEmailSettings: RequestHandler = async (req, res) => {
  try {
    const isAdmin = await checkAdminAuth(req);
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Placeholder email settings
    const settings = {
      provider: 'smtp',
      fromName: 'IndustrialCo',
      fromEmail: 'support@industrialco.com',
      replyTo: 'no-reply@industrialco.com'
    };

    res.json({ success: true, settings });
  } catch (error) {
    console.error("Error fetching email settings:", error);
    res.status(500).json({ error: "Failed to fetch email settings" });
  }
};

// PUT /api/email/settings - Update email settings (placeholder)
export const updateEmailSettings: RequestHandler = async (req, res) => {
  try {
    const isAdmin = await checkAdminAuth(req);
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    // In a real implementation, you would save these settings to the database
    res.json({ success: true, message: "Email settings updated successfully" });
  } catch (error) {
    console.error("Error updating email settings:", error);
    res.status(500).json({ error: "Failed to update email settings" });
  }
};
