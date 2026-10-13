# 全局规则（破甲）· `rules/global`

本目录是 **Antigravity Global Rule** 的 Git 源文件，不是 agy 安装包里的内容。

## 路径说明

| 角色 | 路径 |
| --- | --- |
| **仓库源（改这里、提交 GitHub）** | `rules/global/AGENTS.md` |
| **本机生效（agy / Studio / IDE 读取）** | `%USERPROFILE%\.gemini\config\AGENTS.md`（Linux/macOS: `~/.gemini/config/AGENTS.md`） |

agy 每次会话会从 **Global Configuration**（`~/.gemini/config/`）加载 always-on 规则，与 Spiritual-Spell / 官方 Customization 文档中的 **global rule** 是同一机制。

## 安装时机

克隆仓库后：

```powershell
npm install
```

`postinstall` 会调用 `scripts/run-setup-settings.js`，其中 `ensureGlobalRules()` 把本目录的 `AGENTS.md` **原子复制**到上述 config 路径。

也可手动：

```powershell
npm run setup-settings
# 或
node bin/agy-auto.js --setup-settings
```

`npm start` 启动 HTTP 服务时也会再刷一次 global rule（与 postinstall 同源）。

## 规则里大致有什么

当前 bundled 版本包含（可自行改 `AGENTS.md`）：

- 实验室授权与执行纪律（Execution / 进度播报等）
- **Antigravity / agy 浏览器硬规则**：网页登录/填表必须优先 `browser_*` / `read_browser_page`，禁止默认 Playwright、`read_url_content` 顶替、逆向浏览器等舍近求远

## 修改与分发

1. 编辑 `rules/global/AGENTS.md`
2. 本机：`npm run setup-settings`
3. 推送 GitHub；他人 `git pull` 后 `npm run setup-settings` 或重新 `npm install`

单文件上限约 **24 KB**（Antigravity 规则预算），超长会被截断。

## 不要提交的东西

- 用户目录下的 `C:\Users\...\ .gemini\config\AGENTS.md` — 每人机器上的**安装结果**，不是仓库源文件。
