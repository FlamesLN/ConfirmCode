<template>
    <div class="clipboard">
        <p v-clipboard:success="message_info" v-clipboard:copy="clipboard_msg">{{clipboard_msg}}</p>
        <el-button @click="clipboard_msg = 'Clipboard Update'" id="btn_clipboard">更改clipboard</el-button>
    </div>
</template>
<script>
export default {
    name: 'Clipboard',
    data() {
        return {
          clipboard_msg: 'Clipboard Message'
        }
    },
    methods: {
        message_info() {
          console.log('Clipboard')
        }
    }
}
</script>

