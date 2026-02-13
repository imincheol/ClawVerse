import { redirect } from "next/navigation";

export default function PulseTrendingPage() {
  redirect("/pulse?tag=trending");
}
