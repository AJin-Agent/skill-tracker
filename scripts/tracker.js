#!/usr/bin/env node
/**
 * Skill Usage Tracker - Cross-platform (Mac/Windows/Linux)
 * 
 * Usage:
 *   node tracker.js scan        # Scan transcripts and update stats
 *   node tracker.js stats       # Show usage statistics
 *   node tracker.js unused      # List never-used skills
 *   node tracker.js share [n]   # Export top N skills
 *   node tracker.js list        # List all installed skills
 *   node tracker.js reset       # Reset all statistics
 */

const fs = require('fs');
const path = require('path');

// Cross-platform home directory
const HOME = process.env.HOME || process.env.USERPROFILE;
const SKILL_USAGE_FILE = path.join(HOME, '.openclaw', 'skill-usage.json');
const SESSIONS_DIR = path.join(HOME, '.openclaw', 'agents', 'main', 'sessions');
const SKILLS_DIR = path.join(HOME, '.openclaw', 'skills');
const WORKSPACE_SKILLS_DIR = path.join(HOME, '.openclaw', 'workspace-main', 'skills');

// Skill detection patterns
const SKILL_PATTERNS = [
  { pattern: /skills\/github\/SKILL\.md/gi, skill: 'github' },
  { pattern: /skills\/feishu-bitable\/SKILL\.md/gi, skill: 'feishu-bitable' },
  { pattern: /skills\/feishu-calendar\/SKILL\.md/gi, skill: 'feishu-calendar' },
  { pattern: /skills\/feishu-task\/SKILL\.md/gi, skill: 'feishu-task' },
  { pattern: /skills\/obsidian\/SKILL\.md/gi, skill: 'obsidian' },
  { pattern: /skills\/seedream\/SKILL\.md/gi, skill: 'seedream' },
  { pattern: /skills\/ontology\/SKILL\.md/gi, skill: 'ontology' },
  { pattern: /skills\/humanizer\/SKILL\.md/gi, skill: 'humanizer' },
  { pattern: /skills\/weather\/SKILL\.md/gi, skill: 'weather' },
  { pattern: /skills\/elite-longterm-memory\/SKILL\.md/gi, skill: 'elite-longterm-memory' },
  { pattern: /skills\/self-improving-agent\/SKILL\.md/gi, skill: 'self-improving-agent' },
  { pattern: /skills\/skill-tracker\/SKILL\.md/gi, skill: 'skill-tracker' },
  { pattern: /skills\/gh-issues\/SKILL\.md/gi, skill: 'gh-issues' },
  { pattern: /skills\/ai-image-generation\/SKILL\.md/gi, skill: 'ai-image-generation' },
  { pattern: /elite-longterm/gi, skill: 'elite-longterm-memory' },
  { pattern: /self-improving/gi, skill: 'self-improving-agent' },
  { pattern: /feishu_bitable/gi, skill: 'feishu-bitable' },
  { pattern: /feishu_calendar/gi, skill: 'feishu-calendar' },
  { pattern: /feishu_task/gi, skill: 'feishu-task' },
  { pattern: /skill-tracker/gi, skill: 'skill-tracker' },
];

function loadData() {
  try {
    if (fs.existsSync(SKILL_USAGE_FILE)) {
      return JSON.parse(fs.readFileSync(SKILL_USAGE_FILE, 'utf-8'));
    }
  } catch (e) {}
  return {};
}

function saveData(data) {
  const dir = path.dirname(SKILL_USAGE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(SKILL_USAGE_FILE, JSON.stringify(data, null, 2));
}

function getInstalledSkills() {
  const skills = new Set();
  
  [SKILLS_DIR, WORKSPACE_SKILLS_DIR].forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach(name => {
        const skillPath = path.join(dir, name, 'SKILL.md');
        if (fs.existsSync(skillPath)) {
          skills.add(name);
        }
      });
    }
  });
  
  return Array.from(skills).sort();
}

