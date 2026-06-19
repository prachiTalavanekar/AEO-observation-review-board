import { supabase } from "@/lib/supabase";
import type { Observation } from "@/types/observation";
import DashboardClient from "./DashboardClient";

export const revalidate = 0;

async function getObservations(): Promise<Observation[]> {
  const { data, error } = await supabase
    .from("observations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching observations:", error);
    return [];
  }

  return data ?? [];
}

export default async function DashboardPage() {
  const observations = await getObservations();

  return <DashboardClient observations={observations} />;
}
