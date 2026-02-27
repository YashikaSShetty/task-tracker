const nodemailer = require('nodemailer');
const Task = require('../models/Task');

const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendEndOfDayEmail = async () => {
  try {
    const incompleteTasks = await Task.find({ completed: false });
    
    if (incompleteTasks.length === 0) {
      console.log('No incomplete tasks to report');
      return;
    }

    const transporter = createTransporter();
    
    const taskList = incompleteTasks.map((task, index) => 
      `${index + 1}. ${task.title} (Created: ${task.createdAt.toLocaleDateString()})`
    ).join('\n');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `📋 End of Day Task Report - ${incompleteTasks.length} Incomplete Tasks`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">📋 End of Day Task Report</h2>
          <p style="color: #666;">You have <strong>${incompleteTasks.length}</strong> incomplete task(s) remaining today:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">Incomplete Tasks:</h3>
            <ul style="color: #495057; line-height: 1.6;">
              ${incompleteTasks.map(task => `<li>${task.title}</li>`).join('')}
            </ul>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Keep up the great work! Tomorrow is another opportunity to complete these tasks. 💪
          </p>
          
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated email from your Task Tracker app.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`End of day email sent with ${incompleteTasks.length} incomplete tasks`);
  } catch (error) {
    console.error('Error sending end of day email:', error);
  }
};

module.exports = { sendEndOfDayEmail };
