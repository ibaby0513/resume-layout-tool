(function (global) {
  const BACKUP_APP = "resume-layout-tool";
  const BACKUP_VERSION = 1;

  function createBackupPayload(state, exportedAt = new Date().toISOString()) {
    return {
      app: BACKUP_APP,
      version: BACKUP_VERSION,
      exportedAt,
      state,
    };
  }

  function parseBackupText(text) {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("导入失败：不是有效的 JSON 文件");
    }

    if (!parsed || typeof parsed !== "object") {
      throw new Error("导入失败：JSON 内容格式不正确");
    }

    if (parsed.app === BACKUP_APP) {
      if (!parsed.state || typeof parsed.state !== "object") {
        throw new Error("导入失败：备份文件缺少 state 数据");
      }
      return parsed.state;
    }

    return parsed;
  }

  const api = { createBackupPayload, parseBackupText };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.ResumeBackup = api;
})(typeof window !== "undefined" ? window : globalThis);
