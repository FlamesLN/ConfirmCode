<template>
    <div class="upload_content" v-loading.body="loading">
        <input type="file" class="upload_file" ref="upload_file" accept=".xlsx, .xls" @change="changeUpload"/>
        <div class="upload_box" @dragenter="handleDrag" @drop="handleDrop" @dragover="handleDrag">
            Drag Excel document
            <!-- <slot></slot> -->
            <div class="btn_excel" @click="choiceFile">Add</div>
        </div>
    </div>
</template>
<script>
import XLSX from 'xlsx'
export default {
  name: "uploadFile",
  props: {
      onSuccess: {
          type: Function
      },
      beforeUpload: {
          type: Function
      }
  },
  data() {
      return {
          loading: false,
        //   sheetNames: [],
      }
  },
  methods: {
      choiceFile() {
          this.$refs.upload_file.click()
      },
      changeUpload(e) {
          let file = e.target.files[0]
          // 如果没有选择文件
          if(!file) return
        //   console.log(file)
          if(/\.(xlsx|xls|csv)$/.test(file.name)) { 
            this.upload(file)
          }else {
              alert('该文件不是excel文件')
              return
          }
      },
      // 上传文件
      upload(file) {
         // 这里大文件可用分块切片上传
         if(!this.beforeUpload) {
           this.readUploadFile(file)
           return
         }
         let bol = this.beforeUpload(file)
         if(bol) {
             this.readUploadFile(file)
         }
      },
      // 读取文件
      readUploadFile(file) {
         this.loading = true
         this.$refs.upload_file.value = null
         return new Promise((resolve, reject) => {
             const reader = new FileReader()
             // 文件读取完以后
             reader.onload = e => {
                 console.log('e', e)
                 // 获取文件
                 let target = e.target.result
                 // 读取excel主要是通过XLSX.read(data, {type: type});方法来实现
                 let worksheet = XLSX.read(target, {type: 'array'})
                 let sheetNames = worksheet['SheetNames']
                 let worksheets = worksheet['Sheets']
                //  console.log(worksheet)
                 let result = {}
                 for(let i of sheetNames) {
                    //  console.log(result[i])
                    result[i] = {}
                    //  console.log(XLSX.utils.sheet_to_json(worksheets[i]))
                     result[i].data = XLSX.utils.sheet_to_json(worksheets[i])
                     result[i].header = this.getHeader(worksheets[i])
                 }
                //  console.log(result)
                this.generateExcel(sheetNames, result)
                this.loading = false
                 resolve()
             }
             // 用于读取指定blob和file的内容
             // 读取完会触发load事件
             reader.readAsArrayBuffer(file)
         })
      },
      // 获取表单头部信息
      getHeader(sheet) {
          let header = []
          if(sheet['!ref']) {
         let range = XLSX.utils.decode_range(sheet['!ref'])
          // 定义第一行
          const R = range.s.r
          for(let i = range.s.c; i < range.e.c; i++) {
            const cell = sheet[XLSX.utils.encode_cell({c: i, r: R})]
            // 默认为空
            let hdr = 'UNKONWN' + i
            if(cell && cell.t) hdr = XLSX.utils.format_cell(cell)
            header.push(hdr) 
          }
          console.log(header)
          return header
          }
          else {return []}
      },
      // 传值给父元素
      generateExcel(sheetName, data) {
        this.onSuccess && this.onSuccess(sheetName, data)
      },
      handleDrop(e) {
          // 取消冒泡事件
        e.stopPropagation()
        e.preventDefault()
        //   console.log('drop', e)
        let file = e.dataTransfer.files
        if(file.length > 1) {
            alert('只能拖拽一个文件')
            return false
        }
        let rawfile = file[0]
        console.log(rawfile)
        if(/\.(xlsx|csv|xls)$/.test(rawfile.name)) {
          this.upload(rawfile)
          e.stopPropagation()
          e.preventDefault()
        }else {
            alert('不支持该文件类型')
        }
      },
      handleDrag(e) {
        e.stopPropagation()
        e.preventDefault()
        // 赋值属性
        e.dataTransfer.dropEffect = 'copy'
      }
  }
};
</script>
<style lang="scss" scoped>
.upload_content {
  .upload_box {
    position: relative;
    width: 360px;
    height: 180px;
    margin: 15px auto;
    border: 2px dashed rgb(9, 61, 61);
    border-radius: 4px;
    text-align: center;
    line-height: 180px;
    .btn_excel {
      position: absolute;
      top: 50%;
      right: 6%;
      transform: translateY(-50%);
      width: 60px;
      height: 30px;
      color: #fff;
      line-height: 30px;
      text-align: center;
      border-radius: 4px;
      background-color: rgba(87, 150, 214, 0.822);
      border: none;
      font-size: 16px;
      cursor: pointer;
    //   &:hover {
    //       background-color: #832929;
    //   }
      &:active {
          border: none;
      }
    }
  }
  .upload_file {
      display: none;
      z-index: -1;
  }
}
</style>
