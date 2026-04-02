import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

export const enDict = {
  translation: {
    // Generics & App Wide
    "app.title": "Abandon",
    "app.titleSuffix": "OldLove",
    "app.subtitle": "GITHUB STAR MANAGER",
    "app.intro1": "When we were young and naive, it was inevitable to fall for the wrong person.",
    "app.intro2": "When we were noobs back in the day, browsing GitHub inevitably led us to star some random weird repos.",
    "app.intro3": "It doesn’t matter if you loved the wrong one or starred the wrong stuff",
    "app.intro4": "Abandon old loves will cure your OCD right away.",
    "app.toggleTheme": "Toggle Theme",
    "app.toggleLanguage": "Toggle Language",
    "app.logout": "Disconnect & Logout",

    // Login Screen
    "login.title": "GitHub PAT Configuration",
    "login.desc": "Please provide your GitHub Personal Access Token to manage your stars.",
    "login.tokenLabel": "Personal Access Token",
    "login.tokenPlaceholder": "ghp_...",
    "login.passkeyLabel": "Secret Passkey (Optional Local Encryption)",
    "login.passkeyPlaceholder": "Leave blank or enter a key to encrypt your PAT",
    "login.passkeyDesc": "Enter an easy-to-remember password (e.g. your dog's name). It encrypts your PAT using AES-GCM locally so it's not stored in plain text. Next time you visit, you just type this passkey instead of pasting the PAT again.",
    "login.createPat": "Create a PAT",
    "login.createPatDesc": "Ensure",
    "login.createPatDesc1": "and",
    "login.createPatDesc2": "scopes are ticked.",
    "login.warningText1": "CRITICAL: Do NOT use Fine-Grained Tokens!",
    "login.warningText2": "Classic PAT is strictly recommended because fine-grained tokens cannot manage starred repositories across the platform. If you use a fine-grained token, you will get a Resource not accessible error when you click Unstar.",
    "login.submit": "Validate & Continue",
    "login.testing": "Testing connection...",
    "login.verifying": "Verifying...",
    "login.unlockVault": "Unlock Vault & Connect",
    "login.encryptPat": "Encrypt & Connect GitHub",
    "login.encryptionNote": "Your PAT is stored securely via <1>AES-GCM encryption</1> in your browser's local storage. Not a single string is sent to our own backend.",
    "login.resetVault": "Reset / I forgot my passkey",

    // Dashboard Controls
    "dashboard.searchPlaceholder": "Search active view...",
    "dashboard.computeBy": "Compute Active By:",
    "dashboard.filters.pushedAt": "Pushed At",
    "dashboard.filters.updatedAt": "Updated At",
    "dashboard.massUnstarDesc": "Mass Unstar by Age:",
    "dashboard.daysOld": "days",
    "dashboard.executeMassUnstar": "Execute Mass Unstar",

    // Dashboard Table
    "dashboard.table.repo": "Repository",
    "dashboard.table.stars": "Stars",
    "dashboard.table.lastPush": "Last Push",
    "dashboard.table.lastUpdate": "Last Update",
    "dashboard.table.action": "Action",
    "dashboard.table.unstar": "Unstar",

    // Formats
    "dashboard.format.daysAgo": "{{days}}d ago",
    "dashboard.format.today": "Today",

    // Dashboard Status & Pagination
    "dashboard.status.showing": "Showing",
    "dashboard.status.loaded": "loaded repositories",
    "dashboard.status.totalStars": "Total Stars:",
    "dashboard.loadMore": "Load More Stars",
    "dashboard.pulling": "Pulling stars...",
    "dashboard.error": "Error loading repositories:",

    // Single Modal
    "modal.single.title": "Confirm Unstar",
    "modal.single.desc": "Are you sure you want to remove your star from this repository?",
    "modal.single.noDesc": "No description provided.",
    "modal.single.cancel": "Cancel",
    "modal.single.confirm": "Yes, Unstar",

    // Batch Modal
    "modal.batch.title": "Mass Unstar Confirmation",
    "modal.batch.desc": "You are about to irreversibly remove stars from {{count}} repositories.",
    "modal.batch.execute": "Execute Mass Unstar ({{count}})",

    // Progress
    "progress.title": "Mass Unstar in Progress",
    "progress.removing": "Removing",
    "progress.done": "{{count}} done",
    "progress.remaining": "{{count}} remaining",
  }
};

