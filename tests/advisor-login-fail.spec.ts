import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

const LOGIN_URL = "https://dev2.exitsmarts.com/advisor/login";

// SECTION 1: Advisor Login - Negative Scenarios

test.describe("Advisor Login - Negative Scenarios", () => {
  // Invalid Email Format
  test("should show 'This must be a valid e-mail' for invalid email format", async ({
    page,
  }) => {
    await page.goto(LOGIN_URL);

    await page
      .getByRole("textbox", { name: "e.g. abc@domain.com" })
      .fill("nabigmail.om");
    await page.locator("#password").fill("Secret@1234567");

    await expect(page.getByText("This must be a valid e-mail")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeDisabled();
    console.log("Invalid email format message displayed correctly.");
  });

  // Missing Fields Validation
  test("should show validation errors when email & password are empty", async ({
    page,
  }) => {
    await page.goto(LOGIN_URL);

    const emailInput = page.getByRole("textbox", {
      name: "e.g. abc@domain.com",
    });
    const passwordInput = page.locator("#password");

    await emailInput.fill("arulinfentnabisha09+regularadv@gmail.com");
    await emailInput.clear();
    await page.waitForTimeout(1000);
     await passwordInput.fill("temp123");
     await page.waitForTimeout(1000);
    await expect(page.getByText("Email is required")).toBeVisible();

    await emailInput.fill("arulinfentnabisha09+regularadv@gmail.com");
    await passwordInput.fill("temp123");
    await passwordInput.clear();

    await expect(page.getByText("Password is required")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeDisabled();

    console.log(
      " Validation messages for missing fields displayed correctly."
    );
  });

  // Wrong Email (User Not Found)
  test("should show toast 'Advisor not found' when using wrong email", async ({
    page,
  }) => {
    await page.goto(LOGIN_URL);

    await page
      .getByRole("textbox", { name: "e.g. abc@domain.com" })
      .fill("arulinfentnabisha09+ri@gmail.com");
    await page.locator("#password").fill("Secret@1234567");
    await page.getByRole("button", { name: "Sign In" }).click();

    const userNotFoundToast = page.getByText(
      /Advisor with arulinfentnabisha09\+ri@gmail\.com not found/i
    );
    await expect(userNotFoundToast).toBeVisible({ timeout: 5000 });

    console.log("✅ 'Advisor not found' toast displayed correctly.");
  });

  //  Wrong Password (Invalid Credentials)
  test("should show toast 'Invalid Credentials' for wrong password", async ({
    page,
  }) => {
    await page.goto(LOGIN_URL);

    await page
      .getByRole("textbox", { name: "e.g. abc@domain.com" })
      .fill("arulinfentnabisha09+regularadv@gmail.com");
    await page.locator("#password").fill("WrongPassword123");
    await page.getByRole("button", { name: "Sign In" }).click();

    const invalidPasswordToast = page.getByText(/Invalid Credentials/i);
    await expect(invalidPasswordToast).toBeVisible({ timeout: 5000 });

    console.log("✅ 'Invalid Credentials' toast displayed correctly.");
  });
});

// SECTION 2: Advisor - Business Owner Creation (Fail Case)

test("Advisor - Field validation fail & pass sequence", async ({ page }) => {
  test.setTimeout(180000);

  await page.goto("https://dev2.exitsmarts.com/advisor/login");
  await page
    .getByRole("textbox", { name: "e.g. abc@domain.com" })
    .fill("arulinfentnabisha09+regularadv@gmail.com");
  await page.locator("#password").fill("Secret@1234567");
  await page.getByRole("button", { name: "Sign In" }).click();

  console.log("Please complete verification manually...");
  await page.waitForURL(
    (url: URL) => !url.toString().includes("validate-code"),
    { timeout: 120000 }
  );
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Create Business Owner" }).click();
  await page.waitForTimeout(1000);

  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("First Name is required")).toBeVisible();
  await page.locator('input[name="first_name"]').fill("Sarah");

  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("Last Name is required")).toBeVisible();
  await page.locator('input[name="last_name"]').fill("Johnson");

  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("Business Name is required")).toBeVisible();
  await page.locator('input[name="business_name"]').fill("Tech Innovations");

  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("Type of Business is required")).toBeVisible();
  await page.locator("#react-select-2-input").fill("software");
  await page.waitForTimeout(500);
  await page.getByRole("option").first().click();

  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("Annual Revenue is required")).toBeVisible();
  await page
    .getByRole("button", { name: "Approximate Annual Revenue*" })
    .click();
  await page.locator("#react-select-2-input").fill("$10-$15 Million");
  await page.waitForTimeout(500);
  await page.getByRole("option", { name: "$10-$15 Million" }).click();

  await page.getByRole("button", { name: "Create" }).click();
  await expect(
    page.getByText("Age of Business Owner is required")
  ).toBeVisible();
  await page.getByRole("button", { name: "Age of Business Owner*" }).click();
  await page.locator("#react-select-2-input").fill("40 - 45");
  await page.waitForTimeout(500);
  await page.getByRole("option", { name: "40 - 45" }).click();

  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("Email is required")).toBeVisible();
  await page
    .locator('input[name="email"]')
    .fill("arulinfentnabisha09+Sarah@gmail.com");
await page.getByRole("button", { name: "Create" }).click();

  await page.locator('input[name="zip_code"]').fill("12345");
  await page.locator('input[name="additional_advisor_email"]').fill(`arulinfentnabisha09+aavSarah@gmail.com`);
  await page.locator("textarea[name='notes']").fill("Business owner created by advisor test automation.");

  await page.getByRole("button", { name: "Create" }).click();
  await page.waitForLoadState("networkidle");
  const toast = page.getByText(
    /duplicate key value violates unique constraint/i
  );

  await expect(toast).toBeVisible({ timeout: 10000 });

  console.log(" Duplicate businessowner account");
});

