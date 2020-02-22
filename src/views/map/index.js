// 引入react 核心组件
import React, { Component } from "react";
// 引入 antd 组件模块
import { NavBar, Icon, Toast} from "antd-mobile";
// 引入当前组件的样式文件
import './index.scss' 
// 引入封装好的方法，获取当前城市的数据
import getCurrentCity from '../../utils/location'
// 引入封装好的ajax方法
import $axios from '../../utils/api'
// 引入封装好的端口路径
import { IMG_Url } from '../../utils/config'

export default class Map extends Component {

  state = {
    mapData: [],
    isShow:false,
    houseList:[]
  }

  // 绘制一级覆盖物的方法
  oneCoverAge = (point,map) => {
    // 设置中心点坐标，和地图缩放级别
    map.centerAndZoom(point,11)
    // 批量绘制
    this.state.mapData.forEach(item => {  
      this.commonCoverAge(item, map, 'first')
    })
  }
  
  //封装绘制二级覆盖物的函数
  twoCoverAge = async (data,point,map) => {
    // 1.放大地图
    map.centerAndZoom(point,13)
    // 2.清空1级覆盖图
    // 延时器防止地图API异常报错
    setTimeout(() => {
      map.clearOverlays()
    }, 0);
    // 1.获取二级覆盖物的数据
    let res =  await $axios({method:'get',url:'/area/map',params:{id:data.value}})
    // 2.把数据遍历出来
    res.body.forEach(item=>{
      this.commonCoverAge(item, map, 'second')
    })
  } 

  // 封装绘制三级覆盖物的函数
  threeCoverAge = async (data,point,map) => {
    // 1.放大地图
    map.centerAndZoom(point,15)
    // 2.清空二级覆盖 延时器防止地图API异常报错
    setTimeout(() => {
      map.clearOverlays()
    }, 0);
    // 3、渲染三级覆盖数据
    let res = await $axios({method:'get',url:'/area/map',params:{id:data.value}})
    res.body.forEach(item => {
      this.commonCoverAge(item,map,'third')
    })
  }

  // 获取三级覆盖物房源信息
  getHouseList = async (id)=> {
    const res = await $axios({method:'get',url:'houses',params:{cityId:id}})
    console.log(res);
    this.setState({
      houseList:res.body.list,
      isShow:true
    })
    Toast.hide()
  } 

  // 封装一个公共渲染覆盖的方法
  commonCoverAge = (data,map,type)=> {
    let point = new window.BMap.Point(data.coord.longitude,data.coord.latitude)
    // 覆盖填充的位置
    let opts = {
      // 指定文本标注所在的地理位置
      position:point,
      // 设置文本的偏移量
      offset:new window.BMap.Size(-36.5,-100)
    }
    // 创建label覆盖的结构
    let overInfo = `
    <div class='map-overlay ${type === 'second' ? 'map-second' : ''}'>
      <div class='font-zz'>${data.label}</div>
      <div class='font-zz'>${data.count}套</div>
      <div class='arrow-bottom'></div>
    </div>
    `
    if (type === 'third') {
      overInfo = `
        <div class='third-item'>${data.label}${data.count}套</div>
      `
    }
    
    // 添加文本标注对象
    let label = new window.BMap.Label(overInfo,opts)

    
    // 给覆盖物绑定事件
    label.addEventListener('click',(e)=>{
      if (type === 'first') {
        // 点击一级覆盖物，就绘制二级覆盖物
        this.twoCoverAge(data,point,map)
        Toast.loading('正在加载ing',0,null,false)
      }else if (type === 'second') {
        // 点击二级覆盖物 就绘制三级覆盖物
        this.threeCoverAge(data,point,map)
        Toast.loading('正在加载ing',0,null,false)
      } else if (type === 'third') {
        // 点击三级覆盖物，显示当前房源信息
        this.setState({
          isShow:false
        })

        this.getHouseList(data.value)

        Toast.loading('正在加载ing',0,null,false)
     
        // 拿到当前地图的中心点
        let x = window.innerWidth / 2 
        let y = (window.innerHeight - 300) / 2

        // 拿到鼠标点击的位置  
        let x1 = e.changedTouches[0].clientX
        let y1 = e.changedTouches[0].clientY
        
        // 调用API控制地图移动
        map.panBy(x - x1, y - y1)

        
   
       
      }
      // 点击覆盖物之后，放大地图，清空原油的覆盖物，重新绘制二级覆盖物
      // 1.放大地图
      // 2.清空原有的覆盖物
      // 延时器避免地图API异常报错
    })
    // 调整默认的覆盖物样式
    label.setStyle({
      border:0,
      background:'rgba(0,0,0,0)'
    })
    // 添加覆盖物
    map.addOverlay(label)

    Toast.hide()
    
  }
  
