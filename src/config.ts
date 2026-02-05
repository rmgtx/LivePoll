// ============================================================
// 🔧 POLL CONFIGURATION — Toast: edit this and push to deploy
// ============================================================

export const POLL_CONFIG = {
  // The main question
  question: "When is MC's baby gonna be here?? 👶",

  // Poll type: "options" = pick from list, "date" = pick a date
  type: "date" as const,

  // Date range for the date picker (inclusive)
  dateRange: {
    start: "2026-02-15",
    end: "2026-05-31",
  },

  // Answer options (only used if type = "options")
  options: [] as string[],

  // Branding
  title: "Baby Pool 👶",
  subtitle: "Pick your date — let's see who's closest!",
  footer: "Powered by AI · Built live on this call",

  // Admin password to close the poll (type in the URL: ?admin=close)
  // Or use the lock button in the UI with this code
  adminCode: "baby2026",
};
