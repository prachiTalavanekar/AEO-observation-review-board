import { supabase } from "@/lib/supabase";
import type { Observation } from "@/types/observation";
import DashboardClient from "./DashboardClient";

export const revalidate = 0;

async function getObservations(): Promise<Observation[]> {
  try {
    const { data, error } = await supabase
      .from("observations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching observations:", error.message);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error("Unexpected error fetching observations:", err);
    return [];
  }
}

export default async function DashboardPage() {
  const observations = await getObservations();
  return <DashboardClient observations={observations} />;
}
