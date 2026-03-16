// ===== Markdown renderer =====
function renderMarkdown(md) {
  return md
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^\- (.*$)/gim, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gims, "<ul>$1</ul>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "<br /><br />");
}

// ===== Load a post into the viewer =====
const viewer = document.getElementById("viewer");

async function loadPost(id, buttons) {
  buttons.forEach(b => b.classList.remove("active"));
  const active = [...buttons].find(b => b.dataset.log === id);
  if (active) active.classList.add("active");

  try {
    const res = await fetch(`./logs/${id}.md`);
    if (!res.ok) throw new Error(res.status);
    const md = await res.text();
    viewer.innerHTML = renderMarkdown(md);
  } catch (err) {
    viewer.innerHTML = "<p>Could not load post.</p>";
    console.error(err);
  }
}

// ===== Build sidebar from manifest =====
async function init() {
  const list = document.querySelector(".series-list");

  try {
    const res = await fetch("./logs/manifest.json");
    const posts = await res.json();

    list.innerHTML = posts.map(p =>
      `<li><button class="series-item" data-log="${p.id}">${p.title}</button></li>`
    ).join("");
  } catch (err) {
    list.innerHTML = "<li>Could not load posts.</li>";
    console.error(err);
    return;
  }

  const buttons = document.querySelectorAll(".series-item");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => loadPost(btn.dataset.log, buttons));
  });

  // Auto-load the first post
  if (buttons.length > 0) loadPost(buttons[0].dataset.log, buttons);
}

init();

// ===== Sidebar collapse / expand =====
const toggleBtn = document.getElementById("toggleSidebar");
const layout = document.querySelector(".blog-layout");
let isCollapsed = false;

toggleBtn.addEventListener("click", () => {
  isCollapsed = !isCollapsed;
  layout.classList.toggle("collapsed", isCollapsed);
  toggleBtn.textContent = isCollapsed ? "⟩" : "⟨";
});
