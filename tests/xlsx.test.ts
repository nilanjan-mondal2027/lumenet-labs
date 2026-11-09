import { describe, expect, it } from "vitest";
import { unzipSync, strFromU8 } from "fflate";
import { csv, xlsx } from "../app/lib/xlsx.server";

describe("registration export", () => {
  const rows=[{registration_id:"LUM-TEST12345678",full_name:"=2+2",email:"learner@example.com",guardian_approval_status:"approved"}];
  const headers=["registration_id","full_name","email","guardian_approval_status"];
  it("neutralises spreadsheet formulas in CSV",()=>{expect(csv(rows,headers)).toContain("'=2+2")});
  it("preserves the private organizer export columns",()=>{expect(csv(rows,headers)).toContain("guardian_approval_status")});
  it("creates a valid minimal XLSX archive",()=>{const files=unzipSync(xlsx(rows,headers));expect(files["xl/workbook.xml"]).toBeTruthy();expect(strFromU8(files["xl/worksheets/sheet1.xml"])).toContain("'=2+2")});
});
