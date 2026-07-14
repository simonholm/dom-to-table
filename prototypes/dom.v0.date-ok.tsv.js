// Preserved v0 DOM baseline from the point where date extraction was reliable.
// "date-ok" matters because city parsing kept failing on mixed presentation text
// such as "Örebro · 24/3 - 14/4" and "Örebro/Karlskoga".
// The project later moved toward scripts/api.extract.js for structured API extraction.

let jobs = [];

document.querySelectorAll("a").forEach(el => {
  const text = el.innerText;
  if (!text || !text.includes("Örebro")) return;

  const lines = text.split("\n").map(x => x.trim()).filter(Boolean);
  if (lines.length < 3) return;

  const title = lines[0];
  const company = lines[1];

  let city = "";
  let start = "";
  let end = "";

  const metaText = lines.join(" ");

  const cityMatch = metaText.match(/^([A-Za-zÅÄÖåäö\s]+)\s*[·\-]/);
  if (cityMatch) city = cityMatch[1].trim();

  const dateMatch = metaText.match(/(\d{1,2})\/(\d{1,2})\s*[-–]\s*(\d{1,2})\/(\d{1,2})/);

  if (dateMatch) {
    const year = new Date().getFullYear();

    const d1 = dateMatch[1].padStart(2, "0");
    const m1 = dateMatch[2].padStart(2, "0");
    const d2 = dateMatch[3].padStart(2, "0");
    const m2 = dateMatch[4].padStart(2, "0");

    start = `${year}-${m1}-${d1}`;
    end   = `${year}-${m2}-${d2}`;
  }

  jobs.push([start, end, city, company, title]);
});

const tsv = "Start Date\tEnd Date\tCity\tCompany\tTitle\n" +
  jobs.map(r => r.join("\t")).join("\n");

copy(tsv);
console.log("Copied. Paste into Excel.");
