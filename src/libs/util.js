import axios from 'axios'
import env from '../../build/env'
import semver from 'semver'
import packjson from '../../package.json'

let util = {

}
util.title = function (title) {
  title = title || 'Manager Dashboard'
  window.document.title = title
}

const ajaxUrl = env === 'development'
  ? 'http://127.0.0.1:8888'
  : env === 'production'
    ? 'https://www.url.com'
    : 'https://debug.url.com'

util.ajax = axios.create({
  baseURL: ajaxUrl,
  timeout: 30000
})

util.inOf = function (arr, targetArr) {
  let res = true
  arr.forEach(item => {
    if (targetArr.indexOf(item) < 0) {
      res = false
    }
  })
  return res
}

util.oneOf = function (ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true
  } else {
    return false
  }
}

util.showThisRoute = function (itAccess, currentAccess) {
  if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
    return util.oneOf(currentAccess, itAccess)
  } else {
    return itAccess === currentAccess
  }
}

util.getRouterObjByName = function (routers, name) {
  if (!name || !routers || !routers.length) {
    return null
  }
  // debugger;
  let routerObj = null
  for (let item of routers) {
    if (item.name === name) {
      return item
    }
    routerObj = util.getRouterObjByName(item.children, name)
    if (routerObj) {
      return routerObj
    }
  }
  return null
}

util.handleTitle = function (vm, item) {
  if (typeof item.title === 'object') {
    return vm.$t(item.title.i18n)
  } else {
    return item.title
  }
}

util.setCurrentPath = function (vm, name) {
  let title = ''
  let isOtherRouter = false
  vm.$store.state.app.routers.forEach(item => {
    if (item.children.length === 1) {
      if (item.children[0].name === name) {
        title = util.handleTitle(vm, item)
        if (item.name === 'otherRouter') {
          isOtherRouter = true
        }
      }
    } else {
      item.children.forEach(child => {
        if (child.name === name) {
          title = util.handleTitle(vm, child)
          if (item.name === 'otherRouter') {
            isOtherRouter = true
          }
        }
      })
    }
  })
  let currentPathArr = []
  if (name === 'home_index') {
    currentPathArr = [
      {
        title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
        path: '',
        name: 'home_index'
      }
    ]
  } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
    currentPathArr = [
      {
        title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
        path: '/home',
        name: 'home_index'
      },
      {
        title: title,
        path: '',
        name: name
      }
    ]
  } else {
    let currentPathObj = vm.$store.state.app.routers.filter(item => {
      if (item.children.length <= 1) {
        return item.children[0].name === name
      } else {
        let i = 0
        let childArr = item.children
        let len = childArr.length
        while (i < len) {
          if (childArr[i].name === name) {
            return true
          }
          i++
        }
        return false
      }
    })[0]
    if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
      currentPathArr = [
        {
          title: '首页',
          path: '',
          name: 'home_index'
        }
      ]
    } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
      currentPathArr = [
        {
          title: '首页',
          path: '/home',
          name: 'home_index'
        },
        {
          title: currentPathObj.title,
          path: '',
          name: name
        }
      ]
    } else {
      let childObj = currentPathObj.children.filter((child) => {
        return child.name === name
      })[0]
      currentPathArr = [
        {
          title: '首页',
          path: '/home',
          name: 'home_index'
        },
        {
          title: currentPathObj.title,
          path: '',
          name: currentPathObj.name
        },
        {
          title: childObj.title,
          path: currentPathObj.path + '/' + childObj.path,
          name: name
        }
      ]
    }
  }
  vm.$store.commit('setCurrentPath', currentPathArr)

  return currentPathArr
}

util.cmp = function (x, y) {
  if (x === y) {
    return true
  }

  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false
  }

  if (x.constructor !== y.constructor) {
    return false
  }

  for (let p in x) {
    if (x.hasOwnProperty(p)) {
      if (!y.hasOwnProperty(p)) {
        return false
      }

      if (x[ p ] === y[ p ]) {
        continue
      }

      if (typeof (x[ p ]) !== "object") {
        return false
      }

      if (!Object.equals(x[ p ], y[ p ])) {
        return false
      }
    }
  }

  for (let p in y) {
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
      return false
    }
  }
  return true
}

