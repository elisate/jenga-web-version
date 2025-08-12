declare module "html2pdf.js" {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: any;
    jsPDF?: any;
    pagebreak?: any;
  }

  interface Html2Pdf {
    from(element: HTMLElement): Html2Pdf;
    set(opt: Html2PdfOptions): Html2Pdf;
    save(): Promise<void>;
    toPdf(): Html2Pdf;
    get(type: string): any;
  }

  const html2pdf: () => Html2Pdf;
  export default html2pdf;
}
