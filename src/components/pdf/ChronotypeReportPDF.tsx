import React from "react";
import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { pdfStyles } from "./pdfStyles";
import { buildPdfReportViewModel, type ReportData } from "./pdfReportData";
import { ChronotypeIllustration, BrandMark } from "./pdfIcons";

const DISCLAIMER = "Wellness guidance only — not a medical diagnosis.";
const NOTICE_BODY =
  "This report reflects your sleep-wake preferences based on your assessment responses. It is not a medical diagnosis. Always consult your physician before making changes to your sleep or health routine. If you experience chronic fatigue, insomnia, or excessive daytime sleepiness, seek professional medical advice.";

function accentSoft(vm: ReturnType<typeof buildPdfReportViewModel>): string {
  if (vm.chronotypeKey === "LARK") return "#FFF6EA";
  if (vm.chronotypeKey === "OWL") return "#F4F0FC";
  return "#F1EEFC";
}

function accentBorder(vm: ReturnType<typeof buildPdfReportViewModel>): string {
  if (vm.chronotypeKey === "LARK") return "#F0C79A";
  if (vm.chronotypeKey === "OWL") return "#D9CFF5";
  return "#D9D4F5";
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <Text style={pdfStyles.eyebrow}>{children}</Text>;
}

function Header({ vm }: { vm: ReturnType<typeof buildPdfReportViewModel> }) {
  return (
    <View style={pdfStyles.header}>
      <View style={pdfStyles.brandMark}>
        <View style={pdfStyles.brandBox}>
          <BrandMark size={24} />
        </View>
        <Text style={pdfStyles.brandText}>Chronotype</Text>
      </View>
      {vm.orgName ? <Text style={pdfStyles.orgText}>{vm.orgName}</Text> : null}
    </View>
  );
}

function MetadataRow({ vm }: { vm: ReturnType<typeof buildPdfReportViewModel> }) {
  return (
    <View style={pdfStyles.metadataRow}>
      <View style={pdfStyles.metadataCol}>
        <Text style={pdfStyles.metadataLabel}>Prepared for</Text>
        <Text style={pdfStyles.metadataValue}>{vm.participantName}</Text>
      </View>
      <View style={pdfStyles.metadataCol}>
        <Text style={pdfStyles.metadataLabel}>Assessment date</Text>
        <Text style={pdfStyles.metadataValue}>{vm.assessmentDate}</Text>
      </View>
      <View style={pdfStyles.metadataCol}>
        <Text style={pdfStyles.metadataLabel}>Report ID</Text>
        <Text style={pdfStyles.metadataValue}>{vm.reportId}</Text>
      </View>
    </View>
  );
}

function Hero({ vm }: { vm: ReturnType<typeof buildPdfReportViewModel> }) {
  const accent = vm.accent;
  const soft = accentSoft(vm);
  const softBorder = accentBorder(vm);
  return (
    <View style={[pdfStyles.hero, { borderLeftColor: accent }]}>
      <View style={pdfStyles.heroLeft}>
        <Text style={[pdfStyles.heroEyebrow, { color: accent }]}>Your Chronotype</Text>
        <Text style={pdfStyles.heroName}>{vm.chronotypeName}</Text>
        <View style={[pdfStyles.heroPill, { backgroundColor: soft, borderColor: softBorder }]}>
          <Text style={[pdfStyles.heroPillText, { color: accent }]}>{vm.subtitle}</Text>
        </View>
        <Text style={pdfStyles.heroDescription}>{vm.description}</Text>
      </View>
      <View style={pdfStyles.heroRight}>
        {vm.heroImage ? (
          <View style={pdfStyles.heroImageFrame}>
            <Image src={vm.heroImage} style={pdfStyles.heroImage} />
          </View>
        ) : (
          <ChronotypeIllustration type={vm.chronotypeKey} />
        )}
        <View style={pdfStyles.peakPill}>
          <Text style={pdfStyles.peakPillText}>Peak focus · {vm.peakFocus}</Text>
        </View>
      </View>
    </View>
  );
}

