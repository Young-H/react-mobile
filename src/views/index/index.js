import React, { Component } from "react";
import { Carousel, Flex, Grid, WingBlank,NavBar,Icon} from "antd-mobile";
// import axios from "axios";
import $axios from '../../utils/api'
import { IMG_Url } from '../../utils/config'
import "./index.scss"
// import Bscroll from 'better-scroll'

// 引入菜单图标
import Nav1 from "../../assets/imgs/nav-1.png";
import Nav2 from "../../assets/imgs/nav-2.png";
import Nav3 from "../../assets/imgs/nav-3.png";
import Nav4 from "../../assets/imgs/nav-4.png";

// 配置基准地址

export default class Index extends Component {
  state = {
    swiperData: [],
    groupsData: [],
    newsData:[],
    isautoplay: false
  };

  // 接口拿到轮播图数据
  getSwiperImg = async () => {
    let  { body }  = await $axios({method:'get',url:'/home/swiper'});
    console.log(body);
    
      this.setState({
        swiperData: body
      });
  };

  // 接口拿到租房小组数据
  getGroupData = async () => {
    let { body } = await $axios({method:'get',url:'/home/groups'});
   
      this.setState({
        groupsData:body
      });
  };

  // 接口拿到最新资讯
  getNewsData = async ()=> {
    let { body } = await $axios({method:'get',url:'/home/news'})
    
      this.setState({
        newsData:body
      })
    
  }

  // setBscroll = () => {
  //   const ccc = this.refs.warpper
  //   const scroll = new this.BScroll(ccc, {
  //     scrollX: true,  //开启横向滚动
  //     click: true,  // better-scroll 默认会阻止浏览器的原生 click 事件
  //     scrollY: false, //关闭竖向滚动
  //   })
  // }

  // 组件加载完成，填充数据
  componentDidMount() {
    this.getSwiperImg();
    this.getGroupData();
    this.getNewsData()
    console.log(this.refs.warpper);
    
  }

  // 动态生成轮播图组件
  swiper = () => {
    const swiperTag = this.state.swiperData.map(item => (
      <img
        src={`${IMG_Url}${item.imgSrc}`}
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
                  <img src={`${IMG_Url}${data.imgSrc}`} alt=""/>
                </div>
              )}
            />  
        </div>
    )
  }

  // 动态生成最新资讯组件 
  renderNews = () => {
    const newsTag = this.state.newsData.map(item => (
      <div className='news-item'  key={item.id}>
        <div className='imgwarp'>
          <img className='img' src={`${IMG_Url}${item.imgSrc}`} alt=""/>
        </div>
        <Flex className='content' justify='between' direction='column'>
          <h3 className='title'>{item.title}</h3>
          <Flex className='info' justify='between'>
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))

    return (
      <div className="new">
        <h3 className='news-title'>最新资讯</h3>
        <WingBlank>{newsTag}</WingBlank>
      </div>
    )
  }

  // 动态生成顶部导航
  renderNavbar = () => {
    return (
      <NavBar
        mode="dark"
        icon='北京'
        onLeftClick={() => {
          // 跳转到选择城市页面
          this.props.history.push('/citylist')
        }}
        rightContent={[
          <Icon key="1" type="ellipsis" />,
        ]}
      >主页</NavBar>
    )
  }
  render() {
    return (
      <div ref='warpper'>
        {/* 顶部导航 */}
        {this.renderNavbar()}
        {/* 顶部轮播图 */}
        {this.swiper()}
        {/* 导航菜单 */}
        {this.renderMenu()}
        {/* 租房小组 */}
        {this.renderGroup()}
        {/* 最新资讯 */}
        {this.renderNews()}
      </div>
    )
  }
}
