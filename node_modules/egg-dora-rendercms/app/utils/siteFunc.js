/*
 * @Author: doramart 
 * @Date: 2019-09-25 14:16:44 
 * @Last Modified by: doramart
 * @Last Modified time: 2020-07-28 17:44:10
 */

const MongoClient = require('mongodb').MongoClient;

const fs = require('fs')
const shortid = require('shortid')
const _ = require('lodash')
var siteFunc = {

    addModelProStr(propsInfo, keyWord = '') {

        let tCaseKey = this.renderKeyWord(keyWord); // 首字母大写

        let modelPropsStr = ``,
            controllerPropsStr = ``,
            storePropsStr = ``,
            validateStr = ``;
        // 添加form里的属性
        let formDataStr = ``;
        let dataTableStr = ``;

        // 国际化修改
        let langStr = `\n${keyWord}: {\n`;
        let langStr_en = `\n${keyWord}: {\n`;
        let langStr_tw = `\n${keyWord}: {\n`;
        let langStr_jp = `\n${keyWord}: {\n`;

        // 添加数据校验
        let ruleStr = ``;

        for (const propItem of propsInfo) {
            modelPropsStr += `${propItem.prop}: ${propItem.modelType},// ${propItem.comment} \n`;

            controllerPropsStr += `
     
        ${propItem.prop}:fields.${propItem.prop}, \n
  
      `;

            storePropsStr += `
     
        ${propItem.prop}:'', \n
  
      `;

            validateStr += `
        ${propItem.prop}: {
            type: "${propItem.modelType.toLowerCase()}",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("${propItem.comment}")])
        },\n
      `;

            formDataStr += `
        <el-form-item :label="$t('${keyWord}.${propItem.prop}')" prop="${propItem.prop}">\n
          <el-input size="small" v-model="dialogState.formData.${propItem.prop}"></el-input>\n
        </el-form-item>\n
      `;

            // 添加datatable里的属性
            dataTableStr += `
        <el-table-column prop="${propItem.prop}" :label="$t('${keyWord}.${propItem.prop}')">\n
        </el-table-column>\n
      `;

            langStr += `${propItem.prop}: '${propItem.comment}',\n`;
            langStr_en += `${propItem.prop}: '${propItem.comment_en}',\n`;
            langStr_tw += `${propItem.prop}: '${propItem.comment_tw}',\n`;
            langStr_jp += `${propItem.prop}: '${propItem.comment_jp}',\n`;


            ruleStr += `
        ${propItem.prop}: [\n
          {\n
            required: true,\n
            trigger: "blur"\n
          }\n
        ],\n
      `;

        }


        langStr += `createTime: '创建时间',\n},\n//LangEnd`;
        langStr_en += `createTime: 'Create time',\n},\n//LangEnd`;
        langStr_tw += `createTime: '創建時間',\n},\n//LangEnd`;
        langStr_jp += `createTime: '作成時間',\n},\n//LangEnd`;
        // this.modifyFileByPath(modelPath, '// MODELPROPS', modelPropsStr)
        // this.modifyFileByPath(controllerPath, '// CONTROLLERROPS', controllerPropsStr)
        // this.modifyFileByPath(controllerPath, '// VALIDATEPROPS', validateStr)
        // pagination 修改
        let componentPaginationStr = `this.$store.dispatch("${keyWord}/get${tCaseKey}List", {
            current: targetCurrent,
            pageSize,
            searchkey
          });\n//ComponentPaginationEnd
         `;

        // TOPBar
        let addButtonStr = `<el-button type="primary" size="small" plain round @click="add${tCaseKey}">
        <svg-icon icon-class="icon_add" />
      </el-button>\n<!-- TOPBARLEFT -->\n
          `;

        let addButtonOptionStr = `
          add${tCaseKey}() {\n
            this.$store.dispatch("${keyWord}/show${tCaseKey}Form");\n
          },\n// TOPBARLEFTOPTION\n
          `;


        //   搜索框
        let searchHtmlStr = `<el-input
        class="dr-searchInput"
        size="small"
        :placeholder="$t('main.name')"
        v-model="pageInfo.searchkey"
        suffix-icon="el-icon-search"
        @keyup.enter.native="searchResult"
      ></el-input>\n<!-- TOPBARRIGHT -->\n
        `;
        let searchInputStr = `searchResult(ev) {
            let searchkey = this.pageInfo ? this.pageInfo.searchkey : "";
            this.$store.dispatch("${keyWord}/get${tCaseKey}List", {
              searchkey
            });
          },// TOPBARRIGHTSEARCH
        `;






        return {
            modelPropsStr,
            controllerPropsStr,
            validateStr,
            formDataStr,
            dataTableStr,
            langStr,
            langStr_en,
            langStr_tw,
            langStr_jp,
            componentPaginationStr,
            addButtonStr,
            addButtonOptionStr,
            searchHtmlStr,
            searchInputStr,
            ruleStr,
            storePropsStr
        }
    },

    // 首字母大写
    renderKeyWord(str) {
        return (str.substr(0, 1)).toUpperCase() + str.substr(1, str.length);
    },

    // 插入数据到adminResource
    addDataToAdminResource(MongoClient, databaseInfo = {}, routerInfo) {

        return new Promise((resolve, reject) => {

            if (!_.isEmpty(routerInfo)) {
                let targetDB = databaseInfo.tableName ? databaseInfo.tableName : 'doracms2';
                MongoClient.connect(databaseInfo.mongoLinkAdress, {
                    useNewUrlParser: true
                }, function (err, client) {
                    console.log("连接成功: ", targetDB);
                    let db = client.db(targetDB);
                    var collection = db.collection('adminresources');
                    let currentId = shortid.generate();
                    routerInfo._id = currentId;
                    routerInfo.date = new Date();
                    collection.insertMany([
                        routerInfo
                    ], function (err, result) {
                        client.close();
                        if (err) {
                            resolve('');
                        } else {
                            resolve(currentId);
                        }
                    });
                });

            } else {
                resolve('');
            }

        })
    },

    modifyFileByPath(targetPath, replaceStr, targetStr) {
        var readText = fs.readFileSync(targetPath, 'utf-8');
        var reg = new RegExp(replaceStr, "g")
        var newRenderContent = readText.replace(reg, targetStr);
        fs.writeFileSync(targetPath, newRenderContent);
    },

    scanFolder(basePath) { //文件夹列表读取
        // 记录原始路径
        let filesList = [];
        let fileList = [],
            folderList = [],
            walk = function (basePath, fileList, folderList) {
                files = fs.readdirSync(basePath);
                files.forEach(function (item) {

                    let tmpPath = basePath + '/' + item,
                        stats = fs.statSync(tmpPath);

                    if (stats.isDirectory()) {
                        walk(tmpPath, fileList, folderList);
                    } else {
                        item.split('.')[0] && filesList.push({
                            name: item,
                            path: tmpPath
                        });
                    }

                });
            };

        walk(basePath, fileList, folderList);
        return filesList;
    },

    appendTxtToFileByLine(targetPath, line, targetStr) {
        const fileData = fs.readFileSync(targetPath, 'utf8').split('\n');
        fileData.splice(fileData.length - line, 0, targetStr);
        fs.writeFileSync(targetPath, fileData.join('\n'), 'utf8');
    },

    // 创建文件并写入
    createFileByStr(path, str) {
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
        if (path && str) {
            fs.writeFileSync(path, str, 'utf8')
        }
    }

};
module.exports = siteFunc;