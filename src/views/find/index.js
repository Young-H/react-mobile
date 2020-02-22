// 引入react核心组件 
import React, { Component } from 'react'
// 引入找房样式文件
import './index.scss'
// 引入antd-Flex 布局组件 
import { Flex } from 'antd-mobile'
// 引入封装好的获取当前城市信息的组件
import getCurrentCity from '../../utils/location'
export default class Find extends Component {

  state = {
    currentCity:''
  }
  
  componentDidMount () {
    getCurrentCity().then(city=> {
      this.setState({
        currentCity:city.label
      })
    })
  }
  
  render() {
    return (
      <div>
        {/* 搜索框 */}
        <Flex className='header'>
          {/* 左侧箭头 */}
          <i className='iconfont icon-iconback'></i>
          <Flex className='search-box searchHeader'>
            <Flex className='search'>
              {/* 城市信息位置 */}
              <div className="location">
                <span className='name'>{this.state.currentCity}</span>
                <i className='iconfont icon-arrow-down'></i>
              </div>
              {/* 搜索表单 */}
              <div className="form">
                <i className='iconfont icon-search'></i>
                <span className='text' >请输入小区或地址</span>
              </div>
            </Flex>
            {/* 右侧地图 */}
            <i className="iconfont icon-map"></i>
            
          </Flex>
        </Flex>
      </div>
    )
  }
}