import os

files = {
    "index.html": "",
    "style.css": "/* Paste style.css code here */",
    "app.js": "// Paste app.js code here",
    "manifest.json": "{ /* Paste manifest.json code here */ }",
    "service-worker.js": "// Paste service-worker.js code here"
}

os.makedirs("fitai_app", exist_ok=True)

for name, content in files.items():
    with open(f"fitai_app/{name}", "w", encoding="utf-8") as f:
        f.write(content)

print("✅ FitAI Pro files generated in /fitai_app")