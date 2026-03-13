# 🎯 Skill Tracker

[English](#english) | [中文](#中文)

---

<a name="english"></a>
## English

Track OpenClaw skill usage statistics by scanning session transcripts. **Cross-platform (Mac/Windows/Linux).**

### Features

- ✅ **Auto Tracking**: Scan session transcripts to extract skill usage
- ✅ **Usage Stats**: See which skills are used most frequently
- ✅ **Unused Detection**: Identify skills that have never been used
- ✅ **One-Click Share**: Export top skills for sharing
- ✅ **Cross-Platform**: Works on Mac, Windows, and Linux via Node.js
- ✅ **Zero Config**: No Python or external dependencies required

### Installation

```bash
# Clone or download the skill
cd ~/.openclaw/workspace-main/skills
git clone https://github.com/shaoyong-hu/skill-tracker.git

# Or install via ClawHub
clawhub install skill-tracker
```

### Commands

```bash
# Scan recent transcripts and update stats
node scripts/tracker.js scan

# Show usage statistics
node scripts/tracker.js stats

# List never-used skills
node scripts/tracker.js unused

# Export top N skills for sharing
node scripts/tracker.js share 5

# List all installed skills
node scripts/tracker.js list

# Reset all statistics
node scripts/tracker.js reset
```

### Example Output

```
📊 Skill Usage Statistics (Total: 715 calls)

Top Skills:
  1. skill-tracker (148 calls)
  2. self-improving-agent (144 calls)
  3. elite-longterm-memory (134 calls)
  4. obsidian (108 calls)
  5. feishu-bitable (93 calls)

Never Used (9):
  ❌ ai-image-generation
  ❌ auto-updater
  ❌ bria-ai
  ...
```

### Configuration

Edit `config.json` to change the tracking mode:

```json
{
  "mode": "heartbeat",
  "heartbeat": { "enabled": true },
  "schedule": { "enabled": false, "cron": "0 4 * * *" }
}
```

| Mode | Description |
|------|-------------|
| `heartbeat` | Auto-scan on every heartbeat (default) |
| `schedule` | Scan on schedule (e.g., daily at 4 AM) |
| `manual` | Only scan when manually triggered |

### How It Works

1. **Scan Transcripts**: Reads `~/.openclaw/agents/main/sessions/*.jsonl`
2. **Match Patterns**: Uses regex to extract skill names
3. **Update Stats**: Writes to `~/.openclaw/skill-usage.json`

### Files

| File | Purpose |
|------|---------|
| `scripts/tracker.js` | Main script (Node.js) |
| `config.json` | Configuration file |
| `~/.openclaw/skill-usage.json` | Usage statistics |

### Requirements

- Node.js 14+
- OpenClaw

---

<a name="中文"></a>
## 中文

通过扫描会话记录追踪 OpenClaw skill 使用统计。**跨平台支持（Mac/Windows/Linux）。**

### 功能特性

- ✅ **自动追踪**：扫描会话记录提取 skill 使用情况
- ✅ **使用统计**：查看哪些 skills 使用最频繁
- ✅ **未使用检测**：识别从未使用的 skills
- ✅ **一键分享**：导出高频 skills 分享给他人
- ✅ **跨平台**：通过 Node.js 支持 Mac、Windows、Linux
- ✅ **零配置**：无需 Python 或其他外部依赖

### 安装

```bash
# 克隆或下载 skill
cd ~/.openclaw/workspace-main/skills
git clone https://github.com/shaoyong-hu/skill-tracker.git

# 或通过 ClawHub 安装
clawhub install skill-tracker
```

### 命令

```bash
# 扫描最近的会话记录并更新统计
node scripts/tracker.js scan

# 查看使用统计
node scripts/tracker.js stats

# 列出从未使用的 skills
node scripts/tracker.js unused

# 导出前 N 个高频 skills 用于分享
node scripts/tracker.js share 5

# 列出所有已安装的 skills
node scripts/tracker.js list

# 重置所有统计数据
node scripts/tracker.js reset
```

### 示例输出

```
📊 Skill Usage Statistics (Total: 715 calls)

Top Skills:
  1. skill-tracker (148 calls)
  2. self-improving-agent (144 calls)
  3. elite-longterm-memory (134 calls)
  4. obsidian (108 calls)
  5. feishu-bitable (93 calls)

Never Used (9):
  ❌ ai-image-generation
  ❌ auto-updater
  ❌ bria-ai
  ...
```

### 配置

编辑 `config.json` 更改追踪模式：

```json
{
  "mode": "heartbeat",
  "heartbeat": { "enabled": true },
  "schedule": { "enabled": false, "cron": "0 4 * * *" }
}
```

| 模式 | 说明 |
|------|------|
| `heartbeat` | 每次心跳自动扫描（默认） |
| `schedule` | 定时扫描（如每天凌晨 4 点） |
| `manual` | 仅手动触发 |

### 工作原理

1. **扫描 Transcript**：读取 `~/.openclaw/agents/main/sessions/*.jsonl`
2. **匹配模式**：使用正则表达式提取 skill 名称
3. **更新统计**：写入 `~/.openclaw/skill-usage.json`

### 文件说明

| 文件 | 用途 |
|------|------|
| `scripts/tracker.js` | 主脚本（Node.js） |
| `config.json` | 配置文件 |
| `~/.openclaw/skill-usage.json` | 使用统计数据 |

### 系统要求

- Node.js 14+
- OpenClaw

---

## License

MIT

## Author

Created by 阿锦 (Ajin) for Boss 🐯