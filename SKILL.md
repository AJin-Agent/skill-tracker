---
name: skill-usage-tracker
version: "1.0.0"
description: "Track OpenClaw skill usage statistics by scanning session transcripts. Features: auto scan, usage stats, unused detection, one-click share. Cross-platform (Mac/Windows/Linux). Commands: 'skill scan', 'skill stats', 'skill unused', 'skill share'."
---

# Skill Tracker

Track skill usage by scanning session transcripts. **Cross-platform (Mac/Windows/Linux).**

## Commands

| Say This | Action |
|----------|--------|
| `skill scan` | Scan transcripts and update stats |
| `skill stats` | Show usage statistics |
| `skill unused` | List never-used skills |
| `skill share` | Export top skills for sharing |
| `skill list` | List all installed skills |

## CLI Usage (Cross-Platform)

```bash
# Scan recent transcripts
node scripts/tracker.js scan

# Show statistics
node scripts/tracker.js stats

# List never-used skills
node scripts/tracker.js unused

# Share top 5 skills
node scripts/tracker.js share

# List all installed skills
node scripts/tracker.js list

# Reset statistics
node scripts/tracker.js reset
```

## ⚙️ 配置选项

配置文件：`skills/skill-tracker/config.json`

```json
{
  "mode": "heartbeat",
  "heartbeat": { "enabled": true }
}
```

### 模式说明

| 模式 | 说明 |
|------|------|
| `heartbeat` | 每次心跳自动执行 |
| `schedule` | 定时执行（cron） |
| `manual` | 仅手动触发 |

---

## How It Works

### 执行流程

1. **扫描 transcript 文件**：读取 `~/.openclaw/agents/main/sessions/*.jsonl`
2. **匹配 skill 模式**：正则表达式提取 skill 名称
3. **更新统计文件**：写入 `~/.openclaw/skill-usage.json`

### Skill Detection Patterns

| Pattern | Skill |
|---------|-------|
| `skills/github/SKILL.md` | github |
| `skills/feishu-bitable/SKILL.md` | feishu-bitable |
| `skills/obsidian/SKILL.md` | obsidian |
| `feishu_bitable` | feishu-bitable |
| `feishu_calendar` | feishu-calendar |
| `elite-longterm` | elite-longterm-memory |
| `self-improving` | self-improving-agent |

---

## Files

- **脚本**: `scripts/tracker.js` (Node.js, 跨平台)
- **配置**: `config.json`
- **数据**: `~/.openclaw/skill-usage.json`
- **Transcripts**: `~/.openclaw/agents/main/sessions/*.jsonl`

---

## Requirements

- Node.js 14+ (所有平台已预装)