'use strict'

/**
 * egg-dora-rendercms default config
 * @member Config#eggDoraRenderCms
 * @property {String} SOME_KEY - some description
 */

const pkgInfo = require('../package.json');
exports.doraRenderCms = {
    alias: 'renderCms', // 插件目录，必须为英文
    pkgName: 'egg-dora-rendercms', // 插件包名
    enName: 'doraRenderCms', // 插件名
    name: '插件生成', // 插件名称
    description: '插件生成', // 插件描述
    isadm: 1, // 是否有后台管理，1：有，0：没有，入口地址:'/ext/devteam/admin/index'
    isindex: 0, // 是否需要前台访问，1：需要，0：不需要,入口地址:'/ext/devteam/index/index'
    version: pkgInfo.version, // 版本号
    operationInstructions: "", // 操作说明
    iconName: 'icon_render', // 主菜单图标名称
    adminUrl: 'https://cdn.html-js.cn/cms/plugins/static/admin/renderCms/js/app.js',
    adminApi: [{
        url: 'renderCms/justdo',
        method: 'post',
        controllerName: 'doRender',
        details: '插件生成',
        noPower: true
    }, {
        url: 'renderCms/getProList',
        method: 'get',
        controllerName: 'list',
        details: '获取配置列表',
        noPower: true
    }, {
        url: 'renderCms/getAdminResources',
        method: 'get',
        controllerName: 'getAdminResources',
        details: '获取资源信息列表',
        noPower: true
    }, {
        url: 'renderCms/addOnePro',
        method: 'post',
        controllerName: 'create',
        details: '获取单条配置信息',
        noPower: true
    }, {
        url: 'renderCms/getOnePro',
        method: 'get',
        controllerName: 'getOne',
        details: '获取单条配置信息',
        noPower: true
    }, {
        url: 'renderCms/updateOnePro',
        method: 'post',
        controllerName: 'update',
        details: '更新配置信息',
        noPower: true
    }, {
        url: 'renderCms/deletePro',
        method: 'get',
        controllerName: 'removes',
        details: '删除配置',
        noPower: true
    }, {
        url: 'renderCms/translateWords',
        method: 'get',
        controllerName: 'translateWords',
        details: '词语翻译',
        noPower: true
    }],
    fontApi: [],
    initData: '', // 初始化数据脚本
    pluginsConfig: ` 
    module.exports = {\n
        enable: true,\n        package: 'egg-dora-rendercms',
    };\n
    `, // 插入到 plugins.js 中的配置
    defaultConfig: `
    module.exports = {\n
        match: [ctx => ctx.path.startsWith('/manage/renderCms')],\n
    },\n
    `, // 插入到 config.default.js 中的配置
}