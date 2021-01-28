import Clipboard from 'clipboard'
if(!Clipboard) {
    throw new Error('You should install clipboard')
}
export default {
    // bind 只发生一次
    bind(el, binding) {
        // console.log(binding.value)
        // bingding--对象， el--所绑定元素，可直接操作DOM
        if(binding.arg === 'success') {
            // arg--传入的参数
            el._clipboard_success = binding.value
            // console.log(el._clipboard_success)
        }else if(binding.arg === 'error') {
            el._clipboard_error = binding.value
        }else {
            const clipboard = new Clipboard(el, {
              text() {return binding.value},
              action() {return binding.arg === 'copy' ? 'copy' : 'cut'}
            })
            // console.log(clipboard)
            clipboard.on('success', e => {
                let callback = e.trigger._clipboard_success
                // console.log(callback)
                // console.log(e)
                callback && callback(e)
            })
            clipboard.on('error', e => {
                let callback = e._clipboard_error
                callback && callback(e)
            })
            el._clipboard = clipboard
        }
    },
    update(el, binding) {
        if(binding.arg === 'success') {
            // arg--传入的参数
            el._clipboard_success = binding.value
        }else if(binding.arg === 'error') {
            el._clipboard_error = binding.value
        }else {
            // console.log('Update')
            // console.log(el._clipboard)
            el._clipboard.text = () => binding.value
            el._clipboard.action = () => binding.arg === 'copy'? 'copy': 'cut'
        }
    },
    unbind(el, binding) {
        if(binding.arg === 'success') {
            delete el._clipboard_success
        }else if(binding.arg === 'error') {
            delete el._clipboard_error
        }else {
            delete el._clipboard
        }
    }

}