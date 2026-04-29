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

  const tsv =
    "Start Date\tEnd Date\tCity\tCompany\tTitle\n" +
    jobs.map(r => r.join("\t")).join("\n");

  console.table(jobs);

  // safer than clipboard APIs
  document.body.innerHTML =
    "<pre style='white-space:pre-wrap;font-family:monospace'>" +
    tsv.replace(/</g, "&lt;") +
    "</pre>";

})();
