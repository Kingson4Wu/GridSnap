# 我一行代码没写，两小时做出了替代 PhotoSplit 的免费工具

上周我想把一张照片切成九宫格发 Instagram，打开 PhotoSplit，发现要订阅。

我没付钱。我打开了终端。

两小时后，我有了一个功能完整的替代品：支持六种网格、四种比例、旋转、PWA 离线安装、33 个自动化测试、GitHub Actions CI/CD、完整的开源文档。

**代码我一行没写。**

---

## PhotoSplit 收费了，然后呢

PhotoSplit 是 iOS 上很流行的九宫格切图工具。把一张大图切成 3×3 = 9 张小图，按顺序发到 Instagram，观众左滑就能看到完整拼图效果。需求很真实，工具也好用——但它收费。

以前我会有两个选择：付钱，或者自己花几天写一个。

现在有了第三条路：**告诉 AI 你要什么，等它做完。**

---

## 工具链：三件事

我用了三个工具，缺一不可。

### Claude Code

Claude Code 是 Anthropic 出的 CLI 工具，直接在你的终端里运行。它不只是"帮你写代码"——它可以读文件、跑命令、执行测试、修 Bug、提交 commit、推送代码。整个开发流程它都能参与，不需要你来回复制粘贴。

### Superpowers Skills

这是 Claude Code 的一套结构化工作流插件。核心思路是：把软件开发拆成几个阶段——需求讨论、写实现计划、执行计划——每个阶段有专门的 skill 来驱动。

最关键的一个模式叫 **Subagent-Driven Development**：每个任务由一个独立的子 Agent 来实现，实现完之后自动触发两轮 review——先检查是否符合需求规格，再检查代码质量。不通过就打回去重做，直到两轮都过。

这意味着我不需要盯着屏幕看它写代码。它自己写，自己测，自己 review，自己 commit。我只需要在开始时说清楚要什么，然后等。

### gh CLI

GitHub 官方的命令行工具。创建 Release、设置 Topics、写 Wiki、管理 Labels、开 Discussions——全部一行命令搞定，不需要打开浏览器点来点去。

---

## 过程：四个关键节点

### 1. 用一句话启动：`/brainstorming`

我输入了一句话："做一个 web app，把图片切成九宫格，支持不同比例，用来发 Instagram。"

接下来是一轮对话。AI 问我：
- 要不要支持其他网格形状，不只是 3×3？
- 切出来的图怎么保存——下载还是分享？
- 要不要中英文双语？

几个来回之后，它生成了一份完整的设计文档：技术栈选型（React 18 + TypeScript + Tailwind CSS + Vite）、组件结构、状态管理方案、i18n 策略、PWA 配置。

我没写任何东西，我只是在回答问题。

### 2. 拆任务：`/writing-plans`

设计确认后，AI 自动把它拆成了一个实现计划。不是模糊的"实现 XX 功能"，而是每个任务都包含：
- 具体要创建或修改哪些文件
- 先写什么测试（TDD）
- 测试通过后写什么实现代码
- 跑哪条命令验证
- commit message 是什么

每个任务大约 5-10 步，粒度细到"跑测试 → 确认 FAIL → 写实现 → 确认 PASS → commit"。

### 3. 等它写完

启动 Subagent-Driven Development 之后，我基本就是在旁边等。

屏幕在滚。子 Agent 在写代码、跑测试、自我 review、修问题、再 review。

偶尔它会问我一个问题，比如"Copy Link 按钮点击后显示'Copied!'，持续几秒再还原？"我回答"2秒"，它继续干活。

整个过程我做的事情：回答了几个问题，偶尔确认一下方向。

最终结果：7 个测试文件，33 个测试，全绿。Build 通过，部署到 GitHub Pages。

### 4. GitHub 配置一气呵成

功能做完之后，我告诉 Claude Code："把这个项目的 GitHub 仓库配置得专业一点。"

然后我就看着它自己干：

- 调 `gh repo edit` 更新仓库描述，加上 `pwa`、`instagram`、`react` 等 Topics
- 调 `gh release create` 发布 v1.0.0，自动写好 Release Notes
- 调 GitHub API 开启 Discussions、关掉 Merge Commit 只保留 Squash、开启合并后自动删分支
- 克隆 wiki 仓库，写好 Home、User Guide、Architecture、Contributing、Roadmap 五个页面，push 进去
- 创建 `ios`、`android`、`pwa`、`ui/ux` 等 Issue Labels

我全程没打开过一次 GitHub 网页。我做的唯一一件事，是手动上传了 Social Preview 图片——因为那个接口 GitHub 没有开放 API。

这是最让我印象深刻的部分。不是写代码，而是连"把项目发布到 GitHub 并配置好"这件事，AI 也能端到端地完成。

---

## 结果：和 PhotoSplit 比怎么样

| 功能 | PhotoSplit | GridSnap |
|------|-----------|---------|
| 3×3 九宫格 | ✅ | ✅ |
| 其他网格（2×2, 1×3 等） | 部分 | ✅ 6种 |
| 多种比例（1:1, 9:16 等） | ✅ | ✅ 4种 |
| 旋转 | ✅ | ✅ |
| 裁剪/缩放 | ✅ | ✅ |
| PWA 离线安装 | ❌ | ✅ |
| 照片不上传服务器 | ✅ | ✅ |
| 开源免费 | ❌ 收费 | ✅ MIT |
| 支持 Android/桌面 | ❌ iOS only | ✅ |

PhotoSplit 作为原生 App 体验上有优势，但作为一个网页工具，GridSnap 已经完全覆盖了核心需求，而且跨平台、离线可用、永久免费。

**Live demo：** https://kingson4wu.github.io/GridSnap/
**GitHub：** https://github.com/Kingson4Wu/GridSnap

---

## 这件事说明了什么

我不是在说"AI 让开发变快了"。

这句话已经说烂了，而且它描述的还是一个程序员视角——写同样的代码，但更快。

我想说的是另一件事：**AI 让"不写代码"也能造工具成为可能。**

做一个工具，以前只有两条路：付钱用别人的，或者自己写。这两条路都有门槛——钱，或者时间和技术。

现在有了第三条路：**描述你要什么，等 AI 做完，你来决策。**

整个过程里，我做的事情是：提需求、回答问题、确认方向。这些事情不需要懂 React，不需要懂 TypeScript，甚至不需要知道什么是 PWA。

当然，懂技术会让你问出更好的问题，让你在 AI 偏轨的时候能发现并纠正。但门槛已经大幅降低了。

以前"我有个想法，想做个小工具"大概率会烂在想法阶段。
现在这个想法，两小时可以变成一个开源项目，放在 GitHub Pages 上让全世界用。

这个变化，我觉得比"写代码更快"有意思得多。

---

*GridSnap 开源地址：https://github.com/Kingson4Wu/GridSnap*
*在线体验：https://kingson4wu.github.io/GridSnap/*
