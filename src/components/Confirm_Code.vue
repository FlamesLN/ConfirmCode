<template>
  <div class="confirm_code">
    <canvas id="confirm_id" :width="contentWidth" :height="contentHeight"></canvas>
  </div>
</template>
<script>
export default {
  name: "Confrim_CODE",
  props: {
    // 字符串传值
    confirmNum: {
      type: String,
      default: "1234",
    },
    // 字体最小
    fontSizeMin: {
      type: Number,
      default: 16,
    },
    // 字体最大
    fontSizeMax: {
      type: Number,
      default: 40,
    },
    backgroundColorMin: {
      type: Number,
      default: 140,
    },
    backgroundColorMax: {
      type: Number,
      default: 250,
    },
    contentWidth: {
      type: Number,
      default: 220,
    },
    contentHeight: {
      type: Number,
      default: 80,
    },
    fontColorMax: {
      type: Number,
      default: 252,
    },
    fontColorMin: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      canvasId: null,
    };
  },
  mounted() {
    // this.canvasId = document.getElementById("confirm_id");
    this.drawCtx();
  },
  watch: {
    confirmNum: "drawCtx",
  },
  methods: {
    // 生成随机数(min-max)之间
    makeRandom(max, min) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    // 生成随机背景颜色
    makeBackgroundColor(max, min) {
      let r = this.makeRandom(max, min);
      let g = this.makeRandom(max, min);
      let b = this.makeRandom(max, min);
      return `rgb(${r},${g}, ${b})`;
    },
    // 绘制canvas
    drawCtx() {
      let canvasId = document.getElementById("confirm_id");
      let ctx = canvasId.getContext("2d");
      // 定义基线
      ctx.clearRect(0, 0, this.contentWidth, this.contentHeight);
      ctx.textBaseline = "bottom";
      // 绘制背景
      ctx.fillStyle = this.makeBackgroundColor(
        this.backgroundColorMax,
        this.backgroundColorMin
      );
      ctx.fillRect(0, 0, this.contentWidth, this.contentHeight);
      // 绘制文字
      // for ([char, index) of this.confirmNum) {
      //   console.log(index);
      //   this.drawText(ctx, char, index);
      // }
      for (let i = 0; i < this.confirmNum.length; i++) {
        this.drawText(ctx, this.confirmNum[i], i);
      }
      this.drawLine(ctx);
      this.drawDot(ctx);
    },
    // 绘制文字
    drawText(ctx, char, i) {
      ctx.fillStyle = this.makeBackgroundColor(this.fontColorMax, this.fontColorMin);
      ctx.font = `${this.makeRandom(this.fontSizeMax, this.fontSizeMin)}px makeRandom`;
      // 起点位置横坐标
      let x = (i + 1) * (this.contentWidth / (this.confirmNum.length + 1));
      let y = this.makeRandom(this.contentHeight - 5, this.fontSizeMax);
      // 旋转角度
      let dep = this.makeRandom(60, -60);
      // console.log("x", x, "y", y);
      ctx.translate(x, y);
      ctx.rotate((dep * Math.PI) / 180);
      ctx.fillText(char, 0, 0);
      //恢复坐标原点和旋转角度
      ctx.rotate((-dep * Math.PI) / 180);
      ctx.translate(-x, -y);
    },
    // 绘制干扰线
    drawLine(ctx) {
      // 定义干扰线条数
      let lineMax = Math.floor(Math.random() * (10 - 2) + 2);
      for (let i = 0; i <= lineMax; i++) {
        ctx.strokeStyle = this.makeBackgroundColor(this.fontColorMax, this.fontColorMin);
        ctx.beginPath();
        ctx.moveTo(
          this.makeRandom(this.contentWidth, 0),
          this.makeRandom(this.contentHeight, 0)
        );
        ctx.lineTo(
          this.makeRandom(this.contentWidth, 0),
          this.makeRandom(this.contentHeight, 0)
        );
        ctx.stroke();
      }
    },
    // 绘制干扰点
    drawDot(ctx) {
      let dotMax = Math.floor(Math.random() * (35 - 5) + 5);
      for (let i = 0; i <= dotMax; i++) {
        let radius = this.makeRandom(5, 1);
        ctx.beginPath();
        ctx.arc(
          this.makeRandom(0, this.contentWidth),
          this.makeRandom(0, this.contentHeight),
          radius,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = this.makeBackgroundColor(this.fontColorMax, this.fontColorMin);
        ctx.fill();
        ctx.stroke();
      }
    },
  },
};
</script>