util.parseParam = function (param) {
  let tmp = []
  for (let key in param) {
    tmp.push(`${key}=${param[key]}`)
  }
  return tmp.join('&')
}

util.openNewPage = function (vm, name, argu, query) {
  let pageOpenedList = vm.$store.state.app.pageOpenedList
  let openedPageLen = pageOpenedList.length
  let i = 0
  let tagHasOpened = false
  // if (Object.keys(query).length > 0) {
  //   name += '?' + util.parseParam(query)
  //   console.log(name)
  // }
  while (i < openedPageLen) {
    if (name === pageOpenedList[i].name) { // 页面已经打开
      // let tmp = Object.assign({}, pageOpenedList[i].query)
      // if (Object.keys(query).length > 0 && util.cmp(query, tmp)) {
      //   console.log(tmp, query)
      //   // break
      // }
      // console.log(util.parseParam(query))
      vm.$store.commit('pageOpenedList', {
        index: i,
        // name: name,
        argu: argu,
        query: query
      })
      tagHasOpened = true
      break
    }
    i++
  }
  if (!tagHasOpened) {
    let tag = vm.$store.state.app.tagsList.filter((item) => {
      if (item.children) {
        return name === item.children[0].name
      } else {
        return name === item.name
      }
    })
    tag = tag[0]
    if (tag) {
      tag = tag.children ? tag.children[0] : tag
      if (argu) {
        tag.argu = argu
      }
      if (query) {
        tag.query = query
      }
      vm.$store.commit('increateTag', tag)
    }
  }
  vm.$store.commit('setCurrentPageName', name)
}

util.toDefaultPage = function (routers, name, route, next) {
  let len = routers.length
  let i = 0
  let notHandle = true
  while (i < len) {
    if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
      route.replace({
        name: routers[i].children[0].name
      })
      notHandle = false
      next()
      break
    }
    i++
  }
  if (notHandle) {
    next()
  }
}

util.fullscreenEvent = function (vm) {
  vm.$store.commit('initCachepage')
  // 权限菜单过滤相关
  vm.$store.commit('updateMenulist')
  // 全屏相关
}

util.checkUpdate = function (vm) {
  return true
  axios.get('https://api.idea-source.net/iadmin/releases/latest').then(res => {
    let version = res.data.tag_name
    vm.$Notice.config({
      duration: 0
    })
    if (semver.lt(packjson.version, version)) {
      vm.$Notice.info({
        title: 'iadmin更新啦',
        desc: '<p>iadmin更新到了' + version + '了</p>'
      })
    }
  })
}

util.getDataTableScrollY = (ref) => {
  if (typeof ref.offsetTop === 'undefined') {
    return 500
  }
  let height = window.innerHeight || document.body.clientHeight || document.body.clientHeight
  // console.log(height, offsetTop)
  let scrollY = 0
  if (height > 500) {
    scrollY = height - ref.offsetTop - 246
  }
  return scrollY
}

util.loadImg = (event) => {
  let obj = event.target
  if (obj.width / obj.height > 3) {
    obj.width = 50
    obj.removeAttribute("height")
  }
}
util.filterQuery = (currentObj, queryObj) => {
  if (!queryObj.hasOwnProperty('page')) {
    return
  }
  for (let key in currentObj) {
    switch (key) {
      case 'page':
      case 'pageSize':
        currentObj[key] = parseInt(queryObj[key], 10)
        break
      default:
        currentObj[key] = queryObj[key]
        break
    }
  }
}
util.randomLenNum = (len, date) => {
  let random = ''
  random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, typeof len === 'number' ? len : 4)
  if (date) random = random + Date.now()
  return random
}

util.formatDate = (date,fmt) => {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length);
}

export default util
