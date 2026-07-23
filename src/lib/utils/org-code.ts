import { createClient } from "@/lib/supabase/server";

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export async function generateOrgCode(name: string): Promise<string> {
  const prefix = getInitials(name);
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("organizations")
    .select("unique_code")
    .like("unique_code", `${prefix}%`);

  const maxSeq = (existing ?? []).reduce((max, row) => {
    const num = parseInt((row.unique_code as string).slice(prefix.length), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);

  return `${prefix}${String(maxSeq + 1).padStart(4, "0")}`;
}
