import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const route of ["/", "/register", "/privacy", "/resources"]) {
  test(`${route} renders without serious accessibility violations`, async ({page}) => {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    const results=await new AxeBuilder({page}).analyze();
    expect(results.violations.filter(v=>["critical","serious"].includes(v.impact||""))).toEqual([]);
  });
}
test("mobile page has no horizontal overflow",async({page})=>{await page.setViewportSize({width:390,height:844});await page.goto("/");const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));expect(sizes.scroll).toBeLessThanOrEqual(sizes.client)});
test("registration labels and privacy consent are present",async({page})=>{await page.goto("/register");await expect(page.getByLabel("Full name")).toBeVisible();await expect(page.getByLabel(/privacy notice/)).toBeVisible();await expect(page.getByRole("button",{name:"Submit registration"})).toBeVisible()});
test("guardian consent completion renders without reusing a token",async({page})=>{await page.goto("/consent/guardian?complete=1");await expect(page.getByRole("heading",{name:"Your decision is recorded."})).toBeVisible()});
test("organizer dashboard redirects unauthenticated visitors",async({page})=>{await page.goto("/organizer");await expect(page).toHaveURL(/\/organizer\/login$/);await expect(page.getByRole("heading",{name:"Private operations."})).toBeVisible()});
