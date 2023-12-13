const END_EVENT_NAME_MAP = {
    transitionend: {
        transition: 'transitionend',
        WebkitTransition: 'webkitTransitionEnd',
        MozTransition: 'mozTransitionEnd',
        OTransition: 'oTransitionEnd',
        msTransition: 'MSTransitionEnd'
    },

    animationend: {
        animation: 'animationend',
        WebkitAnimation: 'webkitAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        OAnimation: 'oAnimationEnd',
        msAnimation: 'MSAnimationEnd'
    }
};

function addCssAnimationClass(node, className, anitmationEndCallback) {
    if (node) {
        node.classList.add(className);
        Object.keys(END_EVENT_NAME_MAP.animationend).forEach((event) => {
            node.addEventListener(END_EVENT_NAME_MAP.animationend[event], () => {
                removeCssAnimationClass(node, className, anitmationEndCallback);
            });
        });
    }
}

function removeCssAnimationClass(node, className, anitmationEndCallback) {
    if (node) {
        node.classList.remove(className);
        if (anitmationEndCallback) anitmationEndCallback();
    }
}

export default addCssAnimationClass;
