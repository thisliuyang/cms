/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: doramart
 * @Last Modified time: 2019-10-15 17:28:46
 */

'use strict';
const Service = require('egg').Service;
const path = require('path')
const _ = require('lodash')

// general是一个公共库，可用可不用
const {
    _list,
    _item,
    _count,
    _create,
    _update,
    _removes,
} = require(path.join(process.cwd(), 'app/service/general'));


class ProjectConfigurationService extends Service {

    async find(payload = {}, {
        query = {},
        searchKeys = [],
        populate = [],
        files = null
    } = {}) {

        let listdata = _list(this.ctx.model.ProjectConfiguration, payload, {
            query,
            searchKeys: !_.isEmpty(searchKeys) ? searchKeys : ['tableName'],
        });
        return listdata;

    }

    async count(params = {}) {
        return _count(this.ctx.model.ProjectConfiguration, params);
    }

    async create(payload) {
        return _create(this.ctx.model.ProjectConfiguration, payload);
    }

    async removes(res, values, key = '_id') {
        return _removes(res, this.ctx.model.ProjectConfiguration, values, key);
    }

    async update(res, _id, payload) {
        return _update(res, this.ctx.model.ProjectConfiguration, _id, payload);
    }

    async item(res, {
        query = {},
        populate = [],
        files = null
    } = {}) {
        return _item(res, this.ctx.model.ProjectConfiguration, {
            query,
        })
    }

}

module.exports = ProjectConfigurationService;