<template>
    <div class="part_1" id="part_1">
        <h3>{{common_message}}</h3>
        <el-button @click="common_message = 'This is new Message'" size="mini">更改</el-button>
        </div>
</template>
<script>
import common_mixin from '@/mixin/common.js'
export default {
    name: 'Part1',
    mixins:[common_mixin],
    data() {
        return {
           
        }
    },
    created() {
        console.log('BBBBB')
    }
}
</script>
