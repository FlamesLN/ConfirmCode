<template>
    <div class="drive">
        <div class="drive_box"></div>
        <transition name="info_box_animate"   
          v-on:enter="enter"
          v-on:after-enter="afterEnter"
          v-on:enter-cancelled="enterCancelled">
        <div class="info_box" v-show="show_alert" ref="drive_box"></div>
        </transition>
        <!-- <div class="alert_type"></div> -->
        <div class="info_alert_bottom" v-show="show_alert_cont" ref="drive_alert">
            <div class="title">{{alertTitle}}</div>
            <div class="message">{{alertMessage}}</div>
            <div class="btn">
                <span v-if="count !== 0" @click="preDom">上一个</span>
                <span v-if="count !== drive_arr.length - 1" @click="nextDom">下一个</span>
                <span @click="closeDom">关闭</span>
            </div>
        </div>
        </div>
</template>
<script>
import DriveMixin from '@/mixin/drive.js'
import {getDomOffsetLeft, getDomOffsetTop, isFixed} from '@/utils'
export default {
    name: 'Drive',
    mixins: [DriveMixin],
    data() {
        return {
            alertMessage: '',
            alertTitle: '',
            drive_arr: [],
            count: 0,
            show_alert: false,
            showDrive: true,
            oldDom: null,
            oldDom_pos: '',
            oldDom_zIndex: 0,
            alert_position: 'bottom',
            fixed_parent: [], // 父元素fixed定位DOM节点
            fixed_parentIndex: [] // 父元素fixed定位DOM节点zIndex属性
        }
    },
    created() {
    },
    computed:{
        documentWidth() {
            return document.documentElement.clientWidth
        },
        documentHeight() {
            return document.documentElement.clientHeight
        },
        async show_alert_cont() {
            // console.log('bol')
            let bol = await setTimeout(() => {
                return this.show_alert
            }, 1000)
            return bol
        }
    },
    watch: {
        // show_alert_cont(val) {
        //    console.log('111')
        //     // let bol =  setTimeout(() => {
        //     //     return this.show_alert
        //     // }, 1000)
        //     console.log('bol')
        //     deep: true
        // },
    },
    mounted() {
        this.$nextTick(() => {
            this.getElement()
        })
    },
    methods: {
        getElement() {
            if(this.drive_msg.length) {
              this.drive_arr = this.drive_msg
            }
            this.createEle(this.drive_arr[this.count])
        },
        createEle(dom) {
            let el_id = dom.id
            let oldDom = document.getElementById(el_id)
            this.oldDom = oldDom
            // 获取当前dom元素的position位置及宽高
            let dom_left = getDomOffsetLeft(oldDom)
            // console.log(dom_left)
            let dom_top = getDomOffsetTop(oldDom)
            let dom_width = oldDom.clientWidth === 0?oldDom.getBoundingClientRect().width:oldDom.clientWidth
            let dom_height = oldDom.clientHeight === 0?oldDom.getBoundingClientRect().height:oldDom.clientHeight
            this.alertMessage = dom.message
            this.alertTitle = dom.title
            this.createDom(dom_left, dom_top, dom_width, dom_height, oldDom)
        },
        // 创建节点
        createDom(left, top, width, height, oldDom) {
            width = Number(width)
            height = Number(height)
            let dom_style = {...window.getComputedStyle(oldDom)}
            this.borderTest(top, height, width, left)
             if(dom_style.position === 'static') {
              oldDom.style.position = 'relative'
            } 
            this.fixed_parent = isFixed(oldDom)
            this.fixed_parentIndex = []
            if(this.fixed_parent.length) {
                for(let i of this.fixed_parent) {
                    this.fixed_parentIndex.push(window.getComputedStyle(i).zIndex)
                    i.style.zIndex = 1000
                }
            }
            oldDom.style.zIndex = 1000
            console.log(left)
            Object.assign(this.$refs.drive_box.style, {
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`,
            })
            // 'unset'设置样式初始化类似于inital和继承
            if(this.alert_position === 'bottom') {
              Object.assign(this.$refs.drive_alert.style, {
                left: `${left}px`,
                top: `${top + height + 16}px`,
                right: `unset`,
                bottom: `unset`,
            })
            }else if(this.alert_position === 'right') {
               Object.assign(this.$refs.drive_alert.style, {
                right: `${this.documentWidth - left + 16}px`,
                top: `${top}px`,
                left: `unset`,
                bottom: `unset`
            }) 
            }else if(this.alert_position === 'top_left') {
                 Object.assign(this.$refs.drive_alert.style, {
                  left: `${left}px`,
                  bottom: `${this.documentHeight - top + 16}px`,
                  top: `unset`,
                  right: `unset`
              }) 
            }else if(this.alert_position === 'top_right') {
             Object.assign(this.$refs.drive_alert.style, {
                  right: `${this.documentWidth - left - width}px`,
                  bottom: `${this.documentHeight - top + 16}px`,
                  top: `unset`,
                  left: `unset`
              }) 
            }
            let className = `info_alert_${this.alert_position}`
            // 滚动距离
            let scrollTop = top - this.documentHeight > 0?top - this.documentHeight: 0
            if(scrollTop) {
                window.scrollTo({
                    top: scrollTop + height,
                    behavior: 'smooth'
                })
            }else {
               window.scrollTo({
                    top: scrollTop,
                    behavior: 'smooth'
                }) 
            }
            this.$refs.drive_alert.className = className
            this.oldDom_pos = dom_style.position
            this.oldDom_zIndex = dom_style.zIndex
            this.show_alert = true
        },
        // 关闭Dom
        closeDom() {
            if(this.oldDom) {
                this.oldDom.style.position = this.oldDom_pos
                this.oldDom.style.zIndex = this.oldDom_zIndex
            }
            this.$emit('showDrive', false)
        },
        // 上一个
        preDom() {
            this.count--
            if(this.oldDom) {
                this.oldDom.style.position = this.oldDom_pos
                this.oldDom.style.zIndex = this.oldDom_zIndex
            }
            // console.log(this.fixed_parentIndex)
           if(this.fixed_parentIndex.length && this.fixed_parentIndex.length) {
              for(let i = 0; i < this.fixed_parentIndex.length; i++) {
                //   console.log(this.fixed_parent[i])
                  this.fixed_parent[i].style.zIndex = this.fixed_parentIndex[i]
              }
            } 
            this.show_alert = false
            this.createEle(this.drive_arr[this.count])
        },
        // 下一个
        nextDom() {
            this.count++
            if(this.oldDom) {
                this.oldDom.style.position = this.oldDom_pos
                this.oldDom.style.zIndex = this.oldDom_zIndex
            }
            if(this.fixed_parentIndex.length && this.fixed_parentIndex.length) {
              for(let i = 0; i < this.fixed_parentIndex.length; i++) {
                  this.fixed_parent[i].style.zIndex = this.fixed_parentIndex[i]
              }
            } 
            this.show_alert = false
            this.createEle(this.drive_arr[this.count])
        },
        // 边界判断
        borderTest(top, height, width, left) {
        if(left + width > this.documentWidth - 240 && width < this.documentWidth / 2) {
            // console.log('AAAA')
            if(top + height < this.documentHeight - 200) {
              this.alert_position = 'right'
            }else {
                // console.log('EERR')
                this.alert_position = 'top_right'
            }
        }else {
            if(top + height < this.documentHeight - 200) {
                this.alert_position = 'bottom'
            }else {
                this.alert_position = 'top_left'
            }
         }
      },
      // enter动画钩子函数
      enter(el, down) {
        //   console.log('enter', el)
          el.style.transition = 'all 0.4s ease'
          down()
      },
      // afterEnter动画钩子函数
      afterEnter(el) {
        //   console.log('afterEnter', el)
      },
      // enterCancelled动画钩子函数
      enterCancelled(el) {
        //   console.log('enterCancelled', el)
      }
    }
}
</script>
<style lang="scss" scoped>
  .drive {
      .info_alert_bottom {
        //   border: 1px solid #000;
          border-radius: 4px;
          position: absolute;
          background-color: #fff;
          min-width: 200px;
          max-width: 340px;
          max-height: 240px;
          z-index: 1001;
          padding: 5px 8px;
          text-align: left;
          .btn {
              margin-top: 8px;
              display: flex;
              justify-content: space-around;
              align-items: center;
              margin-bottom: 5px;
              span {
                  display: inline-block;
                  margin-left: 3px;
                  border: 1px solid #eee;
                  font-size: 13px;
                  padding: 2px 4px;
                  border-radius: 4px;
                  padding: 2px 4px;
                  cursor: pointer;
                  &:hover {
                      background-color: rgb(53, 132, 221);
                      color: #fff;
                  }

              }
          }
          &:after {
              content: '';
              position: absolute;
              top: -10px;
              left: 6%;
              bottom: 100%;
              width: 0;
              height: 0;
              border-width: 0 6px 10px;
              border-style: solid;
              border-color: transparent transparent #fff;
          }
          .title {
              font-size: 18px;
              color: #000;
              font-weight: bold;
          }
          .message {
              font-size: 15px;
              margin-top: 8px;
          }
      }
      .info_alert_right {
          border-radius: 4px;
          position: absolute;
          background-color: #fff;
          min-width: 200px;
          max-width: 340px;
          max-height: 200px;
          z-index: 1001;
          padding: 5px 8px;
          text-align: left;
          .btn {
              margin-top: 8px;
              display: flex;
              justify-content: space-around;
              align-items: center;
              margin-bottom: 5px;
              span {
                  display: inline-block;
                  margin-left: 3px;
                  border: 1px solid #eee;
                  font-size: 13px;
                  padding: 2px 4px;
                  border-radius: 4px;
                  padding: 2px 4px;
                  cursor: pointer;
                  &:hover {
                      background-color: rgb(53, 132, 221);
                      color: #fff;
               }

              }
          }
          &:after {
              content: '';
              position: absolute;
              top: 6%;
              right: -10px;
              bottom: 100%;
              width: 0;
              height: 0;
              border-width: 6px 0 6px 10px;
              border-style: solid;
              border-color: transparent #fff transparent;
          }
          .title {
              font-size: 18px;
              color: #000;
              font-weight: bold;
          }
          .message {
              font-size: 15px;
              margin-top: 8px;
          }        
      }
      .info_alert_top_left {
          border-radius: 4px;
          position: absolute;
          background-color: #fff;
          min-width: 200px;
          max-width: 340px;
          max-height: 200px;
          z-index: 1001;
          padding: 5px 8px;
          text-align: left;
          .btn {
              margin-top: 8px;
              display: flex;
              justify-content: space-around;
              align-items: center;
              margin-bottom: 5px;
              span {
                  display: inline-block;
                  margin-left: 3px;
                  border: 1px solid #eee;
                  font-size: 13px;
                  padding: 2px 4px;
                  border-radius: 4px;
                  padding: 2px 4px;
                  cursor: pointer;
                  &:hover {
                      background-color: rgb(53, 132, 221);
                      color: #fff;
               }

              }
          }
          &:after {
              content: '';
              position: absolute;
              left: 6%;
              bottom: -10px;
            //   bottom: 100%;
              width: 0;
              height: 0;
              border-width: 10px 6px 0;
              border-style: solid;
              border-color: #fff transparent transparent transparent;
          }
          .title {
              font-size: 18px;
              color: #000;
              font-weight: bold;
          }
          .message {
              font-size: 15px;
              margin-top: 8px;
          }        
      }
     .info_alert_top_right {
          border-radius: 4px;
          position: absolute;
          background-color: #fff;
          min-width: 200px;
          max-width: 340px;
          max-height: 200px;
          z-index: 1001;
          padding: 5px 8px;
          text-align: left;
          .btn {
              margin-top: 8px;
              display: flex;
              justify-content: space-around;
              align-items: center;
              margin-bottom: 5px;
              span {
                  display: inline-block;
                  margin-left: 3px;
                  border: 1px solid #eee;
                  font-size: 13px;
                  padding: 2px 4px;
                  border-radius: 4px;
                  padding: 2px 4px;
                  cursor: pointer;
                  &:hover {
                      background-color: rgb(53, 132, 221);
                      color: #fff;
               }

              }
          }
          &:after {
              content: '';
              position: absolute;
              right: 6%;
              bottom: -10px;
            //   bottom: 100%;
              width: 0;
              height: 0;
              border-width: 10px 6px 0;
              border-style: solid;
              border-color: #fff transparent transparent transparent;
          }
          .title {
              font-size: 18px;
              color: #000;
              font-weight: bold;
          }
          .message {
              font-size: 15px;
              margin-top: 8px;
          }        
      }
      .info_box {
         position: absolute;
        //  border: 1px solid #eee;
         z-index: 999;
         opacity: 1;
         background-color: #fff;
         border-radius: 2px;
        //  padding: 5px 8px;
      }
      .drive_box {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 900; 
        background-color: #000;
        opacity: 0.75;
      }
    //   .info_box_animate-enter-active, .info_box_animate-leave-active {
    //      transition: all .1s
    //   }
  }
</style>

