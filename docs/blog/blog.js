const viewer = document.getElementById("viewer");
const buttons = document.querySelectorAll(".series-item");

// VERY naive markdown → HTML (temporary)
function renderMarkdown(md) {
  return md
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^\- (.*$)/gim, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gims, "<ul>$1</ul>")
    .replace(/\n\n/g, "<br /><br />");
}

buttons.forEach(btn => {
  btn.addEventListener("click", async () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const path = "./logs/log-1.md";

    const res = await fetch(path);
    const md = await res.text();

    viewer.innerHTML = renderMarkdown(md);
  });
});
