import Link from "next/link";
import ObservationForm from "@/components/ObservationForm";

export const metadata = {
  title: "New Observation — AEO Review Board",
};

export default function NewObservationPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-900 transition">
          Dashboard
        </Link>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 font-medium">New Observation</span>
      </nav>

      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Create New Observation
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Document how your brand appears in an AI-generated answer.
          </p>
        </div>
        <ObservationForm />
      </div>
    </div>
  );
}
