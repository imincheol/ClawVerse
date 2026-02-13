import { redirect } from "next/navigation";

export default function PulseSecurityPage() {
  redirect("/pulse?tag=security");
}
