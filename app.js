const STORAGE_KEY = "resume-layout-state-v2";

const SECTION_LABELS = {
  education: "教育背景",
  experience: "工作 / 实习经历",
  projects: "主要项目经历",
  skills: "个人能力",
  awards: "重要奖项荣誉",
  summary: "自我评价",
  customSections: "研究成果 / 自定义模块",
};

const TEMPLATES = [
  { id: "academic", name: "学术照片", note: "仿博士简历，照片与信息表" },
  { id: "classic", name: "经典单栏", note: "稳重清晰，适合通用岗位" },
  { id: "split", name: "左右分栏", note: "信息密度高，适合技术岗" },
  { id: "campus", name: "应届生", note: "突出教育、项目和荣誉" },
];

const TEMPLATE_ASSETS = {
  logo: "",
  education: "assets/template-icons/template-png-01.png",
  customSections: "assets/template-icons/template-png-02.png",
  projects: "assets/template-icons/template-png-03.png",
  awards: "assets/template-icons/template-png-04.png",
  skills: "assets/template-icons/template-png-03.png",
  summary: "assets/template-icons/template-png-02.png",
  experience: "assets/template-icons/template-png-03.png",
};

const DEFAULT_STATE = {
  activeTemplate: "academic",
  styles: {
    accentColor: "#1f5d7a",
    fontFamily: '"SimSun", "Songti SC", "Microsoft YaHei", serif',
    bodyWeight: "400",
    headingWeight: "800",
    fontSize: 12.5,
    lineHeight: 1.42,
    pageMargin: 13,
    sectionGap: 9,
    itemGap: 7,
    titleGap: 5,
    photoSize: 31,
    photoOffset: 0,
    logoSize: 35,
    summaryOffset: 0,
    educationSchoolCol: 62,
    educationDegreeCol: 32,
    projectRoleCol: 38,
  },
  sectionOrder: ["education", "customSections", "projects", "awards", "skills", "summary", "experience"],
  sectionTitles: { ...SECTION_LABELS },
  sectionLayouts: {
    summary: "paragraph",
  },
  ui: {
    activeEditorSection: "",
  },
  resume: {
    profile: {
      name: "张 三",
      school: "示例大学",
      logo: "",
      gender: "男",
      origin: "北京",
      birth: "2001年1月",
      politics: "共青团员",
      phone: "000-0000-0000",
      email: "example@email.com",
      city: "北京",
      target: "人工智能算法工程师",
      address: "示例大学 人工智能学院",
      researchDirection: "图像处理；深度学习；机器视觉；多模态融合",
      website: "",
      photo: "",
    },
    education: [
      {
        school: "示例大学",
        degree: "本科",
        major: "计算机科学与技术",
        time: "2020.09 - 2024.06",
        description: "主修课程：数据结构、算法设计、机器学习、计算机视觉、数据库系统等。",
      },
      {
        school: "示例大学",
        degree: "硕士",
        major: "人工智能",
        time: "2024.09 - 至今",
        description: "研究方向：视觉感知、多模态理解与大模型应用。",
      },
    ],
    experience: [],
    projects: [
      {
        name: "智能视觉检测系统",
        role: "项目负责人",
        stack: "Python / PyTorch / OpenCV / FastAPI",
        time: "2025.03 - 至今",
        description:
          "面向工业检测场景构建图像采集、缺陷识别与结果可视化流程。\n基于 YOLO 完成目标检测模型训练与部署，结合规则后处理提升缺陷定位稳定性。",
      },
      {
        name: "知识库问答 Agent 系统",
        role: "算法开发",
        stack: "Python / RAG / Tool Calling / React",
        time: "2026.01 - 2026.03",
        description:
          "构建文档清洗、切分、向量检索与问答生成链路，支持面向专业资料的可追溯问答。\n设计工具调用流程，实现搜索、检索、摘要和结构化报告生成。",
      },
    ],
    skills: [
      { category: "AI 工具", items: "熟练使用 ChatGPT、Codex、Claude、DeepSeek、Cursor 等工具辅助开发与文档写作" },
      { category: "算法能力", items: "熟悉图像处理、深度学习、机器视觉与多模态融合方法" },
      { category: "工程开发", items: "熟悉 Python、C++、FastAPI、React、TypeScript、Qt 等技术" },
      { category: "英语写作", items: "通过英语 CET-4、CET-6，具备中英文技术文档和项目报告写作能力" },
    ],
    awards: [
      { name: "大学生数学建模竞赛省级二等奖", time: "2023", description: "负责模型构建、算法实现与论文写作" },
      { name: "软件设计竞赛校级一等奖", time: "2024", description: "负责系统架构、核心功能开发与答辩展示" },
    ],
    summary:
      "本人具备扎实的算法基础和工程实现能力，关注 AI 工具链与大模型应用落地。能够结合业务需求完成数据处理、模型训练、系统开发和效果评估。",
    customSections: [
      {
        title: "开源作品",
        content:
          "**个人项目**：维护若干 AI 应用与前端工具项目，覆盖简历排版、知识库问答和数据可视化等场景。\n**技术文档**：整理项目部署说明、接口文档和使用教程，便于复现与协作。",
      },
    ],
  },
};

let state = loadState();
let activePreviewSelection = null;

const root = {
  controlPanel: document.querySelector(".control-panel"),
  templateList: document.querySelector("#templateList"),
  sectionOrder: document.querySelector("#sectionOrder"),
  editor: document.querySelector("#editorRoot"),
  paper: document.querySelector("#resumePaper"),
  overflowHint: document.querySelector("#overflowHint"),
  selectionStatus: document.querySelector("#selectionStatus"),
  selectionFontSize: document.querySelector("#selectionFontSize"),
  selectionFontFamily: document.querySelector("#selectionFontFamily"),
  selectionBoldBtn: document.querySelector("#selectionBoldBtn"),
  jsonDialog: document.querySelector("#jsonDialog"),
  jsonOutput: document.querySelector("#jsonOutput"),
  accentColor: document.querySelector("#accentColor"),
  fontSize: document.querySelector("#fontSize"),
  fontSizeValue: document.querySelector("#fontSizeValue"),
  fontFamily: document.querySelector("#fontFamily"),
  bodyWeight: document.querySelector("#bodyWeight"),
  headingWeight: document.querySelector("#headingWeight"),
  lineHeight: document.querySelector("#lineHeight"),
  lineHeightValue: document.querySelector("#lineHeightValue"),
  pageMargin: document.querySelector("#pageMargin"),
  pageMarginValue: document.querySelector("#pageMarginValue"),
  sectionGap: document.querySelector("#sectionGap"),
  sectionGapValue: document.querySelector("#sectionGapValue"),
  itemGap: document.querySelector("#itemGap"),
  itemGapValue: document.querySelector("#itemGapValue"),
  titleGap: document.querySelector("#titleGap"),
  titleGapValue: document.querySelector("#titleGapValue"),
  photoSize: document.querySelector("#photoSize"),
  photoSizeValue: document.querySelector("#photoSizeValue"),
  photoOffset: document.querySelector("#photoOffset"),
  photoOffsetValue: document.querySelector("#photoOffsetValue"),
  logoSize: document.querySelector("#logoSize"),
  logoSizeValue: document.querySelector("#logoSizeValue"),
  summaryOffset: document.querySelector("#summaryOffset"),
  summaryOffsetValue: document.querySelector("#summaryOffsetValue"),
  backupExportBtn: document.querySelector("#backupExportBtn"),
  backupImportBtn: document.querySelector("#backupImportBtn"),
  backupImportInput: document.querySelector("#backupImportInput"),
};

