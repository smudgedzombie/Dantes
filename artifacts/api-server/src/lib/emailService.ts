import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const FROM = "Dantès · The Bloom Society <noreply@bloomsociety.ai>";
const resend = apiKey ? new Resend(apiKey) : null;

async function send(to: string, subject: string, html: string) {
  if (!resend) {
    console.log(`[EMAIL SUPPRESSED — set RESEND_API_KEY] To: ${to} | Subject: ${subject}`);
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error("[EMAIL ERROR]", err);
  }
}

const base = (body: string) => `
<div style="font-family:monospace;background:#030810;color:#fff;padding:40px;max-width:600px;margin:0 auto;border:1px solid #0d1b35">
  <div style="margin-bottom:24px">
    <p style="color:#D4AF37;font-size:10px;letter-spacing:0.4em;margin:0 0 4px">THE BLOOM SOCIETY</p>
    <h1 style="color:#fff;font-size:20px;margin:0">DANTÈS</h1>
  </div>
  ${body}
  <div style="margin-top:32px;padding-top:16px;border-top:1px solid #0d1b35">
    <p style="color:#2a4060;font-size:10px;margin:0">This is an automated notification from the Dantès command platform.</p>
  </div>
</div>`;

export const emailService = {
  async newApplication(to: string[], applicantName: string, company: string) {
    const html = base(`
      <p style="color:#D4AF37;font-size:10px;letter-spacing:0.3em;margin:0 0 16px">NEW MEMBERSHIP APPLICATION</p>
      <p style="color:#fff;font-size:14px;margin:0 0 8px"><strong>${applicantName}</strong> has submitted a Bloom Society membership application.</p>
      <p style="color:#8aa0b8;font-size:12px;margin:0 0 24px">Company: ${company}</p>
      <a href="https://dantes.replit.app/admin" style="display:inline-block;background:#D4AF37;color:#030810;padding:10px 24px;font-size:10px;font-weight:bold;letter-spacing:0.2em;text-decoration:none">REVIEW IN ADMIN HUB →</a>
    `);
    for (const addr of to) await send(addr, `New Application: ${applicantName} — ${company}`, html);
  },

  async memberActivated(to: string, fullName: string, bloomMemberId: string, grahamId: string) {
    const html = base(`
      <p style="color:#00ff88;font-size:10px;letter-spacing:0.3em;margin:0 0 16px">MEMBERSHIP ACTIVATED</p>
      <p style="color:#fff;font-size:14px;margin:0 0 8px">Welcome to the Bloom Society, <strong>${fullName}</strong>.</p>
      <p style="color:#8aa0b8;font-size:12px;margin:0 0 4px">Bloom Member ID: <span style="color:#D4AF37">${bloomMemberId}</span></p>
      <p style="color:#8aa0b8;font-size:12px;margin:0 0 24px">Assigned Graham: <span style="color:#D4AF37">${grahamId}</span></p>
      <p style="color:#8aa0b8;font-size:12px;margin:0 0 24px">Your personal portal is now active. Sign in to access your Graham activity, tasks, documents, and billing.</p>
      <a href="https://dantes.replit.app/portal" style="display:inline-block;background:#D4AF37;color:#030810;padding:10px 24px;font-size:10px;font-weight:bold;letter-spacing:0.2em;text-decoration:none">ACCESS YOUR PORTAL →</a>
    `);
    await send(to, "You're in — Bloom Society Membership Activated", html);
  },

  async taskComment(to: string, taskTitle: string, authorName: string, comment: string) {
    const html = base(`
      <p style="color:#06b6d4;font-size:10px;letter-spacing:0.3em;margin:0 0 16px">TASK UPDATE</p>
      <p style="color:#fff;font-size:14px;margin:0 0 8px">New reply on: <strong>${taskTitle}</strong></p>
      <p style="color:#8aa0b8;font-size:12px;margin:0 0 4px">From: ${authorName}</p>
      <div style="background:#040c1a;border:1px solid #0d1b35;padding:16px;margin:16px 0;font-size:12px;color:#8aa0b8;line-height:1.6">${comment}</div>
      <a href="https://dantes.replit.app/portal/tasks" style="display:inline-block;background:#D4AF37;color:#030810;padding:10px 24px;font-size:10px;font-weight:bold;letter-spacing:0.2em;text-decoration:none">VIEW TASK →</a>
    `);
    await send(to, `Task Update: ${taskTitle}`, html);
  },

  async invoiceCreated(to: string, period: string, amountUsd: string, dueDate: string | null, paymentLink: string | null) {
    const html = base(`
      <p style="color:#D4AF37;font-size:10px;letter-spacing:0.3em;margin:0 0 16px">NEW INVOICE</p>
      <p style="color:#fff;font-size:14px;margin:0 0 8px">A new invoice has been issued for your Bloom Society membership.</p>
      <div style="background:#040c1a;border:1px solid #0d1b35;padding:16px;margin:16px 0">
        <p style="color:#8aa0b8;font-size:12px;margin:0 0 4px">Period: <span style="color:#fff">${period}</span></p>
        <p style="color:#8aa0b8;font-size:12px;margin:0 0 4px">Amount: <span style="color:#D4AF37;font-size:16px;font-weight:bold">$${amountUsd}</span></p>
        ${dueDate ? `<p style="color:#8aa0b8;font-size:12px;margin:0">Due: <span style="color:#fff">${dueDate}</span></p>` : ""}
      </div>
      ${paymentLink ? `<a href="${paymentLink}" style="display:inline-block;background:#D4AF37;color:#030810;padding:10px 24px;font-size:10px;font-weight:bold;letter-spacing:0.2em;text-decoration:none">PAY NOW →</a>` : `<a href="https://dantes.replit.app/portal/billing" style="display:inline-block;background:#D4AF37;color:#030810;padding:10px 24px;font-size:10px;font-weight:bold;letter-spacing:0.2em;text-decoration:none">VIEW BILLING →</a>`}
    `);
    await send(to, `Invoice: ${period} — $${amountUsd}`, html);
  },

  async taskStatusChanged(to: string, taskTitle: string, newStatus: string) {
    const color = newStatus === "completed" ? "#00ff88" : newStatus === "in_progress" ? "#06b6d4" : "#D4AF37";
    const html = base(`
      <p style="color:${color};font-size:10px;letter-spacing:0.3em;margin:0 0 16px">TASK STATUS UPDATE</p>
      <p style="color:#fff;font-size:14px;margin:0 0 8px">Your task has been updated: <strong>${taskTitle}</strong></p>
      <p style="color:#8aa0b8;font-size:12px;margin:0 0 24px">New status: <span style="color:${color};font-weight:bold;text-transform:uppercase">${newStatus}</span></p>
      <a href="https://dantes.replit.app/portal/tasks" style="display:inline-block;background:#D4AF37;color:#030810;padding:10px 24px;font-size:10px;font-weight:bold;letter-spacing:0.2em;text-decoration:none">VIEW TASKS →</a>
    `);
    await send(to, `Task ${newStatus === "completed" ? "Completed" : "Updated"}: ${taskTitle}`, html);
  },
};
