# 太空探索知识问答 · Space Quiz

一个只有单个 HTML 文件的太空探索知识问答，共 10 道题。
无需构建、无需服务器、零依赖，打开即玩。默认中文，可一键切换为英文。

A ten-question space exploration quiz in a single HTML file. Chinese by default,
with an English toggle.

本项目在 [GitHub Copilot app 入门工作坊](https://github-samples.github.io/copilot-workshops/first-steps/copilot-app/)
中逐个 issue 完成，完整走过一遍智能体工作流：提示 → 构建 → 测试 → 发布 →
issue → worktree → 规划 → Pull Request → 评审 → 合并。

## 开始游戏

用任意浏览器打开 [`index.html`](index.html) 即可。

```bash
open index.html          # macOS
```

```bash
xdg-open index.html      # Linux
```

```bash
start index.html         # Windows
```

也可以直接访问 GitHub Pages 上的线上版本：**https://hobairiku.github.io/space-quiz/**

## 功能

- **10 道太空探索题目**，每题四个选项，选项带 A–D 标记。
- **中英双语**：默认中文，右上角按钮切换到 English；语言选择会被记住。答题中途切换不会打乱题目和进度。
- **进度条与实时得分**，均可被读屏软件播报。
- **答题反馈动画**：答对轻微放大、答错左右摇晃；系统开启“减少动态效果”时自动关闭。
- **结果页**：环形进度显示得分与正确率，并按成绩给出称号。
- **个人最佳成绩** 保存在 `localStorage`，刷新纪录时会提示。
- **每轮随机打乱** 题目顺序和选项顺序。
- **浅色 / 深色主题** 跟随系统，背景为纯 CSS 绘制的星空。

## 设计约束

以下约束由项目的智能体说明 [`AGENTS.md`](AGENTS.md) 和测试共同保证：

| 约束 | 原因 |
| --- | --- |
| 只有一个 `index.html` | 可通过 `file://` 直接运行，无需安装 |
| 零运行时依赖 | 无 CDN、无打包工具、无供应链风险 |
| 默认无障碍 | 原生 `<button>`、ARIA 进度条语义，每种状态都有文字说明而不仅靠颜色 |
| 双语文案 | 所有界面文字同时提供中文和英文 |
| 浅色与深色主题 | 通过 `prefers-color-scheme` |
| 动效可关闭 | 通过 `prefers-reduced-motion` |

## 测试

问答本身没有任何依赖。测试工具是 [`tests/`](tests/) 下一个独立的 npm 项目，
用 [jsdom](https://github.com/jsdom/jsdom) 加载真实的 `index.html`，只对渲染后的 DOM 做断言。

```bash
cd tests
npm ci
node smoke.js    # 核心行为：进度、计分、反馈、结果、无障碍、语言切换
node best.js     # 个人最佳与语言偏好的持久化，以及存储损坏或被禁用的情况
```

预期结果：**48/48** 与 **27/27** 全部通过。

每次 push 和 Pull Request 都会通过 [`.github/workflows/ci.yml`](.github/workflows/ci.yml) 运行这两组测试。

> 答案按题目和选项的**文字**匹配（中英文各一份），因此即使每轮顺序被打乱，测试依然稳定。

## 目录结构

```
space-quiz/
├── index.html            # 整个应用
├── AGENTS.md             # 每个智能体会话首先阅读的项目说明
├── tests/
│   ├── smoke.js          # 核心行为、无障碍与双语
│   └── best.js           # localStorage 持久化与异常情况
└── .github/workflows/
    ├── ci.yml            # push 与 PR 时运行测试
    └── pages.yml         # 合并到 main 后发布到 GitHub Pages
```

## 无障碍说明

- 所有可交互控件（包括语言切换）都是原生 `<button>`，没有自定义键盘处理。
- 进度条提供 `role="progressbar"` 以及 `aria-valuemin`、`aria-valuemax`、`aria-valuenow`。
- 反馈区使用 `role="status"`，位于 `aria-live="polite"` 区域内，答题结果会被播报。
- 对错状态同时以文字表达（“回答正确！” / “答错了，正确答案是……”），并用 ✓ / ✗ 标记，不只依赖颜色。
- 切换语言时会同步更新 `<html lang>`，读屏软件能按正确的语言朗读。
- 所有按钮都保留 `:focus-visible` 焦点框。

## 参与贡献

1. 先阅读 [`AGENTS.md`](AGENTS.md)，其中记录了上述约束。
2. 修改前后都运行 `cd tests && node smoke.js && node best.js`。
3. 保持单文件。如果某个功能需要引入依赖，它就不属于这个项目。

## 许可

仓库未包含许可证文件；公开仅用于工作坊学习。
