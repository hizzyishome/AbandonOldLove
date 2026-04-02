<div align="center">
  <div style="font-size: 64px; margin-bottom: 20px;">⭐</div>
  <h1 align="center">Abandon<span style="color: #818cf8;">OldLove</span></h1>
  <p align="center">
    <a href="./README.md">English</a> | <strong>简体中文</strong>
  </p>
  <p align="center">
    <strong>一款无需后端、极致安全、数据纯本地、界面精美的 GitHub Star 批量管理工具。</strong><br/>
    <a href="https://hizzyishome.github.io/AbandonOldLove/">✨ 点此在线体验 ✨</a>
  </p>
</div>

<div align="center">
  <em>年少无知时难免爱错人，<br>
  当年还是萌新时逛 GitHub，难免随手给一些莫名其妙的仓库点了 Star。<br>
  爱错人、点错 Star 都没关系，<br>
  抛弃旧爱，强迫症瞬间治愈。</em>
</div>

---

## 🌟 功能特性
- **无后端架构**：你的令牌仅由你自己保管。所有 GraphQL 请求直接从浏览器发送至 GitHub 官方 API。
- **军工级安全**：需要保持登录状态？工具采用 **Web Crypto API（AES-GCM 加密算法）**，使用自定义密码在本地加密你的个人访问令牌，杜绝明文泄露。
- **批量取消 Star 引擎**：内置精密的异步队列系统，支持并发限制与抖动策略，可安全规避 GitHub 严格的接口限流，流畅完成批量取消操作。
- **丰富筛选条件**：精准找出那些老旧、无人维护的仓库。可按「最后推送时间」或「最后更新时间」排序活跃仓库，筛选出超过指定天数未活跃的仓库并批量取消 Star。
- **多语言与主题切换**：内置零依赖本地化支持（英语 / 中文），支持深色/浅色模式自动切换，搭配基于 shadcn/ui 打造的精美界面。

## 🛠 技术栈
- **核心**：React 18 / TypeScript / Vite
- **状态管理**：Zustand
- **样式**：Tailwind CSS v3 / shadcn UI / Lucide 图标库
- **数据请求**：GraphQL Request（`graphql-request`）
- **国际化**：i18next & react-i18next

## 🚀 快速开始
### 1. 环境准备
需安装 Node.js（v18 及以上版本）与 npm。

### 2. 安装
克隆仓库并安装依赖：
```bash
git clone https://github.com/your-username/AbandonOldLove.git
cd AbandonOldLove
npm install
```

### 3. 启动开发服务
运行本地 Vite 服务：
```bash
npm run dev
```
访问 `http://localhost:5173` 即可。

> **重要提示**：本工具高度依赖浏览器的 `SubtleCrypto` API 进行本地令牌加密，该 API 仅在 `localhost` 环境或 **HTTPS** 协议下可用。

## 📖 使用说明
### 1. 生成 GitHub 经典个人访问令牌（PAT）
为管理你的 Star，本工具需要个人访问令牌：
1. 访问 [GitHub 令牌设置页面](sslocal://flow/file_open?url=https%3A%2F%2Fgithub.com%2Fsettings%2Ftokens&flow_extra=eyJsaW5rX3R5cGUiOiJjb2RlX2ludGVycHJldGVyIn0=)。
2. 生成**经典令牌**（请勿使用细粒度令牌，该类令牌无法管理全局仓库 Star）。
3. 勾选 `repo` 或 `public_repo` 以及 `read:user` 权限。

### 2. 登录与密码加密
- **首次使用**：粘贴个人访问令牌，并设置本地专属密码。工具会通过 AES-GCM 加密令牌，并将密文存储在浏览器的 localStorage 中。
- **再次使用**：仅需输入密码，即可在本地解密并登录，无需重复输入令牌。

### 3. 控制台操作
- **筛选与排序**：通过顶部栏切换判断仓库活跃度的依据——开发者推送时间（Pushed At）或常规更新时间（Updated At）。
- **单个取消 Star**：点击常规「取消 Star」按钮并确认提示。
- **批量执行**：输入天数阈值（如 `1000` 天），工具会自动筛选出超过 1000 天无推送/更新的仓库，点击「批量取消 Star」警示按钮，快速清理 Star 列表！

## ⚠️ 已知限制
- **不支持细粒度令牌**。GitHub 现行细粒度权限规范限制了跨组织 Star 管理功能，使用该类令牌会出现「个人访问令牌无法访问该资源」错误，请使用经典个人访问令牌！

## 📝 开源协议
MIT 许可证。为治愈 GitHub Star 强迫症而生。