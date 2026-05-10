"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type PartnerApprovalActionsProps = {
  restaurantId: string;
  ownerId: string | null;
};

export default function PartnerApprovalActions({
  restaurantId,
  ownerId,
}: PartnerApprovalActionsProps) {
  const router = useRouter();

  async function updateStatus(status: "approved" | "rejected") {
    await supabase
      .from("restaurants")
      .update({ approval_status: status })
      .eq("id", restaurantId);

    if (ownerId) {
      await supabase
        .from("profiles")
        .update({
          partner_status: status,
        })
        .eq("id", ownerId);
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={() => updateStatus("approved")}
        className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 py-3 font-black text-white hover:bg-green-600"
      >
        <CheckCircle size={18} />
        Approve
      </button>

      <button
        type="button"
        onClick={() => updateStatus("rejected")}
        className="flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 py-3 font-black text-white hover:bg-red-600"
      >
        <XCircle size={18} />
        Reject
      </button>
    </div>
  );
}