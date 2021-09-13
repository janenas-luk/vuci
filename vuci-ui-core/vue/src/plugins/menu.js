import { rpc } from './rpc'
import axios from 'axios'

const menu = {}

function parseMenus (raw) {
  let menus = {}
  Object.keys(raw).forEach(m => {
    const paths = m.split('/')
    if (paths.length === 1) {
      menus[paths[0]] = raw[m]
    }
  })
  Object.keys(raw).sort((a, b) => a.length - b.length).forEach(m => {
    getMenuSubmenus(menus, m, raw[m])
  })

  menus = Object.keys(menus).map(k => {
    return { path: '/' + k, ...menus[k] }
  })

  menus.forEach(m => {
    getMenuPaths(m, m.path)
    sortMenuChildren(m)
  })

  menus.sort((a, b) => a.index - b.index)

  return menus.filter(m => m.children)
}

function sortMenuChildren (menu) {
  if (menu.children) {
    menu.children.forEach(child => {
      if (child.children) {
        sortMenuChildren(child)
      }
    })
    menu.children.sort((a, b) => a.index - b.index)
  }
}

function getMenuSubmenus (menus, menuObject, rawObject) {
  const [menu, ...submenu] = menuObject.split('/')
  if (submenu.length > 0 && menus[menu]) {
    if (!menus[menu].children) {
      menus[menu].children = {}
    }
    if (submenu.length > 1) {
      getSubmenuChildren(menus[menu].children[submenu[0]], menuObject.split('/').slice(-submenu.length + 1).join('/'), rawObject)
    } else {
      menus[menu].children[submenu[0]] = rawObject
    }
  }
}
function getSubmenuChildren (submenu, path, rawObject) {
  if (!submenu.children) {
    submenu.children = {}
  }
  const childMenu = path.split('/')
  if (childMenu.length > 1) {
    return getSubmenuChildren(childMenu[0], childMenu.slice(0, 1).join('/'), rawObject)
  }
  submenu.children[childMenu[0]] = rawObject
}
function getMenuPaths (menu, currentPath) {
  if (!menu.children) { return }
  menu.children = Object.keys(menu.children).map(k => {
    if (menu.children[k].children) {
      getMenuPaths(menu.children[k], `${menu.path}/${k}`)
    }
    return { path: `${currentPath}/${k}`, ...menu.children[k] }
  })
}

function buildRoute (menu) {
  return {
    path: menu.path,
    component: resolve => {
      try {
        return resolve(require(`@/views/${menu.view}`))
      } catch {
        axios.get(`/views/${menu.view}.js?_t=${new Date().getTime()}`).then(r => {
          // eslint-disable-next-line no-eval
          return resolve(eval(r.data))
        }).catch(() => {
          return resolve(require('@/components/404.vue'))
        })
      }
    },
    meta: {
      title: menu.title
    }
  }
}

function buildRoutes (menus) {
  const routes = []

  menus.forEach(menu => {
    const route = {
      path: '/',
      component: () =>
        import('@/components/VuciLayout'),
      meta: {
        title: menu.title
      },
      children: []
    }

    if (menu.view) {
      route.redirect = menu.path
      route.children.push(buildRoute(menu))
    } else if (menu.children) {
      getChildrenRoutes(route, menu)
    }
    routes.push(route)
  })

  return routes
}

function getChildrenRoutes (route, menu) {
  if (menu.children) {
    menu.children.forEach(submenu => {
      getChildrenRoutes(route, submenu)
    })
  } else {
    return route.children.push(buildRoute(menu))
  }
}

menu.load = function (cb) {
  rpc.call('ui', 'menu').then(r => {
    const menus = parseMenus(r.menu)
    const routes = buildRoutes(menus)
    cb(menus, routes)
  })
}

export default {
  install (Vue) {
    Vue.prototype.$menu = menu
  }
}
