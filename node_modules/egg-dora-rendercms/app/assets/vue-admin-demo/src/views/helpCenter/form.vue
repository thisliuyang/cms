<template>
  <div class="dr-HelpCenterForm">
    <el-dialog
      :xs="20"
      :sm="20"
      :md="6"
      :lg="6"
      :xl="6"
      width="70%"
      title="编辑"
      :visible.sync="dialogState.show"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dialogState.formData"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
        :label-position="device == 'mobile' ? 'top' : 'right'"
      >
        <!-- FORMDATAPROPS -->
        <el-form-item>
          <el-button
            size="medium"
            type="primary"
            @click="submitForm('ruleForm')"
          >{{dialogState.edit ? $t('main.form_btnText_update') : $t('main.form_btnText_save')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { addHelpCenter, updateHelpCenter } from "@/api/helpCenter";

import _ from "lodash";
export default {
  props: {
    dialogState: Object,
    groups: Array,
    device: String
  },
  data() {
    return {
      rules: {
        // CHECKFORMDATA
      }
    };
  },
  components: {},
  methods: {
    confirm() {
      this.$store.dispatch("helpCenter/hideHelpCenterForm");
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = this.dialogState.formData;
          // 更新
          if (this.dialogState.edit) {
            updateHelpCenter(params).then(result => {
              if (result.status === 200) {
                this.$store.dispatch("helpCenter/hideHelpCenterForm");
                this.$store.dispatch("helpCenter/getHelpCenterList");
                this.$message({
                  message: this.$t("main.updateSuccess"),
                  type: "success"
                });
              } else {
                this.$message.error(result.message);
              }
            });
          } else {
            // 新增
            addHelpCenter(params).then(result => {
              if (result.status === 200) {
                this.$store.dispatch("helpCenter/hideHelpCenterForm");
                this.$store.dispatch("helpCenter/getHelpCenterList");
                this.$message({
                  message: this.$t("main.addSuccess"),
                  type: "success"
                });
              } else {
                this.$message.error(result.message);
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.edui-default .edui-toolbar {
  line-height: 20px !important;
}
</style>