function getSkillDescription(skillName) {
  const dirs = [SKILLS_DIR, WORKSPACE_SKILLS_DIR];
  for (const dir of dirs) {
    const skillPath = path.join(dir, skillName, 'SKILL.md');
    if (fs.existsSync(skillPath)) {
      try {
        const content = fs.readFileSync(skillPath, 'utf-8');
        const match = content.match(/description:\s*["'](.+?)["']/);
        if (match) {
          return match[1].substring(0, 60) + (match[1].length > 60 ? '...' : '');
        }
      } catch (e) {}
    }
  }
  return 'No description available';
}

function scanTranscripts() {
  const data = loadData();
  let totalMatches = 0;
  
  if (!fs.existsSync(SESSIONS_DIR)) {
    console.log('No sessions directory found.');
    return;
  }
  
  // Get recent transcript files (last 10)
  const files = fs.readdirSync(SESSIONS_DIR)
    .filter(f => f.endsWith('.jsonl'))
    .map(f => ({
      name: f,
      path: path.join(SESSIONS_DIR, f),
      mtime: fs.statSync(path.join(SESSIONS_DIR, f)).mtime.getTime()
    }))
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, 10);
  
  console.log(`Scanning ${files.length} recent transcripts...\n`);
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file.path, 'utf-8');
      
      SKILL_PATTERNS.forEach(({ pattern, skill }) => {
        const matches = content.match(pattern);
        if (matches) {
          if (!data[skill]) {
            data[skill] = { count: 0, first_used: new Date().toISOString() };
          }
          data[skill].count += matches.length;
          data[skill].last_used = new Date().toISOString();
          totalMatches += matches.length;
        }
      });
    } catch (e) {}
  });
  
  saveData(data);
  console.log(`✓ Found ${totalMatches} skill usages across ${files.length} transcripts.`);
  console.log(`✓ Updated ${Object.keys(data).length} skills in statistics.`);
}

function showStats() {
  const data = loadData();
  const installed = getInstalledSkills();
  
  const sorted = Object.entries(data)
    .sort((a, b) => b[1].count - a[1].count);
  
  const total = sorted.reduce((sum, [, info]) => sum + info.count, 0);
  
  console.log(`\n📊 Skill Usage Statistics (Total: ${total} calls)\n`);
  
  if (sorted.length > 0) {
    console.log('Top Skills:');
    sorted.slice(0, 10).forEach(([name, info], i) => {
      console.log(`  ${i + 1}. ${name} (${info.count} calls)`);
    });
  }
  
  // Never used
  const used = new Set(Object.keys(data));
  const neverUsed = installed.filter(s => !used.has(s));
  
  if (neverUsed.length > 0) {
    console.log(`\nNever Used (${neverUsed.length}):`);
    neverUsed.forEach(s => console.log(`  ❌ ${s}`));
  }
}

function showUnused() {
  const data = loadData();
  const installed = getInstalledSkills();
  const used = new Set(Object.keys(data));
  const neverUsed = installed.filter(s => !used.has(s));
  
  if (neverUsed.length > 0) {
    console.log(`\n❌ Never Used Skills (${neverUsed.length}):\n`);
    neverUsed.forEach(s => {
      const desc = getSkillDescription(s);
      console.log(`  • ${s}`);
      console.log(`    ${desc}\n`);
    });
  } else {
    console.log('\n✅ All installed skills have been used!');
  }
}

function shareSkills(topN = 5) {
  const data = loadData();
  const sorted = Object.entries(data)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, topN);
  
  if (sorted.length === 0) {
    console.log('No skill usage data yet.');
    return;
  }
  
  console.log(`\n🔥 My Top ${sorted.length} Skills (share-ready):\n`);
  
  sorted.forEach(([name, info], i) => {
    const desc = getSkillDescription(name);
    console.log(`${i + 1}. **${name}** - ${desc}`);
    console.log(`   Uses: ${info.count} | Install: \`clawhub install ${name}\`\n`);
  });
  
  console.log('---\n📝 Share Text:\n');
  console.log('```');
  console.log('🔥 我的常用 Skills:\n');
  sorted.forEach(([name, info], i) => {
    console.log(`${i + 1}. ${name} (${info.count} 次使用)`);
  });
  console.log('\n安装命令: clawhub install <skill-name>');
  console.log('```');
}

function listSkills() {
  const data = loadData();
  const installed = getInstalledSkills();
  
  console.log(`\n📦 Installed Skills (${installed.length}):\n`);
  
  installed.forEach(skill => {
    if (data[skill]) {
      console.log(`  ${skill}: ✅ ${data[skill].count} calls`);
    } else {
      console.log(`  ${skill}: ❌ Never used`);
    }
  });
}

function resetStats() {
  if (fs.existsSync(SKILL_USAGE_FILE)) {
    fs.unlinkSync(SKILL_USAGE_FILE);
    console.log('✓ All skill usage statistics have been reset.');
  } else {
    console.log('No statistics to reset.');
  }
}

// Main
const args = process.argv.slice(2);
const command = args[0]?.toLowerCase();

switch (command) {
  case 'scan':
    scanTranscripts();
    break;
  case 'stats':
    showStats();
    break;
  case 'unused':
    showUnused();
    break;
  case 'share':
    shareSkills(parseInt(args[1]) || 5);
    break;
  case 'list':
    listSkills();
    break;
  case 'reset':
    resetStats();
    break;
  default:
    console.log(`
Skill Usage Tracker - Cross-platform

Usage:
  node tracker.js scan        # Scan transcripts and update stats
  node tracker.js stats       # Show usage statistics
  node tracker.js unused      # List never-used skills
  node tracker.js share [n]   # Export top N skills
  node tracker.js list        # List all installed skills
  node tracker.js reset       # Reset all statistics
`);
}