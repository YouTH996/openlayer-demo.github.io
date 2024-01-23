<template>
  <div id="search-box">
    <el-input v-model="kw" style="width: 445px"></el-input>
    <el-button icon="el-icon-search" type="primary"></el-button>
  </div>
</template>
<script>
export default {
  name:"search_box",
  data(){
    return{
      kw:''
    }
  },
  methods:{
    dataFormSubmit(){

    }
  }

}
</script>



<style>
#search-box{
  position: absolute;
  top: 20px;
  left: 20px;
}
</style>
