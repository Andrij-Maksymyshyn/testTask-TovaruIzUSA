const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const url = "https://mail.google.com/";
const gmailLogin = "your_username";
const gmailPassword = "your_password";

const scrape = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });

    await page.type('input[type="email"]', gmailLogin);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(5000);

    await page.type('input[type="password"]', gmailPassword);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(5000);

    console.log(await page.content());
    const selector = "span > a";

    const text = await page.evaluate((selector) => {
      return document.querySelector(selector).getAttribute("aria-label");
    }, selector);
    const textCorrected = text.split(" ").slice(1).join(" ");
    const textFinaly = `${textCorrected} листи`;

    await browser.close();
    return { data: { unreades: textFinaly } };
  } catch (error) {
    console.error("Oopps, something was wrong:", error);
  }
};

scrape().then((value) => {
  console.log(value);
});
