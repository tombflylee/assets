// @ts-nocheck
// v0.0.1
import React from 'react';
import './sticky.scss';

interface IStickyProps {
  stickyCallback?: Function;
  unstickyCallback?: Function;
  children: any;
  placeholderHeight?: string;
  targetId?: string;
}

const stickyObserverConfig = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0, // [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
};

const generateArray = (start: number, end: number, length: number | string) => {
  let step = (end - start) / Number(length);
  let result = [];
  for (let i = 0; i < Number(length); i++) {
    if (step * i < end) result.push(step * i);
  }
  result.push(end);
  return result;
};

class Sticky extends React.Component<IStickyProps, any> {
  private prefixCls = 'jd-content-sticky';

  private ref = React.createRef<HTMLDivElement>();

  private placeholderRef = React.createRef<HTMLDivElement>();

  private stickyFlag = false;

  private targetStyle: React.CSSProperties = {};

  private getTargetStyle = () => {
    if (this.ref.current) {
      this.targetStyle.height = this.ref.current.getBoundingClientRect().height;
      // @ts-ignore
      this.targetStyle.position = this.ref.current.style.position;
      this.targetStyle.top = this.ref.current.style.top;
    }
  };

  private stickyCallback = () => {
    if (this.ref.current) {
      this.ref.current.style.position = 'fixed';
      this.ref.current.style.top = '0px';
    }
    if (this.placeholderRef.current && this.ref.current) {
      this.placeholderRef.current.style.height = this.props.placeholderHeight
        ? this.props.placeholderHeight
        : this.targetStyle.height + 'px';
      this.placeholderRef.current.style.display = 'block';
    }
    this.props?.stickyCallback?.();
  };

  private unstickyCallback = () => {
    if (this.ref.current) {
      this.ref.current.style.position = this.targetStyle.position as string;
      this.ref.current.style.top = this.targetStyle.top as string;
    }
    if (this.placeholderRef.current && this.ref.current) {
      this.placeholderRef.current.style.height = '0px';
    }
    this.props?.unstickyCallback?.();
  };

  private startStickyListener = () => {
    this.getTargetStyle();
    let target = this.props.targetId
      ? document.querySelector('#' + this.props.targetId)
      : this.placeholderRef?.current;
    if (target) {
      let stickyObserver = new IntersectionObserver(
        (entries: any, observer: any) => {
          entries.forEach((entry: any) => {
            console.log('jjjjjj', entry.intersectionRatio, entry.isIntersecting);
            if (entry.intersectionRatio < 1 && !entry.isIntersecting && !this.stickyFlag) {
              this.stickyFlag = true;
              this.stickyCallback();
            }
            if (entry.intersectionRatio > 0 && entry.isIntersecting && this.stickyFlag) {
              this.stickyFlag = false;
              this.unstickyCallback();
            }
          });
        },
        { ...stickyObserverConfig }
      );
      stickyObserver.observe(target);
    }
  };

  private cloneChild() {
    return React.cloneElement(this.props.children, {
      ref: this.ref,
    });
  }

  componentDidMount(): void {
    this.startStickyListener();
  }

  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {}

  render() {
    const { children } = this.props;
    return (
      <>
        <div className={`${this.prefixCls}-placeholder`} ref={this.placeholderRef} />
        {this.cloneChild()}
      </>
    );
  }
}

export default Sticky;
