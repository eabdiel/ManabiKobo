(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const editor = $("[data-ide-source]");
  if (!editor) return;

  const explorer = $("[data-ide-explorer]");
  const tabs = $("[data-ide-tabs]");
  const projectLabel = $("[data-ide-project-name]");
  const status = $("[data-ide-status]");
  const diagnostics = $("[data-ide-diagnostics]");
  const runtime = $("[data-ide-runtime-output]");
  const cursor = $("[data-ide-cursor]");
  const importInput = $("[data-ide-import-file]");

  const STORAGE_VERSION = "2.2.0";
  const CUSTOM_STORAGE = `mk:language-ide:${STORAGE_VERSION}:custom-projects`;
  const SAMPLE_STORAGE_PREFIX = `mk:language-ide:${STORAGE_VERSION}:sample:`;
  const clone = value => JSON.parse(JSON.stringify(value));

  const samples = {
    Hello_World_JP: {
      name: "Hello_World_JP",
      description: "Hello World: Introductions",
      entry: "main.mkpl",
      sample: true,
      files: {
        "main.mkpl": `project Hello_World_JP
import japanese.basics

goal:
    introduce yourself politely

function introduce():
    speaker.say("hajimemashite")
    speaker.say("watashi wa software enjinia desu")
    speaker.say("yoroshiku onegaishimasu")

compile japanese.polite
end`,
        "greetings.mkvoc": `はじめまして|hajimemashite|nice to meet you
よろしくお願いします|yoroshiku onegaishimasu|pleased to meet you`
      }
    },

    Restaurant_Order_System: {
      name: "Restaurant_Order_System",
      description: "Restaurant Ordering System",
      entry: "main.mkpl",
      sample: true,
      files: {
        "main.mkpl": `project Restaurant_Order_System
import japanese.business
import restaurant.vocabulary
use dialog.mkpl

goal:
    complete restaurant ordering workflow

function take_order():
    customer.say("sumimasen, menyuu o onegaishimasu")
    staff.say("hai, kashikomarimashita")
    customer.say("osusume wa nan desu ka")
    staff.say("hanbaagu teishoku ga osusume desu")
    customer.say("sore o kudasai")
    staff.say("hai, kashikomarimashita")

compile japanese.polite
end`,
        "dialog.mkpl": `module dialog

customer.say("sumimasen")
staff.say("irasshaimase")
staff.say("kashikomarimashita")

end`,
        "menu_items.mkvoc": `メニュー|menyuu|menu
注文する|chuumon suru|to order
おすすめ|osusume|recommendation
ハンバーグ定食|hanbaagu teishoku|hamburger steak set meal
ください|kudasai|please give me`
      }
    },

    Daily_Standup_JP: {
      name: "Daily_Standup_JP",
      description: "Daily Standup",
      entry: "main.mkpl",
      sample: true,
      files: {
        "main.mkpl": `project Daily_Standup_JP
import japanese.business
import engineering.standup

goal:
    give a short software standup update

function daily_update():
    engineer.say("kinou wa bagu o shuusei shimashita")
    engineer.say("kyou wa tesuto o tsuzukemasu")
    engineer.say("mondai wa arimasen")

compile japanese.polite
end`,
        "standup.mkvoc": `昨日|kinou|yesterday
今日|kyou|today
修正|shuusei|fix
テスト|tesuto|test
問題|mondai|problem`
      }
    }
  };

  let customProjects = {};
  try {
    customProjects = JSON.parse(localStorage.getItem(CUSTOM_STORAGE) || "{}");
  } catch (_) {
    customProjects = {};
  }

  let currentProject = "Hello_World_JP";
  let currentFiles = {};
  let activeFile = "main.mkpl";
  let findings = [];
  let initialized = false;

  function sampleStorageKey(name) {
    return SAMPLE_STORAGE_PREFIX + name;
  }

  function allProjects() {
    return { ...samples, ...customProjects };
  }

  function isValidProject(project) {
    return Boolean(
      project &&
      project.files &&
      typeof project.files === "object" &&
      Object.keys(project.files).length &&
      project.entry &&
      Object.prototype.hasOwnProperty.call(project.files, project.entry)
    );
  }

  function validSampleOverride(name, saved) {
    if (!isValidProject(saved) || !saved.files["main.mkpl"]) return false;
    const main = saved.files["main.mkpl"];
    return main.includes(`project ${name}`) && main.includes("compile japanese.");
  }

  function readProject(name, includeLocal = true) {
    if (samples[name]) {
      if (includeLocal) {
        try {
          const saved = JSON.parse(localStorage.getItem(sampleStorageKey(name)) || "null");
          if (validSampleOverride(name, saved)) return clone(saved);
          if (saved) localStorage.removeItem(sampleStorageKey(name));
        } catch (_) {
          localStorage.removeItem(sampleStorageKey(name));
        }
      }
      return clone(samples[name]);
    }

    const project = customProjects[name];
    return isValidProject(project) ? clone(project) : null;
  }

  function persistCurrentProject() {
    if (!initialized || !currentProject || !activeFile) return;

    currentFiles[activeFile] = editor.value;
    const base = samples[currentProject] || customProjects[currentProject] || {};
    const snapshot = {
      ...base,
      name: currentProject,
      description: base.description || "Local Project",
      entry: currentFiles["main.mkpl"] !== undefined ? "main.mkpl" : activeFile,
      sample: Boolean(samples[currentProject]),
      files: clone(currentFiles)
    };

    if (samples[currentProject]) {
      localStorage.setItem(sampleStorageKey(currentProject), JSON.stringify(snapshot));
    } else {
      customProjects[currentProject] = snapshot;
      localStorage.setItem(CUSTOM_STORAGE, JSON.stringify(customProjects));
    }
  }

  function clearResults(message = "✓ Ready to compile") {
    findings = [];
    status.className = "ide-compile-status";
    status.textContent = message;
    diagnostics.innerHTML = "";
    runtime.innerHTML = '<div class="ide-empty">Compile the project to execute its language statements.</div>';
  }

  function renderProjectList() {
    explorer.innerHTML = Object.values(allProjects()).map(project => `
      <button type="button" class="ide-project ${project.name === currentProject ? "active" : ""}" data-project="${project.name}">
        <b>${project.name}</b>
        <small>${project.description || "Local Project"}</small>
      </button>
    `).join("");

    $$("[data-project]", explorer).forEach(button => {
      button.addEventListener("click", () => loadProject(button.dataset.project));
    });
  }

  function renderFileTabs() {
    if (!(activeFile in currentFiles)) {
      activeFile = currentFiles["main.mkpl"] !== undefined
        ? "main.mkpl"
        : Object.keys(currentFiles)[0];
    }

    tabs.innerHTML = Object.keys(currentFiles).map(file => `
      <button type="button" class="${file === activeFile ? "active" : ""}" data-file="${file}">${file}</button>
    `).join("");

    $$("[data-file]", tabs).forEach(button => {
      button.addEventListener("click", () => switchFile(button.dataset.file));
    });

    editor.value = currentFiles[activeFile] ?? "";
    updateCursor();
  }

  function activateProject(name, project, message = "✓ Ready to compile") {
    currentProject = name;
    currentFiles = clone(project.files);
    activeFile = currentFiles[project.entry] !== undefined
      ? project.entry
      : currentFiles["main.mkpl"] !== undefined
        ? "main.mkpl"
        : Object.keys(currentFiles)[0];

    projectLabel.textContent = name;
    renderProjectList();
    renderFileTabs();
    clearResults(message);
    initialized = true;
  }

  function loadProject(name, { canonical = false, persistOutgoing = true } = {}) {
    if (persistOutgoing) persistCurrentProject();

    const project = readProject(name, !canonical);
    if (!project) return;
    activateProject(name, project);
  }

  function switchFile(file) {
    if (file === activeFile) return;
    currentFiles[activeFile] = editor.value;
    activeFile = file;
    renderFileTabs();
  }

  function createScratchProject() {
    persistCurrentProject();

    const base = "My_Japanese_Project";
    let name = base;
    let index = 1;

    while (allProjects()[name]) {
      index += 1;
      name = `${base}_${index}`;
    }

    const project = {
      name,
      description: "Local Scratch Project",
      entry: "main.mkpl",
      sample: false,
      files: {
        "main.mkpl": `project ${name}
import japanese.basics

goal:
    practice a reusable Japanese routine

function greet():
    learner.say("hajimemashite")
    learner.say("yoroshiku onegaishimasu")

compile japanese.polite
end`
      }
    };

    customProjects[name] = project;
    localStorage.setItem(CUSTOM_STORAGE, JSON.stringify(customProjects));
    activateProject(name, project, "✓ Scratch project created");
    editor.focus();
  }

  function resetProject() {
    if (samples[currentProject]) {
      localStorage.removeItem(sampleStorageKey(currentProject));
      activateProject(currentProject, clone(samples[currentProject]), "✓ Sample project restored");
      return;
    }

    const name = currentProject;
    const project = {
      name,
      description: "Local Scratch Project",
      entry: "main.mkpl",
      sample: false,
      files: {
        "main.mkpl": `project ${name}
import japanese.basics

function greet():
    learner.say("hajimemashite")

compile japanese.polite
end`
      }
    };

    customProjects[name] = project;
    localStorage.setItem(CUSTOM_STORAGE, JSON.stringify(customProjects));
    activateProject(name, project, "✓ Scratch project reset");
  }

  function exportProject() {
    persistCurrentProject();

    const project = readProject(currentProject, true);
    if (!project) return;

    const blob = new Blob([JSON.stringify(project, null, 2)], {
      type: "application/json"
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${currentProject}.manabi.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 500);
  }

  function importProject(file) {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        if (!isValidProject(imported)) throw new Error("Invalid project");

        let name = imported.name || "Imported_Project";
        let index = 1;
        while (allProjects()[name]) {
          name = `${imported.name || "Imported_Project"}_${index}`;
          index += 1;
        }

        imported.name = name;
        imported.description = imported.description || "Imported Local Project";
        imported.entry = imported.files["main.mkpl"] !== undefined
          ? "main.mkpl"
          : imported.entry;
        imported.sample = false;

        customProjects[name] = imported;
        localStorage.setItem(CUSTOM_STORAGE, JSON.stringify(customProjects));
        activateProject(name, imported, "✓ Project imported");
      } catch (_) {
        alert("Could not import this Manabi Kōbō project JSON.");
      }
    };

    reader.readAsText(file);
  }

  function compileProject() {
    persistCurrentProject();

    const entry = currentFiles["main.mkpl"] || "";
    const lines = entry.split(/\r?\n/);
    findings = [];

    if (!/^\s*project\s+[A-Za-z0-9_]+\s*$/m.test(entry)) {
      findings.push({ type: "error", code: "MK001", line: 1, message: "Missing project declaration." });
    }

    if (!/^\s*compile\s+japanese\.[A-Za-z0-9_.-]+\s*$/m.test(entry)) {
      findings.push({ type: "error", code: "MK002", line: Math.max(1, lines.length), message: "Missing compile japanese.* directive." });
    }

    if (!/^\s*end\s*$/m.test(entry)) {
      findings.push({ type: "error", code: "MK003", line: lines.length, message: "Project must end with end." });
    }

    const calls = [...entry.matchAll(/([A-Za-z_][\w]*)\.say\("([^"]+)"\)/g)];
    if (!calls.length) {
      findings.push({ type: "warning", code: "MK101", line: 1, message: "No executable .say() statements found." });
    }

    diagnostics.innerHTML = findings.length
      ? findings.map((finding, index) => `
        <button type="button" class="ide-diagnostic ${finding.type}" data-diagnostic="${index}">
          <b>${finding.type.toUpperCase()} ${finding.code} · Line ${finding.line}</b>
          <small>${finding.message}</small>
        </button>
      `).join("")
      : '<div class="ide-diagnostic success"><b>No blocking diagnostics</b><small>Project structure is valid.</small></div>';

    $$("[data-diagnostic]", diagnostics).forEach(button => {
      button.addEventListener("click", () => jumpToLine(findings[Number(button.dataset.diagnostic)].line));
    });

    if (findings.some(finding => finding.type === "error")) {
      status.className = "ide-compile-status bad";
      status.textContent = `✕ Compilation Failed · ${findings.filter(finding => finding.type === "error").length} error(s)`;
      runtime.innerHTML = '<div class="ide-empty">Fix compiler errors, then run again.</div>';
      return;
    }

    status.className = "ide-compile-status";
    status.textContent = `✓ Compilation Successful · ${calls.length} statement(s) executed`;
    runtime.innerHTML = calls.length
      ? calls.map(call => `
        <div class="ide-dialog ${call[1].toLowerCase()}">
          <b>${call[1].toUpperCase()}</b>
          <p>${toJapanese(call[2])}</p>
          <small>${call[2]}</small>
        </div>
      `).join("")
      : '<div class="ide-empty">Compilation succeeded; no runtime statements.</div>';
  }

  function debugProject() {
    compileProject();
    if (findings.length) jumpToLine(findings[0].line);
  }

  function refactorProject() {
    let value = editor.value;
    let changes = 0;

    [
      ["menu onegaishimasu", "menyuu o onegaishimasu"],
      ["yoroshiku onegai shimasu", "yoroshiku onegaishimasu"]
    ].forEach(([from, to]) => {
      if (value.includes(from)) {
        value = value.split(from).join(to);
        changes += 1;
      }
    });

    editor.value = value;
    currentFiles[activeFile] = value;
    persistCurrentProject();
    status.textContent = changes
      ? `✓ Refactor applied · ${changes} change(s)`
      : "✓ No safe refactors available";
  }

  function jumpToLine(line) {
    const lines = editor.value.split(/\r?\n/);
    let offset = 0;
    for (let index = 0; index < line - 1; index += 1) {
      offset += lines[index].length + 1;
    }

    editor.focus();
    editor.setSelectionRange(offset, offset + (lines[line - 1] || "").length);
    updateCursor();
  }

  function updateCursor() {
    const before = editor.value.slice(0, editor.selectionStart);
    const parts = before.split(/\r?\n/);
    cursor.textContent = `Ln ${parts.length}, Col ${parts[parts.length - 1].length + 1}`;
  }

  function toJapanese(text) {
    const map = {
      "sumimasen, menyuu o onegaishimasu": "すみません、メニューをお願いします。",
      "hai, kashikomarimashita": "はい、かしこまりました。",
      "osusume wa nan desu ka": "おすすめは何ですか。",
      "hanbaagu teishoku ga osusume desu": "ハンバーグ定食がおすすめです。",
      "sore o kudasai": "それをください。",
      "hajimemashite": "はじめまして。",
      "watashi wa software enjinia desu": "私はソフトウェアエンジニアです。",
      "yoroshiku onegaishimasu": "よろしくお願いします。",
      "kinou wa bagu o shuusei shimashita": "昨日はバグを修正しました。",
      "kyou wa tesuto o tsuzukemasu": "今日はテストを続けます。",
      "mondai wa arimasen": "問題はありません。"
    };
    return map[text] || text;
  }

  editor.addEventListener("input", () => {
    currentFiles[activeFile] = editor.value;
    updateCursor();
  });
  ["click", "keyup", "select"].forEach(eventName => {
    editor.addEventListener(eventName, updateCursor);
  });

  $("[data-ide-new-project]").addEventListener("click", createScratchProject);
  $("[data-ide-run]").addEventListener("click", compileProject);
  $("[data-ide-debug]").addEventListener("click", debugProject);
  $("[data-ide-refactor]").addEventListener("click", refactorProject);
  $("[data-ide-save]").addEventListener("click", () => {
    persistCurrentProject();
    status.textContent = "✓ Saved locally";
  });
  $("[data-ide-export]").addEventListener("click", exportProject);
  $("[data-ide-import]").addEventListener("click", () => importInput.click());
  importInput.addEventListener("change", () => {
    if (importInput.files[0]) importProject(importInput.files[0]);
    importInput.value = "";
  });
  $("[data-ide-reset-project]").addEventListener("click", resetProject);

  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      persistCurrentProject();
      status.textContent = "✓ Saved locally";
    }
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      compileProject();
    }
    if (event.key === "F8") {
      event.preventDefault();
      debugProject();
    }
  });

  const initialProject = readProject("Hello_World_JP", true) || clone(samples.Hello_World_JP);
  activateProject("Hello_World_JP", initialProject);
})();
