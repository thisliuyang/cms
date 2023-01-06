const _ = require('lodash');
const renderCmsAdminController = require('../controller/manage/projectConfiguration')

module.exports = (options, app) => {

    return async function renderCmsRouter(ctx, next) {

        let pluginConfig = app.config.doraRenderCms;
        await app.initPluginRouter(ctx, pluginConfig, renderCmsAdminController);
        await next();

    }

}