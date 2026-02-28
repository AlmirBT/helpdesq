import { redirect } from "next/navigation";

export default function HelpdeskLegacyPage() {
  redirect("/dashboard/requests");
}
