<template>
  <div class="home">
      <Part1 />
      <Part2 />
      <drive v-if="showdrive" @showDrive="showDrive"/>
    <!--<input type="text" v-model="textContent" />
    <div class="btn" @click="confirm">确认</div>
    <div class="confirm" @click="getCode">
      <ConfirmCode :confirmNum="confirmCode" class="confirm_code" />
    </div> -->
    <!-- <upload-excel></upload-excel> -->
    <clipboard></clipboard>
    <div class="right_h">
      <h3 class="right_con" id="right_con">This is right Content</h3>
    </div>
    <div class="bottom_con"><span><div id="bottom_con">This is bottom ContentMdsadsadadsadada<br/>dadadsaa</div></span>
    <div class="bottom_co">HAHAHHALLL</div>
    </div>
    <!-- <HappyYear class="new_year" />
    <ThreeCircle />
    <ul>
      <li v-for="item in dataList" :key="item">
        {{ item }}
      </li>
    </ul>
    <button @click="changeItem">改变</button>
    <p>{{ title.text.p }}</p> -->
  </div>
</template>
<script>
import ConfirmCode from "@/components/Confirm_Code";
import HappyYear from "../components/HappyYear.vue";
// import ThreeCircle from "@/ThreeCircle";
import UploadExcel from '@/components/UploadExcel.vue'
import Clipboard from '@/components/Clipboard'
import Part1 from '@/components/mixin/Part1'
import Part2 from '@/components/mixin/Part2'
import Drive from '@/components/Drive/Index.vue'
// import Driver from "driver.js" // import driver.js
// import "driver.js/dist/driver.min.css" // import driver.js css
export default {
  name: "Home",
  components: {
    ConfirmCode,
    HappyYear,
    // ThreeCircle,
    UploadExcel,
    Clipboard,
    Part1,
    Part2,
    Drive
  },
  data() {
    return {
      textContent: "",
      driver: null,
      confirmCode: "",
      count: 0,
      dataList: ["小红", "小蓝", "小绿", "小紫"],
      title: {
        text: {
          p: "哈哈哈哈",
        },
      },
      showdrive: true,
      steps: [
        {
         element: "#bottom_con",
         popover: {
         title: "菜单导航",
         description: "点击菜单可切换右侧菜单内容",
         position: "bottom"
    }
  },
      ]
    };
  },
  beforeCreate() {
    // console.log(this);
  },
  created() {
    // this.getCode();
  },
  beforeMount() {},
  mounted() {
    // this.driver = new Driver({
    //   className: "scoped-class", // className to wrap driver.js popover
    //   animate: true, // Animate while changing highlighted element
    //   opacity: 0.75, // Background opacity (0 means only popovers and without overlay)
    //   padding: 10, // Distance of element from around the edges
    //   allowClose: true, // Whether clicking on overlay should close or not
    //   overlayClickNext: false, // Should it move to next step on overlay click
    //   doneBtnText: "完成", // Text on the final button
    //   closeBtnText: "关闭", // Text on the close button for this step
    //   nextBtnText: "下一步", // Next button text for this step
    //   prevBtnText: "上一步" // Previous button text for this step
    //   // Calledwhen moving to next step on any step
    // })
    // this.guide()
  },
  beforeUpdate() {},
  updated() {
    console.log("DOM");
  },
  // mounted() {},
  methods: {
    getCode() {
      this.count = 0;
      this.confirmCode = Math.random().toString(36).slice(2, 6);
      console.log(this.confirmCode);
      // console.log(Math.random().toString(36).slice(2, 6));
      // renturn(Math.random().toString(36).slice(2, 6));
    },
    confirm() {
      // alert("aaa");
      if (this.textContent === this.confirmCode) {
        alert("验证成功");
      } else {
        alert("验证失败");
        this.count++;
      }
      if ((this.count = 3)) {
        this.getCode();
        this.textContent = "";
      }
    },
    changeItem() {
      // this.$set(this.dataList, 2, "阿香");
      this.title.text.p = "嘻嘻嘻";
      // this.dataList[2] = "阿香";
    },
    showDrive(el) {
      this.showdrive = el
    },
    guide () {
      this.driver.defineSteps(this.steps)
      this.driver.start()
    }

  },
};
</script>

<style lang="scss" scoped>
// body {
//   background-color: #000;
// }
.home {
  // background-color: #000;
  overflow: auto;
}
.confirm {
  margin: 10px 0;
}
.btn {
  display: inline-block;
  width: 80px;
  height: 30px;
  color: #fff;
  background-color: #1890ff;
  border-radius: 4px;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    background-color: cadetblue;
  }
}
.new_year {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
.right_con {
  float: left;
}
.bottom_con {
  position: fixed;
  top: 600px;
  // left: 20px;
  // height: 100px;
  width: 300px;
  // z-index: -1;
  // transform: translateZ(100px);
  // left: 50px;
  span {
    position: fixed;
    top: 10px;
    // float: left;
    // display: inline-block;
    width: 300px;
    // height: 20px;
    div {
      float: right;
    }
  }
}
</style>
