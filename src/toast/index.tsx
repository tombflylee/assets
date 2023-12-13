// @ts-nocheck
import React from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import addCssAnimationClass from './cssAnimation';

class ToastElement extends React.Component<any, any, any> {
    private state = {
        content: ''
    };
    private animateClassName = 'jrw-fade';
    private currentRef = React.createRef();
    private timer = null;
    public componentDidUpdate() {
        if (this.currentRef?.current)
            addCssAnimationClass(this.currentRef.current, `${this.animateClassName}-enter`);
    }

    public add(content) {
        if (!this.timer) {
            this.setState({
                content: content
            });
            this.timer = setTimeout(() => {
                if (this.currentRef?.current)
                    addCssAnimationClass(
                        this.currentRef.current,
                        `${this.animateClassName}-leave`,
                        () => {
                            // 动画结束后再清空内容
                            this.setState({
                                content: ''
                            });
                            clearTimeout(this.timer);
                            this.timer = null;
                        }
                    );
            }, 3000);
        }
    }

    public render() {
        // 无内容就返回null，销毁
        return this.state.content ? (
            <div className="jrw-toast-container" ref={this.currentRef}>
                {this.state.content}
            </div>
        ) : null;
    }
}

ToastElement.newInstance = (props, callback) => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    function ref(toastRef) {
        callback({
            // 曝露给外部调用的方法
            show: (content) => {
                toastRef.add(content);
            },
            // 暂时用不到；
            destroy: () => {
                // 销毁的老方法
                ReactDOM.unmountComponentAtNode(div);
                document.body.removeChild(div);
            }
        });
    }

    // 渲染在最外层的div中
    ReactDOM.render(<ToastElement {...props} ref={ref} />, div);
};

let toastApi = {
    setApi: (funcObj) => {
        Object.keys(funcObj).forEach((funcName) => {
            toastApi[funcName] = funcObj[funcName];
        });
    }
};

ToastElement.newInstance({}, toastApi.setApi);

export default toastApi;
