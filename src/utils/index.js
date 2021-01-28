// 获取元素相对于浏览器的left
// 若元素是fixed则其offsetParent为null
export const getDomOffsetLeft = (dom, offleft = 0) => {
    // if(dom === null ) {
    //     return offleft
    // }
    // // debugger
    // if(offleft === 0) {
    //     offleft = dom.offsetLeft
    //     // console.log(offleft)
    // }
    // // console.log(dom.offsetParent)
    // if(dom.offsetParent) {
    //     offleft += dom.offsetParent.offsetLeft
    // }
    // dom = dom.offsetParent
    // return getDomOffsetLeft(dom, offleft)
    return dom.getBoundingClientRect().left
}
// 获取元素相对于浏览器的top
export const getDomOffsetTop = (dom, offtop = 0) => {
    // debugger
    // if(dom === null) {
    //     return offtop
    // }
    // // console.log(dom.getBoundingClientRect())
    // if(offtop === 0) {
    //     offtop = dom.offsetTop
    // }
    // if(dom.offsetParent) {
    //     offtop += dom.offsetParent.offsetTop
    // }
    // dom = dom.offsetParent
    // return getDomOffsetTop(dom, offtop)
    return dom.getBoundingClientRect().top
}
// 判断父元素是否是fixed
export const isFixed = (dom, domObj = []) => {
    let parentDom = dom.parentNode 
    if(parentDom.nodeName === 'BODY') return domObj
    if(window.getComputedStyle(parentDom).position === 'fixed') {
        domObj.push(parentDom)
    }
    // console.log(parentDom)
    return arguments.callee(parentDom, domObj)
}
export default {
    getDomOffsetLeft,
    getDomOffsetTop,
    isFixed
}