  // 调用后台接口 获取所有的聚合数据
  loadData = async ()=> {
    // 获取当前坐标的城市
    let city = await getCurrentCity()
    // 根据当前坐标城市的id  获取当前城市所有的房源信息
    let res = await $axios({method:'get',url:'/area/map',params:{id:city.value}})
    this.setState({
      mapData:res.body
    })    
  }
  
  // 初始化一个地图 
  initMap = async ()=>{
    // 初始化地图功能
    // 创建地图实例
    let map = new window.BMap.Map("mymap");
  
    // 根据本地缓存 获取当前的城市信息
    let city = await getCurrentCity()
    // 创建点坐标
    let point = new window.BMap.Point(city.lng, city.lat);
    // 初始化地图，设置中心点坐标和地图缩放级别
    map.centerAndZoom(point, 11);
    // 定位控件
    map.addControl(new window.BMap.GeolocationControl());
    // 缩放控件
    map.addControl(new window.BMap.NavigationControl());

    map.addEventListener('movestart',()=> {
      // 地图移动时，隐藏房源列表
      this.setState({
        isShow:false
      })
    })
    
    // 批量绘制一级覆盖物
    this.oneCoverAge(point,map)
  }

  // 组件加载完成调用
  async componentDidMount() {
   // 获取所有的聚合数据
    await this.loadData()
    // 调用地图方法
    this.initMap()

    // 方法二 ： 在拿到数据之后，再初始化地图
    // this.loadData().then(()=>{
    //   this.initMap()
    // })
  }

  // 渲染房源信息列表
  renderHouseList = () => {
    const cityTag =  this.state.houseList.map(item => (
      <div className="item-city" key={item.houseCode}>
      <div className="item-img">
        <img src={IMG_Url + item.houseImg} alt=""/>
      </div>
      <div className="item-text">
        <h4>{item.title}</h4>
        <p>{item.desc}</p>
        <div className='item-tags'>
          {item.tags.map((item,index)=> {
            let tagCls = 'tag' + (index + 1)
            return (
              <span key={index} className={['tag' , tagCls  ].join(' ')} > {item} </span>
            )
          })}
        </div>
        <div className='item-pice'>
          <span>{item.price}</span>元/月
        </div>
      </div>
    </div>
    ))
    return (
    <div className={['houseList', this.state.isShow ? 'show' : ''].join(' ')}>
      <div className="item-top">
        <h3>房屋列表</h3>
        <span>更多房源</span>
      </div>
      <div className="item-context">
        {cityTag}
      </div>
  </div>
    )
  }
   
  render() {
    return (
      <div style={{ height: "100%",paddingTop:'45px' }}>
        {/* 顶部标题组件 */}
        <NavBar
          className='nav-header'
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={()=>{
            this.props.history.go(-1)
          }}
        >
          地图导航
        </NavBar>
        <div style={{ height: "100%" }} id="mymap"></div>
        {this.renderHouseList()}
      </div>
    );
  }
}

