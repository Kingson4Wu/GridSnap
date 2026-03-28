# 文章设计：《我一行代码没写，两小时做出了替代 PhotoSplit 的免费工具》

**平台：** 个人博客 + 知乎
**受众：** 开发者 + 泛科技用户（技术细节放后半段）
**核心钩子：** 不需要写任何代码，1-2小时，大部分时间在等 AI 写

---

## 标题候选

- 《我一行代码没写，两小时做出了替代 PhotoSplit 的免费工具》（推荐）
- 《Claude Code 让我彻底不需要写代码了》
- 《不写代码，也能做出比收费 App 更好用的工具》

---

## 结构（约2000字）

### ① 开头 — 结论先行（150字）
直接亮答案：PhotoSplit 要收费，我用 Claude Code 两小时做了个免费的，代码一行没写，现在开源在 GitHub。附 GridSnap 截图。

### ② 背景 — 为什么要做（200字）
- PhotoSplit 是什么，收费逻辑
- Instagram 九宫格是真实需求
- 自己想做一个，但不想花时间写前端

### ③ 工具链介绍（300字）
三个工具：
- **Claude Code** — AI 在终端里写代码、跑测试、改 Bug，不需要自己动手
- **Superpowers skills** — 结构化工作流（brainstorm → plan → subagent 写代码 → review），AI 自动拆任务、自动测试
- **gh CLI** — GitHub 所有操作命令行完成，Wiki、Release、Topics 都不用开浏览器

### ④ 过程高光（600字）
四个关键节点，不是流水账：
1. `/brainstorming` — 一句话描述需求，AI 反问几个问题，设计稿自动生成
2. `/writing-plans` — AI 把设计拆成带测试、带代码、带 commit 的任务清单
3. Subagent 写代码 — 自己在等，屏幕在滚，33个测试全绿，build 通过
4. `gh` 命令行搞定一切 — Release、Wiki、Topics、Labels，连浏览器都不用开

### ⑤ 结果展示（300字）
- GridSnap 功能 vs PhotoSplit 功能对比
- PWA 可安装、离线可用、照片不上传、开源免费
- 截图：首页 + 裁剪页

### ⑥ 观点收尾（300字）
核心观点：**AI 编程的本质不是"写代码更快"，而是"不需要懂代码也能造工具"。**
以前做工具要么付费用别人的，要么自己花几天写。现在第三条路：告诉 AI 你要什么，等它做完。

### ⑦ 资源
- GitHub：https://github.com/Kingson4Wu/GridSnap
- Live demo：https://kingson4wu.github.io/GridSnap/

---

## 写作基调

- 口吻：第一人称，轻松直接，有观点
- 不炫技，不堆术语，非开发者也能看懂前半段
- 结论前置，过程服务于结论
