import { generateSidebar } from 'vitepress-sidebar'
import { defineConfig } from 'vitepress'

const postsSidebarOptions = {
    documentRootPath: 'posts',
    excludeFolders: ['old', 'boilerplate'],
    sortMenusByFrontmatterDate: true,
    sortMenusOrderByDescending: true,
    folderSort: (a: string, b: string) => {
        console.log(`Sorting folders: ${a} vs ${b}`);
        // Extract years and convert to numbers
        const yearA = parseInt(a);
        const yearB = parseInt(b);
        // Sort in descending order
        return yearB - yearA;
    }
}

const experimentsSidebarOptions = {
    documentRootPath: 'experiments',
    excludeFolders: ['old', 'boilerplate'],
    sortMenusByFrontmatterDate: true,
    sortMenusOrderByDescending: true,
    folderSort: (a: string, b: string) => {
        console.log(`Sorting folders: ${a} vs ${b}`);
        const yearA = parseInt(a);
        const yearB = parseInt(b);
        return yearB - yearA;
    }
}

const awesomeSidebarOptions = {
    documentRootPath: 'awesome',
    excludeFolders: ['old', 'boilerplate'],
    sortMenusByFrontmatterDate: true,
    sortMenusOrderByDescending: true
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'Tim Mattison\'s blog',
    description: 'Proudly hacked together',
    themeConfig: {
        sidebar: {
            '/posts/': generateSidebar(postsSidebarOptions),
            '/experiments/': generateSidebar(experimentsSidebarOptions),
            '/awesome/': generateSidebar(awesomeSidebarOptions),
        },

        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Posts', link: '/posts/' },
            { text: 'Experiments', link: '/experiments/' },
            { text: 'Awesome', link: '/awesome/' },
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/timmattison' },
        ],

        base: 'blog.timmattison.com/',
    },
})