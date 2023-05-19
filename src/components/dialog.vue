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
      edialogVisible:false,
      dialogTitle:'',
      dialogWidth:''
    }
  },
  mounted() {
    this.$bus.$on('dialogVisible',(edialogVisible)=>{
      this.edialogVisible=edialogVisible,
      this.dialogTitle=dialogTitle,
      this.width=dialogWidth

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
