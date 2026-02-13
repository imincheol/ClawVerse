import { redirect } from "next/navigation";

export default function PulseNewPage() {
  redirect("/pulse?tag=new");
}
