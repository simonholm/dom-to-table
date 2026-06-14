(async () => {

  const res = await fetch("/api/favorites?pageSize=100&page=1");
  const d = await res.json();

  const jobs = d.results.map(row => {

    const j = row.jobentry;

    return [
      j.date_posted?.slice(0, 10) || "",
      j.date_ends?.slice(0, 10) || "",
      j.municipality_name || "",
      j.company_name || "",
      j.heading || ""
    ];

  });

  const csv =
    "Start Date;End Date;City;Company;Title\n" +
    jobs
      .map(r => r.map(v => `"${String(v).replaceAll('"', '""')}"`).join(";"))
      .join("\n");

  console.table(jobs);

  document.body.innerHTML =
    "<pre style='white-space:pre-wrap;font-family:monospace'>" +
    csv.replace(/</g, "&lt;") +
    "</pre>";

})();