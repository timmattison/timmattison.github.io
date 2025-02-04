import { generateSidebar } from 'vitepress-sidebar'
import { defineConfig } from 'vitepress'

const transformSidebarLinks = (prefix: string, sidebar: any[]) => {
    return sidebar.map(group => ({
        ...group,
        items: group.items.map(year => ({
            ...year,
            items: year.items.map(item => ({
                ...item,
                link: `${prefix}${item.link}`,
            })),
        })),
    }))
}

const transformSimpleSidebarLinks = (prefix: string, sidebar: any[]) => {
    return sidebar.map(group => ({
        ...group,
        items: group.items.map(item => ({
            ...item,
            link: `${prefix}${item.link}`,
        })),
    }))
}

const postsSidebarOptions = {
    documentRootPath: 'posts',
    rootGroupText: 'Posts',
    useTitleFromFrontmatter: true,
    includePath: true,
    collapsed: false,
    excludeFolders: ['old', 'boilerplate'],
    sortMenusByFrontmatterDate: true,
    sortMenusOrderByDescending: true,
    folderSort: (a: string, b: string) => {
        console.log(`Sorting folders: ${a} vs ${b}`)
        const yearA = parseInt(a)
        const yearB = parseInt(b)
        return yearB - yearA
    },
    convertSameNameSubFileToGroupIndexPage: true,
    manualSortFileNameByPriority: [],
}

const experimentsSidebarOptions = {
    documentRootPath: 'experiments',
    rootGroupText: 'Experiments',
    useTitleFromFrontmatter: true,
    includePath: true,
    collapsed: false,
    excludeFolders: ['old', 'boilerplate'],
    sortMenusByFrontmatterDate: true,
    sortMenusOrderByDescending: true,
    folderSort: (a: string, b: string) => {
        console.log(`Sorting folders: ${a} vs ${b}`)
        const yearA = parseInt(a)
        const yearB = parseInt(b)
        return yearB - yearA
    },
    convertSameNameSubFileToGroupIndexPage: true,
    manualSortFileNameByPriority: [],
}

const awesomeSidebarOptions = {
    documentRootPath: 'awesome',
    rootGroupText: 'Awesome',
    useTitleFromFrontmatter: true,
    includePath: true,
    collapsed: false,
    excludeFolders: ['old', 'boilerplate'],
    sortMenusByFrontmatterDate: true,
    sortMenusOrderByDescending: true,
    folderSort: (a: string, b: string) => {
        console.log(`Sorting folders: ${a} vs ${b}`)
        const yearA = parseInt(a)
        const yearB = parseInt(b)
        return yearB - yearA
    },
    convertSameNameSubFileToGroupIndexPage: true,
    manualSortFileNameByPriority: [],
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'Tim Mattison\'s blog',
    description: 'Proudly hacked together',

    themeConfig: {
        sidebar: {
            '/posts/': transformSidebarLinks('/posts/', generateSidebar(postsSidebarOptions)),
            '/experiments/': transformSidebarLinks('/experiments/', generateSidebar(experimentsSidebarOptions)),
            '/awesome/': transformSimpleSidebarLinks('/awesome/', generateSidebar(awesomeSidebarOptions)),
        },

        nav: [
            { text: 'Home', link: '/' },
            { text: 'Posts', link: '/posts/' },
            { text: 'Experiments', link: '/experiments/' },
            { text: 'Awesome', link: '/awesome/' },
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/timmattison' },
        ],
    },
})
