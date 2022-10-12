module.exports = {
    base: '/vuci/',
    title: 'vuci',
    locales: {
        '/': {
            lang: 'Englih'
        }
    },
    themeConfig: {
        repo: 'janenas-luk/vuci',
        locales: {
            '/': {
                selectText: 'Languages',
                nav: [
                    { text: 'Guide', link: '/guide/' },
                    { text: 'uci', link: '/uci/' }
                ]
            }
        },
        sidebar: {
            '/guide/': ['', 'compile', 'getting-started'],
            '/uci/': ['', 'components']
        }
    }
}