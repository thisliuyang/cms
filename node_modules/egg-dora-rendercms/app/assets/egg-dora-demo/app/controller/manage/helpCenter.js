const xss = require("xss");
const _ = require('lodash');

const helpCenterRule = (ctx) => {
    return {
        // VALIDATEPROPS
    }
}



let HelpCenterController = {

    async list(ctx) {

        try {

            let payload = ctx.query;
            let queryObj = {};

            let helpCenterList = await ctx.service.helpCenter.find(payload, {
                query: queryObj,
            });

            ctx.helper.renderSuccess(ctx, {
                data: helpCenterList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    },

    async create(ctx) {


        try {

            let fields = ctx.request.body || {};
            const formObj = {
                // CONTROLLERROPS
                createTime: new Date()
            }


            ctx.validate(helpCenterRule(ctx), formObj);



            await ctx.service.helpCenter.create(formObj);

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

            let targetItem = await ctx.service.helpCenter.item(ctx, {
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


    async update(ctx) {


        try {

            let fields = ctx.request.body || {};
            const formObj = {
                // CONTROLLERROPS
                updateTime: new Date()
            }


            ctx.validate(helpCenterRule(ctx), formObj);



            await ctx.service.helpCenter.update(ctx, fields._id, formObj);

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
            await ctx.service.helpCenter.removes(ctx, targetIds);
            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

}

module.exports = HelpCenterController;