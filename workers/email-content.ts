export type EmailJob = {
  emailId: string;
  registrationId: string;
  publicId: string;
  type: "guardian_consent" | "registration_confirmation";
  recipient: string;
  participantName: string;
  guardianToken: string | null;
  statusToken: string | null;
};

type EmailSettings = {
  siteUrl: string;
  workshopWhatsAppGroupUrl?: string;
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] || character);

export function buildEmailContent(job: EmailJob, settings: EmailSettings) {
  const guardian = job.type === "guardian_consent";
  const access = job.statusToken ? `?access=${encodeURIComponent(job.statusToken)}` : "";
  const link = guardian
    ? `${settings.siteUrl}/consent/guardian?token=${encodeURIComponent(job.guardianToken || "")}`
    : `${settings.siteUrl}/registration/status/${job.publicId}${access}`;
  const title = guardian ? "Guardian approval requested" : "Registration confirmed";
  const body = guardian
    ? `A workshop registration was submitted for ${job.participantName}. Review and approve or decline participation using the secure link.`
    : `Your Lumenet Labs registration is confirmed. Your registration ID is ${job.publicId}.`;
  const groupUrl = !guardian && job.statusToken ? settings.workshopWhatsAppGroupUrl?.trim() || "" : "";
  const groupNotice = groupUrl
    ? "Joining the workshop WhatsApp group is optional. WhatsApp may show your phone number to other group members. Group administrators should require approval for join requests."
    : "";
  const safeBody = escapeHtml(body);
  const safeLink = escapeHtml(link);
  const safeGroupUrl = escapeHtml(groupUrl);
  const safeGroupNotice = escapeHtml(groupNotice);

  return {
    subject: `Lumenet Labs: ${title}`,
    text: `${title}\n\n${body}\n\n${link}${groupUrl ? `\n\nJoin the Workshop WhatsApp Group: ${groupUrl}\n${groupNotice}` : ""}\n\nLumenet Labs`,
    html: `<!doctype html><html><body style="margin:0;background:#0a0b09;color:#f2f0e8;font-family:Arial,sans-serif"><div style="max-width:620px;margin:auto;padding:40px 24px"><p style="color:#d9ff3d;font-size:12px;letter-spacing:2px;text-transform:uppercase">Lumenet Labs</p><h1 style="font-size:34px">${title}</h1><p style="font-size:18px;line-height:1.6;color:#c7c6bd">${safeBody}</p><p><a href="${safeLink}" style="display:inline-block;padding:14px 20px;border-radius:999px;background:#d9ff3d;color:#0a0b09;text-decoration:none;font-weight:bold">${guardian ? "Review consent" : "Check registration status"}</a></p>${groupUrl ? `<p><a href="${safeGroupUrl}" style="display:inline-block;padding:14px 20px;border-radius:999px;background:#d9ff3d;color:#0a0b09;text-decoration:none;font-weight:bold">Join the Workshop WhatsApp Group</a></p><p style="font-size:13px;line-height:1.5;color:#a8a69f">${safeGroupNotice}</p>` : ""}<p style="font-size:13px;color:#888">This message is for workshop administration. Do not forward guardian approval links.</p></div></body></html>`,
  };
}