init();

function init() {
  bindGlobalActions();
  renderAll();
}

function bindGlobalActions() {
  document.querySelector("#exportBtn").addEventListener("click", () => window.print());
  root.backupExportBtn.addEventListener("click", exportStateBackup);
  root.backupImportBtn.addEventListener("click", () => root.backupImportInput.click());
  root.backupImportInput.addEventListener("change", importStateBackup);
  document.querySelector("#resetBtn").addEventListener("click", () => {
    state = structuredClone(DEFAULT_STATE);
    persist();
    renderAll();
  });
  document.querySelector("#jsonBtn").addEventListener("click", () => {
    root.jsonOutput.textContent = JSON.stringify(state.resume, null, 2);
    root.jsonDialog.showModal();
  });
  root.paper.addEventListener("mouseup", capturePreviewSelection);
  root.paper.addEventListener("keyup", capturePreviewSelection);
  root.paper.addEventListener("pointerdown", startEducationTabDrag);
  document.addEventListener("selectionchange", () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !root.paper.contains(selection.anchorNode)) return;
    capturePreviewSelection();
  });
  root.selectionBoldBtn.addEventListener("mousedown", (event) => event.preventDefault());
  root.selectionBoldBtn.addEventListener("click", () => applyPreviewSelectionFormat({ bold: true }));
  root.selectionFontSize.addEventListener("mousedown", () => capturePreviewSelection());
  root.selectionFontSize.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applySelectionFontSizeInput();
    }
  });
  root.selectionFontSize.addEventListener("blur", applySelectionFontSizeInput);
  root.selectionFontFamily.addEventListener("mousedown", () => capturePreviewSelection());
  root.selectionFontFamily.addEventListener("change", (event) => {
    if (!event.target.value) return;
    applyPreviewSelectionFormat({ font: event.target.value });
    event.target.value = "";
  });

  bindStyle("accentColor", (value) => value);
  bindStyle("fontFamily", (value) => value);
  bindStyle("bodyWeight", (value) => value);
  bindStyle("headingWeight", (value) => value);
  bindStyle("fontSize", Number);
  bindStyle("lineHeight", Number);
  bindStyle("pageMargin", Number);
  bindStyle("sectionGap", Number);
  bindStyle("itemGap", Number);
  bindStyle("titleGap", Number);
  bindStyle("photoSize", Number);
  bindStyle("photoOffset", Number);
  bindStyle("logoSize", Number);
  bindStyle("summaryOffset", Number);
}

