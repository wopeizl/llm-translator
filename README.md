**中文** | [English](README.en.md)

# LLM Translator

用大模型(DeepSeek / OpenAI / Claude / GLM / 千问 / Kimi / Gemini / 豆包 / MiniMax / Grok)翻译 Markdown 文件,并在侧边预览窗口中查看渲染后的结果——无需离开编辑器。

## 功能特性

- 一键翻译当前正在编辑的 Markdown 文件。
- 支持 DeepSeek、OpenAI、Claude、GLM、千问、Kimi、Gemini、豆包、MiniMax、Grok 及自定义 OpenAI 兼容服务。
- 可翻译成任意目标语言(中文、英文、阿拉伯语……)。
- 长文档自动分段翻译,完整保留 Markdown 语法、代码块、链接和图片。
- 预览窗口随 VS Code 主题自动适配明暗配色。
- 预览页可直接切换**大模型**与**目标语言**,并内置刷新、保存按钮。

## 快速开始

1. 打开**设置**(`Ctrl+,` / `Cmd+,`),搜索 **LLM Translator**,在 `LLM Translator: Provider` 选择服务商。
2. 在命令面板(`Ctrl+Shift+P`)运行 **LLM Translator: Set API Key**,选择服务商并粘贴对应的 **API Key**。Key 会被**加密保存到系统密钥库**,不会写入 `settings.json`,因此不会随设置同步/提交而泄露。
   - 也可以直接打开预览,首次翻译时会提示输入 Key。
   - 如需删除已保存的 Key,运行 **LLM Translator: Clear API Key**。
3. 如需更改翻译目标语言,设置 `LLM Translator: Target Language`。
4. 打开任意 `.md` 文件,按下方方式启动预览。

## 使用方法

在打开的 Markdown 文件中,通过以下任一方式启动翻译预览:

- 点击编辑器右上角工具栏的 🌐 图标。
- 按下 `Ctrl+Shift+\`。
- 在命令面板(`Ctrl+Shift+P`)中运行 **LLM Translator: Open Translation Preview**。

翻译并渲染后的 Markdown 会显示在编辑器旁边的窗口中。

### 切换、刷新与保存

把鼠标移到预览页面上,右上角会淡入四个控件:

- **模型**:从已配置的服务商和模型中切换,切换后立即重新翻译。
- **语言**:输入任意目标语言,切换后立即重新翻译。
- 🔄 **刷新**:重新翻译当前文件并刷新预览(也可运行命令 **LLM Translator: Re-translate**)。
- 💾 **保存**:把翻译结果保存到**源文件同级目录**,文件名为「源文件名.目标语言.扩展名」,例如 `README.md` 在目标语言为「中文」时保存为 `README.中文.md`。若目标文件已存在会先确认是否覆盖,保存后可一键打开。

## 管理 API Key

API Key 通过命令面板设置和删除,不在普通设置里填写,这样不会以明文形式留在 `settings.json` 中。

### 设置 API Key

1. **打开命令面板**:同时按下 `Ctrl` + `Shift` + `P`(Mac 上是 `Cmd` + `Shift` + `P`),窗口顶部中间会出现一个输入框。
2. **输入命令**:在输入框里打字 `Set API Key`(打 `set api` 即可),下方会出现 **LLM Translator: Set API Key**,点它或按 `回车`。
3. **选择服务商**:在弹出的列表里选择对应的服务商。
4. **粘贴 Key**:在输入框里粘贴你的 API Key(输入内容会以圆点遮挡),按 `回车`。
5. 右下角提示「已加密保存」即完成。

> 也可以跳过以上步骤:直接打开预览,首次翻译时会自动弹出输入框让你填 Key。

### 清除 API Key

1. **打开命令面板**:同时按下 `Ctrl` + `Shift` + `P`(Mac 上是 `Cmd` + `Shift` + `P`)。
2. **输入命令**:在输入框里打字 `Clear API Key`(打 `clear api` 即可),下方会出现 **LLM Translator: Clear API Key**,点它或按 `回车`。
3. **选择服务商**:在弹出的列表里点你想删除 Key 的那个服务商。
4. 右下角提示「已清除」即完成。

> 这两个命令在菜单栏和右键菜单里没有按钮,只能通过命令面板(第 1 步的快捷键)运行,这是 VS Code 插件的常规做法。

## 配置项

| 配置 | 说明 | 默认值 |
| --- | --- | --- |
| `llmTranslator.provider` | 服务商:`deepseek` / `openai` / `claude` / `glm` / `qwen` / `kimi` / `custom` / `gemini` / `doubao` / `minimax` / `grok` | `deepseek` |
| `llmTranslator.targetLanguage` | 目标语言 | `中文` |
| `llmTranslator.deepseek.model` / `.baseUrl` | DeepSeek 模型与接口地址 | `deepseek-flash` |
| `llmTranslator.openai.model` / `.baseUrl` | OpenAI 模型与接口地址 | `gpt-6-luna` |
| `llmTranslator.claude.model` / `.baseUrl` | Claude 模型与接口地址 | `claude-haiku-4-5` |
| `llmTranslator.glm.model` / `.baseUrl` | 智谱 GLM 模型与接口地址 | `glm-4.7-flash` |
| `llmTranslator.qwen.model` / `.baseUrl` | 通义千问模型与接口地址 | `qwen3.8-flash` |
| `llmTranslator.kimi.model` / `.baseUrl` | Kimi 模型与接口地址 | `kimi-k2.6` |
| `llmTranslator.custom.model` / `.baseUrl` | 自定义 OpenAI 兼容模型与接口地址 | 无 |
| `llmTranslator.gemini.model` / `.baseUrl` | Gemini 模型与接口地址 | `gemini-3.5-flash-lite` |
| `llmTranslator.doubao.model` / `.baseUrl` | 豆包模型与接口地址 | `doubao-seed-2-1-lite-260915` |
| `llmTranslator.minimax.model` / `.baseUrl` | MiniMax 模型与接口地址 | `MiniMax-M3` |
| `llmTranslator.grok.model` / `.baseUrl` | xAI Grok 模型与接口地址 | `grok-4.3` |

> API Key 不在设置中配置,而是通过 **LLM Translator: Set API Key** 命令加密保存。`baseUrl` 配置可指向兼容的代理或网关。

## 环境要求

- VS Code 1.85 或更高版本。
- 至少一个受支持服务商的 API Key。

## 许可证

[MIT](LICENSE)

### 文件联动与缓存

首次点击 🌐 打开翻译预览后，切换 Markdown 或 `SKILL.md`（Skill 语言）文件会自动更新译文。快速切换时会取消旧请求，旧文件的结果不会覆盖当前文件。关闭翻译预览即停止联动。

译文在当前扩展会话内缓存，最多保留最近生成的 20 个结果；相同文件内容、服务商、模型、接口地址和目标语言会复用结果。重启 VS Code 或重新加载窗口后缓存清空。文件内容或上述配置改变后会重新翻译；点击刷新可强制重新翻译。
