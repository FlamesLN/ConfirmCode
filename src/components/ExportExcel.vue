<!--当前界面excel导出-->
<template>
    <div class="export_excel">
      <div class="btn_export" @click="export_excel">导出</div>
    </div>
</template>
<script>
import XLSX from 'xlsx'
import {Workbook} from '@/utils/excelExport'
export default {
    name: 'Export',
    props: {
        ele: {
            type: Element
        }
    },
    data() {
        return {
        }
    },
    created() {},
    methods: {
               // 获取当前元素下节点
           getElement() {
               // 获取th节点
             this.ele = this.ele || document
             console.log(this.ele)
             let th_node  = [].slice.call(this.ele.getElementsByTagName('th'))
             let tr_node = [].slice.call(this.ele.getElementsByTagName('tr'))
             // 获取td节点内容
             let table_td = {}
             // th节点内容
             let table_th = []
             if(th_node.length) {
                for(let i of th_node) {
                  if(i.textContent) {
                    table_th.push(i.textContent)
                  }else {
                      table_th.push(null)}
               }
             }
             if(tr_node.length) {
               if(tr_node.length > 1) {
                   for(let i = 1; i < tr_node.length; i++) {
                       table_td[i] = []
                       for(let j of tr_node[i].children) {
                           table_td[i].push(j.textContent)
                       }
                   }
               }else {
                   table_td[0] = Array(table_th.length)
               }
             }
             let aoa = []
             aoa.push(table_th)
             for(let i in table_td) {
                 aoa.push(table_td[i])
             }
             return aoa
           },
           // 点击事件
           export_excel() {
            //    this.$nextTick(() => {
                  this.excel_download(this.getElement())
            //    })
           },
           // 生成下载文件
           excel_download(str) {
               // 将二维数组转换为sheet
               let sheet = XLSX.utils.aoa_to_sheet(str)
               console.log('sheet', sheet)
               this.createDownload(this.sheet2blob(sheet), 'download.xlsx')
           },
           // sheet转blob
           sheet2blob(sheet, sheetName) {
               sheetName = sheetName || 'sheet1'
            //    let workbook = {
            //        SheetName: [sheetName],
            //        Sheets: {}
            //    }
            let workbook = new Workbook()
            // console.log(workbook)
               workbook.SheetNames.push(sheetName)
               workbook.Sheets[sheetName] = sheet
               console.log(workbook)
               debugger
               // 生成excel配置项
               let opt = {
                   bookType: 'xlsx',
                   bookSST: false, // 是否生成Shared String Table
                   type: 'binary'
               }
               let wok = XLSX.write(workbook, opt)
            //    console.log(wok)
               let blob = new Blob([this.str2arrarBuffer(wok)], {type: "application/octet-stream"})
               console.log(blob)
               return blob
           },
           // 字符串转ArrayBuffer
           str2arrarBuffer(str) {
               console.log(str)
              let buf = new ArrayBuffer(str.length)
              console.log(buf)
              let un8a = new Uint8Array(buf)
              for(let i = 0;i < str.length; i++) {
                un8a[i] = str.charCodeAt(i) & 0xFF
              }
              return un8a
           },
           // 生成下载链接
           createDownload(url, saveName="download.xlsx") {
              if(url && url instanceof Blob) {
                  url = URL.createObjectURL(url)
              }
              let link = document.createElement('a')
              let style = Object.assign({}, {
                  display: 'none',
              })
              link.href= url
              link.download = saveName
              link.style = style
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
           },
    },
}
</script>
<style lang="scss" scoped>
  .export_excel {
    .btn_export {
        width: 60px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        background-color: rgb(29, 133, 194);
        color: #fff;
        border-radius: 4px;
        font-size: 15px;
    } 
  } 
</style>
