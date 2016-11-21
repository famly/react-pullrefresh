import React, { Component } from 'react'
import './rotate.less'
import image from './pull.svg'

const MAX_DEFAULT = 100

class Pull extends Component {
  static defaultProps = {
    max: MAX_DEFAULT
  }

  constructor(props) {
    super(props)
    this.state = {
      pulled:0
    }
  }

  componentDidMount() {
    this.pullhelper = require('pullhelper')

    let { disabled,onRefresh,max } = this.props
    let maxPull = max || MAX_DEFAULT
    let that= this

    this.pullhelper
    .on('start',function(pulled) {
      that.setState({
        pulling:true
      })
    })
    .on('stepback',function(pulled,next) {
      that.setState({
        pulled:pulled
      })
      let nextPulled = Math.min(pulled - Math.min(pulled/2,10),max)
      next(nextPulled)
    })
    .on('step',function(pulled) {
      that.setState({
        pulled:pulled
      })
    })
    .on('pull',function(pulled,next) {
      that.setState({
        pulling:false
      })
      if(!onRefresh || pulled < maxPull) {
        next()
        return
      }
      that.setState({
        loading:true
      })
      onRefresh(_ => {
        that.setState({
          loading:false
        })
        next()
      })
    })
    .load()
    if(disabled) {
      this.pullhelper.pause()
    }
  }
  componentWillReceiveProps(nextProps) {
    let { disabled } = this.props
    if(disabled !== nextProps.disabled) {
      if(nextProps.disabled) {
        this.pullhelper.pause()
      } else {
        this.pullhelper.resume()
      }
    }
  }
  componentWillUnmount() {
    this.pullhelper.unload()
  }
  render() {
    let { pulling,loading,pulled } = this.state
    let maxPull = this.props.max || MAX_DEFAULT
    let size = this.props.size || 30
    let style = this.props.style || {}
    return (
      <div>
        <div style={{
          display:pulling ? 'block' : 'none',
          position:'fixed',
          top:0,
          left:0,
          right:0,
          bottom:0,
          zIndex:this.props.zIndex,
          userSelect:'none'
        }} />
        <div style={Object.assign({
          background:'white',
          width: size,
          height: size,
          position:'fixed',
          zIndex:this.props.zIndex,
          top:-size+Math.min(pulled,maxPull),
          left:'50%',
          borderRadius:size/2,
          transform:'translate(-50%,-50%)',
          boxShadow:'0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)',
          userSelect:'none'
        },style)}>
          <div style={{
            background:`url(${image}) center center no-repeat`,
            backgroundSize:'100% 100%',
            width:'100%',
            height:'100%',
            opacity:pulled/maxPull,
            transform:`rotate(${pulled/maxPull*360}deg)`,
            animation:loading ? 'rotating 2s linear infinite' : 'none'
          }} />
        </div>
      </div>
    )
  }
}

export default Pull;
