import React, { Component } from "react";
import { NavBar, Icon, Toast } from "antd-mobile";
import { List, AutoSizer } from "react-virtualized";
import getCurrentCity from '../../utils/location'

import $axios from "../../utils/api";
import "./index.scss";

export default class City extends Component {
  state = {

    // 当前选中的索引
    activeIndex : 0,
    
    // 城市列表数据
    cityData: {}
  };
  // 创建一个 list 组件的引用

  listRef = React.createRef()

  // ajax 获取城市列表数据
  getCityData = async () => {
    let res = await $axios({
      method: "get",
      url: "/area/city",
      params: { level: 1 }
    });

    let ret = this.formatData(res.body);
    // ajax  获取热门城市列表
    const hot = await $axios({method:'get',url:'/area/hot'})
    // 添加热门城市
    ret.cityIndex.unshift('hot')
    ret.cityList.hot = hot.body

    // 封装地理定位方法 ，获取当前城市的详细信息
    let ccty = await getCurrentCity()
    console.log(ccty);
    ret.cityIndex.unshift('#')
    ret.cityList['#'] = [ccty]


    this.setState({
      cityData: ret
    },()=> {
      //默认情况，没有看到内容尚未被渲染，所有列表的总高度不清楚，所以哎调用scrollToRow 进行滚动不准确，所以可以通过，measureAllRows 提前计算出列表总高度
      this.listRef.current.measureAllRows()
    }
    );

    // 隐藏提示
    Toast.hide()
  };

  componentDidMount() {
    this.getCityData();
    // 组件开始加载时， 出现
    Toast.loading('正在加载ing',0,null,false)
  }

  // 拿到数据进行重构
  formatData = list => {
    let cityList = {};

    // 遍历 ajax获取的数据
    list.forEach(item => {
      // 根据 数据 拿到  数据中的 首字母  进行判断，分类
      let fristLetter = item.short.substring(0, 1);
      // 如果这个对象 有这个首字母的键
      if (cityList.hasOwnProperty(fristLetter)) {
        // 已存在 直接添加到数据
        cityList[fristLetter].push(item);
      } else {
        // 不存在，初始化一个数组，添加数据
        cityList[fristLetter] = [item];
      }
    });

    //  拿到对象的键值 进行排序
    let cityIndex = Object.keys(cityList).sort();

    return {
      cityList,
      cityIndex
    };
  };

  // 动态生成城市列表数据
  rowRenderer = ({ key, index, style }) => {
    const { cityList, cityIndex } = this.state.cityData;
    // 获取cityIndex 里面的每一项数据
    let fristLetter = cityIndex[index];

    //  拿到citylist 里面的 每一项解析成数组
    let cities = cityList[fristLetter];

    // 遍历
    const cityTag = cities.map(item => (
      <div
      onClick={()=>{
        // 判断点击的城市 是否在这个四个热门城市
        if(['北京','上海','广州','深圳'].includes(item.label)) {
          // 选中该城市，保存到本地缓存
          // 获取选择城市的经纬度数据，（根据城市名称）
          // 创建一个 百度地图根据名称查询经纬度的实例
          let geo = new window.BMap.Geocoder()
          // 参数1： 表示要查询的城市名称  
          // 参数2： 回调函数，获取经纬度结果
          // 参数3： 固定为中国 表示在哪个国家查询城市信息
          geo.getPoint(item.label,(data)=>{
            let info = {
              label: item.label,
              value:item.value,
              lng: data && data.lng,
              lat: data && data.lat
            }
            window.localStorage.setItem('hkzf_city',JSON.stringify(info))
            // 跳转到home主页
            this.props.history.push('/home')
          },('中国'))
          
        } else {
          Toast.info('只支持一线城市',1)
        }
      }}
       key={item.value} className="name">
        {item.label}
      </div>
    ));

    return (
      <div key={key} style={style}>
        <div className="title">{fristLetter.toUpperCase()}</div>
        {cityTag}
      </div>
    );
  };

  // 动态计算每一行的高度
  calcRowHeight = ({ index }) => {
    // index 表示当前行数据的索引
    const { cityList, cityIndex } = this.state.cityData;
    // 根据数据索引获取分组标题的字符
    let fristLetter = cityIndex[index];
    // 根据标题索引获取当前行的城市列表数据
    let cities = cityList[fristLetter];
    // 行高的计算方式  标题的高度， +  每个城市的高度  *  城市的数量
    return 36 + 50 * cities.length;
  };
  
  // 动态填充右侧索引
  renderRightIndex = ()=> {
    const { cityIndex } = this.state.cityData
    const { activeIndex } = this.state
    return cityIndex && cityIndex.map((item,index) => (
      <li 
      onClick={(e)=>{
        // 控制列表滚动
        this.listRef.current.scrollToRow(index)
      }}
      className='city-index-item' 
      key={index}>
        <span className={activeIndex === index ? 'index-active' : ''}>
          {item === 'hot' ? '热' : item.toUpperCase() }
        </span>
      </li>
    ))
  }
  
  // 监听列表的滚动事件
  onRowsRendered = ({startIndex}) => {
    
    if (this.state.activeIndex !== startIndex) {
      console.log(startIndex);
      this.setState({
        activeIndex:startIndex
      })
    }
  }
  
  render() {
    const { cityIndex } = this.state.cityData;
    return (
      <div style={{ height: "100%" }}>
        {/* 导航栏 */}
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            // 跳回到主页
            // this.props.history.push('/home')
            // this.props.history.goBack()
            this.props.history.go(-1);
          }}
        >
          城市选择
        </NavBar>
        
        {/* 城市列表 */}
        {cityIndex && (
          <AutoSizer>
            {({ height, width }) => (
              <List
                ref={this.listRef}
                // 精确定位到
                scrollToAlignment='start'
                className="city"
                onRowsRendered={this.onRowsRendered}
                width={width}
                height={height - 45}
                rowCount={cityIndex.length}
                rowHeight={this.calcRowHeight}
                rowRenderer={this.rowRenderer}
              />
            )}
          </AutoSizer>
        )}
        {/* 右侧索引 */}
        <ul className='city-index'>
          {this.renderRightIndex()}
        </ul>
      </div>
    );
  }
}
