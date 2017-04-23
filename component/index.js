import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';


var imgList = [
    { 'src': '../image/1.jpg' },
    { 'src': '../image/2.jpg' },
    { 'src': '../image/3.jpg' },
    { 'src': '../image/4.jpg' },
    { 'src': '../image/5.jpg' },
    { 'src': '../image/6.jpg' },
    { 'src': '../image/7.jpg' },
    { 'src': '../image/9.jpg' },
    { 'src': '../image/8.jpg' }
]

class SlidePrev extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            isImgShow: false, //图片显示
            imgIndex: 1//图片下标
        }
    }
    showImg(imgIndex = 0) {
        this.setState({
            isImgShow: !this.state.isImgShow,
            imgIndex: imgIndex + 1
        })
    }
    render() {
        const { images } = this.props;
        return (
            <div className='slide'>
                <SlideList itemImages={images} showImg={this.showImg.bind(this)} />
                {
                    this.state.isImgShow && <PrevList itemImages={images} showImg={this.showImg.bind(this)} imgIndex={this.state.imgIndex} />
                }
            </div>
        )
    }
}

let SlideList = ({ itemImages, showImg }) => {
    return (
        <ul className='slide-list'>
            {
                itemImages.map((item, index) => {
                    return (
                        <li className='slide-item' key={index} onClick={showImg.bind(null, index)}>
                            <img src={item.src} />
                        </li>
                    )
                })
            }
        </ul>
    )
}

class PrevList extends React.Component {
    constructor(...args) {
        super(...args);
        this.startX = 0;//手势的起始位置
        this.count = 0;//当前显示的图片
        this.screenWidth = document.body.clientWidth;//屏幕宽度
        this.state = {
            imgIndex: this.props.imgIndex,
            hasMoveStyle: true
        }
    }

    componentDidMount() {
        let prevList = this.refs.prevList;
        if (prevList) {
            let imgChildren = Array.from(prevList.children, item => item.style.width = this.screenWidth + 'px');
            let index = this.props.imgIndex - 1;
            prevList.style.webkitTransform = 'translate3d(' + index * (-this.screenWidth) + 'px,0,0)';
            this.count = index;
        }
    }
    touchstart(e) {
        this.setState({
            hasMoveStyle: false
        })
        this.startX = e.touches[0].pageX;
        e.preventDefault();
    }
    touchmove(length, e) {
        let moveDirection = this.startX - e.touches[0].pageX;//滑动的距离
        if ((this.count === 0 && moveDirection < 0) || (this.count === length - 1 && moveDirection > 0)) {
            return;
        }
        let counts = -this.screenWidth * this.count;
        this.refs.prevList.style.webkitTransform = 'translate3d(' + (counts - (this.startX - e.changedTouches[0].pageX)) + 'px,0,0)';
    }
    touchend(length, itemImages, e) {
        this.setState({
            hasMoveStyle: true
        })
        if (this.startX - e.changedTouches[0].pageX > 100) {
            this.count++;
            if (this.count === length) {
                this.count = length - 1;
                return;
            }
            this.setState({
                imgIndex: this.state.imgIndex + 1
            })
        } else if (this.startX - e.changedTouches[0].pageX < -100) {
            this.count--;
            if (this.count < 0) {
                this.count = 0;
                return;
            }
            this.setState({
                imgIndex: this.state.imgIndex - 1
            })
        }
        this.refs.prevList.style.webkitTransform = 'translate3d(' + this.count * (-this.screenWidth) + 'px,0,0)';
    }

    render() {
        const { itemImages, showImg } = this.props;
        return (
            <div className='prev-wrap'>
                <p className='title'>{this.state.imgIndex} / {itemImages.length}</p>
                <span className='close' onClick={showImg.bind(null)}>×</span>
                <ul className={this.state.hasMoveStyle ? 'prev-list translate' : 'prev-list'} ref="prevList">
                    {
                        itemImages.map((item, index) => {
                            return (
                                <li key={index} className='prev-item'
                                    onTouchStart={this.touchstart.bind(this)}
                                    onTouchMove={this.touchmove.bind(this, itemImages.length)}
                                    onTouchEnd={this.touchend.bind(this, itemImages.length, itemImages)}
                                >
                                    <img src={item.src} />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}

ReactDOM.render(
    <div>
        <SlidePre images={imgList} />
    </div>,
    document.getElementById('container')
);