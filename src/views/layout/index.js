import React, { Component } from "react";

// 引入标签栏组件
import { TabBar } from "antd-mobile";

import { Route, Switch, Redirect} from 'react-router-dom'

import Find from '../find'
import Info from '../info'
import My from '../my'
import Index from '../index'

// 引入样式
import "./index.css";

// 默认导出 layout  布局组件
export default class Layout extends Component {
  state = {
    // 控制菜单的切换
    selectedTab: "index"
  };

  componentDidMount () {
    console.log(this.props);
    
    let Url = this.props.location.pathname
    // lastIndexOf  是从右往左查询， 但是返回的位置，是从左往右。 也可以用indexOf
    //  substring(star,ent) 第一个参数是从哪截取， 第二个参数是截取到哪结束
    let selected = Url.substring( Url.lastIndexOf("/") + 1 ,Url.length)
    this.setState({
      selectedTab:selected
    })

    // Url = Url.split('/')[2]
    // this.setState({
    //   selectedTab:Url
    // })
  }
  // 动态生成所有的菜单项
  renderMenuItem = () => {
    // 定义一个数据
    const menuData = [
      { id: "index", mtitle: "主页", icon: "icon-maozi" },
      { id: "find", mtitle: "找房", icon: "icon-duanku" },
      { id: "info", mtitle: "资讯", icon: "icon-jinjiepaoxie" },
      { id: "my", mtitle: "我的", icon: "icon-beibao" }
    ];

    return menuData.map(item => (
      <TabBar.Item
        // 标题文字
        title={item.mtitle}
        // 唯一标识
        key={item.id}
        // 默认展示图标
        icon={<i className={`iconfont ${item.icon}`} />}
        // 选中展示图标
        selectedIcon={<i className={`iconfont ${item.icon}`} />}
        // 默认选中 当前标识 与 state 标识一致时
        selected={this.state.selectedTab === item.id}
        // 点击触发，当点击的时候，把当前id标识 给state  目的给当前标签默认选中
        onPress={() => {
          this.setState({
            selectedTab: item.id
          });
          // 路由跳转(通过编程式导航控制跳转)
          this.props.history.push('/home/' + item.id)
        }}
      >
        <div>{item.mtitle}</div>
      </TabBar.Item>
    ));
  };

  render() {
    return (
      <div className="menu">

        <Switch>/
          <Redirect exact  from='/home' to='/home/index'  />
          <Route path='/home/index' component={Index} />
          <Route path='/home/info' component={Info} />
          <Route path='/home/my' component={My} />
          <Route path='/home/find' component={Find} />
        </Switch>

        
        <TabBar
          // 未选中字体颜色
          unselectedTintColor="#969696"
          // 选中后的字体颜色
          tintColor="orange"
          // 背景颜色
          barTintColor="white"
          // 不渲染内容部分
          noRenderContent={true}>
          {this.renderMenuItem()}
        </TabBar>
      </div>
    );
  }
}
