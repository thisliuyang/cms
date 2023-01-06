module.exports = app => {
    const mongoose = app.mongoose
    var shortid = require('shortid');
    var path = require('path');
    var Schema = mongoose.Schema;
    var moment = require('moment')

    var HelpCenterSchema = new Schema({
        _id: {
            type: String,
            'default': shortid.generate
        },
        createTime: {
            type: Date,
        },
        updateTime: {
            type: Date,
        },
        // MODELPROPS
    });

    HelpCenterSchema.set('toJSON', {
        getters: true,
        virtuals: true
    });
    HelpCenterSchema.set('toObject', {
        getters: true,
        virtuals: true
    });

    HelpCenterSchema.path('createTime').get(function (v) {
        return moment(v).format("YYYY-MM-DD HH:mm:ss");
    });
    HelpCenterSchema.path('updateTime').get(function (v) {
        return moment(v).format("YYYY-MM-DD HH:mm:ss");
    });

    return mongoose.model("HelpCenter", HelpCenterSchema, 'helpcenters');

}