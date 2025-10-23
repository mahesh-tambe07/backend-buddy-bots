const express = require("express");
const router = express.Router();
const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();

router.post("/", async (req, res) => {
  const { userName, userEmail, resumeText, jobTitle, recruiterEmail } = req.body;

  // ✅ Validate required fields
  if (!userName || !userEmail || !resumeText || !jobTitle) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields.",
    });
  }

  try {
    // ✅ Step 1: Generate optimized cold email using OpenRouter
    const openrouterRes = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",

        messages: [
          {
            role: "system",
            content:
              "You are an expert assistant that writes highly professional job application emails.",
          },
          {
            role: "user",
            content: `Generate a strong cold email for a candidate named ${userName} applying for "${jobTitle}". Use their resume summary:\n\n${resumeText}`,
          },
        ],

        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.FRONTEND_URL, // required
        },
      }
    );

    const emailBody = openrouterRes.data.choices[0].message.content;

    // ✅ Step 2: Email using Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // ✅ recipient defaults
    const receiver = recruiterEmail || userEmail;

    const mailOptions = {
      from: `"${userName}" <${process.env.GMAIL_USER}>`,
      to: receiver,
      subject: `Job Application - ${jobTitle}`,
      text: emailBody,
      replyTo: userEmail,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Cold email generated and sent successfully",
      email: emailBody,
    });
  } catch (err) {
    console.error(
      "Automation error:",
      err.response?.data || err.message || err
    );

    return res.status(500).json({
      success: false,
      error: "Failed to generate or send the email.",
      details: err.response?.data || err.message,
    });
  }
});

module.exports = router;
