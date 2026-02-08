// ===== Viewer + Series logic =====
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

    try {
      const res = await fetch(path);
      const md = await res.text();
      viewer.innerHTML = renderMarkdown(md);
    } catch (err) {
      viewer.innerHTML = "<p>Error loading markdown.</p>";
      console.error(err);
    }
  });
});


// ===== Sidebar collapse / expand logic =====
const toggleBtn = document.getElementById("toggleSidebar");
const layout = document.querySelector(".blog-layout");

let isCollapsed = false;

toggleBtn.addEventListener("click", () => {
  isCollapsed = !isCollapsed;
  layout.classList.toggle("collapsed", isCollapsed);
  toggleBtn.textContent = isCollapsed ? "⟩" : "⟨";
});
