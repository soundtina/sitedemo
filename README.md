# Nexora 模板中心静态部署指南 (Cloudflare Pages)

此文件夹（`gallery-static`）包含好外贸建站平台（Nexora）模板中心的全部静态网页资源与缩略图。

您可以直接将此文件夹部署到 Cloudflare Pages。

## 部署方法

### 方法一：通过 Cloudflare 控制台手动上传（推荐，零门槛）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2. 导航至 **Workers & Pages** -> **Create** -> **Pages** -> **Upload assets**。
3. 输入您的项目名称（例如 `nexora-gallery`）。
4. 点击 **Upload assets**，选择拖拽或上传此 `gallery-static` 目录。
5. 点击 **Deploy site**，稍等片刻即可完成部署并获取可供公开访问的 `.pages.dev` 域名。

### 方法二：使用 Wrangler CLI 命令行部署

如果您本地安装了 Node.js，可以使用 `wrangler` 命令行工具一键上传部署：

1. 打开终端并确保处于项目根目录（或 `gallery-static` 同级目录）。
2. 运行以下命令进行部署：
   ```bash
   npx wrangler pages deploy gallery-static --project-name nexora-gallery
   ```
3. 按照提示登录您的 Cloudflare 账号，选择或新建项目即可完成发布。

## 目录结构说明

- `index.html`：展示中心主页面（基于 HTML5 语义化和 Outfit 现代字体）。
- `style.css`：精美的磨砂玻璃拟态（Glassmorphism）与暗黑科技风响应式样式系统。
- `app.js`：轻量级高性能客户端渲染与分页逻辑，包含优雅的骨架屏（Skeleton Loader）过渡动画。
- `templates.json`：配置的模板链接源数据。
- `screenshots/`：自动生成的模板高保真高清预览图（PNG 格式）。
- `_headers`：Cloudflare Pages 专属的静态缓存头优化配置，实现极致性能加载。
