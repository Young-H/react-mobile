import React, { Component } from "react";
import { Carousel,Flex } from "antd-mobile";
import axios from "axios";
import './index.scss'

// 引入菜单图标
import Nav1 from "../../assets/imgs/nav-1.png";
import Nav2 from "../../assets/imgs/nav-2.png";
import Nav3 from "../../assets/imgs/nav-3.png";
import Nav4 from "../../assets/imgs/nav-4.png";

// 配置基准地址
axios.defaults.baseURL = "http://localhost:8080";

export default class Index extends Component {
  state = {
    swiperData: []
  };

  // 接口拿到轮播图数据
  getSwiperImg = async () => {
    let { data } = await axios.get("http://localhost:8080/home/swiper");
    if (data.status === 200) {
      this.setState({
        swiperData: data.body
      });
    }
  };

  // 组件加载完成，
  componentDidMount() {
    this.getSwiperImg();
  }

  // 动态生成轮播图组件
  swiper = () => {
    return this.state.swiperData.map(item => (
      <img
        src={`http://localhost:8080${item.imgSrc}`}
        key={item.id}
        alt=""
        onLoad={() => {
          // 窗口尺寸变化时 -> 触发resize事件 -> 重新设置动态高
          window.dispatchEvent(new Event("resize"));
        }}
      />
    ));
  };

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
          autoplayInterval="1666"
        >
          {this.swiper()}
        </Carousel>
        {/* 导航菜单 */}
        <Flex>
          <Flex.Item>
            <img src={Nav1} alt=""/>
            <p>整租</p>
          </Flex.Item>
          <Flex.Item>
            <img src={Nav2} alt=""/>
            <p>合租</p>
          </Flex.Item>
          <Flex.Item>
            <img src={Nav3} alt=""/>
            <p>地图找房</p>
          </Flex.Item>
          <Flex.Item>
            <img src={Nav4} alt=""/>
            <p>去出租</p>
          </Flex.Item>
        </Flex>
      </div>
    );
  }
}
