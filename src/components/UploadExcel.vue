<template>
  <div class="uploadExcel">
      <el-select v-model="sheetOpt" v-if="sheetName.length" @change="changeTable">
          <el-option v-for="item in sheetName" :key="item" :label="item" :value="item"></el-option>
      </el-select>
     <excel-content class="upload_content" :on-success="getTableData" :before-upload="beforeUpload">
         <!-- <button class="btn_excel">Add</button> -->
     </excel-content>
     <!-- <table v-if="table_data.length">
         <tr>
             <th v-for="head_item in table_head" :key="head_item">
                {{head_item}}
             </th>
         </tr>
         <tr v-for="con_item in table_data" :key="con_item">
            <td v-for="(td_item, index) in con_item" :key="td_item">{{td_item[table_head[index]]}}</td>
         </tr>
     </table> -->
         <export-excel :ele="ele"></export-excel>
     <el-table :data="table_data" border style="width: 100; margin-top: 15px" id="el_table">
       <el-table-column v-for="item in table_head" :key="item" :label="item" :prop="item"></el-table-column>
     </el-table>
     <!-- <p v-if="!table_data.length">No Data</p> -->
  </div>    
</template>
<script>
import ExcelContent from './UploadExcelCon.vue'
import ExportExcel from '@/components/ExportExcel.vue'
export default {
    name: 'uploadExcel',
    data() {
        return {
          table_head: [], // 标题头
          table_data: [], // 表内容
          sheetName: [], // sheet信息
          result: {}, // 列表信息
          sheetOpt: '',
          ele: null
        }
    },
    components: {
      ExcelContent,
      ExportExcel
    },
    mounted() {
        this.ele = document.getElementById('el_table')
    },
    methods: {
        getTableData(sheetName, data) {
          this.sheetName = [].slice.call(sheetName)
          this.result = data
          this.sheetOpt = sheetName[0]
          this.table_head = this.result[this.sheetOpt].header
          this.table_data = this.result[this.sheetOpt].data
        //   for(let i of this.table_head) {
        //       this.table_data.push(tab_data[i])
        //   }
        //   console.log(this.sheetName)
        //   console.log(this.table_head)
        //   console.log(this.table_data)
        console.log(document.getElementsByTagName('tr'))
        },
        changeTable() {
          this.table_head = this.result[this.sheetOpt].header
          this.table_data = this.result[this.sheetOpt].data
        },
        beforeUpload(val) {
           let maxSize = val.size / 1024 / 1024 < 3
           if(maxSize) {
               return true
           }
           alert('文件大小不能超过3M')
           return false
        }
    }
}
</script>
<style lang="scss" scoped>
.uploadExcel {
    .upload_content {
     position: relative;
    }
    p {
        font-size: 22px;
        color: #eee;
        text-align: center;
        margin-top: 12px;
    }
//   .btn_excel {
//     position: absolute;
//     top: 50%;
//     right: 10%;
//     transform: translateY(-50%);
//     width: 60px;
//     height: 30px;
//     color: #fff;
//     line-height: 30px;
//     text-align: center;
//     border-radius: 4px;
//     background-color: rgba(87, 150, 214, 0.822);
//     border: none;
//     font-size: 16px;
//   }
}
</style>

