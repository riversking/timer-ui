import lazyLoading from './lazyLoading'
import { page404 } from '@/router/router'
import Main from '@/views/Main.vue';
export default (routers, data) => {
  /**
   * 动态路由获取服务端数据
   * component属性是一个字符串，或者可能连字段名都是其他的key
   * 这里要做一些转换
   */
  generaMenu(routers, data)
  routers.push(page404)
}
function generaMenu (routers, data) {
  data.forEach((item) => {
    let menu = Object.assign({}, item)
    // console.log(menu.component)
    if (menu.component === 'Main') {
      menu.component = Main
    } else {
      menu.component = lazyLoading(menu.component)
    }
    if (menu.children) {
      menu.children = []
      generaMenu(menu.children, item.children)
    }
    routers.push(menu)
  })
}
