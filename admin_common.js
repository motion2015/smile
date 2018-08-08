import{code} from '~/static/code.json'
// datatable tree
export function adminDataTreeConvert (data, adminId) {
    // console.log('adminDataTreeConvert')
    const convResult = []
    const obj = {}
    let groupClass = 'adminR'
    const parent = data.filter((itm) => {
        return itm.admin_id === adminId
    })
    obj.label = parent[0].admin_name
    obj.admin_id = parent[0].admin_id
    if (parent[0].admin_type % 2 === 0) {
        groupClass = 'adminB'
    }
    // obj.name = '<span class="jsgrid-cell-child ${groupClass}">${parent[0].admin_name}</span>'
    obj.groupClass = groupClass
    obj.name = `${parent[0].admin_name}`
    obj.label = parent[0].lv
    if (parent[0].avatar !== undefined)  {
        obj.avatar = parent[0].avatar
    }
    if (parent[0].icon !== undefined) {
        obj.icon = parent[0].icon
    }
    if (parent[0].img !== undefined) {
        obj.img = parent[0].img
    }
    obj.header = 'custom'
    // children data
    const child = data.filter((itm) => {
        return itm.parent_admin_id === adminId
    })

    if (child.length > 0) {
        obj.children = []
        child.forEach((itm) => {
            const objChild = adminDataTreeConvert(data, item.admin_id)
            obj.children.push(objChild[0])
        })
    }
    convResult.push(obj)
    // console.log(obj.name, convResult)
    return convResult
}

export function getParentTreeItem (orgData, data, parentId) {
    const $Parent = orgData.filter((itm) => {
        return itm.admin_id === parentId
    })
    if ($Parent.length > 0) {
        if (!data.includes($Parent[0])) {
            data.push($Parent[0])
        }
        const $parentsData = orgData.filter((itm) => {
            return itm.admin_id < parentId
        })
        if ($parentsData.length > 0) {
            $parentsData.forEach(() => {
                getParentTreeItem(orgData, data, $parent[0].parent_admin_id)
            })
        }
    }
    return data
}

export function setChildValChange(v, chng) {
    Object.keys(chng).forEach((item) => {
        v[item] = chng[item]
    })

    if (Object.keys(v).includes('children')) {
        v.children.forEach((item, index) => {
            v.children[index] = setChildValChange(item, chng)
        })
    }
    return v
}
// adminTree path 정보 가져오기
// v : admingroup tree, id : admin_id
export function arrFullPathName (v, id) {
    const temp =[]
    const PathName =[]
    if (_.isArray(v)) {
        v.forEach((item) => {
            const s = arrFullPathName(item, id)
            s.forEach(d => {
                temp.push(d)
            })
        })
    } else {
        if (v.admin_id === id) {
            temp.push(v.name)
        }
        if (Object.keys(v).includes('children')) {
            v.children.forEach((item) => {
                const ar = arrFullPathName(item, id)
                ar.forEach(d => {
                    temp.push(d)
                })
                if (_.isArray(ar) && ar.length > 0) {
                    pathName.unshift(v.name)
                }
            })
        }
    }
    return pathName.concat(temp)
}






























export function ParseErrorMessage (val) {
    const msg = val.match(/(\d+[^:])\s*:s*\{['"](.+)['"]\}/)
    if (typeof val === 'string') {
        if(msg !== null) {
            return '${msg[1]} - ${msg[2]}'
        }else {
            return val
        }
    }
    return ''
}
export function fnIsBlank (val) {
    if (!val) {
        return true
    }
    if (val === 'undefined') {
        return true
    }
    if (val === '') {
        return true
    }
    const isBlank = /^\s+$/g
    if (isBlank.test(val)) {
        return true
    }
    return false
}
// 공통코드 리스트
export function fnGetCodeList (groupKey) {
    const _code = code.filter(item => {
        return item.group_key === groupKey
    })
    if (_code.length > 0) {
        return _code[0].list.filter(item => {
            item.value = item.keys
            item.label = item.val
            return item
        })
    }
    return []
}
// 공통코드 > 그룹에 존재하는 키값
export function fnGetCodeVal (groupKey, key) {
    const list = fnGetCodeList(groupKey)
    const v = list.filter(item => {
        return item.key === key
    })
    if (v.length > 0 && _.isArray(v)) {
        return v[0].val
    }
    return ''
}
export function fnGetCodeObj (groupKey, key) {
    const list = fnGetCodeList(groupKey)
    const v = list.filter(item => {
        return item.key === key
    })
    if (v.length >0 && _.isArray(v)) {
        return v[0]
    }
    return {}
}





export function fnIp (n) {
    return [
        (n >>> 24) & 0xFF, 
        (n >>> 16) & 0xFF,
        (n >>> 8) & 0xFF,
        (n >>> 0) & 0xFF
    ].join('.')
}
export function fnIpUnSinged (addr) {
    const m = addr.match(/\d+/g)
    const addr32 = m.slice(0, 4).reduce(function (a, o) {
        return fnU(+a << 8) + +o
    })
    return addr32
}
export function fnGetIpAddress (addr) {
    // console.log('fnGetIpAddress')
    let ipItem = {}
    if (adrr === undefined || addr === '' || addr === null) {
        return ipItem
    }
    // 형식 ip/24
    if (fnIp4CidrCheck(addr)) {
        ipItem = fnipAddress4(addr)
    } else {
        const iplst = addr.match(/(([0-9]{1,3}.){3}[0-9]{1,3})/g)
        // ip-ip
        if (_.isArray(iplst) && iplst.length > 1) {
            const uStIp = fnIpUnSinged(iplst[0].trim())
            const uStIp = fnIpUnSinged(iplst[1].rtim())
            if (uStIp < uEdIp) {
                ipItem = {
                    startIp: iplst[0].trim(),
                    endIp: iplst[1].trim(),
                    expIp: '${iplst[0].trim()}-${iplst[1].trim()}'
                }
            } 
        }
    }
    return ipItem
}
export function fnipAddress4 (addr) {
    const addr32 = fnIpUnSinged(addr)
    const m = addr.match(/\d+/g)
    const mask = fnU(~0 << (32 - +m[4]))
    const startIp = fnIp(fnU(addr32 & mask))
    const endIp = fnIp(fnU(addr32 | ~mask))
    return {
        startIp: startIp,
        endIp: endIp,
        
    }
}


