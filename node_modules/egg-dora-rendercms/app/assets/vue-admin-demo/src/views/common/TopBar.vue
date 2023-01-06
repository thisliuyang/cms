<template>
  <div class="dr-toolbar">
    <el-col :xs="12" :md="18" class="option-button">
      <!-- TOPBARLEFT -->
    </el-col>
    <el-col :xs="12" :md="6" style="textAlign:right;">
      <!-- TOPBARRIGHT -->
    </el-col>
  </div>
</template>
<script>
import { bakUpCMSData } from "@/api/helpCenter";
export default {
  props: {
    device: String,
    pageInfo: Object,
    type: String,
    ids: Array
  },
  data() {
    return {
      selectUserList: [],
      searchkey: ""
    };
  },
  methods: {
    // TOPBARLEFTOPTION
    // TOPBARRIGHTSEARCH
  },
  components: {}
};
</script>
<style lang="scss">
</style>
