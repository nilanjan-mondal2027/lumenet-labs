import { describe, expect, it } from "vitest";
import { unzipSync, strFromU8 } from "fflate";
import { csv, xlsx } from "../app/lib/xlsx.server";

describe("registration export", () => {
  const rows=[{full_name:"=2+2",email:"learner@example.com"}];
  const headers=["full_name","email"];
  it("neutralises spreadsheet formulas in CSV",()=>{expect(csv(rows,headers)).toContain("'=2+2")});
  it("creates a valid minimal XLSX archive",()=>{const files=unzipSync(xlsx(rows,headers));expect(files["xl/workbook.xml"]).toBeTruthy();expect(strFromU8(files["xl/worksheets/sheet1.xml"])).toContain("'=2+2")});
});
