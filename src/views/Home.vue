<template>
  <div class="home">
    <h1>Home</h1>
    <input type="text" v-model="textContent" />
    <div class="btn" @click="confirm">确认</div>
    <div class="confirm" @click="getCode">
      <ConfirmCode :confirmNum="confirmCode" class="confirm_code" />
    </div>
  </div>
</template>
<script>
import ConfirmCode from "@/components/Confirm_Code";
export default {
  name: "Home",
  components: {
    ConfirmCode,
  },
  data() {
    return {
      textContent: "",
      confirmCode: "",
      count: 0,
    };
  },
  created() {
    this.getCode();
  },
  mounted() {},
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
  },
};
</script>

<style lang="scss" scoped>
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
</style>
