module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    var shortid = require('shortid');
    var moment = require('moment')

    var ProjectConfigurationSchema = new Schema({
        _id: {
            type: String,
            'default': shortid.generate
        },
        date: {
            type: Date,
            default: Date.now
        },
        tableName: {
            type: String,
            unique: true
        }, // 表名 
        localPath: String, // 本地路径 
        type: String, // 项目类型 
        mongoLinkAdress: {
            type: String,
            default: 'mongodb://localhost:27017/doracms2'
        }

    });

    ProjectConfigurationSchema.set('toJSON', {
        getters: true,
        virtuals: true
    });
    ProjectConfigurationSchema.set('toObject', {
        getters: true,
        virtuals: true
    });

    ProjectConfigurationSchema.path('date').get(function (v) {
        return moment(v).format("YYYY-MM-DD HH:mm:ss");
    });


    return mongoose.model("ProjectConfiguration", ProjectConfigurationSchema);
};