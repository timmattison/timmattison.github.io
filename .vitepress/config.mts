import { generateSidebar } from 'vitepress-sidebar'
import { defineConfig } from 'vitepress'

const vitepressSidebarOptions = {
    excludeFolders: ['old', 'boilerplate'],
    sortMenusByFrontmatterDate: true,
    sortMenusOrderByDescending: true,
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'Tim Mattison\'s blog',
    description: 'Proudly hacked together',
    themeConfig: {
        sidebar: generateSidebar(vitepressSidebarOptions),
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Posts', link: '/posts/' },
            { text: 'Experiments', link: '/experiments/' },
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/timmattison' },
        ],

        base: 'blog.timmattison.com/',
    },
})
