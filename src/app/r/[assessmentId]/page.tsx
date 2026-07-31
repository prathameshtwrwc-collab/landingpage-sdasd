import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import SharedResultCard from "./ResultCard";
import { fetchPublicResult } from "@/lib/queries/public-result";

const getResult = cache(async (assessmentId: string) => {
  return fetchPublicResult(assessmentId);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}): Promise<Metadata> {
  const { assessmentId } = await params;
  const data = await getResult(assessmentId);

  if (!data) {
    return {
      title: "Result Not Found",
      description: "This assessment result is not available or has expired.",
    };
  }

  const chronotypeName = (data.chronotype || "EAGLE").charAt(0) + (data.chronotype || "EAGLE").slice(1).toLowerCase();
  const name = [data.firstName, data.lastName].filter(Boolean).join(" ") || "Someone";

  return {
    title: `${chronotypeName} Chronotype - ${name}`,
    description: `${name} is a ${chronotypeName} chronotype.`,
    openGraph: {
      title: `${name} - ${chronotypeName} Chronotype`,
      description: `${name} is a ${chronotypeName} chronotype.`,
      type: "website",
    },
  };
}

export default async function SharedResultPage({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  const { assessmentId } = await params;
  const data = await getResult(assessmentId);

  if (!data) {
    notFound();
  }

  return (
    <main
      style={{
        margin: 0,
        background: "#F4F5FB",
        fontFamily: "Poppins, sans-serif",
        minHeight: "100vh",
        padding: "28px 16px",
      }}
    >
      <SharedResultCard data={data} />
    </main>
  );
}
