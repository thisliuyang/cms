/*
 * @Author: doramart 
 * @Date: 2019-09-23 14:44:21 
 * @Last Modified by: doramart
 * @Last Modified time: 2020-08-01 17:05:44
 */

let DoraMiddleStageController = {


    async sendVerificationCode(ctx, app) {

        try {

            let params = ctx.request.body;
            let pluginItem = await ctx.helper.reqJsonData(app.config.doracms_api + '/api/singleUser/sendVerificationCode', params, 'post');
            ctx.helper.renderSuccess(ctx, {
                data: pluginItem
            });
        } catch (error) {
            ctx.helper.renderFail(ctx, {
                message: error
            });
        }

    },

    async doReg(ctx, app) {

        try {

            let params = ctx.request.body;
            let pluginItem = await ctx.helper.reqJsonData(app.config.doracms_api + '/api/singleUser/doReg', params, 'post');

            ctx.helper.renderSuccess(ctx, {
                data: pluginItem
            });
        } catch (error) {
            ctx.helper.renderFail(ctx, {
                message: error
            });
        }

    },

    async doLogin(ctx, app) {

        try {
            // '/api/singleUser/doLogin',
            let params = ctx.request.body;
            let pluginItem = await ctx.helper.reqJsonData(app.config.doracms_api + '/api/singleUser/doLogin', params, 'post');
            ctx.helper.renderSuccess(ctx, {
                data: pluginItem
            });
        } catch (error) {
            ctx.helper.renderFail(ctx, {
                message: error
            });
        }

    },

    async logOut(ctx, app) {

        try {

            let payload = ctx.query;
            if (!payload.singleUserToken) {
                throw new Error(ctx.__('validate_error_params'));
            }
            let pluginItem = await ctx.helper.reqJsonData(app.config.doracms_api + '/api/singleUser/logOut', {
                token: payload.singleUserToken
            });

            ctx.helper.renderSuccess(ctx, {
                data: pluginItem
            });
        } catch (error) {
            ctx.helper.renderFail(ctx, {
                message: error
            });
        }

    },

    async getUserInfo(ctx, app) {

        try {

            let payload = ctx.query;

            let pluginItem = await ctx.helper.reqJsonData(app.config.doracms_api + '/api/singleUser/userInfo', {
                token: payload.singleUserToken
            });

            ctx.helper.renderSuccess(ctx, {
                data: pluginItem
            });

        } catch (error) {
            ctx.helper.renderFail(ctx, {
                message: error
            });
        }

    },

    async getClientNotice(ctx, app) {

        try {

            let payload = ctx.query;

            let noticeList = await ctx.helper.reqJsonData(app.config.doracms_api + '/api/clientNotice/getList', payload);

            ctx.helper.renderSuccess(ctx, {
                data: noticeList
            });

        } catch (error) {
            ctx.helper.renderFail(ctx, {
                message: error
            });
        }

    },

    async getVersionMaintenanceInfo(ctx, app) {

        try {

            let payload = ctx.query;

            let noticeList = await ctx.helper.reqJsonData(app.config.doracms_api + '/api/versionMaintenance/getList', payload);

            ctx.helper.renderSuccess(ctx, {
                data: noticeList
            });

        } catch (error) {
            ctx.helper.renderFail(ctx, {
                message: error
            });
        }

    },

}

module.exports = DoraMiddleStageController;