/**
 * 构造类继承关系
 *
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {Function} clazz 源类
 * @param {Function} baseClazz 基类
 */
export function inherits(clazz, baseClazz) {
    var clazzPrototype = clazz.prototype;
    function F() {}
    F.prototype = baseClazz.prototype;
    clazz.prototype = new F();

    for (var prop in clazzPrototype) {
        if (clazzPrototype.hasOwnProperty(prop)) {
            clazz.prototype[prop] = clazzPrototype[prop];
        }
    }
    clazz.prototype.constructor = clazz;
    clazz.superClass = baseClazz;
}

/**
 * 这里的 mixin 只拷贝 prototype 上的属性。
 * @memberOf module:zrender/core/dataStructureUtil
 * @param {Object|Function} target
 * @param {Object|Function} sorce
 * @param {boolean} overlay
 */
export function mixin(target, source, overlay) {
    target = 'prototype' in target ? target.prototype : target;
    source = 'prototype' in source ? source.prototype : source;

    defaults(target, source, overlay);
}

/**
 * 拷贝父类上的属性
 * @param {*} subInstance 子类的实例
 * @param {*} SuperClass 父类的类型
 * @param {*} opts 构造参数
 */
export function copyProperties(subInstance,SuperClass,opts){
    let sp=new SuperClass(opts);
    for(let name in sp){
        if(sp.hasOwnProperty(name)){
            subInstance[name]=sp[name]
        }
    }
}

/**
 * @param {*} target
 * @param {*} source
 * @param {boolean} [overlay=false]
 * @memberOf module:zrender/core/dataStructureUtil
 */
export function defaults(target, source, overlay) {
    for (var key in source) {
        if (source.hasOwnProperty(key)
            && (overlay ? source[key] != null : target[key] == null)
        ) {
            target[key] = source[key];
        }
    }
    return target;
}

/**
 * @method copyOwnProperties
 * 
 * Copy own properties from source object to target object, exclude inherited ones.
 * 
 * 从目标对象上拷贝属性，拷贝过程中排除那些通过继承而来的属性。
 * 
 * @param {Object} target 
 * @param {Object} source 
 */
export function copyOwnProperties(target,source){
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }
}