export const zhDict = {
  translation: {
    // Generics & App Wide
    "app.title": "Abandon",
    "app.titleSuffix": "OldLove",
    "app.subtitle": "GITHUB 星标管理器",
    "app.intro1": "年少无知时，难免爱错人。",
    "app.intro2": "曾经的菜鸟岁月，在流连 GitHub 时也难免瞎给一些奇奇怪怪的仓库点 Star。",
    "app.intro3": "爱错人没关系，点错 Star 也没关系，",
    "app.intro4": "抛弃旧爱，立马治愈你的强迫症。",
    "app.toggleTheme": "切换主题",
    "app.toggleLanguage": "切换语言",
    "app.logout": "断开连接并注销",

    // Login Screen
    "login.title": "GitHub PAT 配置",
    "login.desc": "请提供您的 GitHub 个人访问令牌 (PAT) 来管理您的星标库。",
    "login.tokenLabel": "个人访问令牌 (PAT)",
    "login.tokenPlaceholder": "ghp_...",
    "login.passkeyLabel": "加密密钥 (本地加密可选项)",
    "login.passkeyPlaceholder": "留空，或输入密钥对您的 PAT 进行本地加密存储",
    "login.passkeyDesc": "输入一个好记的密码（比如你家狗的名字），它会用 AES-GCM 把你的 PAT 加密存在本地，绝无明文泄露。下次访问时，只需输入密码解锁，不用再到处找你的 PAT 了。",
    "login.createPat": "如何创建 PAT?",
    "login.createPatDesc": "确勾选了",
    "login.createPatDesc1": "和",
    "login.createPatDesc2": "权限范围。",
    "login.warningText1": "严重警告：绝对不要使用 Fine-Grained (细粒度) Tokens！",
    "login.warningText2": "强烈建议使用 Classic PAT。因为 GitHub 的细粒度令牌无法进行跨站星标管理权限下发。如果你使用了细粒度令牌，点取消星标时必定会报 Resource not accessible 错误！",
    "login.submit": "验证并继续",
    "login.testing": "测试网络连接中...",
    "login.verifying": "正在验证口令...",
    "login.unlockVault": "解锁保险库并连接",
    "login.encryptPat": "本地加密存储并连接",
    "login.encryptionNote": "你的 PAT 通过 <1>AES-GCM</1> 加密安全地存储在浏览器的本地缓存中。我们不会向任何后端服务器发送哪怕一个字符。",
    "login.resetVault": "重置 / 我忘了我的加密密钥",

    // Dashboard Controls
    "dashboard.searchPlaceholder": "在当前视图搜索...",
    "dashboard.computeBy": "参照活跃维度:",
    "dashboard.filters.pushedAt": "最后推送时间",
    "dashboard.filters.updatedAt": "最后更新时间",
    "dashboard.massUnstarDesc": "按陈旧度批量取消:",
    "dashboard.daysOld": "天以上未活跃",
    "dashboard.executeMassUnstar": "一键批量取消",

    // Dashboard Table
    "dashboard.table.repo": "仓库清单",
    "dashboard.table.stars": "点赞数",
    "dashboard.table.lastPush": "最后推送",
    "dashboard.table.lastUpdate": "最后更新",
    "dashboard.table.action": "操作",
    "dashboard.table.unstar": "取消 Star",

    // Formats
    "dashboard.format.daysAgo": "{{days}} 天前",
    "dashboard.format.today": "今天",

    // Dashboard Status & Pagination
    "dashboard.status.showing": "正在显示",
    "dashboard.status.loaded": "条已加载记录",
    "dashboard.status.totalStars": "账号总星标数:",
    "dashboard.loadMore": "加载更多星标",
    "dashboard.pulling": "正在拉取星标数据...",
    "dashboard.error": "加载仓库时发生错误:",

    // Single Modal
    "modal.single.title": "确认清除",
    "modal.single.desc": "您确定要取消对这个仓库的标星吗？",
    "modal.single.noDesc": "没有提供描述。",
    "modal.single.cancel": "点错了，取消",
    "modal.single.confirm": "是的，一键拉黑",

    // Batch Modal
    "modal.batch.title": "高危批量清除确认",
    "modal.batch.desc": "您即将一次性、不可挽回地取消 {{count}} 个仓库的星标。",
    "modal.batch.execute": "立刻开始批量处决 ({{count}})",

    // Progress
    "progress.title": "批量取消任务执行中...",
    "progress.removing": "正在移除",
    "progress.done": "已完成 {{count}} 项",
    "progress.remaining": "还剩 {{count}} 项",
  }
};

const savedLang = localStorage.getItem('app-lang') || 'en';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: enDict,
      zh: zhDict
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18next;
