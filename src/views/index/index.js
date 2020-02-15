import React, { Component } from 'react'

import { Carousel } from 'antd-mobile'

import axios from 'axios'
 
export default class Index extends Component {


  
  state = { 
   swiperData:[],
  }

  getSwiperImg = async ()=> {
    let {data} = await axios.get('http://localhost:8080/home/swiper')
    console.log(data);
    if (data.status === 200) {
      this.setState({
        swiperData:data.body,
      })
    }
  }
  
  componentDidMount () {
    this.getSwiperImg()
  }
  
  // 动态生成轮播图片
  swiper = ()=> {
    return this.state.swiperData.map(item=>(
      <img src={`http://localhost:8080${item.imgSrc}`} key={item.id} alt=""/>
    ))
  }
  
  render() {
    return (
      <div>
        {/* 顶部轮播图 */}
        
        <Carousel
        // 自动切换
         autoplay={true}
        //  循环播放
         infinite={true}
        //  循环播放间隔
         autoplayInterval='1666'
        >
          { this.swiper() }
        </Carousel>
      </div>
    )
  }
}