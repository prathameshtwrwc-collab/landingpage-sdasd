import { StyleSheet } from "@react-pdf/renderer";

export const COLORS = {
  indigo: "#30268F",
  ink: "#1B1C27",
  muted: "#5C5D6E",
  faint: "#90919F",
  border: "#E6E6EE",
  softBg: "#F6F6FB",
  softPurple: "#F1EEFC",
  warm: "#ED8300",
  warmBg: "#FFF6EA",
  green: "#2F7D5B",
  greenBg: "#EFF7F2",
  white: "#FFFFFF",
};

export const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: COLORS.white,
    paddingTop: 30,
    paddingBottom: 34,
    paddingLeft: 40,
    paddingRight: 40,
    fontFamily: "Helvetica",
    color: COLORS.ink,
    fontSize: 10,
    lineHeight: 1.5,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  brandMark: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandBox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: COLORS.indigo,
    alignItems: "center",
    justifyContent: "center",
  },
  brandLetter: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "bold",
  },
  brandText: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.indigo,
    letterSpacing: -0.3,
  },
  orgText: {
    fontSize: 9,
    color: COLORS.muted,
    fontWeight: "medium",
  },

  // ── Shared ──
  eyebrow: {
    fontSize: 7.5,
    letterSpacing: 1,
    color: COLORS.indigo,
    marginBottom: 6,
    textTransform: "uppercase" as const,
  },

  // ── Metadata ──
  metadataRow: {
    flexDirection: "row",
    paddingTop: 16,
    paddingBottom: 4,
  },
  metadataCol: {
    flex: 1,
  },
  metadataLabel: {
    fontSize: 7.5,
    letterSpacing: 0.8,
    color: COLORS.faint,
    marginBottom: 3,
    textTransform: "uppercase" as const,
  },
  metadataValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.ink,
  },

  // ── Hero ──
  hero: {
    marginTop: 14,
    flexDirection: "row",
    backgroundColor: COLORS.softBg,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.indigo,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    padding: 22,
    alignItems: "center",
  },
  heroLeft: {
    flex: 1,
    paddingRight: 20,
  },
  heroEyebrow: {
    fontSize: 8,
    letterSpacing: 1.2,
    color: COLORS.indigo,
    marginBottom: 6,
    textTransform: "uppercase" as const,
  },
  heroName: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.ink,
    lineHeight: 1.05,
  },
  heroPill: {
    marginTop: 10,
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
  },
  heroPillText: {
    fontSize: 9,
    fontWeight: "bold",
  },
  heroDescription: {
    marginTop: 10,
    fontSize: 9,
    lineHeight: 1.55,
    color: COLORS.muted,
    maxWidth: 420,
  },
  heroRight: {
    minWidth: 128,
    alignItems: "center",
  },
  heroImageFrame: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    padding: 4,
  },
  heroImage: {
    width: 112,
    borderRadius: 5,
  },
  peakPill: {
    marginTop: 8,
    borderRadius: 999,
    borderWidth: 1,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: COLORS.softPurple,
    borderColor: "#D9D4F5",
    alignItems: "center",
  },
  peakPillText: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: COLORS.indigo,
  },

  // ── Schedule ──
  scheduleRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    marginTop: 12,
    overflow: "hidden",
  },
  scheduleCol: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
  },
  scheduleDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  scheduleLabel: {
    fontSize: 7.5,
    letterSpacing: 0.5,
    color: COLORS.faint,
    marginBottom: 4,
    textTransform: "uppercase" as const,
  },
  scheduleValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.ink,
  },

  // ── Strengths / Watch-outs ──
  twoCol: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  panel: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },
  panelTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 9,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    marginTop: 5,
    marginRight: 8,
  },
  bulletText: {
    fontSize: 8.5,
    lineHeight: 1.45,
    color: COLORS.ink,
    flex: 1,
  },

  // ── Next steps ──
  stepsSection: {
    marginTop: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D9D4F5",
    backgroundColor: COLORS.softPurple,
    padding: 14,
  },
  stepsTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.indigo,
    marginBottom: 10,
  },
  stepsRow: {
    flexDirection: "row",
  },
  stepCol: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  stepBorder: {
    width: 1,
    backgroundColor: "#D9D4F5",
  },
  stepNumberCircle: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: COLORS.indigo,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: {
    fontSize: 9,
    fontWeight: "bold",
    color: COLORS.white,
  },
  stepText: {
    fontSize: 8,
    lineHeight: 1.45,
    color: COLORS.ink,
    marginTop: 6,
  },

  // ── Page 2+ header ──
  pageTwoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pageTwoIdentity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pageTwoName: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: COLORS.ink,
  },
  pageTwoPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: COLORS.warmBg,
    borderColor: "#F0C79A",
  },
  pageTwoPillText: {
    fontSize: 7,
    fontWeight: "bold",
    color: COLORS.warm,
  },

  // ── Gallery ──
  galleryTitle: {
    marginTop: 18,
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.ink,
  },
  gallerySub: {
    marginTop: 4,
    fontSize: 9,
    color: COLORS.muted,
    marginBottom: 14,
  },
  galleryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  galleryBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.indigo,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    flexShrink: 0,
  },
  galleryBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "bold",
  },
  galleryImage: {
    width: 300,
    borderRadius: 6,
  },

  // ── Recommendations ──
  heading2: {
    marginTop: 20,
    marginBottom: 4,
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.ink,
  },
  heading2Sub: {
    marginTop: 0,
    marginBottom: 16,
    fontSize: 8.5,
    color: COLORS.muted,
  },
  recGrid: {
    flexDirection: "row",
    gap: 18,
  },
  recCol: {
    flex: 1,
  },
  recItem: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  recRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  recNumberBadge: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: COLORS.softPurple,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  recNumber: {
    fontSize: 8,
    fontWeight: "bold",
    color: COLORS.indigo,
  },
  recTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.ink,
    marginBottom: 3,
  },
  recDesc: {
    fontSize: 8,
    lineHeight: 1.45,
    color: COLORS.muted,
  },
  notice: {
    marginTop: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F0C79A",
    backgroundColor: COLORS.warmBg,
    padding: 13,
  },
  noticeTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: COLORS.warm,
    marginBottom: 4,
  },
  noticeBody: {
    fontSize: 8,
    lineHeight: 1.5,
    color: COLORS.muted,
  },
  signoff: {
    marginTop: 26,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 14,
  },
  signoffLine: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: COLORS.indigo,
  },
  signoffSub: {
    fontSize: 7.5,
    color: COLORS.faint,
    marginTop: 3,
  },

  // ── Footer ──
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    fontSize: 7.5,
    color: COLORS.faint,
  },
});

export const pagePadding = { top: 36, right: 40, bottom: 40, left: 40 };
