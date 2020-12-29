<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ConfirmCode />
  </div>
</template>

<script>
import ConfirmCode from "./Confirm_Code";
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  components: {
    ConfirmCode,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
