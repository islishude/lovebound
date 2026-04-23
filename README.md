# 恋爱旅行大转盘

一个用 `React + Vite` 实现的情侣旅行目的地选择小游戏。核心交互是大转盘随机抽出下一次出行地，并配上一张轻暧昧的情侣任务卡。

## 本地运行

```bash
npm install
npm run dev
```

默认开发地址由 Vite 输出，通常是 `http://localhost:5173`。

## 构建与静态预览

先构建静态文件：

```bash
npm run build
```

然后用任意简单 http server 预览 `dist/`。示例：

```bash
python3 -m http.server 4173 -d dist
```

打开 `http://localhost:4173` 即可。

如果只想用 Vite 自带预览：

```bash
npm run preview
```

## 测试与检查

```bash
npm run test
npm run lint
```

## 功能概览

- 浪漫风格的大转盘页面，移动端优先，桌面端自适应
- 预置 12 个适合情侣的国内与周边短途目的地
- 支持新增、编辑、删除、恢复默认地点
- 使用 `localStorage` 保存自定义地点
- 结果卡展示城市氛围、出行理由和情侣小任务
- 转盘计算逻辑与存储工具都有单元测试
