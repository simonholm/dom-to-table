// scripts/api.excel-export.js
// Experimental Excel-oriented export path.
//
// Purpose:
// - Keep Excel export separate from the API extraction baseline.
// - Avoid DevTools clipboard/focus problems.
// - Preserve scripts/api.extract.js as the simpler extraction prototype.
//
// Usage:
// 1. Open the relevant page in the browser.
// 2. Open DevTools Console.
// 3. Paste and run this whole file.
// 4. A file named jobs.csv should download.
// 5. Open/import that file in Excel.

fetch("/api/favorites?pageSize=30&page=1")
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const rows = data.results.map(row => {
      const job = row.jobentry || {};

      const rawEnd = job.date_ends?.slice(0, 10) || "";
      const end = rawEnd.startsWith("2650") ? "tills vidare" : rawEnd;

      return {
        start: job.date_posted?.slice(0, 10) || "",
        end,
        city: job.municipality_name || "",
        company: job.company_name || "",
        title: job.heading || ""
      };
    });

    console.table(rows);

    const headers = ["Start Date", "End Date", "City", "Company", "Title"];
    const csvRows = rows.map(row => [
      row.start,
      row.end,
      row.city,
      row.company,
      row.title
    ]);

    const escapeCsv = value => `"${String(value).replaceAll('"', '""')}"`;

    const csv = [headers, ...csvRows]
      .map(row => row.map(escapeCsv).join(";"))
      .join("\r\n");

    // UTF-8 BOM helps Excel recognize Swedish characters when opening CSV directly.
    const utf8Bom = "\uFEFF";
    const blob = new Blob([utf8Bom + csv], {
      type: "text/csv;charset=utf-8"
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "jobs.csv";
    link.click();

    console.log(`Exported ${rows.length} rows to jobs.csv`);
  })
  .catch(error => {
    console.error("Export failed", error);
  });
