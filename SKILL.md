---
name: EduSVG Studio
description: 帮助教育工作者通过自然语言生成专业级交互式教学动画课件。支持HTML animate SVG、Canvas 2D、Three.js、A-Frame等技术，用于创建数学、物理、化学、生物、地理、语文等学科的互动教学资源。适用于：1) 中小学教师快速制作课堂演示交互动画；2) 在线教育内容创作者制作高质量互动课程；3) 学生创建学习笔记中的动态示意图。
---

# EduSVG Studio

帮助教育工作者通过自然语言描述生成专业级交互式教学动画课件。

## 快速开始

用户描述需求时，解析关键信息：
- **学科**：数学、物理、化学、生物、地理、语文
- **技术栈**：根据复杂度选择
- **动画类型**：演示、模拟、交互

## 技术栈选择

| 场景 | 推荐技术 |
|------|----------|
| 简单演示、图表 | HTML + CSS Animations + SVG |
| 2D物理实验模拟 | Canvas 2D |
| 3D科学可视化 | Three.js |
| VR/AR沉浸式学习 | A-Frame |

## 输出规范

- 输出为**单HTML文件**，可直接在浏览器打开
- 内联所有CSS和JavaScript
- 使用CDN加载第三方库（Three.js、A-Frame等）
- 确保响应式设计，兼容教室大屏和学生平板

## 学科模板使用

模板位于 `assets/templates/` 目录：
- `math/` - 数学模板（几何、代数、微积分）
- `physics/` - 物理模板（力学、光学、波动）
- `chemistry/` - 化学模板
- `biology/` - 生物模板
- `geography/` - 地理模板
- `language/` - 语文模板

## 技术参考

详细技术指南：
- [SVG动画指南](references/svg-guide.md)
- [Canvas 2D指南](references/canvas-guide.md)
- [Three.js指南](references/threejs-guide.md)
- [A-Frame VR指南](references/aframe-guide.md)
