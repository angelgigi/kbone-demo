/**
 * 配置参考：https://wechat-miniprogram.github.io/kbone/docs/config/
 */

module.exports = {
    origin: 'https://test.miniprogram.com',
    entry: '/',
    router: {
        home: [
            '/(home|index)?',
            '/index.html',
            '/test/(home|index)',
        ],
        other: [
            '/test/list/:id',
            '/test/detail/:id',
        ],
        order: [
            '/test/order/index',
        ]
    },
    redirect: {
        notFound: 'home',
        accessDenied: 'home',
    },
    generate: {
        autoBuildNpm: 'npm',
    },
    app: {
        backgroundTextStyle: 'dark',
        navigationBarTextStyle: 'white',
        navigationBarTitleText: 'kbone',
    },
    // 小程序
	appExtraConfig: {
        sitemapLocation: 'sitemap.json',
	},
    // 全局
    global: {
        share: true,
        windowScroll: false,
        backgroundColor: '#F7F7F7',
    },
    pages: {},
    // 分包
    optimization: {
		domSubTreeLevel: 10, // 节点最大层级
		scriptDataURI: 1024 * 1024, // 脚本最大体积
		scriptRuntime: 20000, // 脚本最大运行时长
		scriptExtract: true, // 脚本是否独立抽取
		scriptCombine: true, // 脚本是否独立合并
		scriptCompress: true, // 脚本是否压缩
		elementMultiplexing: true,
		textMultiplexing: true,
		commentMultiplexing: true,
		domExtendMultiplexing: true,
		styleValueReduce: 5000,
		attrValueReduce: 5000,
	},
    // 项目配置
    projectConfig: {
        projectname: 'kbone-template-vue',
        appid: '',
    },
}
