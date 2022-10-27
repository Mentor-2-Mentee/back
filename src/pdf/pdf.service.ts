import { Injectable } from "@nestjs/common";
import puppeteer from "puppeteer";

@Injectable()
export class PdfService {
  async puppeteerTest() {
    const browser = await puppeteer.launch({ headless: true });
    browser.newPage();
    const page = await browser.newPage();
    await page.goto(
      "https://namu.wiki/w/%EC%9B%90%EC%8B%A0/%EB%AC%B4%EA%B8%B0/%EC%96%91%EC%86%90%EA%B2%80",
      {
        waitUntil: "load",
      }
    );
    const pdf = await page.pdf({ format: "A4" });

    await browser.close();
    return pdf;
  }
}
