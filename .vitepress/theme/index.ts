import DefaultTheme from 'vitepress/theme'
import './custom.css'
import { install } from 'element-plus'
import 'element-plus/dist/index.css'

// Guidance from https://github.com/vuejs/vitepress/issues/603
export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        install(app)
    },
}
