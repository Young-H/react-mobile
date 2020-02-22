import $axios from './api'

export default () => {
  return new Promise ((resolve,reject) => {
    // 这里处理异步请求
    // 先判断本地缓存是否有当前城市的数据
    // 如果有数据就直接从缓存中获取，否则通过地理定位
    let city = window.localStorage.getItem('hkzf_city')
    if(city) {
      return resolve(JSON.parse(city))
    }
    // 通过地理定位获取当前城市名称 
    let myCity = new window.BMap.LocalCity()
    
    myCity.get(async (result) => {
      // 根据地理定位获取的名称 查询当前城市的详细数据
      const hot = await $axios({method:'get',url:'/area/info',params:{name:result.name === '全国' ? '北京' : result.name}})
      let info = {
        label:hot.body.label,
        value:hot.body.value,
        lng:result.center.lng,
        lat:result.center.lat
      }
      resolve(info)
    })
  })
}