function ScheduleRow({ vm }: { vm: ReturnType<typeof buildPdfReportViewModel> }) {
  const items = [
    { label: "Ideal wake time", value: vm.wakeTime },
    { label: "Best focus window", value: vm.focusWindow },
    { label: "Ideal bedtime", value: vm.bedtime },
  ];
  return (
    <View>
      <View style={{ marginTop: 18 }}>
        <Eyebrow>Your rhythm at a glance</Eyebrow>
      </View>
      <View style={pdfStyles.scheduleRow}>
        {items.map((item, i) => (
          <View key={item.label} style={pdfStyles.scheduleCol}>
            <Text style={pdfStyles.scheduleLabel}>{item.label}</Text>
            <Text style={pdfStyles.scheduleValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function StrengthsWatchOuts({ vm }: { vm: ReturnType<typeof buildPdfReportViewModel> }) {
  return (
    <View>
      <View style={{ marginTop: 16 }}>
        <Eyebrow>Your natural profile</Eyebrow>
      </View>
      <View style={pdfStyles.twoCol}>
        <View style={[pdfStyles.panel, { backgroundColor: "#EFF7F2", borderColor: "#C9DFD1" }]}>
          <Text style={[pdfStyles.panelTitle, { color: "#2F7D5B" }]}>Natural strengths</Text>
          {vm.strengths.map((s, i) => (
            <View key={i} style={pdfStyles.bulletRow}>
              <View style={[pdfStyles.bulletDot, { backgroundColor: "#2F7D5B" }]} />
              <Text style={pdfStyles.bulletText}>{s}</Text>
            </View>
          ))}
        </View>
        <View style={[pdfStyles.panel, { backgroundColor: "#FFF6EA", borderColor: "#F0C79A" }]}>
          <Text style={[pdfStyles.panelTitle, { color: "#ED8300" }]}>Watch-outs</Text>
          {vm.watchOuts.map((w, i) => (
            <View key={i} style={pdfStyles.bulletRow}>
              <View style={[pdfStyles.bulletDot, { backgroundColor: "#ED8300" }]} />
              <Text style={pdfStyles.bulletText}>{w}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function NextSteps({ vm }: { vm: ReturnType<typeof buildPdfReportViewModel> }) {
  return (
    <View style={pdfStyles.stepsSection}>
      <Text style={pdfStyles.stepsTitle}>Best next steps</Text>
      <View style={pdfStyles.stepsRow}>
        {vm.nextSteps.slice(0, 3).map((step, i) => (
          <View key={i} style={pdfStyles.stepCol}>
            <View style={pdfStyles.stepNumberCircle}>
              <Text style={pdfStyles.stepNumber}>{i + 1}</Text>
            </View>
            <Text style={pdfStyles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Footer({ vm, page, totalPages }: { vm: ReturnType<typeof buildPdfReportViewModel>; page: number; totalPages: number }) {
  return (
    <View style={pdfStyles.footer}>
      <Text style={pdfStyles.footerText}>{DISCLAIMER}</Text>
      <Text style={pdfStyles.footerText}>{vm.reportId} · Page {page} of {totalPages}</Text>
    </View>
  );
}

function PageTwoHeader({ vm }: { vm: ReturnType<typeof buildPdfReportViewModel> }) {
  return (
    <View style={pdfStyles.pageTwoHeader}>
      <View style={pdfStyles.pageTwoIdentity}>
        <BrandMark size={18} />
        <Text style={pdfStyles.pageTwoName}>{vm.participantName}</Text>
        <View style={pdfStyles.pageTwoPill}>
          <Text style={pdfStyles.pageTwoPillText}>{vm.chronotypeName}</Text>
        </View>
      </View>
      <Text style={pdfStyles.footerText}>{vm.reportId}</Text>
    </View>
  );
}

function GalleryPage({ vm, images, startIndex, page, totalPages }: { vm: ReturnType<typeof buildPdfReportViewModel>; images: string[]; startIndex: number; page: number; totalPages: number }) {
  const accent = vm.accent;
  const src = images[0];
  const idx = startIndex;
  return (
    <Page size="A4" style={pdfStyles.page}>
      <View style={{ flex: 1, flexDirection: "column" }}>
        <PageTwoHeader vm={vm} />
        <Text style={[pdfStyles.heroEyebrow, { color: accent, marginTop: 14 }]}>Visual journey</Text>
        <Text style={pdfStyles.galleryTitle}>Your {vm.chronotypeName} gallery</Text>
        <Text style={pdfStyles.gallerySub}>A visual journey through your {vm.chronotypeName} rhythm.</Text>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginTop: 10 }}>
          <View style={{ position: "absolute", top: 12, left: 12, zIndex: 1 }}>
            <View style={pdfStyles.galleryBadge}>
              <Text style={pdfStyles.galleryBadgeText}>{idx + 1}</Text>
            </View>
          </View>
          {src ? (
            <Image
              src={src}
              style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 6 }}
              cache={false}
            />
          ) : null}
        </View>
      </View>
      <Footer vm={vm} page={page} totalPages={totalPages} />
    </Page>
  );
}

function RecommendationsPage({ vm, page, totalPages }: { vm: ReturnType<typeof buildPdfReportViewModel>; page: number; totalPages: number }) {
  const left = vm.recommendations.slice(0, 3);
  const right = vm.recommendations.slice(3, 6);
  const renderCol = (recs: { title: string; description: string }[], offset: number) => (
    <View style={pdfStyles.recCol}>
      {recs.map((rec, i) => (
        <View key={i} style={pdfStyles.recItem}>
          <View style={pdfStyles.recRow}>
            <View style={pdfStyles.recNumberBadge}>
              <Text style={pdfStyles.recNumber}>{offset + i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={pdfStyles.recTitle}>{rec.title}</Text>
              <Text style={pdfStyles.recDesc}>{rec.description}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
  return (
    <Page size="A4" style={pdfStyles.page}>
      <View style={{ flex: 1 }}>
        <PageTwoHeader vm={vm} />
        <Eyebrow>Your daily guidance</Eyebrow>
        <Text style={pdfStyles.heading2}>Your personalised daily guidance</Text>
        <Text style={pdfStyles.heading2Sub}>Practical recommendations aligned to your {vm.chronotypeName} rhythm.</Text>
        <View style={pdfStyles.recGrid}>
          {renderCol(left, 0)}
          {renderCol(right, 3)}
        </View>
        <View style={pdfStyles.notice}>
          <Text style={pdfStyles.noticeTitle}>Important notice</Text>
          <Text style={pdfStyles.noticeBody}>{NOTICE_BODY}</Text>
        </View>
        <View style={pdfStyles.signoff}>
          <Text style={pdfStyles.signoffLine}>Sleep is the Foundation. Chronotype is the Blueprint.</Text>
          <Text style={pdfStyles.signoffSub}>Personalised report · Chronotype Assessment Platform</Text>
        </View>
      </View>
      <Footer vm={vm} page={page} totalPages={totalPages} />
    </Page>
  );
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function ChronotypeReportPDF({ data }: { data: ReportData }) {
  const vm = buildPdfReportViewModel(data);
  const galleryChunks = chunk(vm.galleryImages, 1);
  const totalPages = 2 + galleryChunks.length;
  return (
    <Document
      title={`${vm.participantName} — Chronotype Report`}
      subject="Personalised Chronotype Assessment Report"
      author={vm.orgName ?? "Chronotype"}
      creator="Chronotype Assessment Platform"
      producer="Chronotype"
    >
      <Page size="A4" style={pdfStyles.page}>
        <View style={{ flex: 1 }}>
          <Header vm={vm} />
          <MetadataRow vm={vm} />
          <Hero vm={vm} />
          <ScheduleRow vm={vm} />
          <StrengthsWatchOuts vm={vm} />
          <NextSteps vm={vm} />
        </View>
        <Footer vm={vm} page={1} totalPages={totalPages} />
      </Page>
      {galleryChunks.map((images, i) => (
        <GalleryPage key={i} vm={vm} images={images} startIndex={i * 1} page={2 + i} totalPages={totalPages} />
      ))}
      <RecommendationsPage vm={vm} page={2 + galleryChunks.length} totalPages={totalPages} />
    </Document>
  );
}
