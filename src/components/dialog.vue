<template>
  <div>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="edialogVisible"
    :width="dialogWidth"
    :before-close="handleClose">
    <slot></slot>
  </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'dialog',
  data(){
    return{
      edialogVisible:true,
      dialogTitle:'修改用户',
      dialogWidth:'35%'
    }
  },
  mounted() {
    this.$bus.$on('dialogVisible',(value)=>{
      this.edialogVisible= value
    })
  },
  methods: {
    handleClose() {
      // 处理关闭对话框的逻辑
    }
  }
}
</script>

<style>
/* 可选的样式 */
</style>
