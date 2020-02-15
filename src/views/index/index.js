import React, { Component } from "react";
import { Carousel, Flex, Grid } from "antd-mobile";
import axios from "axios";
import "./index.scss";

// 引入菜单图标
import Nav1 from "../../assets/imgs/nav-1.png";
import Nav2 from "../../assets/imgs/nav-2.png";
import Nav3 from "../../assets/imgs/nav-3.png";
import Nav4 from "../../assets/imgs/nav-4.png";

// 配置基准地址
axios.defaults.baseURL = "http://localhost:8080";

export default class Index extends Component {
  state = {
    swiperData: [],
    isautoplay: false,
    groupsData: [],
    newsData:[]
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

  // 接口拿到租房小组数据
  getGroupData = async () => {
    let { data } = await axios.get("/home/groups");
    console.log(data);
    if (data.status === 200) {
      this.setState({
        groupsData: data.body
      });
    }
  };

  // 接口拿到最新资讯
  getNewsData = async ()=> {
    const res = await axios.get('/home/news')
    console.log(res);
    if (res.status === 200) {
      this.setState({
        newsData:res.body
      })
    }
    
  }
  // 组件加载完成，
  componentDidMount() {
    this.getSwiperImg();
    this.getGroupData();
    this.getNewsData()
  }

  // 动态生成轮播图组件
  swiper = () => {
    const swiperTag = this.state.swiperData.map(item => (
      <img
        src={`http://localhost:8080${item.imgSrc}`}
        key={item.id}
        alt=""
        onLoad={() => {
          // 窗口尺寸变化时 -> 触发resize事件 -> 重新设置动态高
          window.dispatchEvent(new Event("resize"));
          this.setState({
            isautoplay: true
          });
        }}
      />
    ));
    return (
      <Carousel
        // 自动切换
        autoplay={this.state.isautoplay}
        //  循环播放
        infinite={true}
        //  循环播放间隔
        autoplayInterval="1666"
      >
        {swiperTag}
      </Carousel>
    );
  };

  // 动态生成菜单组件
  renderMenu = () => {
    let menuData = [
      { id: 1, title: "整租", img: Nav1 },
      { id: 2, title: "合租", img: Nav2 },
      { id: 3, title: "地图", img: Nav3 },
      { id: 4, title: "出租", img: Nav4 }
    ];
    const menuTag = menuData.map(item => (
      <Flex.Item key={item.id}>
        <img src={item.img} alt="" />
        <p>{item.title}</p>
      </Flex.Item>
    ));

    return <Flex> {menuTag} </Flex>;
  };

  // 动态生成租房小组组件 
  renderGroup = ()=> {
    return (
      <div className="group">
          <Flex className="group-title" justify="between">
            <h3>住房小组</h3>
            <span>更多</span>
          </Flex>
           <Grid
              data={this.state.groupsData}
              columnNum={2}
              square={false}
              renderItem={data => (
                <div className='group-item' style={{height:'50px'}}>
                  <div className='desc'>
                     <h3>{data.title}</h3>
                     <p>{data.desc}</p>
                  </div>
                  <img src={`http://localhost:8080${data.imgSrc}`} alt=""/>
                </div>
              )}
            />  
        </div>
    )
  }
  render() {
    return (
      <div>
        {/* 顶部轮播图 */}
        {this.swiper()}
        {/* 导航菜单 */}
        {this.renderMenu()}
        {/* 租房小组 */}
        {this.renderGroup()}
        {/* 最新资讯 */}
        <div className="new">
          <h3 className='group-title'>最新资讯</h3>

        </div>
      </div>
    );
  }
}
