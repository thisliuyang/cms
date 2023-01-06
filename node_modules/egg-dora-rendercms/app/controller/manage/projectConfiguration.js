const _ = require('lodash');
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;
const {
    siteFunc,
} = require('../../utils');


const projectConfigurationRule = (ctx) => {
    return {
        tableName: {
            type: "string",
            required: true,
            min: 2,
            max: 30,
            message: ctx.__("validate_error_field", [ctx.__("label_user_userName")])
        },
        localPath: {
            type: "string",
            required: true,
            message: ctx.__("validate_inputCorrect", [ctx.__("label_user_email")])
        },
        mongoLinkAdress: {
            type: "string",
            required: true,
            message: "invalid mongoLinkAdresse"
        },
        type: {
            type: "string",
            required: true,
            message: "invalid type"
        },
    }
}



let ProjectConfigurationController = {

    async list(ctx, app) {
        try {
            let payload = ctx.query;
            const projectConfigurations = await ctx.service.projectConfiguration.find(payload);

            ctx.helper.renderSuccess(ctx, {
                data: projectConfigurations
            });
        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

    async create(ctx, app) {


        try {
            let fields = ctx.request.body || {};

            const formObj = {
                tableName: fields.tableName,
                localPath: fields.localPath,
                mongoLinkAdress: fields.mongoLinkAdress,
                type: fields.type,
            }

            ctx.validate(projectConfigurationRule(ctx), formObj);


            await ctx.service.projectConfiguration.create(formObj);

            ctx.helper.renderSuccess(ctx);

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    },

    async getOne(ctx) {

        try {
            let _id = ctx.query.id;

            let targetItem = await ctx.service.projectConfiguration.item(ctx, {
                query: {
                    _id: _id
                }
            });

            ctx.helper.renderSuccess(ctx, {
                data: targetItem
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    },

    async update(ctx, app) {


        try {
            let fields = ctx.request.body || {};
            ctx.validate(projectConfigurationRule(ctx), {
                tableName: fields.tableName,
                localPath: fields.localPath,
                mongoLinkAdress: fields.mongoLinkAdress,
                type: fields.type,
            });

            const modelObj = {
                tableName: fields.tableName,
                localPath: fields.localPath,
                mongoLinkAdress: fields.mongoLinkAdress,
                type: fields.type,
            }

            await ctx.service.projectConfiguration.update(ctx, fields._id, modelObj);

            ctx.helper.renderSuccess(ctx);


        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },

    async removes(ctx) {

        try {
            let targetIds = ctx.query.ids;
            await ctx.service.projectConfiguration.removes(ctx, targetIds);
            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

    async translateWords(ctx) {

        try {
            let lang = ctx.query.lang;
            let targetWord = ctx.query.targetWord;

            let translateItem = await axios.get(`http://translate.google.cn/translate_a/single?client=gtx&dt=t&dj=1&ie=UTF-8&sl=zh-CN&tl=${encodeURI(lang)}&q=${encodeURI(targetWord)}`)
            let targetTrans = '';
            if (!_.isEmpty(translateItem) && translateItem.status == 200) {
                targetTrans = translateItem.data
            }

            ctx.helper.renderSuccess(ctx, {
                data: targetTrans
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

    async doRender(ctx, app) {

        try {
            let fields = ctx.request.body || {};

            let databaseInfo = fields.database; // 数据库信息
            let targetProPath = databaseInfo.localPath; // 本地目录
            let targetKey = fields.modelName.name; // 模块关键字
            let backPageCheck = fields.backPageCheck; // vue部分开关
            let serverControlCheck = fields.serverControlCheck; // 模型控制器部分开关
            let addInfoCheck = fields.addInfoCheck; // 新增按钮
            let searchModelCheck = fields.searchModelCheck; // 搜索框
            let propsInfo = fields.propsInfo; // 属性数组
            let modelName = fields.modelName; // 模型名称数组(多语言)
            let targetResource = fields.targetResource; // 数据库权限准备插入的节点

            let tCaseKey = siteFunc.renderKeyWord(targetKey); // 首字母大写
            let eggPluginKey = `egg-dora-${targetKey.toLowerCase()}`; // 首字母大写
            let allCaseKey = targetKey.toUpperCase();

            let assetsPath = path.resolve(__dirname, '../../assets');
            let vue_admin_source_path = `${assetsPath}/vue-admin-demo`;
            let vue_admin_target_source_path = `${targetProPath}/backstage`;
            let egg_plugin_source_path = `${assetsPath}/egg-dora-demo`;
            let egg_plugin_target_source_path = `${targetProPath}/lib/plugin`;

            // 文件清理
            if (fs.existsSync(`${vue_admin_target_source_path}/${targetKey}`)) {
                shell.rm('-rf', `${vue_admin_target_source_path}/${targetKey}`);
            }

            if (fs.existsSync(`${egg_plugin_target_source_path}/${eggPluginKey}`)) {
                shell.rm('-rf', `${egg_plugin_target_source_path}/${eggPluginKey}`);
            }

            // 拷贝资源文件
            shell.cp('-Rf', `${vue_admin_source_path}`, vue_admin_target_source_path);
            shell.cp('-Rf', `${egg_plugin_source_path}`, egg_plugin_target_source_path);


            // 文件或文件夹重命名
            fs.renameSync(`${vue_admin_target_source_path}/vue-admin-demo`, `${vue_admin_target_source_path}/${targetKey}`);
            fs.renameSync(`${egg_plugin_target_source_path}/egg-dora-demo`, `${egg_plugin_target_source_path}/${eggPluginKey}`);

            var vuePath = `${vue_admin_target_source_path}/${targetKey}`;
            var vue_api_path = `${vuePath}/src/api/helpCenter.js`;
            var vue_store_path = `${vuePath}/src/store/modules/helpCenter.js`;
            var vue_views_path = `${vuePath}/src/views/helpCenter`;

            fs.renameSync(`${vue_api_path}`, `${vuePath}/src/api/${targetKey}.js`);
            fs.renameSync(`${vue_store_path}`, `${vuePath}/src/store/modules/${targetKey}.js`);
            fs.renameSync(`${vue_views_path}`, `${vuePath}/src/views/${targetKey}`);

            var eggPluginPath = `${egg_plugin_target_source_path}/${eggPluginKey}`;
            // var egg_plugin_controller_api_path = `${eggPluginPath}/controller/api/helpCenter.js`;
            var egg_plugin_controller_manage_path = `${eggPluginPath}/app/controller/manage/helpCenter.js`;
            var egg_plugin_db_path = `${eggPluginPath}/app/db/helpCenters.json`;
            var egg_plugin_middleware_path = `${eggPluginPath}/app/middleware/helpCenterRouter.js`;
            var egg_plugin_model_path = `${eggPluginPath}/app/model/helpCenter.js`;
            var egg_plugin_service_path = `${eggPluginPath}/app/service/helpCenter.js`;

            fs.renameSync(`${egg_plugin_controller_manage_path}`, `${eggPluginPath}/app/controller/manage/${targetKey}.js`);
            fs.existsSync(egg_plugin_db_path) && fs.renameSync(`${egg_plugin_db_path}`, `${eggPluginPath}/app/db/${targetKey.toLowerCase()}s.json`);
            fs.renameSync(`${egg_plugin_middleware_path}`, `${eggPluginPath}/app/middleware/${targetKey}Router.js`);
            fs.renameSync(`${egg_plugin_model_path}`, `${eggPluginPath}/app/model/${targetKey}.js`);
            fs.renameSync(`${egg_plugin_service_path}`, `${eggPluginPath}/app/service/${targetKey}.js`);


            // 准备需要的组装字符串
            // 关于属性的字符串
            let modelStr = siteFunc.addModelProStr(propsInfo, targetKey);
            // 关键字批量修改
            let vueFileList = siteFunc.scanFolder(vuePath);
            for (const fileInfo of vueFileList) {
                let extendName = path.extname(fileInfo.name);
                if (extendName != '.svg' && extendName != '.ico') {

                    siteFunc.modifyFileByPath(fileInfo.path, 'helpCenter', targetKey);
                    siteFunc.modifyFileByPath(fileInfo.path, 'HelpCenter', tCaseKey);
                    siteFunc.modifyFileByPath(fileInfo.path, 'helpcenter', targetKey.toLowerCase());
                    siteFunc.modifyFileByPath(fileInfo.path, 'HELPCENTER', allCaseKey);

                    // 修改datatable
                    if ((fileInfo.path).indexOf(`/views/${targetKey}/dataTable.vue`) > 0) {
                        if (modelStr.dataTableStr) {
                            siteFunc.modifyFileByPath(fileInfo.path, '<!-- DATATABLEPROPS -->', modelStr.dataTableStr)
                        }
                    }

                    // 修改 form
                    if ((fileInfo.path).indexOf(`/views/${targetKey}/form.vue`) > 0) {
                        if (modelStr.formDataStr) {
                            siteFunc.modifyFileByPath(fileInfo.path, '<!-- FORMDATAPROPS -->', modelStr.formDataStr)
                        }
                    }

                    // 修改国际化
                    if ((fileInfo.path).indexOf(`/lang/zh.js`) > 0) {
                        if (modelStr.langStr) {
                            siteFunc.modifyFileByPath(fileInfo.path, '//LangEnd', modelStr.langStr)
                        }
                    }
                    if ((fileInfo.path).indexOf(`/lang/en.js`) > 0) {
                        if (modelStr.langStr_en) {
                            siteFunc.modifyFileByPath(fileInfo.path, '//LangEnd', modelStr.langStr_en)
                        }
                    }
                    if ((fileInfo.path).indexOf(`/lang/ja.js`) > 0) {
                        if (modelStr.langStr_jp) {
                            siteFunc.modifyFileByPath(fileInfo.path, '//LangEnd', modelStr.langStr_jp)
                        }
                    }

                    // form 修改
                    if ((fileInfo.path).indexOf(`/views/${targetKey}/form.vue`) > 0) {
                        if (modelStr.ruleStr) {
                            siteFunc.modifyFileByPath(fileInfo.path, '// CHECKFORMDATA', modelStr.ruleStr)
                        }
                    }

                    // pagination 修改
                    if ((fileInfo.path).indexOf(`/views/common/Pagination.vue`) > 0) {
                        if (modelStr.componentPaginationStr) {
                            siteFunc.modifyFileByPath(fileInfo.path, '//ComponentPaginationEnd', modelStr.componentPaginationStr)
                        }
                    }

                    // store modules 修改
                    if ((fileInfo.path).indexOf(`/store/modules/${targetKey}.js`) > 0) {
                        if (modelStr.storePropsStr) {
                            siteFunc.modifyFileByPath(fileInfo.path, '//STOREPROPSSTR', modelStr.storePropsStr)
                        }
                    }

                    // TOPBar 修改
                    if ((fileInfo.path).indexOf(`/views/common/TopBar.vue`) > 0) {
                        if (modelStr.addButtonStr) {
                            siteFunc.modifyFileByPath(fileInfo.path, '<!-- TOPBARLEFT -->', modelStr.addButtonStr)
                        }
                        if (modelStr.addButtonOptionStr) {
                            siteFunc.modifyFileByPath(fileInfo.path, '// TOPBARLEFTOPTION', modelStr.addButtonOptionStr)
                        }
                        if (modelStr.searchHtmlStr) {
                            siteFunc.modifyFileByPath(fileInfo.path, '<!-- TOPBARRIGHT -->', modelStr.searchHtmlStr)
                        }
                        if (modelStr.searchInputStr) {
                            siteFunc.modifyFileByPath(fileInfo.path, '// TOPBARRIGHTSEARCH', modelStr.searchInputStr)
                        }
                    }
                }
            }


            let eggPluginFileList = siteFunc.scanFolder(eggPluginPath);
            for (const fileInfo of eggPluginFileList) {
                let extendName = path.extname(fileInfo.name);
                if (extendName != '.svg' && extendName != '.ico') {

                    siteFunc.modifyFileByPath(fileInfo.path, 'helpCenter', targetKey);
                    siteFunc.modifyFileByPath(fileInfo.path, 'HelpCenter', tCaseKey);
                    siteFunc.modifyFileByPath(fileInfo.path, 'helpcenter', targetKey.toLowerCase());
                    siteFunc.modifyFileByPath(fileInfo.path, 'HELPCENTER', allCaseKey);

                    // 配置文件
                    if (fileInfo.name == 'config.default.js') {
                        if (modelName.zh) {
                            siteFunc.modifyFileByPath(fileInfo.path, '帮助', modelName.zh);
                        }
                    }

                    // console.log('--modelStr--', modelStr)
                    // 数据模型
                    if ((fileInfo.path).indexOf(`/model/${targetKey}.js`) > 0) {
                        // console.log('---111-')
                        if (modelStr.modelPropsStr) {
                            siteFunc.modifyFileByPath(fileInfo.path, '// MODELPROPS', modelStr.modelPropsStr)
                        }
                    }

                    // 控制器
                    if ((fileInfo.path).indexOf(`/controller/manage/${targetKey}.js`) > 0) {
                        // console.log('---222-')
                        if (modelStr.controllerPropsStr) {
                            siteFunc.modifyFileByPath(fileInfo.path, '// CONTROLLERROPS', modelStr.controllerPropsStr)
                        }
                        if (modelStr.validateStr) {
                            siteFunc.modifyFileByPath(fileInfo.path, '// VALIDATEPROPS', modelStr.validateStr)
                        }
                    }

                }
            }


            // 添加资源文件
            let targetResourceId = (targetResource.parentId)[(targetResource.parentId).length - 1];
            // 插入主菜单
            let thisParentId = await siteFunc.addDataToAdminResource(MongoClient, databaseInfo, {
                label: `${targetKey}Manage`,
                type: '0',
                api: '',
                parentId: targetResourceId,
                sortId: targetResource.sortId || 0,
                routePath: targetKey,
                icon: 'icon_service',
                componentPath: `${targetKey}/index`,
                enable: true,
                comments: `${modelName.zh}管理`,
            });
            // 插入功能菜单(获取列表)
            await siteFunc.addDataToAdminResource(MongoClient, databaseInfo, {
                label: `${targetKey}GetList`,
                type: '1',
                api: `${targetKey}/getList`,
                parentId: thisParentId,
                sortId: 1,
                routePath: '',
                icon: '',
                componentPath: '',
                enable: true,
                comments: `获取${modelName.zh}`,
            });
            // 插入功能菜单(获取单个)
            await siteFunc.addDataToAdminResource(MongoClient, databaseInfo, {
                label: `${targetKey}GetOne`,
                type: '1',
                api: `${targetKey}/getOne`,
                parentId: thisParentId,
                sortId: 2,
                routePath: '',
                icon: '',
                componentPath: '',
                enable: true,
                comments: `获取单个${modelName.zh}`,
            });
            // 插入功能菜单(新增)
            await siteFunc.addDataToAdminResource(MongoClient, databaseInfo, {
                label: `${targetKey}Add`,
                type: '1',
                api: `${targetKey}/addOne`,
                parentId: thisParentId,
                sortId: 3,
                routePath: '',
                icon: '',
                componentPath: '',
                enable: true,
                comments: `新增${modelName.zh}`,
            });
            // 插入功能菜单(修改)
            await siteFunc.addDataToAdminResource(MongoClient, databaseInfo, {
                label: `${targetKey}Modify`,
                type: '1',
                api: `${targetKey}/updateOne`,
                parentId: thisParentId,
                sortId: 4,
                routePath: '',
                icon: '',
                componentPath: '',
                enable: true,
                comments: `修改${modelName.zh}`,
            });
            // 插入功能菜单(删除)
            await siteFunc.addDataToAdminResource(MongoClient, databaseInfo, {
                label: `${targetKey}Delete`,
                type: '1',
                api: `${targetKey}/delete`,
                parentId: thisParentId,
                sortId: 5,
                routePath: '',
                icon: '',
                componentPath: '',
                enable: true,
                comments: `删除${modelName.zh}`,
            });

            // 修改配置文件
            let pluginConfigPath = path.join(targetProPath, `config/ext/config/${targetKey}.js`);
            let configDefaultPath = path.join(targetProPath, `config/ext/config/${targetKey}.js`);
            let pluginsConfig = `
            module.exports = {\n  
                enable: true,\n        package: '${eggPluginKey}',\n        path: path.join(__dirname, "../../../lib/plugin/${eggPluginKey}")
            };\n  
            `;
            let defaultConfig = `
            module.exports =  {\n
                match: [ctx => ctx.path.startsWith('/manage/${targetKey}')],\n
              },\n
            `;
            if (fs.existsSync(pluginConfigPath)) {
                siteFunc.createFileByStr(pluginConfigPath, pluginsConfig)
            }

            if (fs.existsSync(configDefaultPath)) {
                siteFunc.createFileByStr(configDefaultPath, defaultConfig)
            }

            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

    async getAdminResources(ctx, app) {

        let targetDB = ctx.query.tableName ? ctx.query.tableName : 'doracms2';
        let mongoLinkAdress = ctx.query.mongoLinkAdress;

        let targetItem = await ctx.service.projectConfiguration.item(ctx, {
            query: {
                tableName: targetDB
            }
        }) || {};

        if (!mongoLinkAdress && !targetItem.mongoLinkAdress) {
            throw new Error(ctx.__('validate_error_params'));
        }

        let linkAddress = mongoLinkAdress ? mongoLinkAdress : (!_.isEmpty(targetItem) ? targetItem.mongoLinkAdress : '');

        if (!linkAddress) {
            throw new Error(ctx.__('validate_error_params'));
        }

        var selectData = () => {
            return new Promise((resolve, reject) => {

                MongoClient.connect(linkAddress, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }, async function (err, client) {
                    if (err) {
                        throw new Error("数据库连接失败");
                    }
                    var db = client.db(targetDB);
                    //连接到表
                    var collection = db.collection('adminresources');
                    //查询数据
                    var whereStr = {};
                    collection.find(whereStr).sort({
                        sortId: 1
                    }).toArray(function (error, result) {

                        client.close();
                        if (error) {
                            console.log(error);
                            reject(error);
                        }
                        if (!_.isEmpty(result)) {
                            console.log("mongodb collect success: ", targetDB);
                            resolve(result);
                        } else {
                            reject('数据库连接失败！');
                        }

                    });
                });

            })
        }


        let dbResult = await selectData();
        ctx.helper.renderSuccess(ctx, {
            data: dbResult
        });

    }

}

module.exports = ProjectConfigurationController;