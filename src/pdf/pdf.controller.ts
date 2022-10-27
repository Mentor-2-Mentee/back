import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { PdfService } from "./pdf.service";

@Controller("pdf")
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get()
  async puppeteerTest(@Res() res: Response) {
    const buffer = await this.pdfService.puppeteerTest();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=example.pdf",
      "Content-Length": buffer.length,
    });

    res.end(buffer);

    // res.set({
    //   "Content-Type": "application/pdf",
    // })
  }
}
