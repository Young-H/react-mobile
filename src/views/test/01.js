/*
  关于组件的用法
  <TabBar>
    <TabBar.Item></TabBar.Item>
    <TabBar.Item></TabBar.Item>
    <TabBar.Item></TabBar.Item>
    <TabBar.Item></TabBar.Item>
  </TabBar>

  组件标签中间的内容赋值给了组件的props.children
*/

/**
 * 1、 组件标签中间的内容 赋值给了 组件的 props.children 
 * 2、 类的静态属性
 *  MyCom.Header = class extends React.Componet 
 * 3、 类表达式
 *  MyCom.Header = class extends React.Componet 
 *  
 */

  // 函数声明
  // function foo () {} 
  // 函数表达式
  // let foo = function () {}

  // 类声明
  // class Person {}
  // 类表达式
  // let Person = class {}

import React from 'react'

class MyCom extends React.Component {
  render () {
    return this.props.children
  }
}

MyCom.Header = class extends React.Component {
  render () {
    return (
      <div>Header</div>
    )
  }
}
MyCom.Content = class extends React.Component {
  render () {
    return (
      <div>Content</div>
    )
  }
}
MyCom.Footer = class extends React.Component {
  render () {
    return (
      <div>Footer</div>
    )
  }
}

class Test extends React.Component {
  render () {
    return (
      <div>
        <h1>测试【点标记】组件</h1>
        <hr/>
        <MyCom>
          <MyCom.Header></MyCom.Header>
          <MyCom.Content></MyCom.Content>
          <MyCom.Footer></MyCom.Footer>
        </MyCom>
      </div>
    )
  }
}

export default Test