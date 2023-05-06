import * as pdfjsLib from "pdfjs-dist";

export default async function handler(req: any, res: any) {
  const { method } = req;

  if (method === "POST") {
    try {
      const fileUrl = req.body.fileURL;
      const loadingTask = pdfjsLib.getDocument(`${fileUrl}`);
      const pdf = await loadingTask.promise;
      const maxPages = pdf.numPages;
      let rawText = "";
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join("");
        rawText += pageText + "\n";
      }

      res.status(200).json({ success: true, text: rawText });
    } catch (err) {
      console.log(err);
    }
  }
}
