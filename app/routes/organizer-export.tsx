import { env } from "cloudflare:workers";
import type { Route } from "./+types/organizer-export";
import { requireOrganizer } from "../lib/auth.server";
import { csv, xlsx } from "../lib/xlsx.server";

export async function loader({ request }: Route.LoaderArgs) {
  await requireOrganizer(request);
  const format = new URL(request.url).searchParams.get("format") === "csv" ? "csv" : "xlsx";
  const result = await env.DB.prepare(`
    SELECT
      r.public_id AS registration_id,
      r.full_name,
      r.school_community,
      r.email,
      r.created_at AS registration_date,
      r.status AS registration_status,
      gc.status AS guardian_approval_status,
      r.age_band,
      r.learner_category,
      r.attendance_status,
      r.marketing_consent
    FROM registrations r
    LEFT JOIN guardian_consents gc ON gc.registration_id = r.id
    ORDER BY r.created_at DESC
  `).all();
  const rows = result.results as Record<string, unknown>[];
  const headers = ["registration_id", "full_name", "school_community", "email", "registration_date", "registration_status", "guardian_approval_status", "age_band", "learner_category", "attendance_status", "marketing_consent"];
  const body = format === "csv" ? csv(rows, headers) : xlsx(rows, headers);
  return new Response(body, {
    headers: {
      "Content-Type": format === "csv" ? "text/csv; charset=utf-8" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="lumenet-registrations-2026-11-25.${format}"`,
      "Cache-Control": "no-store",
    },
  });
}
