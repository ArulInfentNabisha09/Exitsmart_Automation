import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.describe("Advisor - Business Owner Management", () => {
  test("Login as advisor and create business owner", async ({ page }) => {
    test.setTimeout(180000);
    const timestamp = Date.now();

    await page.goto("https://dev2.exitsmarts.com/advisor/login");

    await page
      .getByRole("textbox", { name: "e.g. abc@domain.com" })
      .fill("arulinfentnabisha09+regularadv@gmail.com");
    await page.locator("#password").fill("Secret@1234567");
    await page.getByRole("button", { name: "Sign In" }).click();

    console.log("Waiting for manual verification code entry...");
    console.log("Please enter the verification code in the browser");

    await page.waitForURL(
      (url: URL) => !url.toString().includes("validate-code"),
      { timeout: 120000 }
    );
    console.log("Verification completed, proceeding...");

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000); // Extra wait for UI to settle

    await page.getByRole("button", { name: "Create Business Owner" }).click();
    await page.waitForTimeout(1000);

    await page.locator('input[name="first_name"]').fill("Sarah");
    await page.locator('input[name="last_name"]').fill("Johnson");
    await page.locator('input[name="business_name"]').fill("Tech Innovations");

    await page.locator("#react-select-2-input").fill("software");
    await page.waitForTimeout(500);
    await page.getByRole("option").first().click();

    await page
      .getByRole("button", { name: "Approximate Annual Revenue*" })
      .click();
    await page.locator("#react-select-2-input").fill("$10-$15 Million");
    await page.waitForTimeout(500);
    await page.getByRole("option", { name: "$10-$15 Million" }).click();

    await page.getByRole("button", { name: "Age of Business Owner*" })
    .click();
    await page.locator("#react-select-2-input").fill("40 - 45");
    await page.waitForTimeout(500);
    await page.getByRole("option", { name: "40 - 45" }).click();

    await page
      .locator('input[name="additional_advisor_email"]')
      .fill(`arulinfentnabisha09+aavSarah@gmail.com`);
    await page.waitForTimeout(500);

    await page
      .locator('input[name="email"]')
      .fill(`arulinfentnabisha09+Sarah@gmail.com`);
    await page.waitForTimeout(500);

    await page.locator('input[name="zip_code"]').fill("12345");
    await page.waitForTimeout(500);

    await page
      .locator("textarea[name='notes']")
      .fill(
        "create the new business owner account by advisor arulinfentnabisha09+regularadv@gmail.com"
      );
    await page.waitForTimeout(500);

    await page.getByRole("button", { name: "Create" }).click();
    await page.waitForTimeout(500);

    await page.waitForLoadState("networkidle");

    console.log("Business Owner created successfully!");
    console.log(`Email used: arulinfentnabisha09+boSarah@gmail.com`);
  });
});
