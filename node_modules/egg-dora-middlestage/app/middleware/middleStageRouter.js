const _ = require('lodash');

const doraMiddleStageAdminController = require('../controller/manage/middleStage')

module.exports = (options, app) => {

    return async function doraMiddleStageRouter(ctx, next) {

        let pluginConfig = app.config.doraMiddleStage;
        await app.initPluginRouter(ctx, pluginConfig, doraMiddleStageAdminController);
        await next();

    }

}