function exportStateBackup() {
  const payload = window.ResumeBackup.createBackupPayload(state);
  const text = JSON.stringify(payload, null, 2);
  const blob = new Blob([text], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `resume-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

function importStateBackup(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const importedState = window.ResumeBackup.parseBackupText(String(reader.result || ""));
      state = mergeDefaults(structuredClone(DEFAULT_STATE), importedState);
      persist();
      renderAll();
      alert("备份导入成功");
    } catch (error) {
      alert(error.message || "导入失败：无法读取备份文件");
    }
  });
  reader.addEventListener("error", () => alert("导入失败：无法读取备份文件"));
  reader.readAsText(file, "utf-8");
}

function bindStyle(key, transform) {
  if (!root[key]) return;
  root[key].addEventListener("input", (event) => updateStyle(key, transform(event.target.value)));
}

function renderAll() {
  renderTemplateList();
  renderStyleControls();
  renderSectionOrder();
  renderEditor();
  renderPreview();
}

function loadState() {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (!cached) return structuredClone(DEFAULT_STATE);
  try {
    return mergeDefaults(structuredClone(DEFAULT_STATE), JSON.parse(cached));
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function mergeDefaults(base, saved) {
  if (!saved || typeof saved !== "object") return base;
  const merged = { ...base, ...saved };
  merged.styles = { ...base.styles, ...(saved.styles || {}) };
  if (merged.styles.educationSchoolCol < 58) merged.styles.educationSchoolCol = 62;
  if (merged.styles.educationDegreeCol < 24) merged.styles.educationDegreeCol = 32;
  merged.sectionTitles = { ...base.sectionTitles, ...(saved.sectionTitles || {}) };
  merged.sectionLayouts = { ...base.sectionLayouts, ...(saved.sectionLayouts || {}) };
  merged.ui = { ...base.ui, ...(saved.ui || {}) };
  if (saved.ui?.activeEditorSection === "profile" && !saved.ui?.hasExplicitEditorOpen) {
    merged.ui.activeEditorSection = "";
  }
  merged.resume = { ...base.resume, ...(saved.resume || {}) };
  merged.resume.profile = { ...base.resume.profile, ...(saved.resume?.profile || {}) };
  const legacyLogo = "assets/template-icons/school-logo-" + "clean.png";
  if (merged.resume.profile.logo === "assets/template-icons/template-png-05.png" || merged.resume.profile.logo === legacyLogo) {
    merged.resume.profile.logo = "";
  }
  merged.sectionOrder = Array.isArray(saved.sectionOrder) ? saved.sectionOrder.filter((key) => SECTION_LABELS[key]) : base.sectionOrder;
  Object.keys(SECTION_LABELS).forEach((key) => {
    if (!merged.sectionOrder.includes(key)) merged.sectionOrder.push(key);
  });
  return merged;
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderTemplateList() {
  root.templateList.innerHTML = "";
  TEMPLATES.forEach((template) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `template-card${state.activeTemplate === template.id ? " is-active" : ""}`;
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(state.activeTemplate === template.id));
    button.innerHTML = `<strong>${template.name}</strong><span>${template.note}</span>`;
    button.addEventListener("click", () => {
      state.activeTemplate = template.id;
      persist();
      renderAll();
    });
    root.templateList.appendChild(button);
  });
}

function renderStyleControls() {
  const styles = state.styles;
  setControl("accentColor", styles.accentColor, "");
  setControl("fontFamily", styles.fontFamily, "");
  setControl("bodyWeight", styles.bodyWeight, "");
  setControl("headingWeight", styles.headingWeight, "");
  setControl("fontSize", styles.fontSize, "px");
  setControl("lineHeight", styles.lineHeight, "", 2);
  setControl("pageMargin", styles.pageMargin, "mm");
  setControl("sectionGap", styles.sectionGap, "px");
  setControl("itemGap", styles.itemGap, "px");
  setControl("titleGap", styles.titleGap, "px");
  setControl("photoSize", styles.photoSize, "mm");
  setControl("photoOffset", styles.photoOffset, "px");
  setControl("logoSize", styles.logoSize, "mm");
  setControl("summaryOffset", styles.summaryOffset, "px");
}

function setControl(key, value, unit, digits) {
  if (!root[key]) return;
  root[key].value = value;
  const label = root[`${key}Value`];
  if (label) label.textContent = `${digits === undefined ? value : Number(value).toFixed(digits)}${unit}`;
}

function updateStyle(key, value) {
  state.styles[key] = value;
  persist();
  renderStyleControls();
  renderPreview();
}

function startEducationTabDrag(event) {
  const projectHandle = event.target.closest(".project-tab-handle");
  if (projectHandle) {
    startProjectTabDrag(event, projectHandle);
    return;
  }

  const handle = event.target.closest(".education-tab-handle");
  if (!handle) return;
  const row = handle.closest(".education-row");
  if (!row) return;
  event.preventDefault();
  event.stopPropagation();

  const tab = handle.dataset.tab;
  const move = (moveEvent) => updateEducationTabFromPointer(tab, row, moveEvent.clientX);
  const stop = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", stop);
    persist();
    renderPreview();
  };

  handle.setPointerCapture?.(event.pointerId);
  updateEducationTabFromPointer(tab, row, event.clientX);
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", stop);
}

function updateEducationTabFromPointer(tab, row, clientX) {
  const rect = row.getBoundingClientRect();
  const pxPerMm = root.paper.getBoundingClientRect().width / 210;
  const xMm = clamp((clientX - rect.left) / pxPerMm, 48, 150);
  const minDegreeWidth = 20;
  const minMajorWidth = 36;
  const maxMajorStart = rect.width / pxPerMm - minMajorWidth;

  if (tab === "degree") {
    const majorStart = state.styles.educationSchoolCol + state.styles.educationDegreeCol;
    state.styles.educationSchoolCol = clamp(xMm, 48, majorStart - minDegreeWidth);
  } else {
    const schoolCol = state.styles.educationSchoolCol;
    const majorStart = clamp(xMm, schoolCol + minDegreeWidth, maxMajorStart);
    state.styles.educationDegreeCol = majorStart - schoolCol;
  }

  root.paper.style.setProperty("--education-school-col", `${state.styles.educationSchoolCol}mm`);
  root.paper.style.setProperty("--education-degree-col", `${state.styles.educationDegreeCol}mm`);
}

function startProjectTabDrag(event, handle) {
  const row = handle.closest(".project-subtitle-grid");
  if (!row) return;
  event.preventDefault();
  event.stopPropagation();

  const move = (moveEvent) => updateProjectTabFromPointer(row, moveEvent.clientX);
  const stop = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", stop);
    persist();
    renderPreview();
  };

  handle.setPointerCapture?.(event.pointerId);
  updateProjectTabFromPointer(row, event.clientX);
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", stop);
}

function updateProjectTabFromPointer(row, clientX) {
  const rect = row.getBoundingClientRect();
  const pxPerMm = root.paper.getBoundingClientRect().width / 210;
  const maxStart = rect.width / pxPerMm - 36;
  const xMm = clamp((clientX - rect.left) / pxPerMm, 24, maxStart);
  state.styles.projectRoleCol = xMm;
  root.paper.style.setProperty("--project-role-col", `${state.styles.projectRoleCol}mm`);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function renderSectionOrder() {
  root.sectionOrder.innerHTML = "";
  state.sectionOrder.forEach((sectionKey, index) => {
    const row = document.createElement("div");
    row.className = "order-row";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = getSectionTitle(sectionKey);
    titleInput.setAttribute("aria-label", `${SECTION_LABELS[sectionKey]}模块名`);
    titleInput.addEventListener("input", (event) => {
      state.sectionTitles[sectionKey] = event.target.value;
      persist();
      renderEditor();
      renderPreview();
    });
    titleInput.addEventListener("focus", () => setActiveEditorSection(sectionKey));
    row.appendChild(titleInput);
    row.append(
      createSmallButton("↑", "上移", () => moveSection(index, -1), index === 0),
      createSmallButton("↓", "下移", () => moveSection(index, 1), index === state.sectionOrder.length - 1),
      createSmallButton("显隐", "显示或隐藏模块", () => toggleSection(sectionKey), false, isSectionVisible(sectionKey)),
    );
    root.sectionOrder.appendChild(row);
  });
}

function getSectionTitle(sectionKey) {
  return state.sectionTitles?.[sectionKey] || SECTION_LABELS[sectionKey] || sectionKey;
}

function createSmallButton(text, title, onClick, disabled = false, active = true) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "small-button";
  button.textContent = text;
  button.title = title;
  button.disabled = disabled;
  button.style.opacity = active ? "1" : "0.45";
  button.addEventListener("click", onClick);
  return button;
}

function moveSection(index, direction) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= state.sectionOrder.length) return;
  const [item] = state.sectionOrder.splice(index, 1);
  state.sectionOrder.splice(nextIndex, 0, item);
  persist();
  renderAll();
}

function isSectionVisible(sectionKey) {
  return state.resume[sectionKey] !== null;
}

function toggleSection(sectionKey) {
  state.resume[sectionKey] = state.resume[sectionKey] === null ? structuredClone(DEFAULT_STATE.resume[sectionKey]) : null;
  persist();
  renderAll();
}

function renderEditor() {
  root.editor.innerHTML = "";
  root.editor.appendChild(renderProfileEditor());
  state.sectionOrder.forEach((sectionKey) => {
    if (state.resume[sectionKey] === null) return;
    if (sectionKey === "summary") root.editor.appendChild(renderSummaryEditor());
    if (sectionKey === "education") root.editor.appendChild(renderListEditor(sectionKey, educationFields()));
    if (sectionKey === "experience") root.editor.appendChild(renderListEditor(sectionKey, experienceFields()));
    if (sectionKey === "projects") root.editor.appendChild(renderListEditor(sectionKey, projectFields()));
    if (sectionKey === "skills") root.editor.appendChild(renderListEditor(sectionKey, skillFields()));
    if (sectionKey === "awards") root.editor.appendChild(renderListEditor(sectionKey, awardFields()));
    if (sectionKey === "customSections") root.editor.appendChild(renderListEditor(sectionKey, customFields()));
  });
}

function renderProfileEditor() {
  const card = createEditorCard("个人信息与照片", null, "profile");
  card.bodyEl.appendChild(renderLogoControls());
  card.bodyEl.appendChild(renderPhotoControls());
  const grid = createFieldsGrid();
  [
    ["name", "姓名"],
    ["school", "学校 / 机构"],
    ["target", "求职方向 / 学历"],
    ["gender", "性别"],
    ["origin", "籍贯"],
    ["birth", "出生年月"],
    ["politics", "政治面貌"],
    ["phone", "联系电话"],
    ["email", "邮箱"],
    ["city", "城市"],
    ["website", "个人主页"],
    ["address", "地址", true],
    ["researchDirection", "研究方向", true],
  ].forEach(([key, label, full]) => {
    grid.appendChild(createInputField(label, state.resume.profile[key], (value) => {
      state.resume.profile[key] = value;
      commit();
    }, full));
  });
  card.bodyEl.appendChild(grid);
  return card;
}

function renderLogoControls() {
  const wrap = document.createElement("div");
  wrap.className = "photo-editor logo-editor";
  const preview = document.createElement("div");
  preview.className = "photo-editor-preview logo-editor-preview";
  preview.innerHTML = state.resume.profile.logo ? `<img src="${state.resume.profile.logo}" alt="校徽预览" />` : `<span>上传校徽</span>`;

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.id = "logoUploadInput";
  input.addEventListener("change", (event) => {
    readLogoFile(event.target.files?.[0], (dataUrl) => {
      state.resume.profile.logo = dataUrl;
      commit(true);
    });
  });

  const uploadLabel = document.createElement("label");
  uploadLabel.className = "file-upload-button";
  uploadLabel.htmlFor = input.id;
  uploadLabel.textContent = "选择校徽";

  const status = document.createElement("span");
  status.className = "upload-status";
  status.textContent = state.resume.profile.logo ? "已上传校徽" : "未上传校徽";

  const remove = createSmallButton("清空校徽", "清空当前校徽，保留空白上传位", () => {
    state.resume.profile.logo = "";
    commit(true);
  });

  const actions = document.createElement("div");
  actions.className = "photo-editor-actions";
  actions.append(input, uploadLabel, status, remove);
  wrap.append(preview, actions);
  return wrap;
}

function renderPhotoControls() {
  const wrap = document.createElement("div");
  wrap.className = "photo-editor";
  const preview = document.createElement("div");
  preview.className = "photo-editor-preview";
  preview.innerHTML = state.resume.profile.photo ? `<img src="${state.resume.profile.photo}" alt="照片预览" />` : `<span>照片</span>`;

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.id = "photoUploadInput";
  input.addEventListener("change", (event) => {
    readImageFile(event.target.files?.[0], (dataUrl) => {
      state.resume.profile.photo = dataUrl;
      commit(true);
    });
  });

  const uploadLabel = document.createElement("label");
  uploadLabel.className = "file-upload-button";
  uploadLabel.htmlFor = input.id;
  uploadLabel.textContent = "选择照片";

  const status = document.createElement("span");
  status.className = "upload-status";
  status.textContent = state.resume.profile.photo ? "已上传照片" : "未上传照片";

  const remove = createSmallButton("删除照片", "删除当前照片", () => {
    state.resume.profile.photo = "";
    commit(true);
  });

  const actions = document.createElement("div");
  actions.className = "photo-editor-actions";
  actions.append(input, uploadLabel, status, remove);
  wrap.append(preview, actions);
  return wrap;
}

function readImageFile(file, onLoad) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => onLoad(String(reader.result || "")));
  reader.readAsDataURL(file);
}

function readLogoFile(file, onLoad) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => normalizeLogoBackground(String(reader.result || ""), onLoad));
  reader.readAsDataURL(file);
}

function normalizeLogoBackground(dataUrl, onLoad) {
  const image = new Image();
  image.addEventListener("load", () => {
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let index = 0; index < data.length; index += 4) {
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const isNearWhite = r >= 238 && g >= 238 && b >= 238 && Math.max(r, g, b) - Math.min(r, g, b) <= 12;
      if (isNearWhite) {
        data[index] = 255;
        data[index + 1] = 255;
        data[index + 2] = 255;
        data[index + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    onLoad(canvas.toDataURL("image/png"));
  });
  image.addEventListener("error", () => onLoad(dataUrl));
  image.src = dataUrl;
}

function renderSummaryEditor() {
  const card = createEditorCard(getSectionTitle("summary"), null, "summary");
  const layoutField = document.createElement("div");
  layoutField.className = "field full";
  layoutField.innerHTML = `
    <label>自我介绍布局
      <select>
        <option value="paragraph">普通段落</option>
        <option value="bullets">条目列表</option>
        <option value="box">浅色重点块</option>
        <option value="columns">双列信息块</option>
      </select>
    </label>
  `;
  const select = layoutField.querySelector("select");
  select.value = state.sectionLayouts.summary || "paragraph";
  select.addEventListener("change", (event) => {
    state.sectionLayouts.summary = event.target.value;
    persist();
    renderPreview();
  });
  card.bodyEl.appendChild(layoutField);
  card.bodyEl.appendChild(createTextareaField("简介内容", state.resume.summary || "", (value) => {
    state.resume.summary = value;
    commit();
  }, true));
  return card;
}

function renderListEditor(sectionKey, fields) {
  const card = createEditorCard(getSectionTitle(sectionKey), () => {
    setActiveEditorSection(sectionKey, false);
    state.resume[sectionKey].push(createEmptyItem(fields));
    commit(true);
  }, sectionKey);
  const list = document.createElement("div");
  list.className = "item-list";
  state.resume[sectionKey].forEach((item, index) => {
    const itemNode = document.createElement("div");
    itemNode.className = "list-item";
    const grid = createFieldsGrid();
    fields.forEach((field) => {
      const control =
        field.type === "textarea"
          ? createTextareaField(field.label, item[field.key] || "", (value) => {
              item[field.key] = value;
              commit();
            }, field.full)
          : createInputField(field.label, item[field.key] || "", (value) => {
              item[field.key] = value;
              commit();
            }, field.full);
      grid.appendChild(control);
    });
    itemNode.append(grid, renderItemActions(sectionKey, index));
    list.appendChild(itemNode);
  });
  card.bodyEl.appendChild(list);
  return card;
}

function renderItemActions(sectionKey, index) {
  const actions = document.createElement("div");
  actions.className = "item-actions";
  actions.append(
    createSmallButton("↑", "上移条目", () => moveItem(sectionKey, index, -1), index === 0),
    createSmallButton("↓", "下移条目", () => moveItem(sectionKey, index, 1), index === state.resume[sectionKey].length - 1),
    createSmallButton("删除", "删除条目", () => {
      state.resume[sectionKey].splice(index, 1);
      commit(true);
    }),
  );
  return actions;
}

function moveItem(sectionKey, index, direction) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= state.resume[sectionKey].length) return;
  const [item] = state.resume[sectionKey].splice(index, 1);
  state.resume[sectionKey].splice(nextIndex, 0, item);
  commit(true);
}

function createEditorCard(title, onAdd, sectionKey) {
  const card = document.createElement("section");
  const isActive = !sectionKey || state.ui.activeEditorSection === sectionKey;
  card.className = `editor-card${isActive ? "" : " is-collapsed"}`;
  if (sectionKey) card.dataset.section = sectionKey;
  const heading = document.createElement("div");
  heading.className = "section-heading";
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "editor-toggle";
  toggle.innerHTML = `<span>${isActive ? "−" : "+"}</span><strong>${title}</strong>`;
  toggle.addEventListener("click", () => {
    if (sectionKey) setActiveEditorSection(isActive ? "" : sectionKey);
  });
  heading.appendChild(toggle);
  if (onAdd) heading.appendChild(createSmallButton("+", `添加${title}`, onAdd));
  card.appendChild(heading);
  const body = document.createElement("div");
  body.className = "editor-card-body";
  card.appendChild(body);
  card.bodyEl = body;
  return card;
}

function setActiveEditorSection(sectionKey, rerender = true) {
  state.ui.activeEditorSection = sectionKey;
  state.ui.hasExplicitEditorOpen = Boolean(sectionKey);
  persist();
  if (rerender) {
    closeTopPanels();
    renderEditor();
    scrollActiveEditorIntoView(sectionKey);
  }
}

function scrollActiveEditorIntoView(sectionKey) {
  if (!sectionKey) return;
  requestAnimationFrame(() => {
    const card = root.editor.querySelector(`[data-section="${CSS.escape(sectionKey)}"]`);
    if (!card || !root.controlPanel) return;
    const panelTop = root.controlPanel.getBoundingClientRect().top;
    const cardTop = card.getBoundingClientRect().top;
    const nextTop = root.controlPanel.scrollTop + cardTop - panelTop - 8;
    root.controlPanel.scrollTo({ top: Math.max(0, nextTop), behavior: "smooth" });
  });
}

function closeTopPanels() {
  root.controlPanel?.querySelectorAll(".collapsible-panel[open]").forEach((panel) => {
    panel.removeAttribute("open");
  });
}

function createFieldsGrid() {
  const grid = document.createElement("div");
  grid.className = "fields-grid";
  return grid;
}

function createInputField(label, value, onInput, full = false) {
  const wrapper = document.createElement("div");
  wrapper.className = `field${full ? " full" : ""}`;
  wrapper.innerHTML = `<label>${label}<input type="text" value="${escapeAttribute(value)}" /></label>`;
  wrapper.querySelector("input").addEventListener("input", (event) => onInput(event.target.value));
  return wrapper;
}

function createTextareaField(label, value, onInput, full = false) {
  const wrapper = document.createElement("div");
  wrapper.className = `field${full ? " full" : ""}`;
  const id = `ta-${Math.random().toString(36).slice(2)}`;
  wrapper.innerHTML = `
    <label for="${id}">${label}</label>
    <div class="rich-toolbar">
      <button type="button" class="small-button" title="将选中文本加粗">B</button>
      <span>使用 **文字** 可在预览和 PDF 中加粗</span>
    </div>
    <textarea id="${id}">${escapeHtml(value)}</textarea>
  `;
  const textarea = wrapper.querySelector("textarea");
  wrapper.querySelector("button").addEventListener("click", () => wrapSelection(textarea, "**", "**", onInput));
  textarea.addEventListener("input", (event) => onInput(event.target.value));
  return wrapper;
}

function wrapSelection(textarea, before, after, onInput) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end) || "加粗文字";
  textarea.value = `${textarea.value.slice(0, start)}${before}${selected}${after}${textarea.value.slice(end)}`;
  textarea.focus();
  textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
  onInput(textarea.value);
}

function createEmptyItem(fields) {
  return fields.reduce((item, field) => {
    item[field.key] = "";
    return item;
  }, {});
}

function commit(rebuildEditor = false) {
  persist();
  if (rebuildEditor) renderEditor();
  renderPreview();
}

function capturePreviewSelection() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    updateSelectionStatus("");
    return;
  }
  const range = selection.getRangeAt(0);
  if (!root.paper.contains(range.commonAncestorContainer)) {
    updateSelectionStatus("");
    return;
  }
  const text = selection.toString().replace(/\s+/g, " ").trim();
  if (!text) {
    updateSelectionStatus("");
    return;
  }
  const element = getSelectionElement(selection);
  const fontLabel = getElementFontLabel(element);
  const fontValue = getElementFontValue(element);
  const fontSize = getElementFontSize(element);
  const refKey = element?.closest("[data-ref]")?.dataset.ref || "";
  activePreviewSelection = { text, fontLabel, fontValue, fontSize, refKey };
  if (root.selectionFontSize && fontSize) root.selectionFontSize.value = fontSize;
  if (root.selectionFontFamily && fontValue) root.selectionFontFamily.value = fontValue;
  updateSelectionStatus(text, fontLabel, fontSize);
}

function updateSelectionStatus(text, fontLabel = "", fontSize = "") {
  if (!root.selectionStatus) return;
  root.selectionStatus.textContent = text
    ? `已选中：${text.slice(0, 10)}${text.length > 10 ? "..." : ""}${fontLabel ? `｜${fontLabel}` : ""}${fontSize ? `｜${fontSize}px` : ""}`
    : "选中预览文字后可单独调整";
}

function getSelectionElement(selection) {
  const node = selection.anchorNode?.nodeType === Node.TEXT_NODE ? selection.anchorNode.parentElement : selection.anchorNode;
  return node instanceof Element ? node : null;
}

function getElementFontLabel(element) {
  if (!element) return "";
  const family = getComputedStyle(element).fontFamily.toLowerCase();
  if (family.includes("times")) return "Times New Roman";
  if (family.includes("arial")) return "Arial";
  if (family.includes("kaiti") || family.includes("stkaiti")) return "楷体";
  if (family.includes("simsun") || family.includes("songti")) return "宋体";
  if (family.includes("yahei") || family.includes("pingfang")) return "微软雅黑";
  return getComputedStyle(element).fontFamily.split(",")[0].replaceAll('"', "");
}

function getElementFontValue(element) {
  if (!element) return "";
  const family = getComputedStyle(element).fontFamily.toLowerCase();
  if (family.includes("times")) return "times";
  if (family.includes("arial")) return "arial";
  if (family.includes("kaiti") || family.includes("stkaiti")) return "kaiti";
  if (family.includes("simsun") || family.includes("songti")) return "simsun";
  if (family.includes("yahei") || family.includes("pingfang")) return "yahei";
  return "";
}

function getElementFontSize(element) {
  if (!element) return "";
  const value = Number.parseFloat(getComputedStyle(element).fontSize);
  return Number.isFinite(value) ? trimNumber(value) : "";
}

function trimNumber(value) {
  return String(Math.round(value * 10) / 10);
}

function applySelectionFontSizeInput() {
  const value = Number.parseFloat(root.selectionFontSize.value);
  if (!Number.isFinite(value)) return;
  const size = clamp(value, 8, 48);
  root.selectionFontSize.value = trimNumber(size);
  applyPreviewSelectionFormat({ size: trimNumber(size) });
}

function applyPreviewSelectionFormat(format) {
  const selectedText = activePreviewSelection?.text;
  if (!selectedText) {
    updateSelectionStatus("请先在右侧预览中选中文字");
    return;
  }
  const result = formatFirstMatchingText(selectedText, format, activePreviewSelection?.refKey);
  if (!result) {
    updateSelectionStatus("未定位到对应文本，请少选一点或选完整词句");
    return;
  }
  persist();
  renderEditor();
  renderPreview();
  updateSelectionStatus(`${format.bold ? "已加粗" : format.font ? "已调整字体" : "已调整字号"}：${selectedText.slice(0, 14)}`);
}

function formatFirstMatchingText(selectedText, format, preferredRefKey = "") {
  const refs = collectTextRefs();
  const sortedRefs = preferredRefKey ? [...refs.filter((ref) => ref.key === preferredRefKey), ...refs.filter((ref) => ref.key !== preferredRefKey)] : refs;
  for (const ref of sortedRefs) {
    const raw = ref.get();
    if (typeof raw !== "string" || !raw) continue;
    const next = wrapVisibleText(raw, selectedText, format);
    if (next !== null && next !== raw) {
      ref.set(next);
      return true;
    }
  }
  return false;
}

function collectTextRefs() {
  const refs = [];
  Object.keys(state.sectionTitles).forEach((key) => {
    refs.push({
      key: `sectionTitles.${key}`,
      get: () => state.sectionTitles[key],
      set: (value) => {
        state.sectionTitles[key] = value;
      },
    });
  });

  Object.keys(state.resume.profile).forEach((key) => {
    if (["logo", "photo"].includes(key)) return;
    refs.push({
      key: `profile.${key}`,
      get: () => state.resume.profile[key],
      set: (value) => {
        state.resume.profile[key] = value;
      },
    });
  });

  ["education", "experience", "projects", "skills", "awards", "customSections"].forEach((sectionKey) => {
    const section = state.resume[sectionKey];
    if (!Array.isArray(section)) return;
    section.forEach((item, index) => {
      Object.keys(item).forEach((key) => {
        refs.push({
          key: `${sectionKey}.${index}.${key}`,
          get: () => item[key],
          set: (value) => {
            item[key] = value;
          },
        });
      });
    });
  });

  refs.push({
    key: "summary",
    get: () => state.resume.summary,
    set: (value) => {
      state.resume.summary = value;
    },
  });

  return refs;
}

function wrapVisibleText(raw, selectedText, format) {
  const selected = normalizeSelectionText(selectedText);
  const map = buildVisibleIndexMap(raw);
  const plain = map.visible;
  const startPlain = plain.indexOf(selected);
  if (startPlain < 0) return null;
  const endPlain = startPlain + selected.length - 1;
  const startRaw = map.indices[startPlain];
  const endRaw = map.indices[endPlain] + 1;
  if (startRaw === undefined || endRaw === undefined) return null;

  if (format.bold) {
    const hasBoldWrapper = raw.slice(startRaw - 2, startRaw) === "**" && raw.slice(endRaw, endRaw + 2) === "**";
    if (hasBoldWrapper) {
      return `${raw.slice(0, startRaw - 2)}${raw.slice(startRaw, endRaw)}${raw.slice(endRaw + 2)}`;
    }
    return `${raw.slice(0, startRaw)}**${raw.slice(startRaw, endRaw)}**${raw.slice(endRaw)}`;
  }

  if (format.font) {
    const fontOpen = raw.slice(0, startRaw).match(/\[font=[a-z]+\]$/);
    const hasFontWrapper = Boolean(fontOpen && raw.startsWith("[/font]", endRaw));
    if (hasFontWrapper) {
      const openStart = startRaw - fontOpen[0].length;
      return `${raw.slice(0, openStart)}[font=${format.font}]${raw.slice(startRaw, endRaw)}${raw.slice(endRaw)}`;
    }
    return `${raw.slice(0, startRaw)}[font=${format.font}]${raw.slice(startRaw, endRaw)}[/font]${raw.slice(endRaw)}`;
  }

  const sizeOpen = raw.slice(0, startRaw).match(/\[size=\d+(?:\.\d+)?\]$/);
  const hasSizeWrapper = Boolean(sizeOpen && raw.startsWith("[/size]", endRaw));
  if (hasSizeWrapper) {
    const openStart = startRaw - sizeOpen[0].length;
    return `${raw.slice(0, openStart)}[size=${format.size}]${raw.slice(startRaw, endRaw)}${raw.slice(endRaw)}`;
  }
  return `${raw.slice(0, startRaw)}[size=${format.size}]${raw.slice(startRaw, endRaw)}[/size]${raw.slice(endRaw)}`;
}

function normalizeSelectionText(text) {
  return stripFormatTags(String(text || ""))
    .replace(/\s+/g, " ")
    .trim();
}

function buildVisibleIndexMap(raw) {
  let visible = "";
  const indices = [];
  for (let index = 0; index < raw.length; index += 1) {
    if (raw.startsWith("**", index)) {
      index += 1;
      continue;
    }
    const sizeOpen = raw.slice(index).match(/^\[size=\d+(?:\.\d+)?\]/);
    if (sizeOpen) {
      index += sizeOpen[0].length - 1;
      continue;
    }
    if (raw.startsWith("[/size]", index)) {
      index += "[/size]".length - 1;
      continue;
    }
    const fontOpen = raw.slice(index).match(/^\[font=[a-z]+\]/);
    if (fontOpen) {
      index += fontOpen[0].length - 1;
      continue;
    }
    if (raw.startsWith("[/font]", index)) {
      index += "[/font]".length - 1;
      continue;
    }
    const char = /\s/.test(raw[index]) ? " " : raw[index];
    visible += char;
    indices.push(index);
  }
  return { visible: visible.replace(/\s+/g, " "), indices };
}

function stripFormatTags(text) {
  return String(text)
    .replace(/\[font=[a-z]+\]/g, "")
    .replace(/\[\/font\]/g, "")
    .replace(/\[size=\d+(?:\.\d+)?\]/g, "")
    .replace(/\[\/size\]/g, "")
    .replace(/\*\*/g, "");
}

function renderPreview() {
  const styles = state.styles;
  root.paper.className = `resume-paper template-${state.activeTemplate}`;
  root.paper.style.setProperty("--resume-accent", styles.accentColor);
  root.paper.style.setProperty("--resume-font-family", styles.fontFamily);
  root.paper.style.setProperty("--resume-body-weight", String(styles.bodyWeight));
  root.paper.style.setProperty("--resume-heading-weight", String(styles.headingWeight));
  root.paper.style.setProperty("--resume-font-size", `${styles.fontSize}px`);
  root.paper.style.setProperty("--resume-line-height", String(styles.lineHeight));
  root.paper.style.setProperty("--resume-margin", `${styles.pageMargin}mm`);
  root.paper.style.setProperty("--resume-section-gap", `${styles.sectionGap}px`);
  root.paper.style.setProperty("--resume-item-gap", `${styles.itemGap}px`);
  root.paper.style.setProperty("--resume-title-gap", `${styles.titleGap}px`);
  root.paper.style.setProperty("--resume-photo-size", `${styles.photoSize}mm`);
  root.paper.style.setProperty("--resume-photo-offset", `${styles.photoOffset}px`);
  root.paper.style.setProperty("--resume-logo-size", `${styles.logoSize}mm`);
  root.paper.style.setProperty("--resume-summary-offset", `${styles.summaryOffset}px`);
  root.paper.style.setProperty("--education-school-col", `${styles.educationSchoolCol}mm`);
  root.paper.style.setProperty("--education-degree-col", `${styles.educationDegreeCol}mm`);
  root.paper.style.setProperty("--project-role-col", `${styles.projectRoleCol}mm`);

  if (state.activeTemplate === "split") root.paper.innerHTML = renderSplitTemplate(state.resume);
  else if (state.activeTemplate === "academic") root.paper.innerHTML = renderAcademicTemplate(state.resume);
  else root.paper.innerHTML = renderSingleColumnTemplate(state.resume);

  requestAnimationFrame(updateOverflowHint);
}

function renderSingleColumnTemplate(resume) {
  const sections = state.sectionOrder.map((key) => renderSection(key, resume[key])).join("");
  return `<div class="resume-content">${renderSimpleHeader(resume.profile)}${sections}</div>`;
}

function renderSplitTemplate(resume) {
  const sidebarKeys = ["skills", "awards", "summary"];
  const sidebar = state.sectionOrder.filter((key) => sidebarKeys.includes(key)).map((key) => renderSection(key, resume[key])).join("");
  const main = state.sectionOrder.filter((key) => !sidebarKeys.includes(key)).map((key) => renderSection(key, resume[key])).join("");
  return `<div class="resume-content">${renderSimpleHeader(resume.profile)}<aside class="resume-sidebar">${sidebar}</aside><main>${main}</main></div>`;
}

function renderAcademicTemplate(resume) {
  return `<div class="resume-content">${renderAcademicHeader(resume.profile)}${state.sectionOrder
    .map((key) => renderSection(key, resume[key]))
    .join("")}</div>`;
}

function renderSimpleHeader(profile) {
  const meta = [profile.phone, profile.email, profile.city, profile.target, profile.website].filter(Boolean);
  return `
    <header class="resume-header">
      <h2 data-ref="profile.name">${richText(profile.name || "未命名简历")}</h2>
      <div class="resume-meta">${meta.map((item) => `<span>${richText(item)}</span>`).join("")}</div>
    </header>
  `;
}

function renderAcademicHeader(profile) {
  const info = [
    ["性别", profile.gender, "gender"],
    ["籍贯", profile.origin, "origin"],
    ["出生年月", profile.birth, "birth"],
    ["政治面貌", profile.politics, "politics"],
    ["联系电话", profile.phone, "phone"],
    ["邮箱", profile.email, "email"],
    ["地址", profile.address, "address"],
    ["研究方向", profile.researchDirection, "researchDirection"],
  ].filter(([, value]) => value);

  return `
    <header class="academic-header">
      <div class="academic-brand">
        ${profile.logo ? `<img src="${escapeAttribute(profile.logo)}" alt="${escapeAttribute(profile.school || "校徽")}" />` : ""}
      </div>
      <div class="academic-name-block">
        <h2 data-ref="profile.name">${richText(profile.name || "未命名简历")}</h2>
        ${profile.target ? `<div class="academic-target" data-ref="profile.target">${richText(profile.target)}</div>` : ""}
      </div>
      <div class="academic-info">${info
        .map(([label, value, key]) => `<div class="info-row"><strong>${label}：</strong><span data-ref="profile.${key}">${richText(value)}</span></div>`)
        .join("")}</div>
      <div class="resume-photo">${profile.photo ? `<img src="${profile.photo}" alt="证件照片" />` : `<span>照片</span>`}</div>
    </header>
  `;
}

function renderSection(key, value) {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value) && value.length === 0) return "";
  if (typeof value === "string" && !value.trim()) return "";
  if (key === "education") return renderGenericListSection(key, value, renderEducationItem);
  if (key === "experience")
    return renderGenericListSection(key, value, (item, index) =>
      itemTitle(item.company, item.role, item.time, item.description, false, {
        title: `experience.${index}.company`,
        subtitle: `experience.${index}.role`,
        time: `experience.${index}.time`,
        description: `experience.${index}.description`,
      }),
    );
  if (key === "projects") return renderGenericListSection(key, value, renderProjectItem);
  if (key === "skills") return renderSkills(value);
  if (key === "awards")
    return renderGenericListSection(key, value, (item, index) =>
      itemTitle(item.name, item.description, item.time, "", false, {
        title: `awards.${index}.name`,
        subtitle: `awards.${index}.description`,
        time: `awards.${index}.time`,
      }),
    );
  if (key === "summary") return wrapSection(key, renderSummaryContent(value));
  if (key === "customSections")
    return value
      .map((item, index) => wrapSection(item.title || "自定义模块", renderParagraphs(item.content || "", `customSections.${index}.content`), true, `customSections.${index}.title`))
      .join("");
  return "";
}

function renderGenericListSection(key, items, renderer) {
  return wrapSection(key, items.map((item, index) => renderer(item, index)).join(""));
}

function renderEducationItem(item, index) {
  return `
    <div class="resume-item education-item">
      <div class="education-row">
        <strong class="education-school" data-ref="education.${index}.school">${richText(item.school || "未填写学校")}</strong>
        <span class="education-degree" data-ref="education.${index}.degree">${richText(item.degree || "")}</span>
        <span class="education-major" data-ref="education.${index}.major">${richText(item.major || "")}</span>
        ${item.time ? `<span class="resume-time" data-ref="education.${index}.time">${richText(item.time)}</span>` : ""}
        <button class="education-tab-handle degree-tab" data-tab="degree" type="button" title="拖动调整学历起点" aria-label="拖动调整学历起点"></button>
        <button class="education-tab-handle major-tab" data-tab="major" type="button" title="拖动调整专业起点" aria-label="拖动调整专业起点"></button>
      </div>
      ${renderDescription(item.description, false, `education.${index}.description`)}
    </div>
  `;
}

function renderProjectItem(item, index) {
  return itemTitle(item.name, renderProjectSubtitle(item, index), item.time, item.description, true, {
    title: `projects.${index}.name`,
    time: `projects.${index}.time`,
    description: `projects.${index}.description`,
  }, true);
}

function renderProjectSubtitle(item, index) {
  return `
    <div class="project-subtitle-grid">
      <span class="project-role" data-ref="projects.${index}.role">${richText(item.role || "")}</span>
      <span class="project-stack" data-ref="projects.${index}.stack">${richText(item.stack || "")}</span>
      <button class="project-tab-handle" data-tab="project-stack" type="button" title="拖动调整技术栈起点" aria-label="拖动调整技术栈起点"></button>
    </div>
  `;
}

function itemTitle(title, subtitle, time, description, forceList = false, refs = {}, subtitleIsHtml = false) {
  return `
    <div class="resume-item">
      <div class="resume-item-head">
        <strong ${refs.title ? `data-ref="${refs.title}"` : ""}>${richText(title || "未填写")}</strong>
        ${time ? `<span class="resume-time" ${refs.time ? `data-ref="${refs.time}"` : ""}>${richText(time)}</span>` : ""}
      </div>
      ${subtitle ? `<div class="resume-subtitle" ${refs.subtitle ? `data-ref="${refs.subtitle}"` : ""}>${subtitleIsHtml ? subtitle : richText(subtitle)}</div>` : ""}
      ${renderDescription(description, forceList, refs.description || "")}
    </div>
  `;
}

function renderDescription(description, forceList = false, refKey = "") {
  const lines = splitLines(description);
  if (lines.length === 0) return "";
  if (lines.length === 1 && !forceList) return `<p ${refKey ? `data-ref="${refKey}"` : ""}>${richText(lines[0])}</p>`;
  return `<ul class="resume-lines" ${refKey ? `data-ref="${refKey}"` : ""}>${lines.map((line) => `<li>${richText(line)}</li>`).join("")}</ul>`;
}

function renderSummaryContent(value) {
  const mode = state.sectionLayouts.summary || "paragraph";
  const lines = splitLines(value);
  if (lines.length === 0) return "";
  if (mode === "bullets") {
    return `<ul class="resume-lines summary-bullets">${lines.map((line) => `<li>${richText(line)}</li>`).join("")}</ul>`;
  }
  if (mode === "box") {
    return `<div class="summary-box">${lines.map((line) => `<p>${richText(line)}</p>`).join("")}</div>`;
  }
  if (mode === "columns") {
    return `<div class="summary-columns">${lines.map((line) => `<div>${richText(line)}</div>`).join("")}</div>`;
  }
  return lines.map((line) => `<p>${richText(line)}</p>`).join("");
}

function renderParagraphs(text, refKey = "") {
  const lines = splitLines(text);
  if (lines.length === 0) return "";
  return lines.map((line) => `<p ${refKey ? `data-ref="${refKey}"` : ""}>${richText(line)}</p>`).join("");
}

function splitLines(text) {
  return String(text || "")
    .split(/\n|；|;/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function renderSkills(skills) {
  const content = `<div class="skills-list">${skills
    .map(
      (skill, index) =>
        `<div class="skill-row"><strong class="skill-label" data-ref="skills.${index}.category"><span class="skill-name">${richText(skill.category || "技能")}</span><span class="skill-colon">：</span></strong><span class="skill-text" data-ref="skills.${index}.items">${richText(skill.items || "")}</span></div>`
    )
    .join("")}</div>`;
  return wrapSection("skills", content);
}

function wrapSection(keyOrTitle, content, customTitle = false, titleRef = "") {
  const title = customTitle ? keyOrTitle : getSectionTitle(keyOrTitle);
  const sectionTitleRef = titleRef || (!customTitle ? `sectionTitles.${keyOrTitle}` : "");
  const iconKey = customTitle ? "customSections" : keyOrTitle;
  const icon =
    state.activeTemplate === "academic" && TEMPLATE_ASSETS[iconKey]
      ? `<img class="section-icon" src="${TEMPLATE_ASSETS[iconKey]}" alt="" />`
      : "";
  const sectionClass = !customTitle && typeof keyOrTitle === "string" ? ` section-${keyOrTitle}` : "";
  return `
    <section class="resume-section${sectionClass}">
      <h3 class="resume-section-title">${icon}<span ${sectionTitleRef ? `data-ref="${sectionTitleRef}"` : ""}>${richText(title)}</span></h3>
      ${content}
    </section>
  `;
}

function updateOverflowHint() {
  const overflow = root.paper.scrollHeight - root.paper.clientHeight;
  if (overflow > 3) {
    root.overflowHint.textContent = `内容已超出 A4 单页约 ${Math.ceil(overflow)}px，可减少内容、字号、模块间距或页边距`;
    root.overflowHint.classList.add("is-warning");
  } else {
    root.overflowHint.textContent = "A4 单页适配正常";
    root.overflowHint.classList.remove("is-warning");
  }
}

function educationFields() {
  return [
    { key: "school", label: "学校" },
    { key: "degree", label: "学历" },
    { key: "major", label: "专业 / 排名" },
    { key: "time", label: "时间" },
    { key: "description", label: "描述", type: "textarea", full: true },
  ];
}

function experienceFields() {
  return [
    { key: "company", label: "单位" },
    { key: "role", label: "角色 / 岗位" },
    { key: "time", label: "时间" },
    { key: "description", label: "内容", type: "textarea", full: true },
  ];
}

function projectFields() {
  return [
    { key: "name", label: "项目名称" },
    { key: "role", label: "角色" },
    { key: "stack", label: "技术 / 方向" },
    { key: "time", label: "时间" },
    { key: "description", label: "项目描述", type: "textarea", full: true },
  ];
}

function skillFields() {
  return [
    { key: "category", label: "分类" },
    { key: "items", label: "能力说明", full: true },
  ];
}

function awardFields() {
  return [
    { key: "name", label: "奖项 / 证书" },
    { key: "time", label: "时间" },
    { key: "description", label: "说明", full: true },
  ];
}

function customFields() {
  return [
    { key: "title", label: "模块标题" },
    { key: "content", label: "模块内容", type: "textarea", full: true },
  ];
}

function richText(value) {
  const safe = escapeHtml(value)
    .replace(/\[font=([a-z]+)\]([\s\S]*?)\[\/font\]/g, (match, font, content) => `<span class="font-${font}">${content}</span>`)
    .replace(/\[size=(\d+(?:\.\d+)?)\]([\s\S]*?)\[\/size\]/g, '<span class="inline-sized" style="font-size: $1px">$2</span>')
    .replace(/\*\*([\s\S]*?)\*\*/g, "<strong>$1</strong>");
  return applyLatinFont(safe).replaceAll("&amp;", '<span class="latin-text">&amp;</span>');
}

function applyLatinFont(value) {
  return String(value)
    .split(/(<[^>]+>|&[a-zA-Z0-9#]+;)/g)
    .map((part) => {
      if (part.startsWith("<") && part.endsWith(">")) return part;
      if (part.startsWith("&") && part.endsWith(";")) return part;
      return part.replace(/[A-Za-z0-9][A-Za-z0-9+\-./_:%@#]*|\//g, (match) => {
        if (!/[A-Za-z0-9/]/.test(match)) return match;
        return `<span class="latin-text">${match}</span>`;
      });
    })
    .join("");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
