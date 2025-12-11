(function() {
  "use strict";
  /**
  * @vue/shared v3.5.25
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  // @__NO_SIDE_EFFECTS__
  function makeMap(str) {
    const map2 = /* @__PURE__ */ Object.create(null);
    for (const key of str.split(",")) map2[key] = 1;
    return (val) => val in map2;
  }
  const EMPTY_OBJ = Object.freeze({});
  const EMPTY_ARR = Object.freeze([]);
  const NOOP = () => {
  };
  const NO = () => false;
  const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
  (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
  const isModelListener = (key) => key.startsWith("onUpdate:");
  const extend$1 = Object.assign;
  const remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
      arr.splice(i, 1);
    }
  };
  const hasOwnProperty$2 = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty$2.call(val, key);
  const isArray$2 = Array.isArray;
  const isMap = (val) => toTypeString(val) === "[object Map]";
  const isSet = (val) => toTypeString(val) === "[object Set]";
  const isFunction$3 = (val) => typeof val === "function";
  const isString$2 = (val) => typeof val === "string";
  const isSymbol = (val) => typeof val === "symbol";
  const isObject$2 = (val) => val !== null && typeof val === "object";
  const isPromise = (val) => {
    return (isObject$2(val) || isFunction$3(val)) && isFunction$3(val.then) && isFunction$3(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
  const isIntegerKey = (key) => isString$2(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
  const isReservedProp = /* @__PURE__ */ makeMap(
    // the leading comma is intentional so empty string "" is also included
    ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
  );
  const isBuiltInDirective = /* @__PURE__ */ makeMap(
    "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
  );
  const cacheStringFunction = (fn2) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return ((str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn2(str));
    });
  };
  const camelizeRE = /-\w/g;
  const camelize = cacheStringFunction(
    (str) => {
      return str.replace(camelizeRE, (c) => c.slice(1).toUpperCase());
    }
  );
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cacheStringFunction(
    (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
  );
  const capitalize = cacheStringFunction((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  const toHandlerKey = cacheStringFunction(
    (str) => {
      const s2 = str ? `on${capitalize(str)}` : ``;
      return s2;
    }
  );
  const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
  const invokeArrayFns = (fns, ...arg) => {
    for (let i = 0; i < fns.length; i++) {
      fns[i](...arg);
    }
  };
  const def = (obj, key, value, writable = false) => {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: false,
      writable,
      value
    });
  };
  const looseToNumber = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
  };
  let _globalThis;
  const getGlobalThis = () => {
    return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
  };
  function normalizeStyle(value) {
    if (isArray$2(value)) {
      const res2 = {};
      for (let i = 0; i < value.length; i++) {
        const item2 = value[i];
        const normalized = isString$2(item2) ? parseStringStyle(item2) : normalizeStyle(item2);
        if (normalized) {
          for (const key in normalized) {
            res2[key] = normalized[key];
          }
        }
      }
      return res2;
    } else if (isString$2(value) || isObject$2(value)) {
      return value;
    }
  }
  const listDelimiterRE = /;(?![^(]*\))/g;
  const propertyDelimiterRE = /:([^]+)/;
  const styleCommentRE = /\/\*[^]*?\*\//g;
  function parseStringStyle(cssText) {
    const ret = {};
    cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item2) => {
      if (item2) {
        const tmp = item2.split(propertyDelimiterRE);
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return ret;
  }
  function normalizeClass(value) {
    let res2 = "";
    if (isString$2(value)) {
      res2 = value;
    } else if (isArray$2(value)) {
      for (let i = 0; i < value.length; i++) {
        const normalized = normalizeClass(value[i]);
        if (normalized) {
          res2 += normalized + " ";
        }
      }
    } else if (isObject$2(value)) {
      for (const name2 in value) {
        if (value[name2]) {
          res2 += name2 + " ";
        }
      }
    }
    return res2.trim();
  }
  const HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
  const SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
  const MATH_TAGS = "annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics";
  const isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
  const isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
  const isMathMLTag = /* @__PURE__ */ makeMap(MATH_TAGS);
  const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
  const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
  function includeBooleanAttr(value) {
    return !!value || value === "";
  }
  const isRef$1 = (val) => {
    return !!(val && val["__v_isRef"] === true);
  };
  const toDisplayString = (val) => {
    return isString$2(val) ? val : val == null ? "" : isArray$2(val) || isObject$2(val) && (val.toString === objectToString || !isFunction$3(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
  };
  const replacer = (_key, val) => {
    if (isRef$1(val)) {
      return replacer(_key, val.value);
    } else if (isMap(val)) {
      return {
        [`Map(${val.size})`]: [...val.entries()].reduce(
          (entries, [key, val2], i) => {
            entries[stringifySymbol(key, i) + " =>"] = val2;
            return entries;
          },
          {}
        )
      };
    } else if (isSet(val)) {
      return {
        [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
      };
    } else if (isSymbol(val)) {
      return stringifySymbol(val);
    } else if (isObject$2(val) && !isArray$2(val) && !isPlainObject$1(val)) {
      return String(val);
    }
    return val;
  };
  const stringifySymbol = (v, i = "") => {
    var _a;
    return (
      // Symbol.description in es2019+ so we need to cast here to pass
      // the lib: es2016 check
      isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
    );
  };
  /**
  * @vue/reactivity v3.5.25
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  function warn$2(msg, ...args) {
    console.warn(`[Vue warn] ${msg}`, ...args);
  }
  let activeEffectScope;
  class EffectScope {
    constructor(detached = false) {
      this.detached = detached;
      this._active = true;
      this._on = 0;
      this.effects = [];
      this.cleanups = [];
      this._isPaused = false;
      this.parent = activeEffectScope;
      if (!detached && activeEffectScope) {
        this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this
        ) - 1;
      }
    }
    get active() {
      return this._active;
    }
    pause() {
      if (this._active) {
        this._isPaused = true;
        let i, l;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].pause();
          }
        }
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].pause();
        }
      }
    }
    /**
     * Resumes the effect scope, including all child scopes and effects.
     */
    resume() {
      if (this._active) {
        if (this._isPaused) {
          this._isPaused = false;
          let i, l;
          if (this.scopes) {
            for (i = 0, l = this.scopes.length; i < l; i++) {
              this.scopes[i].resume();
            }
          }
          for (i = 0, l = this.effects.length; i < l; i++) {
            this.effects[i].resume();
          }
        }
      }
    }
    run(fn2) {
      if (this._active) {
        const currentEffectScope = activeEffectScope;
        try {
          activeEffectScope = this;
          return fn2();
        } finally {
          activeEffectScope = currentEffectScope;
        }
      } else {
        warn$2(`cannot run an inactive effect scope.`);
      }
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    on() {
      if (++this._on === 1) {
        this.prevScope = activeEffectScope;
        activeEffectScope = this;
      }
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    off() {
      if (this._on > 0 && --this._on === 0) {
        activeEffectScope = this.prevScope;
        this.prevScope = void 0;
      }
    }
    stop(fromParent) {
      if (this._active) {
        this._active = false;
        let i, l;
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].stop();
        }
        this.effects.length = 0;
        for (i = 0, l = this.cleanups.length; i < l; i++) {
          this.cleanups[i]();
        }
        this.cleanups.length = 0;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].stop(true);
          }
          this.scopes.length = 0;
        }
        if (!this.detached && this.parent && !fromParent) {
          const last = this.parent.scopes.pop();
          if (last && last !== this) {
            this.parent.scopes[this.index] = last;
            last.index = this.index;
          }
        }
        this.parent = void 0;
      }
    }
  }
  function getCurrentScope() {
    return activeEffectScope;
  }
  let activeSub;
  const pausedQueueEffects = /* @__PURE__ */ new WeakSet();
  class ReactiveEffect {
    constructor(fn2) {
      this.fn = fn2;
      this.deps = void 0;
      this.depsTail = void 0;
      this.flags = 1 | 4;
      this.next = void 0;
      this.cleanup = void 0;
      this.scheduler = void 0;
      if (activeEffectScope && activeEffectScope.active) {
        activeEffectScope.effects.push(this);
      }
    }
    pause() {
      this.flags |= 64;
    }
    resume() {
      if (this.flags & 64) {
        this.flags &= -65;
        if (pausedQueueEffects.has(this)) {
          pausedQueueEffects.delete(this);
          this.trigger();
        }
      }
    }
    /**
     * @internal
     */
    notify() {
      if (this.flags & 2 && !(this.flags & 32)) {
        return;
      }
      if (!(this.flags & 8)) {
        batch(this);
      }
    }
    run() {
      if (!(this.flags & 1)) {
        return this.fn();
      }
      this.flags |= 2;
      cleanupEffect(this);
      prepareDeps(this);
      const prevEffect = activeSub;
      const prevShouldTrack = shouldTrack;
      activeSub = this;
      shouldTrack = true;
      try {
        return this.fn();
      } finally {
        if (activeSub !== this) {
          warn$2(
            "Active effect was not restored correctly - this is likely a Vue internal bug."
          );
        }
        cleanupDeps(this);
        activeSub = prevEffect;
        shouldTrack = prevShouldTrack;
        this.flags &= -3;
      }
    }
    stop() {
      if (this.flags & 1) {
        for (let link = this.deps; link; link = link.nextDep) {
          removeSub(link);
        }
        this.deps = this.depsTail = void 0;
        cleanupEffect(this);
        this.onStop && this.onStop();
        this.flags &= -2;
      }
    }
    trigger() {
      if (this.flags & 64) {
        pausedQueueEffects.add(this);
      } else if (this.scheduler) {
        this.scheduler();
      } else {
        this.runIfDirty();
      }
    }
    /**
     * @internal
     */
    runIfDirty() {
      if (isDirty(this)) {
        this.run();
      }
    }
    get dirty() {
      return isDirty(this);
    }
  }
  let batchDepth = 0;
  let batchedSub;
  let batchedComputed;
  function batch(sub, isComputed = false) {
    sub.flags |= 8;
    if (isComputed) {
      sub.next = batchedComputed;
      batchedComputed = sub;
      return;
    }
    sub.next = batchedSub;
    batchedSub = sub;
  }
  function startBatch() {
    batchDepth++;
  }
  function endBatch() {
    if (--batchDepth > 0) {
      return;
    }
    if (batchedComputed) {
      let e = batchedComputed;
      batchedComputed = void 0;
      while (e) {
        const next = e.next;
        e.next = void 0;
        e.flags &= -9;
        e = next;
      }
    }
    let error2;
    while (batchedSub) {
      let e = batchedSub;
      batchedSub = void 0;
      while (e) {
        const next = e.next;
        e.next = void 0;
        e.flags &= -9;
        if (e.flags & 1) {
          try {
            ;
            e.trigger();
          } catch (err) {
            if (!error2) error2 = err;
          }
        }
        e = next;
      }
    }
    if (error2) throw error2;
  }
  function prepareDeps(sub) {
    for (let link = sub.deps; link; link = link.nextDep) {
      link.version = -1;
      link.prevActiveLink = link.dep.activeLink;
      link.dep.activeLink = link;
    }
  }
  function cleanupDeps(sub) {
    let head;
    let tail = sub.depsTail;
    let link = tail;
    while (link) {
      const prev = link.prevDep;
      if (link.version === -1) {
        if (link === tail) tail = prev;
        removeSub(link);
        removeDep(link);
      } else {
        head = link;
      }
      link.dep.activeLink = link.prevActiveLink;
      link.prevActiveLink = void 0;
      link = prev;
    }
    sub.deps = head;
    sub.depsTail = tail;
  }
  function isDirty(sub) {
    for (let link = sub.deps; link; link = link.nextDep) {
      if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) {
        return true;
      }
    }
    if (sub._dirty) {
      return true;
    }
    return false;
  }
  function refreshComputed(computed2) {
    if (computed2.flags & 4 && !(computed2.flags & 16)) {
      return;
    }
    computed2.flags &= -17;
    if (computed2.globalVersion === globalVersion) {
      return;
    }
    computed2.globalVersion = globalVersion;
    if (!computed2.isSSR && computed2.flags & 128 && (!computed2.deps && !computed2._dirty || !isDirty(computed2))) {
      return;
    }
    computed2.flags |= 2;
    const dep = computed2.dep;
    const prevSub = activeSub;
    const prevShouldTrack = shouldTrack;
    activeSub = computed2;
    shouldTrack = true;
    try {
      prepareDeps(computed2);
      const value = computed2.fn(computed2._value);
      if (dep.version === 0 || hasChanged(value, computed2._value)) {
        computed2.flags |= 128;
        computed2._value = value;
        dep.version++;
      }
    } catch (err) {
      dep.version++;
      throw err;
    } finally {
      activeSub = prevSub;
      shouldTrack = prevShouldTrack;
      cleanupDeps(computed2);
      computed2.flags &= -3;
    }
  }
  function removeSub(link, soft = false) {
    const { dep, prevSub, nextSub } = link;
    if (prevSub) {
      prevSub.nextSub = nextSub;
      link.prevSub = void 0;
    }
    if (nextSub) {
      nextSub.prevSub = prevSub;
      link.nextSub = void 0;
    }
    if (dep.subsHead === link) {
      dep.subsHead = nextSub;
    }
    if (dep.subs === link) {
      dep.subs = prevSub;
      if (!prevSub && dep.computed) {
        dep.computed.flags &= -5;
        for (let l = dep.computed.deps; l; l = l.nextDep) {
          removeSub(l, true);
        }
      }
    }
    if (!soft && !--dep.sc && dep.map) {
      dep.map.delete(dep.key);
    }
  }
  function removeDep(link) {
    const { prevDep, nextDep } = link;
    if (prevDep) {
      prevDep.nextDep = nextDep;
      link.prevDep = void 0;
    }
    if (nextDep) {
      nextDep.prevDep = prevDep;
      link.nextDep = void 0;
    }
  }
  let shouldTrack = true;
  const trackStack = [];
  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }
  function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === void 0 ? true : last;
  }
  function cleanupEffect(e) {
    const { cleanup } = e;
    e.cleanup = void 0;
    if (cleanup) {
      const prevSub = activeSub;
      activeSub = void 0;
      try {
        cleanup();
      } finally {
        activeSub = prevSub;
      }
    }
  }
  let globalVersion = 0;
  class Link {
    constructor(sub, dep) {
      this.sub = sub;
      this.dep = dep;
      this.version = dep.version;
      this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
    }
  }
  class Dep {
    // TODO isolatedDeclarations "__v_skip"
    constructor(computed2) {
      this.computed = computed2;
      this.version = 0;
      this.activeLink = void 0;
      this.subs = void 0;
      this.map = void 0;
      this.key = void 0;
      this.sc = 0;
      this.__v_skip = true;
      {
        this.subsHead = void 0;
      }
    }
    track(debugInfo) {
      if (!activeSub || !shouldTrack || activeSub === this.computed) {
        return;
      }
      let link = this.activeLink;
      if (link === void 0 || link.sub !== activeSub) {
        link = this.activeLink = new Link(activeSub, this);
        if (!activeSub.deps) {
          activeSub.deps = activeSub.depsTail = link;
        } else {
          link.prevDep = activeSub.depsTail;
          activeSub.depsTail.nextDep = link;
          activeSub.depsTail = link;
        }
        addSub(link);
      } else if (link.version === -1) {
        link.version = this.version;
        if (link.nextDep) {
          const next = link.nextDep;
          next.prevDep = link.prevDep;
          if (link.prevDep) {
            link.prevDep.nextDep = next;
          }
          link.prevDep = activeSub.depsTail;
          link.nextDep = void 0;
          activeSub.depsTail.nextDep = link;
          activeSub.depsTail = link;
          if (activeSub.deps === link) {
            activeSub.deps = next;
          }
        }
      }
      if (activeSub.onTrack) {
        activeSub.onTrack(
          extend$1(
            {
              effect: activeSub
            },
            debugInfo
          )
        );
      }
      return link;
    }
    trigger(debugInfo) {
      this.version++;
      globalVersion++;
      this.notify(debugInfo);
    }
    notify(debugInfo) {
      startBatch();
      try {
        if (true) {
          for (let head = this.subsHead; head; head = head.nextSub) {
            if (head.sub.onTrigger && !(head.sub.flags & 8)) {
              head.sub.onTrigger(
                extend$1(
                  {
                    effect: head.sub
                  },
                  debugInfo
                )
              );
            }
          }
        }
        for (let link = this.subs; link; link = link.prevSub) {
          if (link.sub.notify()) {
            ;
            link.sub.dep.notify();
          }
        }
      } finally {
        endBatch();
      }
    }
  }
  function addSub(link) {
    link.dep.sc++;
    if (link.sub.flags & 4) {
      const computed2 = link.dep.computed;
      if (computed2 && !link.dep.subs) {
        computed2.flags |= 4 | 16;
        for (let l = computed2.deps; l; l = l.nextDep) {
          addSub(l);
        }
      }
      const currentTail = link.dep.subs;
      if (currentTail !== link) {
        link.prevSub = currentTail;
        if (currentTail) currentTail.nextSub = link;
      }
      if (link.dep.subsHead === void 0) {
        link.dep.subsHead = link;
      }
      link.dep.subs = link;
    }
  }
  const targetMap = /* @__PURE__ */ new WeakMap();
  const ITERATE_KEY = Symbol(
    "Object iterate"
  );
  const MAP_KEY_ITERATE_KEY = Symbol(
    "Map keys iterate"
  );
  const ARRAY_ITERATE_KEY = Symbol(
    "Array iterate"
  );
  function track(target, type2, key) {
    if (shouldTrack && activeSub) {
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let dep = depsMap.get(key);
      if (!dep) {
        depsMap.set(key, dep = new Dep());
        dep.map = depsMap;
        dep.key = key;
      }
      {
        dep.track({
          target,
          type: type2,
          key
        });
      }
    }
  }
  function trigger(target, type2, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      globalVersion++;
      return;
    }
    const run2 = (dep) => {
      if (dep) {
        {
          dep.trigger({
            target,
            type: type2,
            key,
            newValue,
            oldValue,
            oldTarget
          });
        }
      }
    };
    startBatch();
    if (type2 === "clear") {
      depsMap.forEach(run2);
    } else {
      const targetIsArray = isArray$2(target);
      const isArrayIndex = targetIsArray && isIntegerKey(key);
      if (targetIsArray && key === "length") {
        const newLength = Number(newValue);
        depsMap.forEach((dep, key2) => {
          if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
            run2(dep);
          }
        });
      } else {
        if (key !== void 0 || depsMap.has(void 0)) {
          run2(depsMap.get(key));
        }
        if (isArrayIndex) {
          run2(depsMap.get(ARRAY_ITERATE_KEY));
        }
        switch (type2) {
          case "add":
            if (!targetIsArray) {
              run2(depsMap.get(ITERATE_KEY));
              if (isMap(target)) {
                run2(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            } else if (isArrayIndex) {
              run2(depsMap.get("length"));
            }
            break;
          case "delete":
            if (!targetIsArray) {
              run2(depsMap.get(ITERATE_KEY));
              if (isMap(target)) {
                run2(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            }
            break;
          case "set":
            if (isMap(target)) {
              run2(depsMap.get(ITERATE_KEY));
            }
            break;
        }
      }
    }
    endBatch();
  }
  function reactiveReadArray(array) {
    const raw = toRaw(array);
    if (raw === array) return raw;
    track(raw, "iterate", ARRAY_ITERATE_KEY);
    return isShallow(array) ? raw : raw.map(toReactive);
  }
  function shallowReadArray(arr) {
    track(arr = toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
    return arr;
  }
  function toWrapped(target, item2) {
    if (isReadonly(target)) {
      return isReactive(target) ? toReadonly(toReactive(item2)) : toReadonly(item2);
    }
    return toReactive(item2);
  }
  const arrayInstrumentations = {
    __proto__: null,
    [Symbol.iterator]() {
      return iterator$1(this, Symbol.iterator, (item2) => toWrapped(this, item2));
    },
    concat(...args) {
      return reactiveReadArray(this).concat(
        ...args.map((x2) => isArray$2(x2) ? reactiveReadArray(x2) : x2)
      );
    },
    entries() {
      return iterator$1(this, "entries", (value) => {
        value[1] = toWrapped(this, value[1]);
        return value;
      });
    },
    every(fn2, thisArg) {
      return apply(this, "every", fn2, thisArg, void 0, arguments);
    },
    filter(fn2, thisArg) {
      return apply(
        this,
        "filter",
        fn2,
        thisArg,
        (v) => v.map((item2) => toWrapped(this, item2)),
        arguments
      );
    },
    find(fn2, thisArg) {
      return apply(
        this,
        "find",
        fn2,
        thisArg,
        (item2) => toWrapped(this, item2),
        arguments
      );
    },
    findIndex(fn2, thisArg) {
      return apply(this, "findIndex", fn2, thisArg, void 0, arguments);
    },
    findLast(fn2, thisArg) {
      return apply(
        this,
        "findLast",
        fn2,
        thisArg,
        (item2) => toWrapped(this, item2),
        arguments
      );
    },
    findLastIndex(fn2, thisArg) {
      return apply(this, "findLastIndex", fn2, thisArg, void 0, arguments);
    },
    // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
    forEach(fn2, thisArg) {
      return apply(this, "forEach", fn2, thisArg, void 0, arguments);
    },
    includes(...args) {
      return searchProxy(this, "includes", args);
    },
    indexOf(...args) {
      return searchProxy(this, "indexOf", args);
    },
    join(separator) {
      return reactiveReadArray(this).join(separator);
    },
    // keys() iterator only reads `length`, no optimization required
    lastIndexOf(...args) {
      return searchProxy(this, "lastIndexOf", args);
    },
    map(fn2, thisArg) {
      return apply(this, "map", fn2, thisArg, void 0, arguments);
    },
    pop() {
      return noTracking(this, "pop");
    },
    push(...args) {
      return noTracking(this, "push", args);
    },
    reduce(fn2, ...args) {
      return reduce$1(this, "reduce", fn2, args);
    },
    reduceRight(fn2, ...args) {
      return reduce$1(this, "reduceRight", fn2, args);
    },
    shift() {
      return noTracking(this, "shift");
    },
    // slice could use ARRAY_ITERATE but also seems to beg for range tracking
    some(fn2, thisArg) {
      return apply(this, "some", fn2, thisArg, void 0, arguments);
    },
    splice(...args) {
      return noTracking(this, "splice", args);
    },
    toReversed() {
      return reactiveReadArray(this).toReversed();
    },
    toSorted(comparer) {
      return reactiveReadArray(this).toSorted(comparer);
    },
    toSpliced(...args) {
      return reactiveReadArray(this).toSpliced(...args);
    },
    unshift(...args) {
      return noTracking(this, "unshift", args);
    },
    values() {
      return iterator$1(this, "values", (item2) => toWrapped(this, item2));
    }
  };
  function iterator$1(self2, method, wrapValue) {
    const arr = shallowReadArray(self2);
    const iter = arr[method]();
    if (arr !== self2 && !isShallow(self2)) {
      iter._next = iter.next;
      iter.next = () => {
        const result = iter._next();
        if (!result.done) {
          result.value = wrapValue(result.value);
        }
        return result;
      };
    }
    return iter;
  }
  const arrayProto = Array.prototype;
  function apply(self2, method, fn2, thisArg, wrappedRetFn, args) {
    const arr = shallowReadArray(self2);
    const needsWrap = arr !== self2 && !isShallow(self2);
    const methodFn = arr[method];
    if (methodFn !== arrayProto[method]) {
      const result2 = methodFn.apply(self2, args);
      return needsWrap ? toReactive(result2) : result2;
    }
    let wrappedFn = fn2;
    if (arr !== self2) {
      if (needsWrap) {
        wrappedFn = function(item2, index) {
          return fn2.call(this, toWrapped(self2, item2), index, self2);
        };
      } else if (fn2.length > 2) {
        wrappedFn = function(item2, index) {
          return fn2.call(this, item2, index, self2);
        };
      }
    }
    const result = methodFn.call(arr, wrappedFn, thisArg);
    return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
  }
  function reduce$1(self2, method, fn2, args) {
    const arr = shallowReadArray(self2);
    let wrappedFn = fn2;
    if (arr !== self2) {
      if (!isShallow(self2)) {
        wrappedFn = function(acc, item2, index) {
          return fn2.call(this, acc, toWrapped(self2, item2), index, self2);
        };
      } else if (fn2.length > 3) {
        wrappedFn = function(acc, item2, index) {
          return fn2.call(this, acc, item2, index, self2);
        };
      }
    }
    return arr[method](wrappedFn, ...args);
  }
  function searchProxy(self2, method, args) {
    const arr = toRaw(self2);
    track(arr, "iterate", ARRAY_ITERATE_KEY);
    const res2 = arr[method](...args);
    if ((res2 === -1 || res2 === false) && isProxy(args[0])) {
      args[0] = toRaw(args[0]);
      return arr[method](...args);
    }
    return res2;
  }
  function noTracking(self2, method, args = []) {
    pauseTracking();
    startBatch();
    const res2 = toRaw(self2)[method].apply(self2, args);
    endBatch();
    resetTracking();
    return res2;
  }
  const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
  const builtInSymbols = new Set(
    /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
  );
  function hasOwnProperty$1(key) {
    if (!isSymbol(key)) key = String(key);
    const obj = toRaw(this);
    track(obj, "has", key);
    return obj.hasOwnProperty(key);
  }
  class BaseReactiveHandler {
    constructor(_isReadonly = false, _isShallow = false) {
      this._isReadonly = _isReadonly;
      this._isShallow = _isShallow;
    }
    get(target, key, receiver) {
      if (key === "__v_skip") return target["__v_skip"];
      const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_isShallow") {
        return isShallow2;
      } else if (key === "__v_raw") {
        if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
        // this means the receiver is a user proxy of the reactive proxy
        Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
          return target;
        }
        return;
      }
      const targetIsArray = isArray$2(target);
      if (!isReadonly2) {
        let fn2;
        if (targetIsArray && (fn2 = arrayInstrumentations[key])) {
          return fn2;
        }
        if (key === "hasOwnProperty") {
          return hasOwnProperty$1;
        }
      }
      const res2 = Reflect.get(
        target,
        key,
        // if this is a proxy wrapping a ref, return methods using the raw ref
        // as receiver so that we don't have to call `toRaw` on the ref in all
        // its class methods
        isRef(target) ? target : receiver
      );
      if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res2;
      }
      if (!isReadonly2) {
        track(target, "get", key);
      }
      if (isShallow2) {
        return res2;
      }
      if (isRef(res2)) {
        const value = targetIsArray && isIntegerKey(key) ? res2 : res2.value;
        return isReadonly2 && isObject$2(value) ? readonly(value) : value;
      }
      if (isObject$2(res2)) {
        return isReadonly2 ? readonly(res2) : reactive(res2);
      }
      return res2;
    }
  }
  class MutableReactiveHandler extends BaseReactiveHandler {
    constructor(isShallow2 = false) {
      super(false, isShallow2);
    }
    set(target, key, value, receiver) {
      let oldValue = target[key];
      const isArrayWithIntegerKey = isArray$2(target) && isIntegerKey(key);
      if (!this._isShallow) {
        const isOldValueReadonly = isReadonly(oldValue);
        if (!isShallow(value) && !isReadonly(value)) {
          oldValue = toRaw(oldValue);
          value = toRaw(value);
        }
        if (!isArrayWithIntegerKey && isRef(oldValue) && !isRef(value)) {
          if (isOldValueReadonly) {
            {
              warn$2(
                `Set operation on key "${String(key)}" failed: target is readonly.`,
                target[key]
              );
            }
            return true;
          } else {
            oldValue.value = value;
            return true;
          }
        }
      }
      const hadKey = isArrayWithIntegerKey ? Number(key) < target.length : hasOwn(target, key);
      const result = Reflect.set(
        target,
        key,
        value,
        isRef(target) ? target : receiver
      );
      if (target === toRaw(receiver)) {
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value, oldValue);
        }
      }
      return result;
    }
    deleteProperty(target, key) {
      const hadKey = hasOwn(target, key);
      const oldValue = target[key];
      const result = Reflect.deleteProperty(target, key);
      if (result && hadKey) {
        trigger(target, "delete", key, void 0, oldValue);
      }
      return result;
    }
    has(target, key) {
      const result = Reflect.has(target, key);
      if (!isSymbol(key) || !builtInSymbols.has(key)) {
        track(target, "has", key);
      }
      return result;
    }
    ownKeys(target) {
      track(
        target,
        "iterate",
        isArray$2(target) ? "length" : ITERATE_KEY
      );
      return Reflect.ownKeys(target);
    }
  }
  class ReadonlyReactiveHandler extends BaseReactiveHandler {
    constructor(isShallow2 = false) {
      super(true, isShallow2);
    }
    set(target, key) {
      {
        warn$2(
          `Set operation on key "${String(key)}" failed: target is readonly.`,
          target
        );
      }
      return true;
    }
    deleteProperty(target, key) {
      {
        warn$2(
          `Delete operation on key "${String(key)}" failed: target is readonly.`,
          target
        );
      }
      return true;
    }
  }
  const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
  const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
  const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
  const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
  const toShallow = (value) => value;
  const getProto$1 = (v) => Reflect.getPrototypeOf(v);
  function createIterableMethod(method, isReadonly2, isShallow2) {
    return function(...args) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const targetIsMap = isMap(rawTarget);
      const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
      const isKeyOnly = method === "keys" && targetIsMap;
      const innerIterator = target[method](...args);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      !isReadonly2 && track(
        rawTarget,
        "iterate",
        isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
      );
      return {
        // iterator protocol
        next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        },
        // iterable protocol
        [Symbol.iterator]() {
          return this;
        }
      };
    };
  }
  function createReadonlyMethod(type2) {
    return function(...args) {
      {
        const key = args[0] ? `on key "${args[0]}" ` : ``;
        warn$2(
          `${capitalize(type2)} operation ${key}failed: target is readonly.`,
          toRaw(this)
        );
      }
      return type2 === "delete" ? false : type2 === "clear" ? void 0 : this;
    };
  }
  function createInstrumentations(readonly2, shallow) {
    const instrumentations = {
      get(key) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const rawKey = toRaw(key);
        if (!readonly2) {
          if (hasChanged(key, rawKey)) {
            track(rawTarget, "get", key);
          }
          track(rawTarget, "get", rawKey);
        }
        const { has } = getProto$1(rawTarget);
        const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
        if (has.call(rawTarget, key)) {
          return wrap(target.get(key));
        } else if (has.call(rawTarget, rawKey)) {
          return wrap(target.get(rawKey));
        } else if (target !== rawTarget) {
          target.get(key);
        }
      },
      get size() {
        const target = this["__v_raw"];
        !readonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
        return target.size;
      },
      has(key) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const rawKey = toRaw(key);
        if (!readonly2) {
          if (hasChanged(key, rawKey)) {
            track(rawTarget, "has", key);
          }
          track(rawTarget, "has", rawKey);
        }
        return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
      },
      forEach(callback, thisArg) {
        const observed = this;
        const target = observed["__v_raw"];
        const rawTarget = toRaw(target);
        const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
        !readonly2 && track(rawTarget, "iterate", ITERATE_KEY);
        return target.forEach((value, key) => {
          return callback.call(thisArg, wrap(value), wrap(key), observed);
        });
      }
    };
    extend$1(
      instrumentations,
      readonly2 ? {
        add: createReadonlyMethod("add"),
        set: createReadonlyMethod("set"),
        delete: createReadonlyMethod("delete"),
        clear: createReadonlyMethod("clear")
      } : {
        add(value) {
          if (!shallow && !isShallow(value) && !isReadonly(value)) {
            value = toRaw(value);
          }
          const target = toRaw(this);
          const proto = getProto$1(target);
          const hadKey = proto.has.call(target, value);
          if (!hadKey) {
            target.add(value);
            trigger(target, "add", value, value);
          }
          return this;
        },
        set(key, value) {
          if (!shallow && !isShallow(value) && !isReadonly(value)) {
            value = toRaw(value);
          }
          const target = toRaw(this);
          const { has, get: get2 } = getProto$1(target);
          let hadKey = has.call(target, key);
          if (!hadKey) {
            key = toRaw(key);
            hadKey = has.call(target, key);
          } else {
            checkIdentityKeys(target, has, key);
          }
          const oldValue = get2.call(target, key);
          target.set(key, value);
          if (!hadKey) {
            trigger(target, "add", key, value);
          } else if (hasChanged(value, oldValue)) {
            trigger(target, "set", key, value, oldValue);
          }
          return this;
        },
        delete(key) {
          const target = toRaw(this);
          const { has, get: get2 } = getProto$1(target);
          let hadKey = has.call(target, key);
          if (!hadKey) {
            key = toRaw(key);
            hadKey = has.call(target, key);
          } else {
            checkIdentityKeys(target, has, key);
          }
          const oldValue = get2 ? get2.call(target, key) : void 0;
          const result = target.delete(key);
          if (hadKey) {
            trigger(target, "delete", key, void 0, oldValue);
          }
          return result;
        },
        clear() {
          const target = toRaw(this);
          const hadItems = target.size !== 0;
          const oldTarget = isMap(target) ? new Map(target) : new Set(target);
          const result = target.clear();
          if (hadItems) {
            trigger(
              target,
              "clear",
              void 0,
              void 0,
              oldTarget
            );
          }
          return result;
        }
      }
    );
    const iteratorMethods = [
      "keys",
      "values",
      "entries",
      Symbol.iterator
    ];
    iteratorMethods.forEach((method) => {
      instrumentations[method] = createIterableMethod(method, readonly2, shallow);
    });
    return instrumentations;
  }
  function createInstrumentationGetter(isReadonly2, shallow) {
    const instrumentations = createInstrumentations(isReadonly2, shallow);
    return (target, key, receiver) => {
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_raw") {
        return target;
      }
      return Reflect.get(
        hasOwn(instrumentations, key) && key in target ? instrumentations : target,
        key,
        receiver
      );
    };
  }
  const mutableCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, false)
  };
  const shallowCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, true)
  };
  const readonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, false)
  };
  const shallowReadonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, true)
  };
  function checkIdentityKeys(target, has, key) {
    const rawKey = toRaw(key);
    if (rawKey !== key && has.call(target, rawKey)) {
      const type2 = toRawType(target);
      warn$2(
        `Reactive ${type2} contains both the raw and reactive versions of the same object${type2 === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
      );
    }
  }
  const reactiveMap = /* @__PURE__ */ new WeakMap();
  const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
  const readonlyMap = /* @__PURE__ */ new WeakMap();
  const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
  function targetTypeMap(rawType) {
    switch (rawType) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  function getTargetType(value) {
    return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
  }
  function reactive(target) {
    if (isReadonly(target)) {
      return target;
    }
    return createReactiveObject(
      target,
      false,
      mutableHandlers,
      mutableCollectionHandlers,
      reactiveMap
    );
  }
  function shallowReactive(target) {
    return createReactiveObject(
      target,
      false,
      shallowReactiveHandlers,
      shallowCollectionHandlers,
      shallowReactiveMap
    );
  }
  function readonly(target) {
    return createReactiveObject(
      target,
      true,
      readonlyHandlers,
      readonlyCollectionHandlers,
      readonlyMap
    );
  }
  function shallowReadonly(target) {
    return createReactiveObject(
      target,
      true,
      shallowReadonlyHandlers,
      shallowReadonlyCollectionHandlers,
      shallowReadonlyMap
    );
  }
  function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject$2(target)) {
      {
        warn$2(
          `value cannot be made ${isReadonly2 ? "readonly" : "reactive"}: ${String(
            target
          )}`
        );
      }
      return target;
    }
    if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
      return target;
    }
    const targetType = getTargetType(target);
    if (targetType === 0) {
      return target;
    }
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const proxy = new Proxy(
      target,
      targetType === 2 ? collectionHandlers : baseHandlers
    );
    proxyMap.set(target, proxy);
    return proxy;
  }
  function isReactive(value) {
    if (isReadonly(value)) {
      return isReactive(value["__v_raw"]);
    }
    return !!(value && value["__v_isReactive"]);
  }
  function isReadonly(value) {
    return !!(value && value["__v_isReadonly"]);
  }
  function isShallow(value) {
    return !!(value && value["__v_isShallow"]);
  }
  function isProxy(value) {
    return value ? !!value["__v_raw"] : false;
  }
  function toRaw(observed) {
    const raw = observed && observed["__v_raw"];
    return raw ? toRaw(raw) : observed;
  }
  function markRaw(value) {
    if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
      def(value, "__v_skip", true);
    }
    return value;
  }
  const toReactive = (value) => isObject$2(value) ? reactive(value) : value;
  const toReadonly = (value) => isObject$2(value) ? readonly(value) : value;
  function isRef(r2) {
    return r2 ? r2["__v_isRef"] === true : false;
  }
  function ref$1(value) {
    return createRef(value, false);
  }
  function createRef(rawValue, shallow) {
    if (isRef(rawValue)) {
      return rawValue;
    }
    return new RefImpl(rawValue, shallow);
  }
  class RefImpl {
    constructor(value, isShallow2) {
      this.dep = new Dep();
      this["__v_isRef"] = true;
      this["__v_isShallow"] = false;
      this._rawValue = isShallow2 ? value : toRaw(value);
      this._value = isShallow2 ? value : toReactive(value);
      this["__v_isShallow"] = isShallow2;
    }
    get value() {
      {
        this.dep.track({
          target: this,
          type: "get",
          key: "value"
        });
      }
      return this._value;
    }
    set value(newValue) {
      const oldValue = this._rawValue;
      const useDirectValue = this["__v_isShallow"] || isShallow(newValue) || isReadonly(newValue);
      newValue = useDirectValue ? newValue : toRaw(newValue);
      if (hasChanged(newValue, oldValue)) {
        this._rawValue = newValue;
        this._value = useDirectValue ? newValue : toReactive(newValue);
        {
          this.dep.trigger({
            target: this,
            type: "set",
            key: "value",
            newValue,
            oldValue
          });
        }
      }
    }
  }
  function unref(ref2) {
    return isRef(ref2) ? ref2.value : ref2;
  }
  const shallowUnwrapHandlers = {
    get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
    set: (target, key, value, receiver) => {
      const oldValue = target[key];
      if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    }
  };
  function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
  }
  class ComputedRefImpl {
    constructor(fn2, setter, isSSR) {
      this.fn = fn2;
      this.setter = setter;
      this._value = void 0;
      this.dep = new Dep(this);
      this.__v_isRef = true;
      this.deps = void 0;
      this.depsTail = void 0;
      this.flags = 16;
      this.globalVersion = globalVersion - 1;
      this.next = void 0;
      this.effect = this;
      this["__v_isReadonly"] = !setter;
      this.isSSR = isSSR;
    }
    /**
     * @internal
     */
    notify() {
      this.flags |= 16;
      if (!(this.flags & 8) && // avoid infinite self recursion
      activeSub !== this) {
        batch(this, true);
        return true;
      }
    }
    get value() {
      const link = this.dep.track({
        target: this,
        type: "get",
        key: "value"
      });
      refreshComputed(this);
      if (link) {
        link.version = this.dep.version;
      }
      return this._value;
    }
    set value(newValue) {
      if (this.setter) {
        this.setter(newValue);
      } else {
        warn$2("Write operation failed: computed value is readonly");
      }
    }
  }
  function computed$1(getterOrOptions, debugOptions, isSSR = false) {
    let getter;
    let setter;
    if (isFunction$3(getterOrOptions)) {
      getter = getterOrOptions;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    const cRef = new ComputedRefImpl(getter, setter, isSSR);
    if (debugOptions && !isSSR) {
      cRef.onTrack = debugOptions.onTrack;
      cRef.onTrigger = debugOptions.onTrigger;
    }
    return cRef;
  }
  const INITIAL_WATCHER_VALUE = {};
  const cleanupMap = /* @__PURE__ */ new WeakMap();
  let activeWatcher = void 0;
  function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
    if (owner) {
      let cleanups = cleanupMap.get(owner);
      if (!cleanups) cleanupMap.set(owner, cleanups = []);
      cleanups.push(cleanupFn);
    } else if (!failSilently) {
      warn$2(
        `onWatcherCleanup() was called when there was no active watcher to associate with.`
      );
    }
  }
  function watch$1(source, cb, options = EMPTY_OBJ) {
    const { immediate, deep, once, scheduler, augmentJob, call } = options;
    const warnInvalidSource = (s2) => {
      (options.onWarn || warn$2)(
        `Invalid watch source: `,
        s2,
        `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`
      );
    };
    const reactiveGetter = (source2) => {
      if (deep) return source2;
      if (isShallow(source2) || deep === false || deep === 0)
        return traverse(source2, 1);
      return traverse(source2);
    };
    let effect2;
    let getter;
    let cleanup;
    let boundCleanup;
    let forceTrigger = false;
    let isMultiSource = false;
    if (isRef(source)) {
      getter = () => source.value;
      forceTrigger = isShallow(source);
    } else if (isReactive(source)) {
      getter = () => reactiveGetter(source);
      forceTrigger = true;
    } else if (isArray$2(source)) {
      isMultiSource = true;
      forceTrigger = source.some((s2) => isReactive(s2) || isShallow(s2));
      getter = () => source.map((s2) => {
        if (isRef(s2)) {
          return s2.value;
        } else if (isReactive(s2)) {
          return reactiveGetter(s2);
        } else if (isFunction$3(s2)) {
          return call ? call(s2, 2) : s2();
        } else {
          warnInvalidSource(s2);
        }
      });
    } else if (isFunction$3(source)) {
      if (cb) {
        getter = call ? () => call(source, 2) : source;
      } else {
        getter = () => {
          if (cleanup) {
            pauseTracking();
            try {
              cleanup();
            } finally {
              resetTracking();
            }
          }
          const currentEffect = activeWatcher;
          activeWatcher = effect2;
          try {
            return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
          } finally {
            activeWatcher = currentEffect;
          }
        };
      }
    } else {
      getter = NOOP;
      warnInvalidSource(source);
    }
    if (cb && deep) {
      const baseGetter = getter;
      const depth = deep === true ? Infinity : deep;
      getter = () => traverse(baseGetter(), depth);
    }
    const scope = getCurrentScope();
    const watchHandle = () => {
      effect2.stop();
      if (scope && scope.active) {
        remove(scope.effects, effect2);
      }
    };
    if (once && cb) {
      const _cb = cb;
      cb = (...args) => {
        _cb(...args);
        watchHandle();
      };
    }
    let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
    const job = (immediateFirstRun) => {
      if (!(effect2.flags & 1) || !effect2.dirty && !immediateFirstRun) {
        return;
      }
      if (cb) {
        const newValue = effect2.run();
        if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
          if (cleanup) {
            cleanup();
          }
          const currentWatcher = activeWatcher;
          activeWatcher = effect2;
          try {
            const args = [
              newValue,
              // pass undefined as the old value when it's changed for the first time
              oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
              boundCleanup
            ];
            oldValue = newValue;
            call ? call(cb, 3, args) : (
              // @ts-expect-error
              cb(...args)
            );
          } finally {
            activeWatcher = currentWatcher;
          }
        }
      } else {
        effect2.run();
      }
    };
    if (augmentJob) {
      augmentJob(job);
    }
    effect2 = new ReactiveEffect(getter);
    effect2.scheduler = scheduler ? () => scheduler(job, false) : job;
    boundCleanup = (fn2) => onWatcherCleanup(fn2, false, effect2);
    cleanup = effect2.onStop = () => {
      const cleanups = cleanupMap.get(effect2);
      if (cleanups) {
        if (call) {
          call(cleanups, 4);
        } else {
          for (const cleanup2 of cleanups) cleanup2();
        }
        cleanupMap.delete(effect2);
      }
    };
    {
      effect2.onTrack = options.onTrack;
      effect2.onTrigger = options.onTrigger;
    }
    if (cb) {
      if (immediate) {
        job(true);
      } else {
        oldValue = effect2.run();
      }
    } else if (scheduler) {
      scheduler(job.bind(null, true), true);
    } else {
      effect2.run();
    }
    watchHandle.pause = effect2.pause.bind(effect2);
    watchHandle.resume = effect2.resume.bind(effect2);
    watchHandle.stop = watchHandle;
    return watchHandle;
  }
  function traverse(value, depth = Infinity, seen) {
    if (depth <= 0 || !isObject$2(value) || value["__v_skip"]) {
      return value;
    }
    seen = seen || /* @__PURE__ */ new Map();
    if ((seen.get(value) || 0) >= depth) {
      return value;
    }
    seen.set(value, depth);
    depth--;
    if (isRef(value)) {
      traverse(value.value, depth, seen);
    } else if (isArray$2(value)) {
      for (let i = 0; i < value.length; i++) {
        traverse(value[i], depth, seen);
      }
    } else if (isSet(value) || isMap(value)) {
      value.forEach((v) => {
        traverse(v, depth, seen);
      });
    } else if (isPlainObject$1(value)) {
      for (const key in value) {
        traverse(value[key], depth, seen);
      }
      for (const key of Object.getOwnPropertySymbols(value)) {
        if (Object.prototype.propertyIsEnumerable.call(value, key)) {
          traverse(value[key], depth, seen);
        }
      }
    }
    return value;
  }
  /**
  * @vue/runtime-core v3.5.25
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  const stack = [];
  function pushWarningContext(vnode) {
    stack.push(vnode);
  }
  function popWarningContext() {
    stack.pop();
  }
  let isWarning = false;
  function warn$1(msg, ...args) {
    if (isWarning) return;
    isWarning = true;
    pauseTracking();
    const instance = stack.length ? stack[stack.length - 1].component : null;
    const appWarnHandler = instance && instance.appContext.config.warnHandler;
    const trace = getComponentTrace();
    if (appWarnHandler) {
      callWithErrorHandling(
        appWarnHandler,
        instance,
        11,
        [
          // eslint-disable-next-line no-restricted-syntax
          msg + args.map((a) => {
            var _a, _b;
            return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
          }).join(""),
          instance && instance.proxy,
          trace.map(
            ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
          ).join("\n"),
          trace
        ]
      );
    } else {
      const warnArgs = [`[Vue warn]: ${msg}`, ...args];
      if (trace.length && // avoid spamming console during tests
      true) {
        warnArgs.push(`
`, ...formatTrace(trace));
      }
      console.warn(...warnArgs);
    }
    resetTracking();
    isWarning = false;
  }
  function getComponentTrace() {
    let currentVNode = stack[stack.length - 1];
    if (!currentVNode) {
      return [];
    }
    const normalizedStack = [];
    while (currentVNode) {
      const last = normalizedStack[0];
      if (last && last.vnode === currentVNode) {
        last.recurseCount++;
      } else {
        normalizedStack.push({
          vnode: currentVNode,
          recurseCount: 0
        });
      }
      const parentInstance = currentVNode.component && currentVNode.component.parent;
      currentVNode = parentInstance && parentInstance.vnode;
    }
    return normalizedStack;
  }
  function formatTrace(trace) {
    const logs = [];
    trace.forEach((entry, i) => {
      logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
    });
    return logs;
  }
  function formatTraceEntry({ vnode, recurseCount }) {
    const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
    const isRoot = vnode.component ? vnode.component.parent == null : false;
    const open = ` at <${formatComponentName(
      vnode.component,
      vnode.type,
      isRoot
    )}`;
    const close = `>` + postfix;
    return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
  }
  function formatProps(props2) {
    const res2 = [];
    const keys = Object.keys(props2);
    keys.slice(0, 3).forEach((key) => {
      res2.push(...formatProp(key, props2[key]));
    });
    if (keys.length > 3) {
      res2.push(` ...`);
    }
    return res2;
  }
  function formatProp(key, value, raw) {
    if (isString$2(value)) {
      value = JSON.stringify(value);
      return raw ? value : [`${key}=${value}`];
    } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
      return raw ? value : [`${key}=${value}`];
    } else if (isRef(value)) {
      value = formatProp(key, toRaw(value.value), true);
      return raw ? value : [`${key}=Ref<`, value, `>`];
    } else if (isFunction$3(value)) {
      return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
    } else {
      value = toRaw(value);
      return raw ? value : [`${key}=`, value];
    }
  }
  const ErrorTypeStrings$1 = {
    ["sp"]: "serverPrefetch hook",
    ["bc"]: "beforeCreate hook",
    ["c"]: "created hook",
    ["bm"]: "beforeMount hook",
    ["m"]: "mounted hook",
    ["bu"]: "beforeUpdate hook",
    ["u"]: "updated",
    ["bum"]: "beforeUnmount hook",
    ["um"]: "unmounted hook",
    ["a"]: "activated hook",
    ["da"]: "deactivated hook",
    ["ec"]: "errorCaptured hook",
    ["rtc"]: "renderTracked hook",
    ["rtg"]: "renderTriggered hook",
    [0]: "setup function",
    [1]: "render function",
    [2]: "watcher getter",
    [3]: "watcher callback",
    [4]: "watcher cleanup function",
    [5]: "native event handler",
    [6]: "component event handler",
    [7]: "vnode hook",
    [8]: "directive hook",
    [9]: "transition hook",
    [10]: "app errorHandler",
    [11]: "app warnHandler",
    [12]: "ref function",
    [13]: "async component loader",
    [14]: "scheduler flush",
    [15]: "component update",
    [16]: "app unmount cleanup function"
  };
  function callWithErrorHandling(fn2, instance, type2, args) {
    try {
      return args ? fn2(...args) : fn2();
    } catch (err) {
      handleError(err, instance, type2);
    }
  }
  function callWithAsyncErrorHandling(fn2, instance, type2, args) {
    if (isFunction$3(fn2)) {
      const res2 = callWithErrorHandling(fn2, instance, type2, args);
      if (res2 && isPromise(res2)) {
        res2.catch((err) => {
          handleError(err, instance, type2);
        });
      }
      return res2;
    }
    if (isArray$2(fn2)) {
      const values = [];
      for (let i = 0; i < fn2.length; i++) {
        values.push(callWithAsyncErrorHandling(fn2[i], instance, type2, args));
      }
      return values;
    } else {
      warn$1(
        `Invalid value type passed to callWithAsyncErrorHandling(): ${typeof fn2}`
      );
    }
  }
  function handleError(err, instance, type2, throwInDev = true) {
    const contextVNode = instance ? instance.vnode : null;
    const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
    if (instance) {
      let cur = instance.parent;
      const exposedInstance = instance.proxy;
      const errorInfo = ErrorTypeStrings$1[type2];
      while (cur) {
        const errorCapturedHooks = cur.ec;
        if (errorCapturedHooks) {
          for (let i = 0; i < errorCapturedHooks.length; i++) {
            if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
              return;
            }
          }
        }
        cur = cur.parent;
      }
      if (errorHandler) {
        pauseTracking();
        callWithErrorHandling(errorHandler, null, 10, [
          err,
          exposedInstance,
          errorInfo
        ]);
        resetTracking();
        return;
      }
    }
    logError(err, type2, contextVNode, throwInDev, throwUnhandledErrorInProduction);
  }
  function logError(err, type2, contextVNode, throwInDev = true, throwInProd = false) {
    {
      const info = ErrorTypeStrings$1[type2];
      if (contextVNode) {
        pushWarningContext(contextVNode);
      }
      warn$1(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
      if (contextVNode) {
        popWarningContext();
      }
      if (throwInDev) {
        throw err;
      } else {
        console.error(err);
      }
    }
  }
  const queue = [];
  let flushIndex = -1;
  const pendingPostFlushCbs = [];
  let activePostFlushCbs = null;
  let postFlushIndex = 0;
  const resolvedPromise = /* @__PURE__ */ Promise.resolve();
  let currentFlushPromise = null;
  const RECURSION_LIMIT = 100;
  function nextTick(fn2) {
    const p2 = currentFlushPromise || resolvedPromise;
    return fn2 ? p2.then(this ? fn2.bind(this) : fn2) : p2;
  }
  function findInsertionIndex(id) {
    let start = flushIndex + 1;
    let end2 = queue.length;
    while (start < end2) {
      const middle = start + end2 >>> 1;
      const middleJob = queue[middle];
      const middleJobId = getId(middleJob);
      if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
        start = middle + 1;
      } else {
        end2 = middle;
      }
    }
    return start;
  }
  function queueJob(job) {
    if (!(job.flags & 1)) {
      const jobId = getId(job);
      const lastJob = queue[queue.length - 1];
      if (!lastJob || // fast path when the job id is larger than the tail
      !(job.flags & 2) && jobId >= getId(lastJob)) {
        queue.push(job);
      } else {
        queue.splice(findInsertionIndex(jobId), 0, job);
      }
      job.flags |= 1;
      queueFlush();
    }
  }
  function queueFlush() {
    if (!currentFlushPromise) {
      currentFlushPromise = resolvedPromise.then(flushJobs);
    }
  }
  function queuePostFlushCb(cb) {
    if (!isArray$2(cb)) {
      if (activePostFlushCbs && cb.id === -1) {
        activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
      } else if (!(cb.flags & 1)) {
        pendingPostFlushCbs.push(cb);
        cb.flags |= 1;
      }
    } else {
      pendingPostFlushCbs.push(...cb);
    }
    queueFlush();
  }
  function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
    {
      seen = seen || /* @__PURE__ */ new Map();
    }
    for (; i < queue.length; i++) {
      const cb = queue[i];
      if (cb && cb.flags & 2) {
        if (instance && cb.id !== instance.uid) {
          continue;
        }
        if (checkRecursiveUpdates(seen, cb)) {
          continue;
        }
        queue.splice(i, 1);
        i--;
        if (cb.flags & 4) {
          cb.flags &= -2;
        }
        cb();
        if (!(cb.flags & 4)) {
          cb.flags &= -2;
        }
      }
    }
  }
  function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
      const deduped = [...new Set(pendingPostFlushCbs)].sort(
        (a, b) => getId(a) - getId(b)
      );
      pendingPostFlushCbs.length = 0;
      if (activePostFlushCbs) {
        activePostFlushCbs.push(...deduped);
        return;
      }
      activePostFlushCbs = deduped;
      {
        seen = seen || /* @__PURE__ */ new Map();
      }
      for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
        const cb = activePostFlushCbs[postFlushIndex];
        if (checkRecursiveUpdates(seen, cb)) {
          continue;
        }
        if (cb.flags & 4) {
          cb.flags &= -2;
        }
        if (!(cb.flags & 8)) cb();
        cb.flags &= -2;
      }
      activePostFlushCbs = null;
      postFlushIndex = 0;
    }
  }
  const getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
  function flushJobs(seen) {
    {
      seen = seen || /* @__PURE__ */ new Map();
    }
    const check = (job) => checkRecursiveUpdates(seen, job);
    try {
      for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job && !(job.flags & 8)) {
          if (check(job)) {
            continue;
          }
          if (job.flags & 4) {
            job.flags &= ~1;
          }
          callWithErrorHandling(
            job,
            job.i,
            job.i ? 15 : 14
          );
          if (!(job.flags & 4)) {
            job.flags &= ~1;
          }
        }
      }
    } finally {
      for (; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job) {
          job.flags &= -2;
        }
      }
      flushIndex = -1;
      queue.length = 0;
      flushPostFlushCbs(seen);
      currentFlushPromise = null;
      if (queue.length || pendingPostFlushCbs.length) {
        flushJobs(seen);
      }
    }
  }
  function checkRecursiveUpdates(seen, fn2) {
    const count = seen.get(fn2) || 0;
    if (count > RECURSION_LIMIT) {
      const instance = fn2.i;
      const componentName = instance && getComponentName(instance.type);
      handleError(
        `Maximum recursive updates exceeded${componentName ? ` in component <${componentName}>` : ``}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
        null,
        10
      );
      return true;
    }
    seen.set(fn2, count + 1);
    return false;
  }
  let isHmrUpdating = false;
  const hmrDirtyComponents = /* @__PURE__ */ new Map();
  {
    getGlobalThis().__VUE_HMR_RUNTIME__ = {
      createRecord: tryWrap(createRecord),
      rerender: tryWrap(rerender),
      reload: tryWrap(reload)
    };
  }
  const map$1 = /* @__PURE__ */ new Map();
  function registerHMR(instance) {
    const id = instance.type.__hmrId;
    let record = map$1.get(id);
    if (!record) {
      createRecord(id, instance.type);
      record = map$1.get(id);
    }
    record.instances.add(instance);
  }
  function unregisterHMR(instance) {
    map$1.get(instance.type.__hmrId).instances.delete(instance);
  }
  function createRecord(id, initialDef) {
    if (map$1.has(id)) {
      return false;
    }
    map$1.set(id, {
      initialDef: normalizeClassComponent(initialDef),
      instances: /* @__PURE__ */ new Set()
    });
    return true;
  }
  function normalizeClassComponent(component) {
    return isClassComponent(component) ? component.__vccOpts : component;
  }
  function rerender(id, newRender) {
    const record = map$1.get(id);
    if (!record) {
      return;
    }
    record.initialDef.render = newRender;
    [...record.instances].forEach((instance) => {
      if (newRender) {
        instance.render = newRender;
        normalizeClassComponent(instance.type).render = newRender;
      }
      instance.renderCache = [];
      isHmrUpdating = true;
      if (!(instance.job.flags & 8)) {
        instance.update();
      }
      isHmrUpdating = false;
    });
  }
  function reload(id, newComp) {
    const record = map$1.get(id);
    if (!record) return;
    newComp = normalizeClassComponent(newComp);
    updateComponentDef(record.initialDef, newComp);
    const instances2 = [...record.instances];
    for (let i = 0; i < instances2.length; i++) {
      const instance = instances2[i];
      const oldComp = normalizeClassComponent(instance.type);
      let dirtyInstances = hmrDirtyComponents.get(oldComp);
      if (!dirtyInstances) {
        if (oldComp !== record.initialDef) {
          updateComponentDef(oldComp, newComp);
        }
        hmrDirtyComponents.set(oldComp, dirtyInstances = /* @__PURE__ */ new Set());
      }
      dirtyInstances.add(instance);
      instance.appContext.propsCache.delete(instance.type);
      instance.appContext.emitsCache.delete(instance.type);
      instance.appContext.optionsCache.delete(instance.type);
      if (instance.ceReload) {
        dirtyInstances.add(instance);
        instance.ceReload(newComp.styles);
        dirtyInstances.delete(instance);
      } else if (instance.parent) {
        queueJob(() => {
          if (!(instance.job.flags & 8)) {
            isHmrUpdating = true;
            instance.parent.update();
            isHmrUpdating = false;
            dirtyInstances.delete(instance);
          }
        });
      } else if (instance.appContext.reload) {
        instance.appContext.reload();
      } else if (typeof window !== "undefined") {
        window.location.reload();
      } else {
        console.warn(
          "[HMR] Root or manually mounted instance modified. Full reload required."
        );
      }
      if (instance.root.ce && instance !== instance.root) {
        instance.root.ce._removeChildStyle(oldComp);
      }
    }
    queuePostFlushCb(() => {
      hmrDirtyComponents.clear();
    });
  }
  function updateComponentDef(oldComp, newComp) {
    extend$1(oldComp, newComp);
    for (const key in oldComp) {
      if (key !== "__file" && !(key in newComp)) {
        delete oldComp[key];
      }
    }
  }
  function tryWrap(fn2) {
    return (id, arg) => {
      try {
        return fn2(id, arg);
      } catch (e) {
        console.error(e);
        console.warn(
          `[HMR] Something went wrong during Vue component hot-reload. Full reload required.`
        );
      }
    };
  }
  let devtools$1;
  let buffer = [];
  let devtoolsNotInstalled = false;
  function emit$1(event, ...args) {
    if (devtools$1) {
      devtools$1.emit(event, ...args);
    } else if (!devtoolsNotInstalled) {
      buffer.push({ event, args });
    }
  }
  function setDevtoolsHook$1(hook, target) {
    var _a, _b;
    devtools$1 = hook;
    if (devtools$1) {
      devtools$1.enabled = true;
      buffer.forEach(({ event, args }) => devtools$1.emit(event, ...args));
      buffer = [];
    } else if (
      // handle late devtools injection - only do this if we are in an actual
      // browser environment to avoid the timer handle stalling test runner exit
      // (#4815)
      typeof window !== "undefined" && // some envs mock window but not fully
      window.HTMLElement && // also exclude jsdom
      // eslint-disable-next-line no-restricted-syntax
      !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))
    ) {
      const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
      replay.push((newHook) => {
        setDevtoolsHook$1(newHook, target);
      });
      setTimeout(() => {
        if (!devtools$1) {
          target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
          devtoolsNotInstalled = true;
          buffer = [];
        }
      }, 3e3);
    } else {
      devtoolsNotInstalled = true;
      buffer = [];
    }
  }
  function devtoolsInitApp(app, version2) {
    emit$1("app:init", app, version2, {
      Fragment,
      Text,
      Comment,
      Static
    });
  }
  function devtoolsUnmountApp(app) {
    emit$1("app:unmount", app);
  }
  const devtoolsComponentAdded = /* @__PURE__ */ createDevtoolsComponentHook(
    "component:added"
    /* COMPONENT_ADDED */
  );
  const devtoolsComponentUpdated = /* @__PURE__ */ createDevtoolsComponentHook(
    "component:updated"
    /* COMPONENT_UPDATED */
  );
  const _devtoolsComponentRemoved = /* @__PURE__ */ createDevtoolsComponentHook(
    "component:removed"
    /* COMPONENT_REMOVED */
  );
  const devtoolsComponentRemoved = (component) => {
    if (devtools$1 && typeof devtools$1.cleanupBuffer === "function" && // remove the component if it wasn't buffered
    !devtools$1.cleanupBuffer(component)) {
      _devtoolsComponentRemoved(component);
    }
  };
  // @__NO_SIDE_EFFECTS__
  function createDevtoolsComponentHook(hook) {
    return (component) => {
      emit$1(
        hook,
        component.appContext.app,
        component.uid,
        component.parent ? component.parent.uid : void 0,
        component
      );
    };
  }
  const devtoolsPerfStart = /* @__PURE__ */ createDevtoolsPerformanceHook(
    "perf:start"
    /* PERFORMANCE_START */
  );
  const devtoolsPerfEnd = /* @__PURE__ */ createDevtoolsPerformanceHook(
    "perf:end"
    /* PERFORMANCE_END */
  );
  function createDevtoolsPerformanceHook(hook) {
    return (component, type2, time) => {
      emit$1(hook, component.appContext.app, component.uid, component, type2, time);
    };
  }
  function devtoolsComponentEmit(component, event, params) {
    emit$1(
      "component:emit",
      component.appContext.app,
      component,
      event,
      params
    );
  }
  let currentRenderingInstance = null;
  let currentScopeId = null;
  function setCurrentRenderingInstance(instance) {
    const prev = currentRenderingInstance;
    currentRenderingInstance = instance;
    currentScopeId = instance && instance.type.__scopeId || null;
    return prev;
  }
  function withCtx(fn2, ctx = currentRenderingInstance, isNonScopedSlot) {
    if (!ctx) return fn2;
    if (fn2._n) {
      return fn2;
    }
    const renderFnWithContext = (...args) => {
      if (renderFnWithContext._d) {
        setBlockTracking(-1);
      }
      const prevInstance = setCurrentRenderingInstance(ctx);
      let res2;
      try {
        res2 = fn2(...args);
      } finally {
        setCurrentRenderingInstance(prevInstance);
        if (renderFnWithContext._d) {
          setBlockTracking(1);
        }
      }
      {
        devtoolsComponentUpdated(ctx);
      }
      return res2;
    };
    renderFnWithContext._n = true;
    renderFnWithContext._c = true;
    renderFnWithContext._d = true;
    return renderFnWithContext;
  }
  function validateDirectiveName(name2) {
    if (isBuiltInDirective(name2)) {
      warn$1("Do not use built-in directive ids as custom directive id: " + name2);
    }
  }
  function invokeDirectiveHook(vnode, prevVNode, instance, name2) {
    const bindings = vnode.dirs;
    const oldBindings = prevVNode && prevVNode.dirs;
    for (let i = 0; i < bindings.length; i++) {
      const binding = bindings[i];
      if (oldBindings) {
        binding.oldValue = oldBindings[i].value;
      }
      let hook = binding.dir[name2];
      if (hook) {
        pauseTracking();
        callWithAsyncErrorHandling(hook, instance, 8, [
          vnode.el,
          binding,
          vnode,
          prevVNode
        ]);
        resetTracking();
      }
    }
  }
  const TeleportEndKey = Symbol("_vte");
  const isTeleport = (type2) => type2.__isTeleport;
  const leaveCbKey = Symbol("_leaveCb");
  function setTransitionHooks(vnode, hooks) {
    if (vnode.shapeFlag & 6 && vnode.component) {
      vnode.transition = hooks;
      setTransitionHooks(vnode.component.subTree, hooks);
    } else if (vnode.shapeFlag & 128) {
      vnode.ssContent.transition = hooks.clone(vnode.ssContent);
      vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
    } else {
      vnode.transition = hooks;
    }
  }
  // @__NO_SIDE_EFFECTS__
  function defineComponent(options, extraOptions) {
    return isFunction$3(options) ? (
      // #8236: extend call and options.name access are considered side-effects
      // by Rollup, so we have to wrap it in a pure-annotated IIFE.
      /* @__PURE__ */ (() => extend$1({ name: options.name }, extraOptions, { setup: options }))()
    ) : options;
  }
  function markAsyncBoundary(instance) {
    instance.ids = [instance.ids[0] + instance.ids[2]++ + "-", 0, 0];
  }
  const knownTemplateRefs = /* @__PURE__ */ new WeakSet();
  const pendingSetRefMap = /* @__PURE__ */ new WeakMap();
  function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
    if (isArray$2(rawRef)) {
      rawRef.forEach(
        (r2, i) => setRef(
          r2,
          oldRawRef && (isArray$2(oldRawRef) ? oldRawRef[i] : oldRawRef),
          parentSuspense,
          vnode,
          isUnmount
        )
      );
      return;
    }
    if (isAsyncWrapper(vnode) && !isUnmount) {
      if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) {
        setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
      }
      return;
    }
    const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
    const value = isUnmount ? null : refValue;
    const { i: owner, r: ref3 } = rawRef;
    if (!owner) {
      warn$1(
        `Missing ref owner context. ref cannot be used on hoisted vnodes. A vnode with ref must be created inside the render function.`
      );
      return;
    }
    const oldRef = oldRawRef && oldRawRef.r;
    const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
    const setupState = owner.setupState;
    const rawSetupState = toRaw(setupState);
    const canSetSetupRef = setupState === EMPTY_OBJ ? NO : (key) => {
      {
        if (hasOwn(rawSetupState, key) && !isRef(rawSetupState[key])) {
          warn$1(
            `Template ref "${key}" used on a non-ref value. It will not work in the production build.`
          );
        }
        if (knownTemplateRefs.has(rawSetupState[key])) {
          return false;
        }
      }
      return hasOwn(rawSetupState, key);
    };
    const canSetRef = (ref22) => {
      return !knownTemplateRefs.has(ref22);
    };
    if (oldRef != null && oldRef !== ref3) {
      invalidatePendingSetRef(oldRawRef);
      if (isString$2(oldRef)) {
        refs[oldRef] = null;
        if (canSetSetupRef(oldRef)) {
          setupState[oldRef] = null;
        }
      } else if (isRef(oldRef)) {
        if (canSetRef(oldRef)) {
          oldRef.value = null;
        }
        const oldRawRefAtom = oldRawRef;
        if (oldRawRefAtom.k) refs[oldRawRefAtom.k] = null;
      }
    }
    if (isFunction$3(ref3)) {
      callWithErrorHandling(ref3, owner, 12, [value, refs]);
    } else {
      const _isString = isString$2(ref3);
      const _isRef = isRef(ref3);
      if (_isString || _isRef) {
        const doSet = () => {
          if (rawRef.f) {
            const existing = _isString ? canSetSetupRef(ref3) ? setupState[ref3] : refs[ref3] : canSetRef(ref3) || !rawRef.k ? ref3.value : refs[rawRef.k];
            if (isUnmount) {
              isArray$2(existing) && remove(existing, refValue);
            } else {
              if (!isArray$2(existing)) {
                if (_isString) {
                  refs[ref3] = [refValue];
                  if (canSetSetupRef(ref3)) {
                    setupState[ref3] = refs[ref3];
                  }
                } else {
                  const newVal = [refValue];
                  if (canSetRef(ref3)) {
                    ref3.value = newVal;
                  }
                  if (rawRef.k) refs[rawRef.k] = newVal;
                }
              } else if (!existing.includes(refValue)) {
                existing.push(refValue);
              }
            }
          } else if (_isString) {
            refs[ref3] = value;
            if (canSetSetupRef(ref3)) {
              setupState[ref3] = value;
            }
          } else if (_isRef) {
            if (canSetRef(ref3)) {
              ref3.value = value;
            }
            if (rawRef.k) refs[rawRef.k] = value;
          } else {
            warn$1("Invalid template ref type:", ref3, `(${typeof ref3})`);
          }
        };
        if (value) {
          const job = () => {
            doSet();
            pendingSetRefMap.delete(rawRef);
          };
          job.id = -1;
          pendingSetRefMap.set(rawRef, job);
          queuePostRenderEffect(job, parentSuspense);
        } else {
          invalidatePendingSetRef(rawRef);
          doSet();
        }
      } else {
        warn$1("Invalid template ref type:", ref3, `(${typeof ref3})`);
      }
    }
  }
  function invalidatePendingSetRef(rawRef) {
    const pendingSetRef = pendingSetRefMap.get(rawRef);
    if (pendingSetRef) {
      pendingSetRef.flags |= 8;
      pendingSetRefMap.delete(rawRef);
    }
  }
  getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
  getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
  const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
  const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
  function onActivated(hook, target) {
    registerKeepAliveHook(hook, "a", target);
  }
  function onDeactivated(hook, target) {
    registerKeepAliveHook(hook, "da", target);
  }
  function registerKeepAliveHook(hook, type2, target = currentInstance) {
    const wrappedHook = hook.__wdc || (hook.__wdc = () => {
      let current = target;
      while (current) {
        if (current.isDeactivated) {
          return;
        }
        current = current.parent;
      }
      return hook();
    });
    injectHook(type2, wrappedHook, target);
    if (target) {
      let current = target.parent;
      while (current && current.parent) {
        if (isKeepAlive(current.parent.vnode)) {
          injectToKeepAliveRoot(wrappedHook, type2, target, current);
        }
        current = current.parent;
      }
    }
  }
  function injectToKeepAliveRoot(hook, type2, target, keepAliveRoot) {
    const injected = injectHook(
      type2,
      hook,
      keepAliveRoot,
      true
      /* prepend */
    );
    onUnmounted(() => {
      remove(keepAliveRoot[type2], injected);
    }, target);
  }
  function injectHook(type2, hook, target = currentInstance, prepend = false) {
    if (target) {
      const hooks = target[type2] || (target[type2] = []);
      const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
        pauseTracking();
        const reset = setCurrentInstance(target);
        const res2 = callWithAsyncErrorHandling(hook, target, type2, args);
        reset();
        resetTracking();
        return res2;
      });
      if (prepend) {
        hooks.unshift(wrappedHook);
      } else {
        hooks.push(wrappedHook);
      }
      return wrappedHook;
    } else {
      const apiName = toHandlerKey(ErrorTypeStrings$1[type2].replace(/ hook$/, ""));
      warn$1(
        `${apiName} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`
      );
    }
  }
  const createHook = (lifecycle) => (hook, target = currentInstance) => {
    if (!isInSSRComponentSetup || lifecycle === "sp") {
      injectHook(lifecycle, (...args) => hook(...args), target);
    }
  };
  const onBeforeMount = createHook("bm");
  const onMounted = createHook("m");
  const onBeforeUpdate = createHook(
    "bu"
  );
  const onUpdated = createHook("u");
  const onBeforeUnmount = createHook(
    "bum"
  );
  const onUnmounted = createHook("um");
  const onServerPrefetch = createHook(
    "sp"
  );
  const onRenderTriggered = createHook("rtg");
  const onRenderTracked = createHook("rtc");
  function onErrorCaptured(hook, target = currentInstance) {
    injectHook("ec", hook, target);
  }
  const COMPONENTS = "components";
  function resolveComponent(name2, maybeSelfReference) {
    return resolveAsset(COMPONENTS, name2, true, maybeSelfReference) || name2;
  }
  const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
  function resolveAsset(type2, name2, warnMissing = true, maybeSelfReference = false) {
    const instance = currentRenderingInstance || currentInstance;
    if (instance) {
      const Component = instance.type;
      {
        const selfName = getComponentName(
          Component,
          false
        );
        if (selfName && (selfName === name2 || selfName === camelize(name2) || selfName === capitalize(camelize(name2)))) {
          return Component;
        }
      }
      const res2 = (
        // local registration
        // check instance[type] first which is resolved for options API
        resolve(instance[type2] || Component[type2], name2) || // global registration
        resolve(instance.appContext[type2], name2)
      );
      if (!res2 && maybeSelfReference) {
        return Component;
      }
      if (warnMissing && !res2) {
        const extra = `
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.`;
        warn$1(`Failed to resolve ${type2.slice(0, -1)}: ${name2}${extra}`);
      }
      return res2;
    } else {
      warn$1(
        `resolve${capitalize(type2.slice(0, -1))} can only be used in render() or setup().`
      );
    }
  }
  function resolve(registry, name2) {
    return registry && (registry[name2] || registry[camelize(name2)] || registry[capitalize(camelize(name2))]);
  }
  function renderList(source, renderItem, cache, index) {
    let ret;
    const cached = cache;
    const sourceIsArray = isArray$2(source);
    if (sourceIsArray || isString$2(source)) {
      const sourceIsReactiveArray = sourceIsArray && isReactive(source);
      let needsWrap = false;
      let isReadonlySource = false;
      if (sourceIsReactiveArray) {
        needsWrap = !isShallow(source);
        isReadonlySource = isReadonly(source);
        source = shallowReadArray(source);
      }
      ret = new Array(source.length);
      for (let i = 0, l = source.length; i < l; i++) {
        ret[i] = renderItem(
          needsWrap ? isReadonlySource ? toReadonly(toReactive(source[i])) : toReactive(source[i]) : source[i],
          i,
          void 0,
          cached
        );
      }
    } else if (typeof source === "number") {
      if (!Number.isInteger(source)) {
        warn$1(`The v-for range expect an integer value but got ${source}.`);
      }
      ret = new Array(source);
      for (let i = 0; i < source; i++) {
        ret[i] = renderItem(i + 1, i, void 0, cached);
      }
    } else if (isObject$2(source)) {
      if (source[Symbol.iterator]) {
        ret = Array.from(
          source,
          (item2, i) => renderItem(item2, i, void 0, cached)
        );
      } else {
        const keys = Object.keys(source);
        ret = new Array(keys.length);
        for (let i = 0, l = keys.length; i < l; i++) {
          const key = keys[i];
          ret[i] = renderItem(source[key], key, i, cached);
        }
      }
    } else {
      ret = [];
    }
    return ret;
  }
  const getPublicInstance = (i) => {
    if (!i) return null;
    if (isStatefulComponent(i)) return getComponentPublicInstance(i);
    return getPublicInstance(i.parent);
  };
  const publicPropertiesMap = (
    // Move PURE marker to new line to workaround compiler discarding it
    // due to type annotation
    /* @__PURE__ */ extend$1(/* @__PURE__ */ Object.create(null), {
      $: (i) => i,
      $el: (i) => i.vnode.el,
      $data: (i) => i.data,
      $props: (i) => shallowReadonly(i.props),
      $attrs: (i) => shallowReadonly(i.attrs),
      $slots: (i) => shallowReadonly(i.slots),
      $refs: (i) => shallowReadonly(i.refs),
      $parent: (i) => getPublicInstance(i.parent),
      $root: (i) => getPublicInstance(i.root),
      $host: (i) => i.ce,
      $emit: (i) => i.emit,
      $options: (i) => resolveMergedOptions(i),
      $forceUpdate: (i) => i.f || (i.f = () => {
        queueJob(i.update);
      }),
      $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
      $watch: (i) => instanceWatch.bind(i)
    })
  );
  const isReservedPrefix = (key) => key === "_" || key === "$";
  const hasSetupBinding = (state2, key) => state2 !== EMPTY_OBJ && !state2.__isScriptSetup && hasOwn(state2, key);
  const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
      if (key === "__v_skip") {
        return true;
      }
      const { ctx, setupState, data: data2, props: props2, accessCache, type: type2, appContext } = instance;
      if (key === "__isVue") {
        return true;
      }
      if (key[0] !== "$") {
        const n = accessCache[key];
        if (n !== void 0) {
          switch (n) {
            case 1:
              return setupState[key];
            case 2:
              return data2[key];
            case 4:
              return ctx[key];
            case 3:
              return props2[key];
          }
        } else if (hasSetupBinding(setupState, key)) {
          accessCache[key] = 1;
          return setupState[key];
        } else if (data2 !== EMPTY_OBJ && hasOwn(data2, key)) {
          accessCache[key] = 2;
          return data2[key];
        } else if (hasOwn(props2, key)) {
          accessCache[key] = 3;
          return props2[key];
        } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
          accessCache[key] = 4;
          return ctx[key];
        } else if (shouldCacheAccess) {
          accessCache[key] = 0;
        }
      }
      const publicGetter = publicPropertiesMap[key];
      let cssModule, globalProperties;
      if (publicGetter) {
        if (key === "$attrs") {
          track(instance.attrs, "get", "");
          markAttrsAccessed();
        } else if (key === "$slots") {
          track(instance, "get", key);
        }
        return publicGetter(instance);
      } else if (
        // css module (injected by vue-loader)
        (cssModule = type2.__cssModules) && (cssModule = cssModule[key])
      ) {
        return cssModule;
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (
        // global properties
        globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
      ) {
        {
          return globalProperties[key];
        }
      } else if (currentRenderingInstance && (!isString$2(key) || // #1091 avoid internal isRef/isVNode checks on component instance leading
      // to infinite warning loop
      key.indexOf("__v") !== 0)) {
        if (data2 !== EMPTY_OBJ && isReservedPrefix(key[0]) && hasOwn(data2, key)) {
          warn$1(
            `Property ${JSON.stringify(
              key
            )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
          );
        } else if (instance === currentRenderingInstance) {
          warn$1(
            `Property ${JSON.stringify(key)} was accessed during render but is not defined on instance.`
          );
        }
      }
    },
    set({ _: instance }, key, value) {
      const { data: data2, setupState, ctx } = instance;
      if (hasSetupBinding(setupState, key)) {
        setupState[key] = value;
        return true;
      } else if (setupState.__isScriptSetup && hasOwn(setupState, key)) {
        warn$1(`Cannot mutate <script setup> binding "${key}" from Options API.`);
        return false;
      } else if (data2 !== EMPTY_OBJ && hasOwn(data2, key)) {
        data2[key] = value;
        return true;
      } else if (hasOwn(instance.props, key)) {
        warn$1(`Attempting to mutate prop "${key}". Props are readonly.`);
        return false;
      }
      if (key[0] === "$" && key.slice(1) in instance) {
        warn$1(
          `Attempting to mutate public property "${key}". Properties starting with $ are reserved and readonly.`
        );
        return false;
      } else {
        if (key in instance.appContext.config.globalProperties) {
          Object.defineProperty(ctx, key, {
            enumerable: true,
            configurable: true,
            value
          });
        } else {
          ctx[key] = value;
        }
      }
      return true;
    },
    has({
      _: { data: data2, setupState, accessCache, ctx, appContext, props: props2, type: type2 }
    }, key) {
      let cssModules;
      return !!(accessCache[key] || data2 !== EMPTY_OBJ && key[0] !== "$" && hasOwn(data2, key) || hasSetupBinding(setupState, key) || hasOwn(props2, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key) || (cssModules = type2.__cssModules) && cssModules[key]);
    },
    defineProperty(target, key, descriptor) {
      if (descriptor.get != null) {
        target._.accessCache[key] = 0;
      } else if (hasOwn(descriptor, "value")) {
        this.set(target, key, descriptor.value, null);
      }
      return Reflect.defineProperty(target, key, descriptor);
    }
  };
  {
    PublicInstanceProxyHandlers.ownKeys = (target) => {
      warn$1(
        `Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`
      );
      return Reflect.ownKeys(target);
    };
  }
  function createDevRenderContext(instance) {
    const target = {};
    Object.defineProperty(target, `_`, {
      configurable: true,
      enumerable: false,
      get: () => instance
    });
    Object.keys(publicPropertiesMap).forEach((key) => {
      Object.defineProperty(target, key, {
        configurable: true,
        enumerable: false,
        get: () => publicPropertiesMap[key](instance),
        // intercepted by the proxy so no need for implementation,
        // but needed to prevent set errors
        set: NOOP
      });
    });
    return target;
  }
  function exposePropsOnRenderContext(instance) {
    const {
      ctx,
      propsOptions: [propsOptions]
    } = instance;
    if (propsOptions) {
      Object.keys(propsOptions).forEach((key) => {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => instance.props[key],
          set: NOOP
        });
      });
    }
  }
  function exposeSetupStateOnRenderContext(instance) {
    const { ctx, setupState } = instance;
    Object.keys(toRaw(setupState)).forEach((key) => {
      if (!setupState.__isScriptSetup) {
        if (isReservedPrefix(key[0])) {
          warn$1(
            `setup() return property ${JSON.stringify(
              key
            )} should not start with "$" or "_" which are reserved prefixes for Vue internals.`
          );
          return;
        }
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => setupState[key],
          set: NOOP
        });
      }
    });
  }
  function normalizePropsOrEmits(props2) {
    return isArray$2(props2) ? props2.reduce(
      (normalized, p2) => (normalized[p2] = null, normalized),
      {}
    ) : props2;
  }
  function createDuplicateChecker() {
    const cache = /* @__PURE__ */ Object.create(null);
    return (type2, key) => {
      if (cache[key]) {
        warn$1(`${type2} property "${key}" is already defined in ${cache[key]}.`);
      } else {
        cache[key] = type2;
      }
    };
  }
  let shouldCacheAccess = true;
  function applyOptions(instance) {
    const options = resolveMergedOptions(instance);
    const publicThis = instance.proxy;
    const ctx = instance.ctx;
    shouldCacheAccess = false;
    if (options.beforeCreate) {
      callHook(options.beforeCreate, instance, "bc");
    }
    const {
      // state
      data: dataOptions,
      computed: computedOptions,
      methods: methods2,
      watch: watchOptions,
      provide: provideOptions,
      inject: injectOptions,
      // lifecycle
      created,
      beforeMount,
      mounted,
      beforeUpdate,
      updated,
      activated,
      deactivated,
      beforeDestroy,
      beforeUnmount,
      destroyed,
      unmounted,
      render: render2,
      renderTracked,
      renderTriggered,
      errorCaptured,
      serverPrefetch,
      // public API
      expose,
      inheritAttrs,
      // assets
      components,
      directives,
      filters: filters2
    } = options;
    const checkDuplicateProperties = createDuplicateChecker();
    {
      const [propsOptions] = instance.propsOptions;
      if (propsOptions) {
        for (const key in propsOptions) {
          checkDuplicateProperties("Props", key);
        }
      }
    }
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties);
    }
    if (methods2) {
      for (const key in methods2) {
        const methodHandler = methods2[key];
        if (isFunction$3(methodHandler)) {
          {
            Object.defineProperty(ctx, key, {
              value: methodHandler.bind(publicThis),
              configurable: true,
              enumerable: true,
              writable: true
            });
          }
          {
            checkDuplicateProperties("Methods", key);
          }
        } else {
          warn$1(
            `Method "${key}" has type "${typeof methodHandler}" in the component definition. Did you reference the function correctly?`
          );
        }
      }
    }
    if (dataOptions) {
      if (!isFunction$3(dataOptions)) {
        warn$1(
          `The data option must be a function. Plain object usage is no longer supported.`
        );
      }
      const data2 = dataOptions.call(publicThis, publicThis);
      if (isPromise(data2)) {
        warn$1(
          `data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>.`
        );
      }
      if (!isObject$2(data2)) {
        warn$1(`data() should return an object.`);
      } else {
        instance.data = reactive(data2);
        {
          for (const key in data2) {
            checkDuplicateProperties("Data", key);
            if (!isReservedPrefix(key[0])) {
              Object.defineProperty(ctx, key, {
                configurable: true,
                enumerable: true,
                get: () => data2[key],
                set: NOOP
              });
            }
          }
        }
      }
    }
    shouldCacheAccess = true;
    if (computedOptions) {
      for (const key in computedOptions) {
        const opt = computedOptions[key];
        const get2 = isFunction$3(opt) ? opt.bind(publicThis, publicThis) : isFunction$3(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
        if (get2 === NOOP) {
          warn$1(`Computed property "${key}" has no getter.`);
        }
        const set = !isFunction$3(opt) && isFunction$3(opt.set) ? opt.set.bind(publicThis) : () => {
          warn$1(
            `Write operation failed: computed property "${key}" is readonly.`
          );
        };
        const c = computed({
          get: get2,
          set
        });
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => c.value,
          set: (v) => c.value = v
        });
        {
          checkDuplicateProperties("Computed", key);
        }
      }
    }
    if (watchOptions) {
      for (const key in watchOptions) {
        createWatcher(watchOptions[key], ctx, publicThis, key);
      }
    }
    if (provideOptions) {
      const provides = isFunction$3(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
    if (created) {
      callHook(created, instance, "c");
    }
    function registerLifecycleHook(register, hook) {
      if (isArray$2(hook)) {
        hook.forEach((_hook) => register(_hook.bind(publicThis)));
      } else if (hook) {
        register(hook.bind(publicThis));
      }
    }
    registerLifecycleHook(onBeforeMount, beforeMount);
    registerLifecycleHook(onMounted, mounted);
    registerLifecycleHook(onBeforeUpdate, beforeUpdate);
    registerLifecycleHook(onUpdated, updated);
    registerLifecycleHook(onActivated, activated);
    registerLifecycleHook(onDeactivated, deactivated);
    registerLifecycleHook(onErrorCaptured, errorCaptured);
    registerLifecycleHook(onRenderTracked, renderTracked);
    registerLifecycleHook(onRenderTriggered, renderTriggered);
    registerLifecycleHook(onBeforeUnmount, beforeUnmount);
    registerLifecycleHook(onUnmounted, unmounted);
    registerLifecycleHook(onServerPrefetch, serverPrefetch);
    if (isArray$2(expose)) {
      if (expose.length) {
        const exposed = instance.exposed || (instance.exposed = {});
        expose.forEach((key) => {
          Object.defineProperty(exposed, key, {
            get: () => publicThis[key],
            set: (val) => publicThis[key] = val,
            enumerable: true
          });
        });
      } else if (!instance.exposed) {
        instance.exposed = {};
      }
    }
    if (render2 && instance.render === NOOP) {
      instance.render = render2;
    }
    if (inheritAttrs != null) {
      instance.inheritAttrs = inheritAttrs;
    }
    if (components) instance.components = components;
    if (directives) instance.directives = directives;
    if (serverPrefetch) {
      markAsyncBoundary(instance);
    }
  }
  function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
    if (isArray$2(injectOptions)) {
      injectOptions = normalizeInject(injectOptions);
    }
    for (const key in injectOptions) {
      const opt = injectOptions[key];
      let injected;
      if (isObject$2(opt)) {
        if ("default" in opt) {
          injected = inject(
            opt.from || key,
            opt.default,
            true
          );
        } else {
          injected = inject(opt.from || key);
        }
      } else {
        injected = inject(opt);
      }
      if (isRef(injected)) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v) => injected.value = v
        });
      } else {
        ctx[key] = injected;
      }
      {
        checkDuplicateProperties("Inject", key);
      }
    }
  }
  function callHook(hook, instance, type2) {
    callWithAsyncErrorHandling(
      isArray$2(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
      instance,
      type2
    );
  }
  function createWatcher(raw, ctx, publicThis, key) {
    let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
    if (isString$2(raw)) {
      const handler = ctx[raw];
      if (isFunction$3(handler)) {
        {
          watch(getter, handler);
        }
      } else {
        warn$1(`Invalid watch handler specified by key "${raw}"`, handler);
      }
    } else if (isFunction$3(raw)) {
      {
        watch(getter, raw.bind(publicThis));
      }
    } else if (isObject$2(raw)) {
      if (isArray$2(raw)) {
        raw.forEach((r2) => createWatcher(r2, ctx, publicThis, key));
      } else {
        const handler = isFunction$3(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
        if (isFunction$3(handler)) {
          watch(getter, handler, raw);
        } else {
          warn$1(`Invalid watch handler specified by key "${raw.handler}"`, handler);
        }
      }
    } else {
      warn$1(`Invalid watch option: "${key}"`, raw);
    }
  }
  function resolveMergedOptions(instance) {
    const base = instance.type;
    const { mixins, extends: extendsOptions } = base;
    const {
      mixins: globalMixins,
      optionsCache: cache,
      config: { optionMergeStrategies }
    } = instance.appContext;
    const cached = cache.get(base);
    let resolved;
    if (cached) {
      resolved = cached;
    } else if (!globalMixins.length && !mixins && !extendsOptions) {
      {
        resolved = base;
      }
    } else {
      resolved = {};
      if (globalMixins.length) {
        globalMixins.forEach(
          (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
        );
      }
      mergeOptions(resolved, base, optionMergeStrategies);
    }
    if (isObject$2(base)) {
      cache.set(base, resolved);
    }
    return resolved;
  }
  function mergeOptions(to, from, strats, asMixin = false) {
    const { mixins, extends: extendsOptions } = from;
    if (extendsOptions) {
      mergeOptions(to, extendsOptions, strats, true);
    }
    if (mixins) {
      mixins.forEach(
        (m) => mergeOptions(to, m, strats, true)
      );
    }
    for (const key in from) {
      if (asMixin && key === "expose") {
        warn$1(
          `"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.`
        );
      } else {
        const strat = internalOptionMergeStrats[key] || strats && strats[key];
        to[key] = strat ? strat(to[key], from[key]) : from[key];
      }
    }
    return to;
  }
  const internalOptionMergeStrats = {
    data: mergeDataFn,
    props: mergeEmitsOrPropsOptions,
    emits: mergeEmitsOrPropsOptions,
    // objects
    methods: mergeObjectOptions,
    computed: mergeObjectOptions,
    // lifecycle
    beforeCreate: mergeAsArray,
    created: mergeAsArray,
    beforeMount: mergeAsArray,
    mounted: mergeAsArray,
    beforeUpdate: mergeAsArray,
    updated: mergeAsArray,
    beforeDestroy: mergeAsArray,
    beforeUnmount: mergeAsArray,
    destroyed: mergeAsArray,
    unmounted: mergeAsArray,
    activated: mergeAsArray,
    deactivated: mergeAsArray,
    errorCaptured: mergeAsArray,
    serverPrefetch: mergeAsArray,
    // assets
    components: mergeObjectOptions,
    directives: mergeObjectOptions,
    // watch
    watch: mergeWatchOptions,
    // provide / inject
    provide: mergeDataFn,
    inject: mergeInject
  };
  function mergeDataFn(to, from) {
    if (!from) {
      return to;
    }
    if (!to) {
      return from;
    }
    return function mergedDataFn() {
      return extend$1(
        isFunction$3(to) ? to.call(this, this) : to,
        isFunction$3(from) ? from.call(this, this) : from
      );
    };
  }
  function mergeInject(to, from) {
    return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
  }
  function normalizeInject(raw) {
    if (isArray$2(raw)) {
      const res2 = {};
      for (let i = 0; i < raw.length; i++) {
        res2[raw[i]] = raw[i];
      }
      return res2;
    }
    return raw;
  }
  function mergeAsArray(to, from) {
    return to ? [...new Set([].concat(to, from))] : from;
  }
  function mergeObjectOptions(to, from) {
    return to ? extend$1(/* @__PURE__ */ Object.create(null), to, from) : from;
  }
  function mergeEmitsOrPropsOptions(to, from) {
    if (to) {
      if (isArray$2(to) && isArray$2(from)) {
        return [.../* @__PURE__ */ new Set([...to, ...from])];
      }
      return extend$1(
        /* @__PURE__ */ Object.create(null),
        normalizePropsOrEmits(to),
        normalizePropsOrEmits(from != null ? from : {})
      );
    } else {
      return from;
    }
  }
  function mergeWatchOptions(to, from) {
    if (!to) return from;
    if (!from) return to;
    const merged = extend$1(/* @__PURE__ */ Object.create(null), to);
    for (const key in from) {
      merged[key] = mergeAsArray(to[key], from[key]);
    }
    return merged;
  }
  function createAppContext() {
    return {
      app: null,
      config: {
        isNativeTag: NO,
        performance: false,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {}
      },
      mixins: [],
      components: {},
      directives: {},
      provides: /* @__PURE__ */ Object.create(null),
      optionsCache: /* @__PURE__ */ new WeakMap(),
      propsCache: /* @__PURE__ */ new WeakMap(),
      emitsCache: /* @__PURE__ */ new WeakMap()
    };
  }
  let uid$1 = 0;
  function createAppAPI$1(render2, hydrate) {
    return function createApp2(rootComponent, rootProps = null) {
      if (!isFunction$3(rootComponent)) {
        rootComponent = extend$1({}, rootComponent);
      }
      if (rootProps != null && !isObject$2(rootProps)) {
        warn$1(`root props passed to app.mount() must be an object.`);
        rootProps = null;
      }
      const context = createAppContext();
      const installedPlugins = /* @__PURE__ */ new WeakSet();
      const pluginCleanupFns = [];
      let isMounted = false;
      const app = context.app = {
        _uid: uid$1++,
        _component: rootComponent,
        _props: rootProps,
        _container: null,
        _context: context,
        _instance: null,
        version,
        get config() {
          return context.config;
        },
        set config(v) {
          {
            warn$1(
              `app.config cannot be replaced. Modify individual options instead.`
            );
          }
        },
        use(plugin2, ...options) {
          if (installedPlugins.has(plugin2)) {
            warn$1(`Plugin has already been applied to target app.`);
          } else if (plugin2 && isFunction$3(plugin2.install)) {
            installedPlugins.add(plugin2);
            plugin2.install(app, ...options);
          } else if (isFunction$3(plugin2)) {
            installedPlugins.add(plugin2);
            plugin2(app, ...options);
          } else {
            warn$1(
              `A plugin must either be a function or an object with an "install" function.`
            );
          }
          return app;
        },
        mixin(mixin) {
          {
            if (!context.mixins.includes(mixin)) {
              context.mixins.push(mixin);
            } else {
              warn$1(
                "Mixin has already been applied to target app" + (mixin.name ? `: ${mixin.name}` : "")
              );
            }
          }
          return app;
        },
        component(name2, component) {
          {
            validateComponentName(name2, context.config);
          }
          if (!component) {
            return context.components[name2];
          }
          if (context.components[name2]) {
            warn$1(`Component "${name2}" has already been registered in target app.`);
          }
          context.components[name2] = component;
          return app;
        },
        directive(name2, directive) {
          {
            validateDirectiveName(name2);
          }
          if (!directive) {
            return context.directives[name2];
          }
          if (context.directives[name2]) {
            warn$1(`Directive "${name2}" has already been registered in target app.`);
          }
          context.directives[name2] = directive;
          return app;
        },
        mount(rootContainer, isHydrate, namespace2) {
          if (!isMounted) {
            if (rootContainer.__vue_app__) {
              warn$1(
                `There is already an app instance mounted on the host container.
 If you want to mount another app on the same host container, you need to unmount the previous app by calling \`app.unmount()\` first.`
              );
            }
            const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
            vnode.appContext = context;
            if (namespace2 === true) {
              namespace2 = "svg";
            } else if (namespace2 === false) {
              namespace2 = void 0;
            }
            {
              context.reload = () => {
                const cloned = cloneVNode(vnode);
                cloned.el = null;
                render2(cloned, rootContainer, namespace2);
              };
            }
            {
              render2(vnode, rootContainer, namespace2);
            }
            isMounted = true;
            app._container = rootContainer;
            rootContainer.__vue_app__ = app;
            {
              app._instance = vnode.component;
              devtoolsInitApp(app, version);
            }
            return getComponentPublicInstance(vnode.component);
          } else {
            warn$1(
              `App has already been mounted.
If you want to remount the same app, move your app creation logic into a factory function and create fresh app instances for each mount - e.g. \`const createMyApp = () => createApp(App)\``
            );
          }
        },
        onUnmount(cleanupFn) {
          if (typeof cleanupFn !== "function") {
            warn$1(
              `Expected function as first argument to app.onUnmount(), but got ${typeof cleanupFn}`
            );
          }
          pluginCleanupFns.push(cleanupFn);
        },
        unmount() {
          if (isMounted) {
            callWithAsyncErrorHandling(
              pluginCleanupFns,
              app._instance,
              16
            );
            render2(null, app._container);
            {
              app._instance = null;
              devtoolsUnmountApp(app);
            }
            delete app._container.__vue_app__;
          } else {
            warn$1(`Cannot unmount an app that is not mounted.`);
          }
        },
        provide(key, value) {
          if (key in context.provides) {
            if (hasOwn(context.provides, key)) {
              warn$1(
                `App already provides property with key "${String(key)}". It will be overwritten with the new value.`
              );
            } else {
              warn$1(
                `App already provides property with key "${String(key)}" inherited from its parent element. It will be overwritten with the new value.`
              );
            }
          }
          context.provides[key] = value;
          return app;
        },
        runWithContext(fn2) {
          const lastApp = currentApp;
          currentApp = app;
          try {
            return fn2();
          } finally {
            currentApp = lastApp;
          }
        }
      };
      return app;
    };
  }
  let currentApp = null;
  function provide(key, value) {
    {
      if (!currentInstance || currentInstance.isMounted) {
        warn$1(`provide() can only be used inside setup().`);
      }
    }
    if (currentInstance) {
      let provides = currentInstance.provides;
      const parentProvides = currentInstance.parent && currentInstance.parent.provides;
      if (parentProvides === provides) {
        provides = currentInstance.provides = Object.create(parentProvides);
      }
      provides[key] = value;
    }
  }
  function inject(key, defaultValue, treatDefaultAsFactory = false) {
    const instance = getCurrentInstance();
    if (instance || currentApp) {
      let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
      if (provides && key in provides) {
        return provides[key];
      } else if (arguments.length > 1) {
        return treatDefaultAsFactory && isFunction$3(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
      } else {
        warn$1(`injection "${String(key)}" not found.`);
      }
    } else {
      warn$1(`inject() can only be used inside setup() or functional components.`);
    }
  }
  const ssrContextKey = Symbol.for("v-scx");
  const useSSRContext = () => {
    {
      const ctx = inject(ssrContextKey);
      if (!ctx) {
        warn$1(
          `Server rendering context not provided. Make sure to only call useSSRContext() conditionally in the server build.`
        );
      }
      return ctx;
    }
  };
  function watch(source, cb, options) {
    if (!isFunction$3(cb)) {
      warn$1(
        `\`watch(fn, options?)\` signature has been moved to a separate API. Use \`watchEffect(fn, options?)\` instead. \`watch\` now only supports \`watch(source, cb, options?) signature.`
      );
    }
    return doWatch(source, cb, options);
  }
  function doWatch(source, cb, options = EMPTY_OBJ) {
    const { immediate, deep, flush, once } = options;
    if (!cb) {
      if (immediate !== void 0) {
        warn$1(
          `watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`
        );
      }
      if (deep !== void 0) {
        warn$1(
          `watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`
        );
      }
      if (once !== void 0) {
        warn$1(
          `watch() "once" option is only respected when using the watch(source, callback, options?) signature.`
        );
      }
    }
    const baseWatchOptions = extend$1({}, options);
    baseWatchOptions.onWarn = warn$1;
    const runsImmediately = cb && immediate || !cb && flush !== "post";
    let ssrCleanup;
    if (isInSSRComponentSetup) {
      if (flush === "sync") {
        const ctx = useSSRContext();
        ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
      } else if (!runsImmediately) {
        const watchStopHandle = () => {
        };
        watchStopHandle.stop = NOOP;
        watchStopHandle.resume = NOOP;
        watchStopHandle.pause = NOOP;
        return watchStopHandle;
      }
    }
    const instance = currentInstance;
    baseWatchOptions.call = (fn2, type2, args) => callWithAsyncErrorHandling(fn2, instance, type2, args);
    let isPre = false;
    if (flush === "post") {
      baseWatchOptions.scheduler = (job) => {
        queuePostRenderEffect(job, instance && instance.suspense);
      };
    } else if (flush !== "sync") {
      isPre = true;
      baseWatchOptions.scheduler = (job, isFirstRun) => {
        if (isFirstRun) {
          job();
        } else {
          queueJob(job);
        }
      };
    }
    baseWatchOptions.augmentJob = (job) => {
      if (cb) {
        job.flags |= 4;
      }
      if (isPre) {
        job.flags |= 2;
        if (instance) {
          job.id = instance.uid;
          job.i = instance;
        }
      }
    };
    const watchHandle = watch$1(source, cb, baseWatchOptions);
    if (isInSSRComponentSetup) {
      if (ssrCleanup) {
        ssrCleanup.push(watchHandle);
      } else if (runsImmediately) {
        watchHandle();
      }
    }
    return watchHandle;
  }
  function instanceWatch(source, value, options) {
    const publicThis = this.proxy;
    const getter = isString$2(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
    let cb;
    if (isFunction$3(value)) {
      cb = value;
    } else {
      cb = value.handler;
      options = value;
    }
    const reset = setCurrentInstance(this);
    const res2 = doWatch(getter, cb.bind(publicThis), options);
    reset();
    return res2;
  }
  function createPathGetter(ctx, path) {
    const segments = path.split(".");
    return () => {
      let cur = ctx;
      for (let i = 0; i < segments.length && cur; i++) {
        cur = cur[segments[i]];
      }
      return cur;
    };
  }
  const getModelModifiers = (props2, modelName) => {
    return modelName === "modelValue" || modelName === "model-value" ? props2.modelModifiers : props2[`${modelName}Modifiers`] || props2[`${camelize(modelName)}Modifiers`] || props2[`${hyphenate(modelName)}Modifiers`];
  };
  function emit(instance, event, ...rawArgs) {
    if (instance.isUnmounted) return;
    const props2 = instance.vnode.props || EMPTY_OBJ;
    {
      const {
        emitsOptions,
        propsOptions: [propsOptions]
      } = instance;
      if (emitsOptions) {
        if (!(event in emitsOptions) && true) {
          if (!propsOptions || !(toHandlerKey(camelize(event)) in propsOptions)) {
            warn$1(
              `Component emitted event "${event}" but it is neither declared in the emits option nor as an "${toHandlerKey(camelize(event))}" prop.`
            );
          }
        } else {
          const validator2 = emitsOptions[event];
          if (isFunction$3(validator2)) {
            const isValid = validator2(...rawArgs);
            if (!isValid) {
              warn$1(
                `Invalid event arguments: event validation failed for event "${event}".`
              );
            }
          }
        }
      }
    }
    let args = rawArgs;
    const isModelListener2 = event.startsWith("update:");
    const modifiers = isModelListener2 && getModelModifiers(props2, event.slice(7));
    if (modifiers) {
      if (modifiers.trim) {
        args = rawArgs.map((a) => isString$2(a) ? a.trim() : a);
      }
      if (modifiers.number) {
        args = rawArgs.map(looseToNumber);
      }
    }
    {
      devtoolsComponentEmit(instance, event, args);
    }
    {
      const lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && props2[toHandlerKey(lowerCaseEvent)]) {
        warn$1(
          `Event "${lowerCaseEvent}" is emitted in component ${formatComponentName(
            instance,
            instance.type
          )} but the handler is registered for "${event}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${hyphenate(
            event
          )}" instead of "${event}".`
        );
      }
    }
    let handlerName;
    let handler = props2[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
    props2[handlerName = toHandlerKey(camelize(event))];
    if (!handler && isModelListener2) {
      handler = props2[handlerName = toHandlerKey(hyphenate(event))];
    }
    if (handler) {
      callWithAsyncErrorHandling(
        handler,
        instance,
        6,
        args
      );
    }
    const onceHandler = props2[handlerName + `Once`];
    if (onceHandler) {
      if (!instance.emitted) {
        instance.emitted = {};
      } else if (instance.emitted[handlerName]) {
        return;
      }
      instance.emitted[handlerName] = true;
      callWithAsyncErrorHandling(
        onceHandler,
        instance,
        6,
        args
      );
    }
  }
  const mixinEmitsCache = /* @__PURE__ */ new WeakMap();
  function normalizeEmitsOptions(comp, appContext, asMixin = false) {
    const cache = asMixin ? mixinEmitsCache : appContext.emitsCache;
    const cached = cache.get(comp);
    if (cached !== void 0) {
      return cached;
    }
    const raw = comp.emits;
    let normalized = {};
    let hasExtends = false;
    if (!isFunction$3(comp)) {
      const extendEmits = (raw2) => {
        const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
        if (normalizedFromExtend) {
          hasExtends = true;
          extend$1(normalized, normalizedFromExtend);
        }
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendEmits);
      }
      if (comp.extends) {
        extendEmits(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendEmits);
      }
    }
    if (!raw && !hasExtends) {
      if (isObject$2(comp)) {
        cache.set(comp, null);
      }
      return null;
    }
    if (isArray$2(raw)) {
      raw.forEach((key) => normalized[key] = null);
    } else {
      extend$1(normalized, raw);
    }
    if (isObject$2(comp)) {
      cache.set(comp, normalized);
    }
    return normalized;
  }
  function isEmitListener(options, key) {
    if (!options || !isOn(key)) {
      return false;
    }
    key = key.slice(2).replace(/Once$/, "");
    return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
  }
  let accessedAttrs = false;
  function markAttrsAccessed() {
    accessedAttrs = true;
  }
  function renderComponentRoot(instance) {
    const {
      type: Component,
      vnode,
      proxy,
      withProxy,
      propsOptions: [propsOptions],
      slots,
      attrs,
      emit: emit2,
      render: render2,
      renderCache,
      props: props2,
      data: data2,
      setupState,
      ctx,
      inheritAttrs
    } = instance;
    const prev = setCurrentRenderingInstance(instance);
    let result;
    let fallthroughAttrs;
    {
      accessedAttrs = false;
    }
    try {
      if (vnode.shapeFlag & 4) {
        const proxyToUse = withProxy || proxy;
        const thisProxy = setupState.__isScriptSetup ? new Proxy(proxyToUse, {
          get(target, key, receiver) {
            warn$1(
              `Property '${String(
                key
              )}' was accessed via 'this'. Avoid using 'this' in templates.`
            );
            return Reflect.get(target, key, receiver);
          }
        }) : proxyToUse;
        result = normalizeVNode(
          render2.call(
            thisProxy,
            proxyToUse,
            renderCache,
            true ? shallowReadonly(props2) : props2,
            setupState,
            data2,
            ctx
          )
        );
        fallthroughAttrs = attrs;
      } else {
        const render22 = Component;
        if (attrs === props2) {
          markAttrsAccessed();
        }
        result = normalizeVNode(
          render22.length > 1 ? render22(
            true ? shallowReadonly(props2) : props2,
            true ? {
              get attrs() {
                markAttrsAccessed();
                return shallowReadonly(attrs);
              },
              slots,
              emit: emit2
            } : { attrs, slots, emit: emit2 }
          ) : render22(
            true ? shallowReadonly(props2) : props2,
            null
          )
        );
        fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
      }
    } catch (err) {
      blockStack.length = 0;
      handleError(err, instance, 1);
      result = createVNode(Comment);
    }
    let root2 = result;
    let setRoot = void 0;
    if (result.patchFlag > 0 && result.patchFlag & 2048) {
      [root2, setRoot] = getChildRoot(result);
    }
    if (fallthroughAttrs && inheritAttrs !== false) {
      const keys = Object.keys(fallthroughAttrs);
      const { shapeFlag } = root2;
      if (keys.length) {
        if (shapeFlag & (1 | 6)) {
          if (propsOptions && keys.some(isModelListener)) {
            fallthroughAttrs = filterModelListeners(
              fallthroughAttrs,
              propsOptions
            );
          }
          root2 = cloneVNode(root2, fallthroughAttrs, false, true);
        } else if (!accessedAttrs && root2.type !== Comment) {
          const allAttrs = Object.keys(attrs);
          const eventAttrs = [];
          const extraAttrs = [];
          for (let i = 0, l = allAttrs.length; i < l; i++) {
            const key = allAttrs[i];
            if (isOn(key)) {
              if (!isModelListener(key)) {
                eventAttrs.push(key[2].toLowerCase() + key.slice(3));
              }
            } else {
              extraAttrs.push(key);
            }
          }
          if (extraAttrs.length) {
            warn$1(
              `Extraneous non-props attributes (${extraAttrs.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes.`
            );
          }
          if (eventAttrs.length) {
            warn$1(
              `Extraneous non-emits event listeners (${eventAttrs.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option.`
            );
          }
        }
      }
    }
    if (vnode.dirs) {
      if (!isElementRoot(root2)) {
        warn$1(
          `Runtime directive used on component with non-element root node. The directives will not function as intended.`
        );
      }
      root2 = cloneVNode(root2, null, false, true);
      root2.dirs = root2.dirs ? root2.dirs.concat(vnode.dirs) : vnode.dirs;
    }
    if (vnode.transition) {
      if (!isElementRoot(root2)) {
        warn$1(
          `Component inside <Transition> renders non-element root node that cannot be animated.`
        );
      }
      setTransitionHooks(root2, vnode.transition);
    }
    if (setRoot) {
      setRoot(root2);
    } else {
      result = root2;
    }
    setCurrentRenderingInstance(prev);
    return result;
  }
  const getChildRoot = (vnode) => {
    const rawChildren = vnode.children;
    const dynamicChildren = vnode.dynamicChildren;
    const childRoot = filterSingleRoot(rawChildren, false);
    if (!childRoot) {
      return [vnode, void 0];
    } else if (childRoot.patchFlag > 0 && childRoot.patchFlag & 2048) {
      return getChildRoot(childRoot);
    }
    const index = rawChildren.indexOf(childRoot);
    const dynamicIndex = dynamicChildren ? dynamicChildren.indexOf(childRoot) : -1;
    const setRoot = (updatedRoot) => {
      rawChildren[index] = updatedRoot;
      if (dynamicChildren) {
        if (dynamicIndex > -1) {
          dynamicChildren[dynamicIndex] = updatedRoot;
        } else if (updatedRoot.patchFlag > 0) {
          vnode.dynamicChildren = [...dynamicChildren, updatedRoot];
        }
      }
    };
    return [normalizeVNode(childRoot), setRoot];
  };
  function filterSingleRoot(children, recurse = true) {
    let singleRoot;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (isVNode(child)) {
        if (child.type !== Comment || child.children === "v-if") {
          if (singleRoot) {
            return;
          } else {
            singleRoot = child;
            if (recurse && singleRoot.patchFlag > 0 && singleRoot.patchFlag & 2048) {
              return filterSingleRoot(singleRoot.children);
            }
          }
        }
      } else {
        return;
      }
    }
    return singleRoot;
  }
  const getFunctionalFallthrough = (attrs) => {
    let res2;
    for (const key in attrs) {
      if (key === "class" || key === "style" || isOn(key)) {
        (res2 || (res2 = {}))[key] = attrs[key];
      }
    }
    return res2;
  };
  const filterModelListeners = (attrs, props2) => {
    const res2 = {};
    for (const key in attrs) {
      if (!isModelListener(key) || !(key.slice(9) in props2)) {
        res2[key] = attrs[key];
      }
    }
    return res2;
  };
  const isElementRoot = (vnode) => {
    return vnode.shapeFlag & (6 | 1) || vnode.type === Comment;
  };
  function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
    const { props: prevProps, children: prevChildren, component } = prevVNode;
    const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
    const emits = component.emitsOptions;
    if ((prevChildren || nextChildren) && isHmrUpdating) {
      return true;
    }
    if (nextVNode.dirs || nextVNode.transition) {
      return true;
    }
    if (optimized && patchFlag >= 0) {
      if (patchFlag & 1024) {
        return true;
      }
      if (patchFlag & 16) {
        if (!prevProps) {
          return !!nextProps;
        }
        return hasPropsChanged(prevProps, nextProps, emits);
      } else if (patchFlag & 8) {
        const dynamicProps = nextVNode.dynamicProps;
        for (let i = 0; i < dynamicProps.length; i++) {
          const key = dynamicProps[i];
          if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
            return true;
          }
        }
      }
    } else {
      if (prevChildren || nextChildren) {
        if (!nextChildren || !nextChildren.$stable) {
          return true;
        }
      }
      if (prevProps === nextProps) {
        return false;
      }
      if (!prevProps) {
        return !!nextProps;
      }
      if (!nextProps) {
        return true;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    }
    return false;
  }
  function hasPropsChanged(prevProps, nextProps, emitsOptions) {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
      return true;
    }
    for (let i = 0; i < nextKeys.length; i++) {
      const key = nextKeys[i];
      if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
        return true;
      }
    }
    return false;
  }
  function updateHOCHostEl({ vnode, parent }, el) {
    while (parent) {
      const root2 = parent.subTree;
      if (root2.suspense && root2.suspense.activeBranch === vnode) {
        root2.el = vnode.el;
      }
      if (root2 === vnode) {
        (vnode = parent.vnode).el = el;
        parent = parent.parent;
      } else {
        break;
      }
    }
  }
  const internalObjectProto = {};
  const createInternalObject = () => Object.create(internalObjectProto);
  const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
  function initProps(instance, rawProps, isStateful, isSSR = false) {
    const props2 = {};
    const attrs = createInternalObject();
    instance.propsDefaults = /* @__PURE__ */ Object.create(null);
    setFullProps(instance, rawProps, props2, attrs);
    for (const key in instance.propsOptions[0]) {
      if (!(key in props2)) {
        props2[key] = void 0;
      }
    }
    {
      validateProps(rawProps || {}, props2, instance);
    }
    if (isStateful) {
      instance.props = isSSR ? props2 : shallowReactive(props2);
    } else {
      if (!instance.type.props) {
        instance.props = attrs;
      } else {
        instance.props = props2;
      }
    }
    instance.attrs = attrs;
  }
  function isInHmrContext(instance) {
    while (instance) {
      if (instance.type.__hmrId) return true;
      instance = instance.parent;
    }
  }
  function updateProps(instance, rawProps, rawPrevProps, optimized) {
    const {
      props: props2,
      attrs,
      vnode: { patchFlag }
    } = instance;
    const rawCurrentProps = toRaw(props2);
    const [options] = instance.propsOptions;
    let hasAttrsChanged = false;
    if (
      // always force full diff in dev
      // - #1942 if hmr is enabled with sfc component
      // - vite#872 non-sfc component used by sfc component
      !isInHmrContext(instance) && (optimized || patchFlag > 0) && !(patchFlag & 16)
    ) {
      if (patchFlag & 8) {
        const propsToUpdate = instance.vnode.dynamicProps;
        for (let i = 0; i < propsToUpdate.length; i++) {
          let key = propsToUpdate[i];
          if (isEmitListener(instance.emitsOptions, key)) {
            continue;
          }
          const value = rawProps[key];
          if (options) {
            if (hasOwn(attrs, key)) {
              if (value !== attrs[key]) {
                attrs[key] = value;
                hasAttrsChanged = true;
              }
            } else {
              const camelizedKey = camelize(key);
              props2[camelizedKey] = resolvePropValue(
                options,
                rawCurrentProps,
                camelizedKey,
                value,
                instance,
                false
              );
            }
          } else {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          }
        }
      }
    } else {
      if (setFullProps(instance, rawProps, props2, attrs)) {
        hasAttrsChanged = true;
      }
      let kebabKey;
      for (const key in rawCurrentProps) {
        if (!rawProps || // for camelCase
        !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
        // and converted to camelCase (#955)
        ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
          if (options) {
            if (rawPrevProps && // for camelCase
            (rawPrevProps[key] !== void 0 || // for kebab-case
            rawPrevProps[kebabKey] !== void 0)) {
              props2[key] = resolvePropValue(
                options,
                rawCurrentProps,
                key,
                void 0,
                instance,
                true
              );
            }
          } else {
            delete props2[key];
          }
        }
      }
      if (attrs !== rawCurrentProps) {
        for (const key in attrs) {
          if (!rawProps || !hasOwn(rawProps, key) && true) {
            delete attrs[key];
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (hasAttrsChanged) {
      trigger(instance.attrs, "set", "");
    }
    {
      validateProps(rawProps || {}, props2, instance);
    }
  }
  function setFullProps(instance, rawProps, props2, attrs) {
    const [options, needCastKeys] = instance.propsOptions;
    let hasAttrsChanged = false;
    let rawCastValues;
    if (rawProps) {
      for (let key in rawProps) {
        if (isReservedProp(key)) {
          continue;
        }
        const value = rawProps[key];
        let camelKey;
        if (options && hasOwn(options, camelKey = camelize(key))) {
          if (!needCastKeys || !needCastKeys.includes(camelKey)) {
            props2[camelKey] = value;
          } else {
            (rawCastValues || (rawCastValues = {}))[camelKey] = value;
          }
        } else if (!isEmitListener(instance.emitsOptions, key)) {
          if (!(key in attrs) || value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (needCastKeys) {
      const rawCurrentProps = toRaw(props2);
      const castValues = rawCastValues || EMPTY_OBJ;
      for (let i = 0; i < needCastKeys.length; i++) {
        const key = needCastKeys[i];
        props2[key] = resolvePropValue(
          options,
          rawCurrentProps,
          key,
          castValues[key],
          instance,
          !hasOwn(castValues, key)
        );
      }
    }
    return hasAttrsChanged;
  }
  function resolvePropValue(options, props2, key, value, instance, isAbsent) {
    const opt = options[key];
    if (opt != null) {
      const hasDefault = hasOwn(opt, "default");
      if (hasDefault && value === void 0) {
        const defaultValue = opt.default;
        if (opt.type !== Function && !opt.skipFactory && isFunction$3(defaultValue)) {
          const { propsDefaults } = instance;
          if (key in propsDefaults) {
            value = propsDefaults[key];
          } else {
            const reset = setCurrentInstance(instance);
            value = propsDefaults[key] = defaultValue.call(
              null,
              props2
            );
            reset();
          }
        } else {
          value = defaultValue;
        }
        if (instance.ce) {
          instance.ce._setProp(key, value);
        }
      }
      if (opt[
        0
        /* shouldCast */
      ]) {
        if (isAbsent && !hasDefault) {
          value = false;
        } else if (opt[
          1
          /* shouldCastTrue */
        ] && (value === "" || value === hyphenate(key))) {
          value = true;
        }
      }
    }
    return value;
  }
  const mixinPropsCache = /* @__PURE__ */ new WeakMap();
  function normalizePropsOptions(comp, appContext, asMixin = false) {
    const cache = asMixin ? mixinPropsCache : appContext.propsCache;
    const cached = cache.get(comp);
    if (cached) {
      return cached;
    }
    const raw = comp.props;
    const normalized = {};
    const needCastKeys = [];
    let hasExtends = false;
    if (!isFunction$3(comp)) {
      const extendProps = (raw2) => {
        hasExtends = true;
        const [props2, keys] = normalizePropsOptions(raw2, appContext, true);
        extend$1(normalized, props2);
        if (keys) needCastKeys.push(...keys);
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendProps);
      }
      if (comp.extends) {
        extendProps(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendProps);
      }
    }
    if (!raw && !hasExtends) {
      if (isObject$2(comp)) {
        cache.set(comp, EMPTY_ARR);
      }
      return EMPTY_ARR;
    }
    if (isArray$2(raw)) {
      for (let i = 0; i < raw.length; i++) {
        if (!isString$2(raw[i])) {
          warn$1(`props must be strings when using array syntax.`, raw[i]);
        }
        const normalizedKey = camelize(raw[i]);
        if (validatePropName(normalizedKey)) {
          normalized[normalizedKey] = EMPTY_OBJ;
        }
      }
    } else if (raw) {
      if (!isObject$2(raw)) {
        warn$1(`invalid props options`, raw);
      }
      for (const key in raw) {
        const normalizedKey = camelize(key);
        if (validatePropName(normalizedKey)) {
          const opt = raw[key];
          const prop = normalized[normalizedKey] = isArray$2(opt) || isFunction$3(opt) ? { type: opt } : extend$1({}, opt);
          const propType = prop.type;
          let shouldCast = false;
          let shouldCastTrue = true;
          if (isArray$2(propType)) {
            for (let index = 0; index < propType.length; ++index) {
              const type2 = propType[index];
              const typeName = isFunction$3(type2) && type2.name;
              if (typeName === "Boolean") {
                shouldCast = true;
                break;
              } else if (typeName === "String") {
                shouldCastTrue = false;
              }
            }
          } else {
            shouldCast = isFunction$3(propType) && propType.name === "Boolean";
          }
          prop[
            0
            /* shouldCast */
          ] = shouldCast;
          prop[
            1
            /* shouldCastTrue */
          ] = shouldCastTrue;
          if (shouldCast || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
    const res2 = [normalized, needCastKeys];
    if (isObject$2(comp)) {
      cache.set(comp, res2);
    }
    return res2;
  }
  function validatePropName(key) {
    if (key[0] !== "$" && !isReservedProp(key)) {
      return true;
    } else {
      warn$1(`Invalid prop name: "${key}" is a reserved property.`);
    }
    return false;
  }
  function getType$1(ctor) {
    if (ctor === null) {
      return "null";
    }
    if (typeof ctor === "function") {
      return ctor.name || "";
    } else if (typeof ctor === "object") {
      const name2 = ctor.constructor && ctor.constructor.name;
      return name2 || "";
    }
    return "";
  }
  function validateProps(rawProps, props2, instance) {
    const resolvedValues = toRaw(props2);
    const options = instance.propsOptions[0];
    const camelizePropsKey = Object.keys(rawProps).map((key) => camelize(key));
    for (const key in options) {
      let opt = options[key];
      if (opt == null) continue;
      validateProp(
        key,
        resolvedValues[key],
        opt,
        shallowReadonly(resolvedValues),
        !camelizePropsKey.includes(key)
      );
    }
  }
  function validateProp(name2, value, prop, props2, isAbsent) {
    const { type: type2, required, validator: validator2, skipCheck } = prop;
    if (required && isAbsent) {
      warn$1('Missing required prop: "' + name2 + '"');
      return;
    }
    if (value == null && !required) {
      return;
    }
    if (type2 != null && type2 !== true && !skipCheck) {
      let isValid = false;
      const types = isArray$2(type2) ? type2 : [type2];
      const expectedTypes = [];
      for (let i = 0; i < types.length && !isValid; i++) {
        const { valid, expectedType } = assertType(value, types[i]);
        expectedTypes.push(expectedType || "");
        isValid = valid;
      }
      if (!isValid) {
        warn$1(getInvalidTypeMessage(name2, value, expectedTypes));
        return;
      }
    }
    if (validator2 && !validator2(value, props2)) {
      warn$1('Invalid prop: custom validator check failed for prop "' + name2 + '".');
    }
  }
  const isSimpleType = /* @__PURE__ */ makeMap(
    "String,Number,Boolean,Function,Symbol,BigInt"
  );
  function assertType(value, type2) {
    let valid;
    const expectedType = getType$1(type2);
    if (expectedType === "null") {
      valid = value === null;
    } else if (isSimpleType(expectedType)) {
      const t2 = typeof value;
      valid = t2 === expectedType.toLowerCase();
      if (!valid && t2 === "object") {
        valid = value instanceof type2;
      }
    } else if (expectedType === "Object") {
      valid = isObject$2(value);
    } else if (expectedType === "Array") {
      valid = isArray$2(value);
    } else {
      valid = value instanceof type2;
    }
    return {
      valid,
      expectedType
    };
  }
  function getInvalidTypeMessage(name2, value, expectedTypes) {
    if (expectedTypes.length === 0) {
      return `Prop type [] for prop "${name2}" won't match anything. Did you mean to use type Array instead?`;
    }
    let message = `Invalid prop: type check failed for prop "${name2}". Expected ${expectedTypes.map(capitalize).join(" | ")}`;
    const expectedType = expectedTypes[0];
    const receivedType = toRawType(value);
    const expectedValue = styleValue(value, expectedType);
    const receivedValue = styleValue(value, receivedType);
    if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean$2(expectedType, receivedType)) {
      message += ` with value ${expectedValue}`;
    }
    message += `, got ${receivedType} `;
    if (isExplicable(receivedType)) {
      message += `with value ${receivedValue}.`;
    }
    return message;
  }
  function styleValue(value, type2) {
    if (type2 === "String") {
      return `"${value}"`;
    } else if (type2 === "Number") {
      return `${Number(value)}`;
    } else {
      return `${value}`;
    }
  }
  function isExplicable(type2) {
    const explicitTypes = ["string", "number", "boolean"];
    return explicitTypes.some((elem) => type2.toLowerCase() === elem);
  }
  function isBoolean$2(...args) {
    return args.some((elem) => elem.toLowerCase() === "boolean");
  }
  const isInternalKey = (key) => key === "_" || key === "_ctx" || key === "$stable";
  const normalizeSlotValue = (value) => isArray$2(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
  const normalizeSlot = (key, rawSlot, ctx) => {
    if (rawSlot._n) {
      return rawSlot;
    }
    const normalized = withCtx((...args) => {
      if (currentInstance && !(ctx === null && currentRenderingInstance) && !(ctx && ctx.root !== currentInstance.root)) {
        warn$1(
          `Slot "${key}" invoked outside of the render function: this will not track dependencies used in the slot. Invoke the slot function inside the render function instead.`
        );
      }
      return normalizeSlotValue(rawSlot(...args));
    }, ctx);
    normalized._c = false;
    return normalized;
  };
  const normalizeObjectSlots = (rawSlots, slots, instance) => {
    const ctx = rawSlots._ctx;
    for (const key in rawSlots) {
      if (isInternalKey(key)) continue;
      const value = rawSlots[key];
      if (isFunction$3(value)) {
        slots[key] = normalizeSlot(key, value, ctx);
      } else if (value != null) {
        {
          warn$1(
            `Non-function value encountered for slot "${key}". Prefer function slots for better performance.`
          );
        }
        const normalized = normalizeSlotValue(value);
        slots[key] = () => normalized;
      }
    }
  };
  const normalizeVNodeSlots = (instance, children) => {
    if (!isKeepAlive(instance.vnode) && true) {
      warn$1(
        `Non-function value encountered for default slot. Prefer function slots for better performance.`
      );
    }
    const normalized = normalizeSlotValue(children);
    instance.slots.default = () => normalized;
  };
  const assignSlots = (slots, children, optimized) => {
    for (const key in children) {
      if (optimized || !isInternalKey(key)) {
        slots[key] = children[key];
      }
    }
  };
  const initSlots = (instance, children, optimized) => {
    const slots = instance.slots = createInternalObject();
    if (instance.vnode.shapeFlag & 32) {
      const type2 = children._;
      if (type2) {
        assignSlots(slots, children, optimized);
        if (optimized) {
          def(slots, "_", type2, true);
        }
      } else {
        normalizeObjectSlots(children, slots);
      }
    } else if (children) {
      normalizeVNodeSlots(instance, children);
    }
  };
  const updateSlots = (instance, children, optimized) => {
    const { vnode, slots } = instance;
    let needDeletionCheck = true;
    let deletionComparisonTarget = EMPTY_OBJ;
    if (vnode.shapeFlag & 32) {
      const type2 = children._;
      if (type2) {
        if (isHmrUpdating) {
          assignSlots(slots, children, optimized);
          trigger(instance, "set", "$slots");
        } else if (optimized && type2 === 1) {
          needDeletionCheck = false;
        } else {
          assignSlots(slots, children, optimized);
        }
      } else {
        needDeletionCheck = !children.$stable;
        normalizeObjectSlots(children, slots);
      }
      deletionComparisonTarget = children;
    } else if (children) {
      normalizeVNodeSlots(instance, children);
      deletionComparisonTarget = { default: 1 };
    }
    if (needDeletionCheck) {
      for (const key in slots) {
        if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
          delete slots[key];
        }
      }
    }
  };
  let supported$1;
  let perf$1;
  function startMeasure(instance, type2) {
    if (instance.appContext.config.performance && isSupported$1()) {
      perf$1.mark(`vue-${type2}-${instance.uid}`);
    }
    {
      devtoolsPerfStart(instance, type2, isSupported$1() ? perf$1.now() : Date.now());
    }
  }
  function endMeasure(instance, type2) {
    if (instance.appContext.config.performance && isSupported$1()) {
      const startTag = `vue-${type2}-${instance.uid}`;
      const endTag = startTag + `:end`;
      const measureName = `<${formatComponentName(instance, instance.type)}> ${type2}`;
      perf$1.mark(endTag);
      perf$1.measure(measureName, startTag, endTag);
      perf$1.clearMeasures(measureName);
      perf$1.clearMarks(startTag);
      perf$1.clearMarks(endTag);
    }
    {
      devtoolsPerfEnd(instance, type2, isSupported$1() ? perf$1.now() : Date.now());
    }
  }
  function isSupported$1() {
    if (supported$1 !== void 0) {
      return supported$1;
    }
    if (typeof window !== "undefined" && window.performance) {
      supported$1 = true;
      perf$1 = window.performance;
    } else {
      supported$1 = false;
    }
    return supported$1;
  }
  function initFeatureFlags() {
    const needWarn = [];
    if (needWarn.length) {
      const multi = needWarn.length > 1;
      console.warn(
        `Feature flag${multi ? `s` : ``} ${needWarn.join(", ")} ${multi ? `are` : `is`} not explicitly defined. You are running the esm-bundler build of Vue, which expects these compile-time feature flags to be globally injected via the bundler config in order to get better tree-shaking in the production bundle.

For more details, see https://link.vuejs.org/feature-flags.`
      );
    }
  }
  const queuePostRenderEffect = queueEffectWithSuspense;
  function createRenderer(options) {
    return baseCreateRenderer(options);
  }
  function baseCreateRenderer(options, createHydrationFns) {
    {
      initFeatureFlags();
    }
    const target = getGlobalThis();
    target.__VUE__ = true;
    {
      setDevtoolsHook$1(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
    }
    const {
      insert: hostInsert,
      remove: hostRemove,
      patchProp: hostPatchProp,
      createElement: hostCreateElement,
      createText: hostCreateText,
      createComment: hostCreateComment,
      setText: hostSetText,
      setElementText: hostSetElementText,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      setScopeId: hostSetScopeId = NOOP,
      insertStaticContent: hostInsertStaticContent
    } = options;
    const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace2 = void 0, slotScopeIds = null, optimized = isHmrUpdating ? false : !!n2.dynamicChildren) => {
      if (n1 === n2) {
        return;
      }
      if (n1 && !isSameVNodeType(n1, n2)) {
        anchor = getNextHostNode(n1);
        unmount(n1, parentComponent, parentSuspense, true);
        n1 = null;
      }
      if (n2.patchFlag === -2) {
        optimized = false;
        n2.dynamicChildren = null;
      }
      const { type: type2, ref: ref3, shapeFlag } = n2;
      switch (type2) {
        case Text:
          processText(n1, n2, container, anchor);
          break;
        case Comment:
          processCommentNode(n1, n2, container, anchor);
          break;
        case Static:
          if (n1 == null) {
            mountStaticNode(n2, container, anchor, namespace2);
          } else {
            patchStaticNode(n1, n2, container, namespace2);
          }
          break;
        case Fragment:
          processFragment(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace2,
            slotScopeIds,
            optimized
          );
          break;
        default:
          if (shapeFlag & 1) {
            processElement(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace2,
              slotScopeIds,
              optimized
            );
          } else if (shapeFlag & 6) {
            processComponent(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace2,
              slotScopeIds,
              optimized
            );
          } else if (shapeFlag & 64) {
            type2.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace2,
              slotScopeIds,
              optimized,
              internals
            );
          } else if (shapeFlag & 128) {
            type2.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace2,
              slotScopeIds,
              optimized,
              internals
            );
          } else {
            warn$1("Invalid VNode type:", type2, `(${typeof type2})`);
          }
      }
      if (ref3 != null && parentComponent) {
        setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
      } else if (ref3 == null && n1 && n1.ref != null) {
        setRef(n1.ref, null, parentSuspense, n1, true);
      }
    };
    const processText = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(
          n2.el = hostCreateText(n2.children),
          container,
          anchor
        );
      } else {
        const el = n2.el = n1.el;
        if (n2.children !== n1.children) {
          hostSetText(el, n2.children);
        }
      }
    };
    const processCommentNode = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(
          n2.el = hostCreateComment(n2.children || ""),
          container,
          anchor
        );
      } else {
        n2.el = n1.el;
      }
    };
    const mountStaticNode = (n2, container, anchor, namespace2) => {
      [n2.el, n2.anchor] = hostInsertStaticContent(
        n2.children,
        container,
        anchor,
        namespace2,
        n2.el,
        n2.anchor
      );
    };
    const patchStaticNode = (n1, n2, container, namespace2) => {
      if (n2.children !== n1.children) {
        const anchor = hostNextSibling(n1.anchor);
        removeStaticNode(n1);
        [n2.el, n2.anchor] = hostInsertStaticContent(
          n2.children,
          container,
          anchor,
          namespace2
        );
      } else {
        n2.el = n1.el;
        n2.anchor = n1.anchor;
      }
    };
    const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostInsert(el, container, nextSibling);
        el = next;
      }
      hostInsert(anchor, container, nextSibling);
    };
    const removeStaticNode = ({ el, anchor }) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostRemove(el);
        el = next;
      }
      hostRemove(anchor);
    };
    const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace2, slotScopeIds, optimized) => {
      if (n2.type === "svg") {
        namespace2 = "svg";
      } else if (n2.type === "math") {
        namespace2 = "mathml";
      }
      if (n1 == null) {
        mountElement(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace2,
          slotScopeIds,
          optimized
        );
      } else {
        const customElement = !!(n1.el && n1.el._isVueCE) ? n1.el : null;
        try {
          if (customElement) {
            customElement._beginPatch();
          }
          patchElement(
            n1,
            n2,
            parentComponent,
            parentSuspense,
            namespace2,
            slotScopeIds,
            optimized
          );
        } finally {
          if (customElement) {
            customElement._endPatch();
          }
        }
      }
    };
    const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace2, slotScopeIds, optimized) => {
      let el;
      let vnodeHook;
      const { props: props2, shapeFlag, transition, dirs } = vnode;
      el = vnode.el = hostCreateElement(
        vnode.type,
        namespace2,
        props2 && props2.is,
        props2
      );
      if (shapeFlag & 8) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(
          vnode.children,
          el,
          null,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(vnode, namespace2),
          slotScopeIds,
          optimized
        );
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
      if (props2) {
        for (const key in props2) {
          if (key !== "value" && !isReservedProp(key)) {
            hostPatchProp(el, key, null, props2[key], namespace2, parentComponent);
          }
        }
        if ("value" in props2) {
          hostPatchProp(el, "value", null, props2.value, namespace2);
        }
        if (vnodeHook = props2.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      {
        def(el, "__vnode", vnode, true);
        def(el, "__vueParentComponent", parentComponent, true);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
      }
      const needCallTransitionHooks = needTransition(parentSuspense, transition);
      if (needCallTransitionHooks) {
        transition.beforeEnter(el);
      }
      hostInsert(el, container, anchor);
      if ((vnodeHook = props2 && props2.onVnodeMounted) || needCallTransitionHooks || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        }, parentSuspense);
      }
    };
    const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
      if (scopeId) {
        hostSetScopeId(el, scopeId);
      }
      if (slotScopeIds) {
        for (let i = 0; i < slotScopeIds.length; i++) {
          hostSetScopeId(el, slotScopeIds[i]);
        }
      }
      if (parentComponent) {
        let subTree = parentComponent.subTree;
        if (subTree.patchFlag > 0 && subTree.patchFlag & 2048) {
          subTree = filterSingleRoot(subTree.children) || subTree;
        }
        if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
          const parentVNode = parentComponent.vnode;
          setScopeId(
            el,
            parentVNode,
            parentVNode.scopeId,
            parentVNode.slotScopeIds,
            parentComponent.parent
          );
        }
      }
    };
    const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace2, slotScopeIds, optimized, start = 0) => {
      for (let i = start; i < children.length; i++) {
        const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
        patch(
          null,
          child,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace2,
          slotScopeIds,
          optimized
        );
      }
    };
    const patchElement = (n1, n2, parentComponent, parentSuspense, namespace2, slotScopeIds, optimized) => {
      const el = n2.el = n1.el;
      {
        el.__vnode = n2;
      }
      let { patchFlag, dynamicChildren, dirs } = n2;
      patchFlag |= n1.patchFlag & 16;
      const oldProps = n1.props || EMPTY_OBJ;
      const newProps = n2.props || EMPTY_OBJ;
      let vnodeHook;
      parentComponent && toggleRecurse(parentComponent, false);
      if (vnodeHook = newProps.onVnodeBeforeUpdate) {
        invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
      }
      if (dirs) {
        invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
      }
      parentComponent && toggleRecurse(parentComponent, true);
      if (isHmrUpdating) {
        patchFlag = 0;
        optimized = false;
        dynamicChildren = null;
      }
      if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
        hostSetElementText(el, "");
      }
      if (dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          el,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(n2, namespace2),
          slotScopeIds
        );
        {
          traverseStaticChildren(n1, n2);
        }
      } else if (!optimized) {
        patchChildren(
          n1,
          n2,
          el,
          null,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(n2, namespace2),
          slotScopeIds,
          false
        );
      }
      if (patchFlag > 0) {
        if (patchFlag & 16) {
          patchProps(el, oldProps, newProps, parentComponent, namespace2);
        } else {
          if (patchFlag & 2) {
            if (oldProps.class !== newProps.class) {
              hostPatchProp(el, "class", null, newProps.class, namespace2);
            }
          }
          if (patchFlag & 4) {
            hostPatchProp(el, "style", oldProps.style, newProps.style, namespace2);
          }
          if (patchFlag & 8) {
            const propsToUpdate = n2.dynamicProps;
            for (let i = 0; i < propsToUpdate.length; i++) {
              const key = propsToUpdate[i];
              const prev = oldProps[key];
              const next = newProps[key];
              if (next !== prev || key === "value") {
                hostPatchProp(el, key, prev, next, namespace2, parentComponent);
              }
            }
          }
        }
        if (patchFlag & 1) {
          if (n1.children !== n2.children) {
            hostSetElementText(el, n2.children);
          }
        }
      } else if (!optimized && dynamicChildren == null) {
        patchProps(el, oldProps, newProps, parentComponent, namespace2);
      }
      if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
          dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
        }, parentSuspense);
      }
    };
    const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace2, slotScopeIds) => {
      for (let i = 0; i < newChildren.length; i++) {
        const oldVNode = oldChildren[i];
        const newVNode = newChildren[i];
        const container = (
          // oldVNode may be an errored async setup() component inside Suspense
          // which will not have a mounted element
          oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
          // of the Fragment itself so it can move its children.
          (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
          // which also requires the correct parent container
          !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
          oldVNode.shapeFlag & (6 | 64 | 128)) ? hostParentNode(oldVNode.el) : (
            // In other cases, the parent container is not actually used so we
            // just pass the block element here to avoid a DOM parentNode call.
            fallbackContainer
          )
        );
        patch(
          oldVNode,
          newVNode,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace2,
          slotScopeIds,
          true
        );
      }
    };
    const patchProps = (el, oldProps, newProps, parentComponent, namespace2) => {
      if (oldProps !== newProps) {
        if (oldProps !== EMPTY_OBJ) {
          for (const key in oldProps) {
            if (!isReservedProp(key) && !(key in newProps)) {
              hostPatchProp(
                el,
                key,
                oldProps[key],
                null,
                namespace2,
                parentComponent
              );
            }
          }
        }
        for (const key in newProps) {
          if (isReservedProp(key)) continue;
          const next = newProps[key];
          const prev = oldProps[key];
          if (next !== prev && key !== "value") {
            hostPatchProp(el, key, prev, next, namespace2, parentComponent);
          }
        }
        if ("value" in newProps) {
          hostPatchProp(el, "value", oldProps.value, newProps.value, namespace2);
        }
      }
    };
    const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace2, slotScopeIds, optimized) => {
      const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
      const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
      let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
      if (
        // #5523 dev root fragment may inherit directives
        isHmrUpdating || patchFlag & 2048
      ) {
        patchFlag = 0;
        optimized = false;
        dynamicChildren = null;
      }
      if (fragmentSlotScopeIds) {
        slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
      }
      if (n1 == null) {
        hostInsert(fragmentStartAnchor, container, anchor);
        hostInsert(fragmentEndAnchor, container, anchor);
        mountChildren(
          // #10007
          // such fragment like `<></>` will be compiled into
          // a fragment which doesn't have a children.
          // In this case fallback to an empty array
          n2.children || [],
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace2,
          slotScopeIds,
          optimized
        );
      } else {
        if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
        // of renderSlot() with no valid children
        n1.dynamicChildren) {
          patchBlockChildren(
            n1.dynamicChildren,
            dynamicChildren,
            container,
            parentComponent,
            parentSuspense,
            namespace2,
            slotScopeIds
          );
          {
            traverseStaticChildren(n1, n2);
          }
        } else {
          patchChildren(
            n1,
            n2,
            container,
            fragmentEndAnchor,
            parentComponent,
            parentSuspense,
            namespace2,
            slotScopeIds,
            optimized
          );
        }
      }
    };
    const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace2, slotScopeIds, optimized) => {
      n2.slotScopeIds = slotScopeIds;
      if (n1 == null) {
        if (n2.shapeFlag & 512) {
          parentComponent.ctx.activate(
            n2,
            container,
            anchor,
            namespace2,
            optimized
          );
        } else {
          mountComponent(
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace2,
            optimized
          );
        }
      } else {
        updateComponent(n1, n2, optimized);
      }
    };
    const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace2, optimized) => {
      const instance = initialVNode.component = createComponentInstance(
        initialVNode,
        parentComponent,
        parentSuspense
      );
      if (instance.type.__hmrId) {
        registerHMR(instance);
      }
      {
        pushWarningContext(initialVNode);
        startMeasure(instance, `mount`);
      }
      if (isKeepAlive(initialVNode)) {
        instance.ctx.renderer = internals;
      }
      {
        {
          startMeasure(instance, `init`);
        }
        setupComponent(instance, false, optimized);
        {
          endMeasure(instance, `init`);
        }
      }
      if (isHmrUpdating) initialVNode.el = null;
      if (instance.asyncDep) {
        parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
        if (!initialVNode.el) {
          const placeholder = instance.subTree = createVNode(Comment);
          processCommentNode(null, placeholder, container, anchor);
          initialVNode.placeholder = placeholder.el;
        }
      } else {
        setupRenderEffect(
          instance,
          initialVNode,
          container,
          anchor,
          parentSuspense,
          namespace2,
          optimized
        );
      }
      {
        popWarningContext();
        endMeasure(instance, `mount`);
      }
    };
    const updateComponent = (n1, n2, optimized) => {
      const instance = n2.component = n1.component;
      if (shouldUpdateComponent(n1, n2, optimized)) {
        if (instance.asyncDep && !instance.asyncResolved) {
          {
            pushWarningContext(n2);
          }
          updateComponentPreRender(instance, n2, optimized);
          {
            popWarningContext();
          }
          return;
        } else {
          instance.next = n2;
          instance.update();
        }
      } else {
        n2.el = n1.el;
        instance.vnode = n2;
      }
    };
    const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace2, optimized) => {
      const componentUpdateFn = () => {
        if (!instance.isMounted) {
          let vnodeHook;
          const { el, props: props2 } = initialVNode;
          const { bm, m, parent, root: root2, type: type2 } = instance;
          const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
          toggleRecurse(instance, false);
          if (bm) {
            invokeArrayFns(bm);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props2 && props2.onVnodeBeforeMount)) {
            invokeVNodeHook(vnodeHook, parent, initialVNode);
          }
          toggleRecurse(instance, true);
          {
            if (root2.ce && // @ts-expect-error _def is private
            root2.ce._def.shadowRoot !== false) {
              root2.ce._injectChildStyle(type2);
            }
            {
              startMeasure(instance, `render`);
            }
            const subTree = instance.subTree = renderComponentRoot(instance);
            {
              endMeasure(instance, `render`);
            }
            {
              startMeasure(instance, `patch`);
            }
            patch(
              null,
              subTree,
              container,
              anchor,
              instance,
              parentSuspense,
              namespace2
            );
            {
              endMeasure(instance, `patch`);
            }
            initialVNode.el = subTree.el;
          }
          if (m) {
            queuePostRenderEffect(m, parentSuspense);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props2 && props2.onVnodeMounted)) {
            const scopedInitialVNode = initialVNode;
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
              parentSuspense
            );
          }
          if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
            instance.a && queuePostRenderEffect(instance.a, parentSuspense);
          }
          instance.isMounted = true;
          {
            devtoolsComponentAdded(instance);
          }
          initialVNode = container = anchor = null;
        } else {
          let { next, bu, u, parent, vnode } = instance;
          {
            const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
            if (nonHydratedAsyncRoot) {
              if (next) {
                next.el = vnode.el;
                updateComponentPreRender(instance, next, optimized);
              }
              nonHydratedAsyncRoot.asyncDep.then(() => {
                if (!instance.isUnmounted) {
                  componentUpdateFn();
                }
              });
              return;
            }
          }
          let originNext = next;
          let vnodeHook;
          {
            pushWarningContext(next || instance.vnode);
          }
          toggleRecurse(instance, false);
          if (next) {
            next.el = vnode.el;
            updateComponentPreRender(instance, next, optimized);
          } else {
            next = vnode;
          }
          if (bu) {
            invokeArrayFns(bu);
          }
          if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
            invokeVNodeHook(vnodeHook, parent, next, vnode);
          }
          toggleRecurse(instance, true);
          {
            startMeasure(instance, `render`);
          }
          const nextTree = renderComponentRoot(instance);
          {
            endMeasure(instance, `render`);
          }
          const prevTree = instance.subTree;
          instance.subTree = nextTree;
          {
            startMeasure(instance, `patch`);
          }
          patch(
            prevTree,
            nextTree,
            // parent may have changed if it's in a teleport
            hostParentNode(prevTree.el),
            // anchor may have changed if it's in a fragment
            getNextHostNode(prevTree),
            instance,
            parentSuspense,
            namespace2
          );
          {
            endMeasure(instance, `patch`);
          }
          next.el = nextTree.el;
          if (originNext === null) {
            updateHOCHostEl(instance, nextTree.el);
          }
          if (u) {
            queuePostRenderEffect(u, parentSuspense);
          }
          if (vnodeHook = next.props && next.props.onVnodeUpdated) {
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, next, vnode),
              parentSuspense
            );
          }
          {
            devtoolsComponentUpdated(instance);
          }
          {
            popWarningContext();
          }
        }
      };
      instance.scope.on();
      const effect2 = instance.effect = new ReactiveEffect(componentUpdateFn);
      instance.scope.off();
      const update = instance.update = effect2.run.bind(effect2);
      const job = instance.job = effect2.runIfDirty.bind(effect2);
      job.i = instance;
      job.id = instance.uid;
      effect2.scheduler = () => queueJob(job);
      toggleRecurse(instance, true);
      {
        effect2.onTrack = instance.rtc ? (e) => invokeArrayFns(instance.rtc, e) : void 0;
        effect2.onTrigger = instance.rtg ? (e) => invokeArrayFns(instance.rtg, e) : void 0;
      }
      update();
    };
    const updateComponentPreRender = (instance, nextVNode, optimized) => {
      nextVNode.component = instance;
      const prevProps = instance.vnode.props;
      instance.vnode = nextVNode;
      instance.next = null;
      updateProps(instance, nextVNode.props, prevProps, optimized);
      updateSlots(instance, nextVNode.children, optimized);
      pauseTracking();
      flushPreFlushCbs(instance);
      resetTracking();
    };
    const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace2, slotScopeIds, optimized = false) => {
      const c1 = n1 && n1.children;
      const prevShapeFlag = n1 ? n1.shapeFlag : 0;
      const c2 = n2.children;
      const { patchFlag, shapeFlag } = n2;
      if (patchFlag > 0) {
        if (patchFlag & 128) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace2,
            slotScopeIds,
            optimized
          );
          return;
        } else if (patchFlag & 256) {
          patchUnkeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace2,
            slotScopeIds,
            optimized
          );
          return;
        }
      }
      if (shapeFlag & 8) {
        if (prevShapeFlag & 16) {
          unmountChildren(c1, parentComponent, parentSuspense);
        }
        if (c2 !== c1) {
          hostSetElementText(container, c2);
        }
      } else {
        if (prevShapeFlag & 16) {
          if (shapeFlag & 16) {
            patchKeyedChildren(
              c1,
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace2,
              slotScopeIds,
              optimized
            );
          } else {
            unmountChildren(c1, parentComponent, parentSuspense, true);
          }
        } else {
          if (prevShapeFlag & 8) {
            hostSetElementText(container, "");
          }
          if (shapeFlag & 16) {
            mountChildren(
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace2,
              slotScopeIds,
              optimized
            );
          }
        }
      }
    };
    const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace2, slotScopeIds, optimized) => {
      c1 = c1 || EMPTY_ARR;
      c2 = c2 || EMPTY_ARR;
      const oldLength = c1.length;
      const newLength = c2.length;
      const commonLength = Math.min(oldLength, newLength);
      let i;
      for (i = 0; i < commonLength; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        patch(
          c1[i],
          nextChild,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace2,
          slotScopeIds,
          optimized
        );
      }
      if (oldLength > newLength) {
        unmountChildren(
          c1,
          parentComponent,
          parentSuspense,
          true,
          false,
          commonLength
        );
      } else {
        mountChildren(
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace2,
          slotScopeIds,
          optimized,
          commonLength
        );
      }
    };
    const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace2, slotScopeIds, optimized) => {
      let i = 0;
      const l2 = c2.length;
      let e1 = c1.length - 1;
      let e2 = l2 - 1;
      while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (isSameVNodeType(n1, n2)) {
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace2,
            slotScopeIds,
            optimized
          );
        } else {
          break;
        }
        i++;
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
        if (isSameVNodeType(n1, n2)) {
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace2,
            slotScopeIds,
            optimized
          );
        } else {
          break;
        }
        e1--;
        e2--;
      }
      if (i > e1) {
        if (i <= e2) {
          const nextPos = e2 + 1;
          const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
          while (i <= e2) {
            patch(
              null,
              c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace2,
              slotScopeIds,
              optimized
            );
            i++;
          }
        }
      } else if (i > e2) {
        while (i <= e1) {
          unmount(c1[i], parentComponent, parentSuspense, true);
          i++;
        }
      } else {
        const s1 = i;
        const s2 = i;
        const keyToNewIndexMap = /* @__PURE__ */ new Map();
        for (i = s2; i <= e2; i++) {
          const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
          if (nextChild.key != null) {
            if (keyToNewIndexMap.has(nextChild.key)) {
              warn$1(
                `Duplicate keys found during update:`,
                JSON.stringify(nextChild.key),
                `Make sure keys are unique.`
              );
            }
            keyToNewIndexMap.set(nextChild.key, i);
          }
        }
        let j;
        let patched = 0;
        const toBePatched = e2 - s2 + 1;
        let moved = false;
        let maxNewIndexSoFar = 0;
        const newIndexToOldIndexMap = new Array(toBePatched);
        for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
        for (i = s1; i <= e1; i++) {
          const prevChild = c1[i];
          if (patched >= toBePatched) {
            unmount(prevChild, parentComponent, parentSuspense, true);
            continue;
          }
          let newIndex;
          if (prevChild.key != null) {
            newIndex = keyToNewIndexMap.get(prevChild.key);
          } else {
            for (j = s2; j <= e2; j++) {
              if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
                newIndex = j;
                break;
              }
            }
          }
          if (newIndex === void 0) {
            unmount(prevChild, parentComponent, parentSuspense, true);
          } else {
            newIndexToOldIndexMap[newIndex - s2] = i + 1;
            if (newIndex >= maxNewIndexSoFar) {
              maxNewIndexSoFar = newIndex;
            } else {
              moved = true;
            }
            patch(
              prevChild,
              c2[newIndex],
              container,
              null,
              parentComponent,
              parentSuspense,
              namespace2,
              slotScopeIds,
              optimized
            );
            patched++;
          }
        }
        const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
        j = increasingNewIndexSequence.length - 1;
        for (i = toBePatched - 1; i >= 0; i--) {
          const nextIndex = s2 + i;
          const nextChild = c2[nextIndex];
          const anchorVNode = c2[nextIndex + 1];
          const anchor = nextIndex + 1 < l2 ? (
            // #13559, fallback to el placeholder for unresolved async component
            anchorVNode.el || anchorVNode.placeholder
          ) : parentAnchor;
          if (newIndexToOldIndexMap[i] === 0) {
            patch(
              null,
              nextChild,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace2,
              slotScopeIds,
              optimized
            );
          } else if (moved) {
            if (j < 0 || i !== increasingNewIndexSequence[j]) {
              move(nextChild, container, anchor, 2);
            } else {
              j--;
            }
          }
        }
      }
    };
    const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
      const { el, type: type2, transition, children, shapeFlag } = vnode;
      if (shapeFlag & 6) {
        move(vnode.component.subTree, container, anchor, moveType);
        return;
      }
      if (shapeFlag & 128) {
        vnode.suspense.move(container, anchor, moveType);
        return;
      }
      if (shapeFlag & 64) {
        type2.move(vnode, container, anchor, internals);
        return;
      }
      if (type2 === Fragment) {
        hostInsert(el, container, anchor);
        for (let i = 0; i < children.length; i++) {
          move(children[i], container, anchor, moveType);
        }
        hostInsert(vnode.anchor, container, anchor);
        return;
      }
      if (type2 === Static) {
        moveStaticNode(vnode, container, anchor);
        return;
      }
      const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
      if (needTransition2) {
        if (moveType === 0) {
          transition.beforeEnter(el);
          hostInsert(el, container, anchor);
          queuePostRenderEffect(() => transition.enter(el), parentSuspense);
        } else {
          const { leave, delayLeave, afterLeave } = transition;
          const remove22 = () => {
            if (vnode.ctx.isUnmounted) {
              hostRemove(el);
            } else {
              hostInsert(el, container, anchor);
            }
          };
          const performLeave = () => {
            if (el._isLeaving) {
              el[leaveCbKey](
                true
                /* cancelled */
              );
            }
            leave(el, () => {
              remove22();
              afterLeave && afterLeave();
            });
          };
          if (delayLeave) {
            delayLeave(el, remove22, performLeave);
          } else {
            performLeave();
          }
        }
      } else {
        hostInsert(el, container, anchor);
      }
    };
    const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
      const {
        type: type2,
        props: props2,
        ref: ref3,
        children,
        dynamicChildren,
        shapeFlag,
        patchFlag,
        dirs,
        cacheIndex
      } = vnode;
      if (patchFlag === -2) {
        optimized = false;
      }
      if (ref3 != null) {
        pauseTracking();
        setRef(ref3, null, parentSuspense, vnode, true);
        resetTracking();
      }
      if (cacheIndex != null) {
        parentComponent.renderCache[cacheIndex] = void 0;
      }
      if (shapeFlag & 256) {
        parentComponent.ctx.deactivate(vnode);
        return;
      }
      const shouldInvokeDirs = shapeFlag & 1 && dirs;
      const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
      let vnodeHook;
      if (shouldInvokeVnodeHook && (vnodeHook = props2 && props2.onVnodeBeforeUnmount)) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
      if (shapeFlag & 6) {
        unmountComponent(vnode.component, parentSuspense, doRemove);
      } else {
        if (shapeFlag & 128) {
          vnode.suspense.unmount(parentSuspense, doRemove);
          return;
        }
        if (shouldInvokeDirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
        }
        if (shapeFlag & 64) {
          vnode.type.remove(
            vnode,
            parentComponent,
            parentSuspense,
            internals,
            doRemove
          );
        } else if (dynamicChildren && // #5154
        // when v-once is used inside a block, setBlockTracking(-1) marks the
        // parent block with hasOnce: true
        // so that it doesn't take the fast path during unmount - otherwise
        // components nested in v-once are never unmounted.
        !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
        (type2 !== Fragment || patchFlag > 0 && patchFlag & 64)) {
          unmountChildren(
            dynamicChildren,
            parentComponent,
            parentSuspense,
            false,
            true
          );
        } else if (type2 === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
          unmountChildren(children, parentComponent, parentSuspense);
        }
        if (doRemove) {
          remove2(vnode);
        }
      }
      if (shouldInvokeVnodeHook && (vnodeHook = props2 && props2.onVnodeUnmounted) || shouldInvokeDirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
        }, parentSuspense);
      }
    };
    const remove2 = (vnode) => {
      const { type: type2, el, anchor, transition } = vnode;
      if (type2 === Fragment) {
        if (vnode.patchFlag > 0 && vnode.patchFlag & 2048 && transition && !transition.persisted) {
          vnode.children.forEach((child) => {
            if (child.type === Comment) {
              hostRemove(child.el);
            } else {
              remove2(child);
            }
          });
        } else {
          removeFragment(el, anchor);
        }
        return;
      }
      if (type2 === Static) {
        removeStaticNode(vnode);
        return;
      }
      const performRemove = () => {
        hostRemove(el);
        if (transition && !transition.persisted && transition.afterLeave) {
          transition.afterLeave();
        }
      };
      if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
        const { leave, delayLeave } = transition;
        const performLeave = () => leave(el, performRemove);
        if (delayLeave) {
          delayLeave(vnode.el, performRemove, performLeave);
        } else {
          performLeave();
        }
      } else {
        performRemove();
      }
    };
    const removeFragment = (cur, end2) => {
      let next;
      while (cur !== end2) {
        next = hostNextSibling(cur);
        hostRemove(cur);
        cur = next;
      }
      hostRemove(end2);
    };
    const unmountComponent = (instance, parentSuspense, doRemove) => {
      if (instance.type.__hmrId) {
        unregisterHMR(instance);
      }
      const { bum, scope, job, subTree, um, m, a } = instance;
      invalidateMount(m);
      invalidateMount(a);
      if (bum) {
        invokeArrayFns(bum);
      }
      scope.stop();
      if (job) {
        job.flags |= 8;
        unmount(subTree, instance, parentSuspense, doRemove);
      }
      if (um) {
        queuePostRenderEffect(um, parentSuspense);
      }
      queuePostRenderEffect(() => {
        instance.isUnmounted = true;
      }, parentSuspense);
      {
        devtoolsComponentRemoved(instance);
      }
    };
    const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
      for (let i = start; i < children.length; i++) {
        unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
      }
    };
    const getNextHostNode = (vnode) => {
      if (vnode.shapeFlag & 6) {
        return getNextHostNode(vnode.component.subTree);
      }
      if (vnode.shapeFlag & 128) {
        return vnode.suspense.next();
      }
      const el = hostNextSibling(vnode.anchor || vnode.el);
      const teleportEnd = el && el[TeleportEndKey];
      return teleportEnd ? hostNextSibling(teleportEnd) : el;
    };
    let isFlushing = false;
    const render2 = (vnode, container, namespace2) => {
      if (vnode == null) {
        if (container._vnode) {
          unmount(container._vnode, null, null, true);
        }
      } else {
        patch(
          container._vnode || null,
          vnode,
          container,
          null,
          null,
          null,
          namespace2
        );
      }
      container._vnode = vnode;
      if (!isFlushing) {
        isFlushing = true;
        flushPreFlushCbs();
        flushPostFlushCbs();
        isFlushing = false;
      }
    };
    const internals = {
      p: patch,
      um: unmount,
      m: move,
      r: remove2,
      mt: mountComponent,
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      n: getNextHostNode,
      o: options
    };
    let hydrate;
    return {
      render: render2,
      hydrate,
      createApp: createAppAPI$1(render2)
    };
  }
  function resolveChildrenNamespace({ type: type2, props: props2 }, currentNamespace) {
    return currentNamespace === "svg" && type2 === "foreignObject" || currentNamespace === "mathml" && type2 === "annotation-xml" && props2 && props2.encoding && props2.encoding.includes("html") ? void 0 : currentNamespace;
  }
  function toggleRecurse({ effect: effect2, job }, allowed) {
    if (allowed) {
      effect2.flags |= 32;
      job.flags |= 4;
    } else {
      effect2.flags &= -33;
      job.flags &= -5;
    }
  }
  function needTransition(parentSuspense, transition) {
    return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
  }
  function traverseStaticChildren(n1, n2, shallow = false) {
    const ch1 = n1.children;
    const ch2 = n2.children;
    if (isArray$2(ch1) && isArray$2(ch2)) {
      for (let i = 0; i < ch1.length; i++) {
        const c1 = ch1[i];
        let c2 = ch2[i];
        if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
          if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
            c2 = ch2[i] = cloneIfMounted(ch2[i]);
            c2.el = c1.el;
          }
          if (!shallow && c2.patchFlag !== -2)
            traverseStaticChildren(c1, c2);
        }
        if (c2.type === Text && // avoid cached text nodes retaining detached dom nodes
        c2.patchFlag !== -1) {
          c2.el = c1.el;
        }
        if (c2.type === Comment && !c2.el) {
          c2.el = c1.el;
        }
        {
          c2.el && (c2.el.__vnode = c2);
        }
      }
    }
  }
  function getSequence(arr) {
    const p2 = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
          p2[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = u + v >> 1;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p2[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p2[v];
    }
    return result;
  }
  function locateNonHydratedAsyncRoot(instance) {
    const subComponent = instance.subTree.component;
    if (subComponent) {
      if (subComponent.asyncDep && !subComponent.asyncResolved) {
        return subComponent;
      } else {
        return locateNonHydratedAsyncRoot(subComponent);
      }
    }
  }
  function invalidateMount(hooks) {
    if (hooks) {
      for (let i = 0; i < hooks.length; i++)
        hooks[i].flags |= 8;
    }
  }
  const isSuspense = (type2) => type2.__isSuspense;
  function queueEffectWithSuspense(fn2, suspense) {
    if (suspense && suspense.pendingBranch) {
      if (isArray$2(fn2)) {
        suspense.effects.push(...fn2);
      } else {
        suspense.effects.push(fn2);
      }
    } else {
      queuePostFlushCb(fn2);
    }
  }
  const Fragment = Symbol.for("v-fgt");
  const Text = Symbol.for("v-txt");
  const Comment = Symbol.for("v-cmt");
  const Static = Symbol.for("v-stc");
  const blockStack = [];
  let currentBlock = null;
  function openBlock(disableTracking = false) {
    blockStack.push(currentBlock = disableTracking ? null : []);
  }
  function closeBlock() {
    blockStack.pop();
    currentBlock = blockStack[blockStack.length - 1] || null;
  }
  let isBlockTreeEnabled = 1;
  function setBlockTracking(value, inVOnce = false) {
    isBlockTreeEnabled += value;
    if (value < 0 && currentBlock && inVOnce) {
      currentBlock.hasOnce = true;
    }
  }
  function setupBlock(vnode) {
    vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
    closeBlock();
    if (isBlockTreeEnabled > 0 && currentBlock) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  function createElementBlock(type2, props2, children, patchFlag, dynamicProps, shapeFlag) {
    return setupBlock(
      createBaseVNode(
        type2,
        props2,
        children,
        patchFlag,
        dynamicProps,
        shapeFlag,
        true
      )
    );
  }
  function createBlock(type2, props2, children, patchFlag, dynamicProps) {
    return setupBlock(
      createVNode(
        type2,
        props2,
        children,
        patchFlag,
        dynamicProps,
        true
      )
    );
  }
  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }
  function isSameVNodeType(n1, n2) {
    if (n2.shapeFlag & 6 && n1.component) {
      const dirtyInstances = hmrDirtyComponents.get(n2.type);
      if (dirtyInstances && dirtyInstances.has(n1.component)) {
        n1.shapeFlag &= -257;
        n2.shapeFlag &= -513;
        return false;
      }
    }
    return n1.type === n2.type && n1.key === n2.key;
  }
  const createVNodeWithArgsTransform = (...args) => {
    return _createVNode(
      ...args
    );
  };
  const normalizeKey = ({ key }) => key != null ? key : null;
  const normalizeRef = ({
    ref: ref3,
    ref_key,
    ref_for
  }) => {
    if (typeof ref3 === "number") {
      ref3 = "" + ref3;
    }
    return ref3 != null ? isString$2(ref3) || isRef(ref3) || isFunction$3(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
  };
  function createBaseVNode(type2, props2 = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type2 === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
    const vnode = {
      __v_isVNode: true,
      __v_skip: true,
      type: type2,
      props: props2,
      key: props2 && normalizeKey(props2),
      ref: props2 && normalizeRef(props2),
      scopeId: currentScopeId,
      slotScopeIds: null,
      children,
      component: null,
      suspense: null,
      ssContent: null,
      ssFallback: null,
      dirs: null,
      transition: null,
      el: null,
      anchor: null,
      target: null,
      targetStart: null,
      targetAnchor: null,
      staticCount: 0,
      shapeFlag,
      patchFlag,
      dynamicProps,
      dynamicChildren: null,
      appContext: null,
      ctx: currentRenderingInstance
    };
    if (needFullChildrenNormalization) {
      normalizeChildren(vnode, children);
      if (shapeFlag & 128) {
        type2.normalize(vnode);
      }
    } else if (children) {
      vnode.shapeFlag |= isString$2(children) ? 8 : 16;
    }
    if (vnode.key !== vnode.key) {
      warn$1(`VNode created with invalid key (NaN). VNode type:`, vnode.type);
    }
    if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
    !isBlockNode && // has current parent block
    currentBlock && // presence of a patch flag indicates this node needs patching on updates.
    // component nodes also should always be patched, because even if the
    // component doesn't need to update, it needs to persist the instance on to
    // the next vnode so that it can be properly unmounted later.
    (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
    // vnode should not be considered dynamic due to handler caching.
    vnode.patchFlag !== 32) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  const createVNode = createVNodeWithArgsTransform;
  function _createVNode(type2, props2 = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
    if (!type2 || type2 === NULL_DYNAMIC_COMPONENT) {
      if (!type2) {
        warn$1(`Invalid vnode type when creating vnode: ${type2}.`);
      }
      type2 = Comment;
    }
    if (isVNode(type2)) {
      const cloned = cloneVNode(
        type2,
        props2,
        true
        /* mergeRef: true */
      );
      if (children) {
        normalizeChildren(cloned, children);
      }
      if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
        if (cloned.shapeFlag & 6) {
          currentBlock[currentBlock.indexOf(type2)] = cloned;
        } else {
          currentBlock.push(cloned);
        }
      }
      cloned.patchFlag = -2;
      return cloned;
    }
    if (isClassComponent(type2)) {
      type2 = type2.__vccOpts;
    }
    if (props2) {
      props2 = guardReactiveProps(props2);
      let { class: klass, style } = props2;
      if (klass && !isString$2(klass)) {
        props2.class = normalizeClass(klass);
      }
      if (isObject$2(style)) {
        if (isProxy(style) && !isArray$2(style)) {
          style = extend$1({}, style);
        }
        props2.style = normalizeStyle(style);
      }
    }
    const shapeFlag = isString$2(type2) ? 1 : isSuspense(type2) ? 128 : isTeleport(type2) ? 64 : isObject$2(type2) ? 4 : isFunction$3(type2) ? 2 : 0;
    if (shapeFlag & 4 && isProxy(type2)) {
      type2 = toRaw(type2);
      warn$1(
        `Vue received a Component that was made a reactive object. This can lead to unnecessary performance overhead and should be avoided by marking the component with \`markRaw\` or using \`shallowRef\` instead of \`ref\`.`,
        `
Component that was made reactive: `,
        type2
      );
    }
    return createBaseVNode(
      type2,
      props2,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      isBlockNode,
      true
    );
  }
  function guardReactiveProps(props2) {
    if (!props2) return null;
    return isProxy(props2) || isInternalObject(props2) ? extend$1({}, props2) : props2;
  }
  function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
    const { props: props2, ref: ref3, patchFlag, children, transition } = vnode;
    const mergedProps = extraProps ? mergeProps(props2 || {}, extraProps) : props2;
    const cloned = {
      __v_isVNode: true,
      __v_skip: true,
      type: vnode.type,
      props: mergedProps,
      key: mergedProps && normalizeKey(mergedProps),
      ref: extraProps && extraProps.ref ? (
        // #2078 in the case of <component :is="vnode" ref="extra"/>
        // if the vnode itself already has a ref, cloneVNode will need to merge
        // the refs so the single vnode can be set on multiple refs
        mergeRef && ref3 ? isArray$2(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
      ) : ref3,
      scopeId: vnode.scopeId,
      slotScopeIds: vnode.slotScopeIds,
      children: patchFlag === -1 && isArray$2(children) ? children.map(deepCloneVNode) : children,
      target: vnode.target,
      targetStart: vnode.targetStart,
      targetAnchor: vnode.targetAnchor,
      staticCount: vnode.staticCount,
      shapeFlag: vnode.shapeFlag,
      // if the vnode is cloned with extra props, we can no longer assume its
      // existing patch flag to be reliable and need to add the FULL_PROPS flag.
      // note: preserve flag for fragments since they use the flag for children
      // fast paths only.
      patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
      dynamicProps: vnode.dynamicProps,
      dynamicChildren: vnode.dynamicChildren,
      appContext: vnode.appContext,
      dirs: vnode.dirs,
      transition,
      // These should technically only be non-null on mounted VNodes. However,
      // they *should* be copied for kept-alive vnodes. So we just always copy
      // them since them being non-null during a mount doesn't affect the logic as
      // they will simply be overwritten.
      component: vnode.component,
      suspense: vnode.suspense,
      ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
      ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
      placeholder: vnode.placeholder,
      el: vnode.el,
      anchor: vnode.anchor,
      ctx: vnode.ctx,
      ce: vnode.ce
    };
    if (transition && cloneTransition) {
      setTransitionHooks(
        cloned,
        transition.clone(cloned)
      );
    }
    return cloned;
  }
  function deepCloneVNode(vnode) {
    const cloned = cloneVNode(vnode);
    if (isArray$2(vnode.children)) {
      cloned.children = vnode.children.map(deepCloneVNode);
    }
    return cloned;
  }
  function createTextVNode(text2 = " ", flag = 0) {
    return createVNode(Text, null, text2, flag);
  }
  function createCommentVNode(text2 = "", asBlock = false) {
    return asBlock ? (openBlock(), createBlock(Comment, null, text2)) : createVNode(Comment, null, text2);
  }
  function normalizeVNode(child) {
    if (child == null || typeof child === "boolean") {
      return createVNode(Comment);
    } else if (isArray$2(child)) {
      return createVNode(
        Fragment,
        null,
        // #3666, avoid reference pollution when reusing vnode
        child.slice()
      );
    } else if (isVNode(child)) {
      return cloneIfMounted(child);
    } else {
      return createVNode(Text, null, String(child));
    }
  }
  function cloneIfMounted(child) {
    return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
  }
  function normalizeChildren(vnode, children) {
    let type2 = 0;
    const { shapeFlag } = vnode;
    if (children == null) {
      children = null;
    } else if (isArray$2(children)) {
      type2 = 16;
    } else if (typeof children === "object") {
      if (shapeFlag & (1 | 64)) {
        const slot = children.default;
        if (slot) {
          slot._c && (slot._d = false);
          normalizeChildren(vnode, slot());
          slot._c && (slot._d = true);
        }
        return;
      } else {
        type2 = 32;
        const slotFlag = children._;
        if (!slotFlag && !isInternalObject(children)) {
          children._ctx = currentRenderingInstance;
        } else if (slotFlag === 3 && currentRenderingInstance) {
          if (currentRenderingInstance.slots._ === 1) {
            children._ = 1;
          } else {
            children._ = 2;
            vnode.patchFlag |= 1024;
          }
        }
      }
    } else if (isFunction$3(children)) {
      children = { default: children, _ctx: currentRenderingInstance };
      type2 = 32;
    } else {
      children = String(children);
      if (shapeFlag & 64) {
        type2 = 16;
        children = [createTextVNode(children)];
      } else {
        type2 = 8;
      }
    }
    vnode.children = children;
    vnode.shapeFlag |= type2;
  }
  function mergeProps(...args) {
    const ret = {};
    for (let i = 0; i < args.length; i++) {
      const toMerge = args[i];
      for (const key in toMerge) {
        if (key === "class") {
          if (ret.class !== toMerge.class) {
            ret.class = normalizeClass([ret.class, toMerge.class]);
          }
        } else if (key === "style") {
          ret.style = normalizeStyle([ret.style, toMerge.style]);
        } else if (isOn(key)) {
          const existing = ret[key];
          const incoming = toMerge[key];
          if (incoming && existing !== incoming && !(isArray$2(existing) && existing.includes(incoming))) {
            ret[key] = existing ? [].concat(existing, incoming) : incoming;
          }
        } else if (key !== "") {
          ret[key] = toMerge[key];
        }
      }
    }
    return ret;
  }
  function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
    callWithAsyncErrorHandling(hook, instance, 7, [
      vnode,
      prevVNode
    ]);
  }
  const emptyAppContext = createAppContext();
  let uid = 0;
  function createComponentInstance(vnode, parent, suspense) {
    const type2 = vnode.type;
    const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
    const instance = {
      uid: uid++,
      vnode,
      type: type2,
      parent,
      appContext,
      root: null,
      // to be immediately set
      next: null,
      subTree: null,
      // will be set synchronously right after creation
      effect: null,
      update: null,
      // will be set synchronously right after creation
      job: null,
      scope: new EffectScope(
        true
        /* detached */
      ),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: parent ? parent.provides : Object.create(appContext.provides),
      ids: parent ? parent.ids : ["", 0, 0],
      accessCache: null,
      renderCache: [],
      // local resolved assets
      components: null,
      directives: null,
      // resolved props and emits options
      propsOptions: normalizePropsOptions(type2, appContext),
      emitsOptions: normalizeEmitsOptions(type2, appContext),
      // emit
      emit: null,
      // to be set immediately
      emitted: null,
      // props default value
      propsDefaults: EMPTY_OBJ,
      // inheritAttrs
      inheritAttrs: type2.inheritAttrs,
      // state
      ctx: EMPTY_OBJ,
      data: EMPTY_OBJ,
      props: EMPTY_OBJ,
      attrs: EMPTY_OBJ,
      slots: EMPTY_OBJ,
      refs: EMPTY_OBJ,
      setupState: EMPTY_OBJ,
      setupContext: null,
      // suspense related
      suspense,
      suspenseId: suspense ? suspense.pendingId : 0,
      asyncDep: null,
      asyncResolved: false,
      // lifecycle hooks
      // not using enums here because it results in computed properties
      isMounted: false,
      isUnmounted: false,
      isDeactivated: false,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null
    };
    {
      instance.ctx = createDevRenderContext(instance);
    }
    instance.root = parent ? parent.root : instance;
    instance.emit = emit.bind(null, instance);
    if (vnode.ce) {
      vnode.ce(instance);
    }
    return instance;
  }
  let currentInstance = null;
  const getCurrentInstance = () => currentInstance || currentRenderingInstance;
  let internalSetCurrentInstance;
  let setInSSRSetupState;
  {
    const g2 = getGlobalThis();
    const registerGlobalSetter = (key, setter) => {
      let setters;
      if (!(setters = g2[key])) setters = g2[key] = [];
      setters.push(setter);
      return (v) => {
        if (setters.length > 1) setters.forEach((set) => set(v));
        else setters[0](v);
      };
    };
    internalSetCurrentInstance = registerGlobalSetter(
      `__VUE_INSTANCE_SETTERS__`,
      (v) => currentInstance = v
    );
    setInSSRSetupState = registerGlobalSetter(
      `__VUE_SSR_SETTERS__`,
      (v) => isInSSRComponentSetup = v
    );
  }
  const setCurrentInstance = (instance) => {
    const prev = currentInstance;
    internalSetCurrentInstance(instance);
    instance.scope.on();
    return () => {
      instance.scope.off();
      internalSetCurrentInstance(prev);
    };
  };
  const unsetCurrentInstance = () => {
    currentInstance && currentInstance.scope.off();
    internalSetCurrentInstance(null);
  };
  const isBuiltInTag = /* @__PURE__ */ makeMap("slot,component");
  function validateComponentName(name2, { isNativeTag }) {
    if (isBuiltInTag(name2) || isNativeTag(name2)) {
      warn$1(
        "Do not use built-in or reserved HTML elements as component id: " + name2
      );
    }
  }
  function isStatefulComponent(instance) {
    return instance.vnode.shapeFlag & 4;
  }
  let isInSSRComponentSetup = false;
  function setupComponent(instance, isSSR = false, optimized = false) {
    isSSR && setInSSRSetupState(isSSR);
    const { props: props2, children } = instance.vnode;
    const isStateful = isStatefulComponent(instance);
    initProps(instance, props2, isStateful, isSSR);
    initSlots(instance, children, optimized || isSSR);
    const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
    isSSR && setInSSRSetupState(false);
    return setupResult;
  }
  function setupStatefulComponent(instance, isSSR) {
    const Component = instance.type;
    {
      if (Component.name) {
        validateComponentName(Component.name, instance.appContext.config);
      }
      if (Component.components) {
        const names = Object.keys(Component.components);
        for (let i = 0; i < names.length; i++) {
          validateComponentName(names[i], instance.appContext.config);
        }
      }
      if (Component.directives) {
        const names = Object.keys(Component.directives);
        for (let i = 0; i < names.length; i++) {
          validateDirectiveName(names[i]);
        }
      }
      if (Component.compilerOptions && isRuntimeOnly()) {
        warn$1(
          `"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.`
        );
      }
    }
    instance.accessCache = /* @__PURE__ */ Object.create(null);
    instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
    {
      exposePropsOnRenderContext(instance);
    }
    const { setup } = Component;
    if (setup) {
      pauseTracking();
      const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
      const reset = setCurrentInstance(instance);
      const setupResult = callWithErrorHandling(
        setup,
        instance,
        0,
        [
          shallowReadonly(instance.props),
          setupContext
        ]
      );
      const isAsyncSetup = isPromise(setupResult);
      resetTracking();
      reset();
      if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
        markAsyncBoundary(instance);
      }
      if (isAsyncSetup) {
        setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
        if (isSSR) {
          return setupResult.then((resolvedResult) => {
            handleSetupResult(instance, resolvedResult, isSSR);
          }).catch((e) => {
            handleError(e, instance, 0);
          });
        } else {
          instance.asyncDep = setupResult;
          if (!instance.suspense) {
            const name2 = formatComponentName(instance, Component);
            warn$1(
              `Component <${name2}>: setup function returned a promise, but no <Suspense> boundary was found in the parent component tree. A component with async setup() must be nested in a <Suspense> in order to be rendered.`
            );
          }
        }
      } else {
        handleSetupResult(instance, setupResult, isSSR);
      }
    } else {
      finishComponentSetup(instance, isSSR);
    }
  }
  function handleSetupResult(instance, setupResult, isSSR) {
    if (isFunction$3(setupResult)) {
      if (instance.type.__ssrInlineRender) {
        instance.ssrRender = setupResult;
      } else {
        instance.render = setupResult;
      }
    } else if (isObject$2(setupResult)) {
      if (isVNode(setupResult)) {
        warn$1(
          `setup() should not return VNodes directly - return a render function instead.`
        );
      }
      {
        instance.devtoolsRawSetupState = setupResult;
      }
      instance.setupState = proxyRefs(setupResult);
      {
        exposeSetupStateOnRenderContext(instance);
      }
    } else if (setupResult !== void 0) {
      warn$1(
        `setup() should return an object. Received: ${setupResult === null ? "null" : typeof setupResult}`
      );
    }
    finishComponentSetup(instance, isSSR);
  }
  const isRuntimeOnly = () => true;
  function finishComponentSetup(instance, isSSR, skipOptions) {
    const Component = instance.type;
    if (!instance.render) {
      instance.render = Component.render || NOOP;
    }
    {
      const reset = setCurrentInstance(instance);
      pauseTracking();
      try {
        applyOptions(instance);
      } finally {
        resetTracking();
        reset();
      }
    }
    if (!Component.render && instance.render === NOOP && !isSSR) {
      if (Component.template) {
        warn$1(
          `Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
        );
      } else {
        warn$1(`Component is missing template or render function: `, Component);
      }
    }
  }
  const attrsProxyHandlers = {
    get(target, key) {
      markAttrsAccessed();
      track(target, "get", "");
      return target[key];
    },
    set() {
      warn$1(`setupContext.attrs is readonly.`);
      return false;
    },
    deleteProperty() {
      warn$1(`setupContext.attrs is readonly.`);
      return false;
    }
  };
  function getSlotsProxy(instance) {
    return new Proxy(instance.slots, {
      get(target, key) {
        track(instance, "get", "$slots");
        return target[key];
      }
    });
  }
  function createSetupContext(instance) {
    const expose = (exposed) => {
      {
        if (instance.exposed) {
          warn$1(`expose() should be called only once per setup().`);
        }
        if (exposed != null) {
          let exposedType = typeof exposed;
          if (exposedType === "object") {
            if (isArray$2(exposed)) {
              exposedType = "array";
            } else if (isRef(exposed)) {
              exposedType = "ref";
            }
          }
          if (exposedType !== "object") {
            warn$1(
              `expose() should be passed a plain object, received ${exposedType}.`
            );
          }
        }
      }
      instance.exposed = exposed || {};
    };
    {
      let attrsProxy;
      let slotsProxy;
      return Object.freeze({
        get attrs() {
          return attrsProxy || (attrsProxy = new Proxy(instance.attrs, attrsProxyHandlers));
        },
        get slots() {
          return slotsProxy || (slotsProxy = getSlotsProxy(instance));
        },
        get emit() {
          return (event, ...args) => instance.emit(event, ...args);
        },
        expose
      });
    }
  }
  function getComponentPublicInstance(instance) {
    if (instance.exposed) {
      return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
        get(target, key) {
          if (key in target) {
            return target[key];
          } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance);
          }
        },
        has(target, key) {
          return key in target || key in publicPropertiesMap;
        }
      }));
    } else {
      return instance.proxy;
    }
  }
  const classifyRE = /(?:^|[-_])\w/g;
  const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
  function getComponentName(Component, includeInferred = true) {
    return isFunction$3(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
  }
  function formatComponentName(instance, Component, isRoot = false) {
    let name2 = getComponentName(Component);
    if (!name2 && Component.__file) {
      const match = Component.__file.match(/([^/\\]+)\.\w+$/);
      if (match) {
        name2 = match[1];
      }
    }
    if (!name2 && instance) {
      const inferFromRegistry = (registry) => {
        for (const key in registry) {
          if (registry[key] === Component) {
            return key;
          }
        }
      };
      name2 = inferFromRegistry(instance.components) || instance.parent && inferFromRegistry(
        instance.parent.type.components
      ) || inferFromRegistry(instance.appContext.components);
    }
    return name2 ? classify(name2) : isRoot ? `App` : `Anonymous`;
  }
  function isClassComponent(value) {
    return isFunction$3(value) && "__vccOpts" in value;
  }
  const computed = (getterOrOptions, debugOptions) => {
    const c = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
    {
      const i = getCurrentInstance();
      if (i && i.appContext.config.warnRecursiveComputed) {
        c._warnRecursive = true;
      }
    }
    return c;
  };
  function h(type2, propsOrChildren, children) {
    try {
      setBlockTracking(-1);
      const l = arguments.length;
      if (l === 2) {
        if (isObject$2(propsOrChildren) && !isArray$2(propsOrChildren)) {
          if (isVNode(propsOrChildren)) {
            return createVNode(type2, null, [propsOrChildren]);
          }
          return createVNode(type2, propsOrChildren);
        } else {
          return createVNode(type2, null, propsOrChildren);
        }
      } else {
        if (l > 3) {
          children = Array.prototype.slice.call(arguments, 2);
        } else if (l === 3 && isVNode(children)) {
          children = [children];
        }
        return createVNode(type2, propsOrChildren, children);
      }
    } finally {
      setBlockTracking(1);
    }
  }
  function initCustomFormatter() {
    if (typeof window === "undefined") {
      return;
    }
    const vueStyle = { style: "color:#3ba776" };
    const numberStyle = { style: "color:#1677ff" };
    const stringStyle = { style: "color:#f5222d" };
    const keywordStyle = { style: "color:#eb2f96" };
    const formatter = {
      __vue_custom_formatter: true,
      header(obj) {
        if (!isObject$2(obj)) {
          return null;
        }
        if (obj.__isVue) {
          return ["div", vueStyle, `VueInstance`];
        } else if (isRef(obj)) {
          pauseTracking();
          const value = obj.value;
          resetTracking();
          return [
            "div",
            {},
            ["span", vueStyle, genRefFlag(obj)],
            "<",
            formatValue(value),
            `>`
          ];
        } else if (isReactive(obj)) {
          return [
            "div",
            {},
            ["span", vueStyle, isShallow(obj) ? "ShallowReactive" : "Reactive"],
            "<",
            formatValue(obj),
            `>${isReadonly(obj) ? ` (readonly)` : ``}`
          ];
        } else if (isReadonly(obj)) {
          return [
            "div",
            {},
            ["span", vueStyle, isShallow(obj) ? "ShallowReadonly" : "Readonly"],
            "<",
            formatValue(obj),
            ">"
          ];
        }
        return null;
      },
      hasBody(obj) {
        return obj && obj.__isVue;
      },
      body(obj) {
        if (obj && obj.__isVue) {
          return [
            "div",
            {},
            ...formatInstance(obj.$)
          ];
        }
      }
    };
    function formatInstance(instance) {
      const blocks = [];
      if (instance.type.props && instance.props) {
        blocks.push(createInstanceBlock("props", toRaw(instance.props)));
      }
      if (instance.setupState !== EMPTY_OBJ) {
        blocks.push(createInstanceBlock("setup", instance.setupState));
      }
      if (instance.data !== EMPTY_OBJ) {
        blocks.push(createInstanceBlock("data", toRaw(instance.data)));
      }
      const computed2 = extractKeys(instance, "computed");
      if (computed2) {
        blocks.push(createInstanceBlock("computed", computed2));
      }
      const injected = extractKeys(instance, "inject");
      if (injected) {
        blocks.push(createInstanceBlock("injected", injected));
      }
      blocks.push([
        "div",
        {},
        [
          "span",
          {
            style: keywordStyle.style + ";opacity:0.66"
          },
          "$ (internal): "
        ],
        ["object", { object: instance }]
      ]);
      return blocks;
    }
    function createInstanceBlock(type2, target) {
      target = extend$1({}, target);
      if (!Object.keys(target).length) {
        return ["span", {}];
      }
      return [
        "div",
        { style: "line-height:1.25em;margin-bottom:0.6em" },
        [
          "div",
          {
            style: "color:#476582"
          },
          type2
        ],
        [
          "div",
          {
            style: "padding-left:1.25em"
          },
          ...Object.keys(target).map((key) => {
            return [
              "div",
              {},
              ["span", keywordStyle, key + ": "],
              formatValue(target[key], false)
            ];
          })
        ]
      ];
    }
    function formatValue(v, asRaw = true) {
      if (typeof v === "number") {
        return ["span", numberStyle, v];
      } else if (typeof v === "string") {
        return ["span", stringStyle, JSON.stringify(v)];
      } else if (typeof v === "boolean") {
        return ["span", keywordStyle, v];
      } else if (isObject$2(v)) {
        return ["object", { object: asRaw ? toRaw(v) : v }];
      } else {
        return ["span", stringStyle, String(v)];
      }
    }
    function extractKeys(instance, type2) {
      const Comp = instance.type;
      if (isFunction$3(Comp)) {
        return;
      }
      const extracted = {};
      for (const key in instance.ctx) {
        if (isKeyOfType(Comp, key, type2)) {
          extracted[key] = instance.ctx[key];
        }
      }
      return extracted;
    }
    function isKeyOfType(Comp, key, type2) {
      const opts = Comp[type2];
      if (isArray$2(opts) && opts.includes(key) || isObject$2(opts) && key in opts) {
        return true;
      }
      if (Comp.extends && isKeyOfType(Comp.extends, key, type2)) {
        return true;
      }
      if (Comp.mixins && Comp.mixins.some((m) => isKeyOfType(m, key, type2))) {
        return true;
      }
    }
    function genRefFlag(v) {
      if (isShallow(v)) {
        return `ShallowRef`;
      }
      if (v.effect) {
        return `ComputedRef`;
      }
      return `Ref`;
    }
    if (window.devtoolsFormatters) {
      window.devtoolsFormatters.push(formatter);
    } else {
      window.devtoolsFormatters = [formatter];
    }
  }
  const version = "3.5.25";
  const warn = warn$1;
  /**
  * @vue/runtime-dom v3.5.25
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  let policy = void 0;
  const tt = typeof window !== "undefined" && window.trustedTypes;
  if (tt) {
    try {
      policy = /* @__PURE__ */ tt.createPolicy("vue", {
        createHTML: (val) => val
      });
    } catch (e) {
      warn(`Error creating trusted types policy: ${e}`);
    }
  }
  const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
  const svgNS = "http://www.w3.org/2000/svg";
  const mathmlNS = "http://www.w3.org/1998/Math/MathML";
  const doc = typeof document !== "undefined" ? document : null;
  const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
  const nodeOps = {
    insert: (child, parent, anchor) => {
      parent.insertBefore(child, anchor || null);
    },
    remove: (child) => {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    createElement: (tag, namespace2, is, props2) => {
      const el = namespace2 === "svg" ? doc.createElementNS(svgNS, tag) : namespace2 === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
      if (tag === "select" && props2 && props2.multiple != null) {
        el.setAttribute("multiple", props2.multiple);
      }
      return el;
    },
    createText: (text2) => doc.createTextNode(text2),
    createComment: (text2) => doc.createComment(text2),
    setText: (node, text2) => {
      node.nodeValue = text2;
    },
    setElementText: (el, text2) => {
      el.textContent = text2;
    },
    parentNode: (node) => node.parentNode,
    nextSibling: (node) => node.nextSibling,
    querySelector: (selector) => doc.querySelector(selector),
    setScopeId(el, id) {
      el.setAttribute(id, "");
    },
    // __UNSAFE__
    // Reason: innerHTML.
    // Static content here can only come from compiled templates.
    // As long as the user only uses trusted templates, this is safe.
    insertStaticContent(content, parent, anchor, namespace2, start, end2) {
      const before = anchor ? anchor.previousSibling : parent.lastChild;
      if (start && (start === end2 || start.nextSibling)) {
        while (true) {
          parent.insertBefore(start.cloneNode(true), anchor);
          if (start === end2 || !(start = start.nextSibling)) break;
        }
      } else {
        templateContainer.innerHTML = unsafeToTrustedHTML(
          namespace2 === "svg" ? `<svg>${content}</svg>` : namespace2 === "mathml" ? `<math>${content}</math>` : content
        );
        const template = templateContainer.content;
        if (namespace2 === "svg" || namespace2 === "mathml") {
          const wrapper = template.firstChild;
          while (wrapper.firstChild) {
            template.appendChild(wrapper.firstChild);
          }
          template.removeChild(wrapper);
        }
        parent.insertBefore(template, anchor);
      }
      return [
        // first
        before ? before.nextSibling : parent.firstChild,
        // last
        anchor ? anchor.previousSibling : parent.lastChild
      ];
    }
  };
  const vtcKey = Symbol("_vtc");
  function patchClass(el, value, isSVG) {
    const transitionClasses = el[vtcKey];
    if (transitionClasses) {
      value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
    }
    if (value == null) {
      el.removeAttribute("class");
    } else if (isSVG) {
      el.setAttribute("class", value);
    } else {
      el.className = value;
    }
  }
  const vShowOriginalDisplay = Symbol("_vod");
  const vShowHidden = Symbol("_vsh");
  const CSS_VAR_TEXT = Symbol("CSS_VAR_TEXT");
  const displayRE = /(?:^|;)\s*display\s*:/;
  function patchStyle(el, prev, next) {
    const style = el.style;
    const isCssString = isString$2(next);
    let hasControlledDisplay = false;
    if (next && !isCssString) {
      if (prev) {
        if (!isString$2(prev)) {
          for (const key in prev) {
            if (next[key] == null) {
              setStyle(style, key, "");
            }
          }
        } else {
          for (const prevStyle of prev.split(";")) {
            const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
            if (next[key] == null) {
              setStyle(style, key, "");
            }
          }
        }
      }
      for (const key in next) {
        if (key === "display") {
          hasControlledDisplay = true;
        }
        setStyle(style, key, next[key]);
      }
    } else {
      if (isCssString) {
        if (prev !== next) {
          const cssVarText = style[CSS_VAR_TEXT];
          if (cssVarText) {
            next += ";" + cssVarText;
          }
          style.cssText = next;
          hasControlledDisplay = displayRE.test(next);
        }
      } else if (prev) {
        el.removeAttribute("style");
      }
    }
    if (vShowOriginalDisplay in el) {
      el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
      if (el[vShowHidden]) {
        style.display = "none";
      }
    }
  }
  const semicolonRE = /[^\\];\s*$/;
  const importantRE = /\s*!important$/;
  function setStyle(style, name2, val) {
    if (isArray$2(val)) {
      val.forEach((v) => setStyle(style, name2, v));
    } else {
      if (val == null) val = "";
      {
        if (semicolonRE.test(val)) {
          warn(
            `Unexpected semicolon at the end of '${name2}' style value: '${val}'`
          );
        }
      }
      if (name2.startsWith("--")) {
        style.setProperty(name2, val);
      } else {
        const prefixed = autoPrefix(style, name2);
        if (importantRE.test(val)) {
          style.setProperty(
            hyphenate(prefixed),
            val.replace(importantRE, ""),
            "important"
          );
        } else {
          style[prefixed] = val;
        }
      }
    }
  }
  const prefixes = ["Webkit", "Moz", "ms"];
  const prefixCache = {};
  function autoPrefix(style, rawName) {
    const cached = prefixCache[rawName];
    if (cached) {
      return cached;
    }
    let name2 = camelize(rawName);
    if (name2 !== "filter" && name2 in style) {
      return prefixCache[rawName] = name2;
    }
    name2 = capitalize(name2);
    for (let i = 0; i < prefixes.length; i++) {
      const prefixed = prefixes[i] + name2;
      if (prefixed in style) {
        return prefixCache[rawName] = prefixed;
      }
    }
    return rawName;
  }
  const xlinkNS = "http://www.w3.org/1999/xlink";
  function patchAttr(el, key, value, isSVG, instance, isBoolean2 = isSpecialBooleanAttr(key)) {
    if (isSVG && key.startsWith("xlink:")) {
      if (value == null) {
        el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      if (value == null || isBoolean2 && !includeBooleanAttr(value)) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(
          key,
          isBoolean2 ? "" : isSymbol(value) ? String(value) : value
        );
      }
    }
  }
  function patchDOMProp(el, key, value, parentComponent, attrName) {
    if (key === "innerHTML" || key === "textContent") {
      if (value != null) {
        el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
      }
      return;
    }
    const tag = el.tagName;
    if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
    !tag.includes("-")) {
      const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
      const newValue = value == null ? (
        // #11647: value should be set as empty string for null and undefined,
        // but <input type="checkbox"> should be set as 'on'.
        el.type === "checkbox" ? "on" : ""
      ) : String(value);
      if (oldValue !== newValue || !("_value" in el)) {
        el.value = newValue;
      }
      if (value == null) {
        el.removeAttribute(key);
      }
      el._value = value;
      return;
    }
    let needRemove = false;
    if (value === "" || value == null) {
      const type2 = typeof el[key];
      if (type2 === "boolean") {
        value = includeBooleanAttr(value);
      } else if (value == null && type2 === "string") {
        value = "";
        needRemove = true;
      } else if (type2 === "number") {
        value = 0;
        needRemove = true;
      }
    }
    try {
      el[key] = value;
    } catch (e) {
      if (!needRemove) {
        warn(
          `Failed setting prop "${key}" on <${tag.toLowerCase()}>: value ${value} is invalid.`,
          e
        );
      }
    }
    needRemove && el.removeAttribute(attrName || key);
  }
  function addEventListener(el, event, handler, options) {
    el.addEventListener(event, handler, options);
  }
  function removeEventListener(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
  }
  const veiKey = Symbol("_vei");
  function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
    const invokers = el[veiKey] || (el[veiKey] = {});
    const existingInvoker = invokers[rawName];
    if (nextValue && existingInvoker) {
      existingInvoker.value = sanitizeEventValue(nextValue, rawName);
    } else {
      const [name2, options] = parseName(rawName);
      if (nextValue) {
        const invoker = invokers[rawName] = createInvoker(
          sanitizeEventValue(nextValue, rawName),
          instance
        );
        addEventListener(el, name2, invoker, options);
      } else if (existingInvoker) {
        removeEventListener(el, name2, existingInvoker, options);
        invokers[rawName] = void 0;
      }
    }
  }
  const optionsModifierRE = /(?:Once|Passive|Capture)$/;
  function parseName(name2) {
    let options;
    if (optionsModifierRE.test(name2)) {
      options = {};
      let m;
      while (m = name2.match(optionsModifierRE)) {
        name2 = name2.slice(0, name2.length - m[0].length);
        options[m[0].toLowerCase()] = true;
      }
    }
    const event = name2[2] === ":" ? name2.slice(3) : hyphenate(name2.slice(2));
    return [event, options];
  }
  let cachedNow = 0;
  const p$1 = /* @__PURE__ */ Promise.resolve();
  const getNow = () => cachedNow || (p$1.then(() => cachedNow = 0), cachedNow = Date.now());
  function createInvoker(initialValue, instance) {
    const invoker = (e) => {
      if (!e._vts) {
        e._vts = Date.now();
      } else if (e._vts <= invoker.attached) {
        return;
      }
      callWithAsyncErrorHandling(
        patchStopImmediatePropagation(e, invoker.value),
        instance,
        5,
        [e]
      );
    };
    invoker.value = initialValue;
    invoker.attached = getNow();
    return invoker;
  }
  function sanitizeEventValue(value, propName) {
    if (isFunction$3(value) || isArray$2(value)) {
      return value;
    }
    warn(
      `Wrong type passed as event handler to ${propName} - did you forget @ or : in front of your prop?
Expected function or array of functions, received type ${typeof value}.`
    );
    return NOOP;
  }
  function patchStopImmediatePropagation(e, value) {
    if (isArray$2(value)) {
      const originalStop = e.stopImmediatePropagation;
      e.stopImmediatePropagation = () => {
        originalStop.call(e);
        e._stopped = true;
      };
      return value.map(
        (fn2) => (e2) => !e2._stopped && fn2 && fn2(e2)
      );
    } else {
      return value;
    }
  }
  const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
  key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
  const patchProp = (el, key, prevValue, nextValue, namespace2, parentComponent) => {
    const isSVG = namespace2 === "svg";
    if (key === "class") {
      patchClass(el, nextValue, isSVG);
    } else if (key === "style") {
      patchStyle(el, prevValue, nextValue);
    } else if (isOn(key)) {
      if (!isModelListener(key)) {
        patchEvent(el, key, prevValue, nextValue, parentComponent);
      }
    } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
      patchDOMProp(el, key, nextValue);
      if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
        patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
      }
    } else if (
      // #11081 force set props for possible async custom element
      el._isVueCE && (/[A-Z]/.test(key) || !isString$2(nextValue))
    ) {
      patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
    } else {
      if (key === "true-value") {
        el._trueValue = nextValue;
      } else if (key === "false-value") {
        el._falseValue = nextValue;
      }
      patchAttr(el, key, nextValue, isSVG);
    }
  };
  function shouldSetAsProp(el, key, value, isSVG) {
    if (isSVG) {
      if (key === "innerHTML" || key === "textContent") {
        return true;
      }
      if (key in el && isNativeOn(key) && isFunction$3(value)) {
        return true;
      }
      return false;
    }
    if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") {
      return false;
    }
    if (key === "sandbox" && el.tagName === "IFRAME") {
      return false;
    }
    if (key === "form") {
      return false;
    }
    if (key === "list" && el.tagName === "INPUT") {
      return false;
    }
    if (key === "type" && el.tagName === "TEXTAREA") {
      return false;
    }
    if (key === "width" || key === "height") {
      const tag = el.tagName;
      if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
        return false;
      }
    }
    if (isNativeOn(key) && isString$2(value)) {
      return false;
    }
    return key in el;
  }
  const systemModifiers = ["ctrl", "shift", "alt", "meta"];
  const modifierGuards = {
    stop: (e) => e.stopPropagation(),
    prevent: (e) => e.preventDefault(),
    self: (e) => e.target !== e.currentTarget,
    ctrl: (e) => !e.ctrlKey,
    shift: (e) => !e.shiftKey,
    alt: (e) => !e.altKey,
    meta: (e) => !e.metaKey,
    left: (e) => "button" in e && e.button !== 0,
    middle: (e) => "button" in e && e.button !== 1,
    right: (e) => "button" in e && e.button !== 2,
    exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
  };
  const withModifiers = (fn2, modifiers) => {
    const cache = fn2._withMods || (fn2._withMods = {});
    const cacheKey = modifiers.join(".");
    return cache[cacheKey] || (cache[cacheKey] = ((event, ...args) => {
      for (let i = 0; i < modifiers.length; i++) {
        const guard = modifierGuards[modifiers[i]];
        if (guard && guard(event, modifiers)) return;
      }
      return fn2(event, ...args);
    }));
  };
  const rendererOptions = /* @__PURE__ */ extend$1({ patchProp }, nodeOps);
  let renderer;
  function ensureRenderer() {
    return renderer || (renderer = createRenderer(rendererOptions));
  }
  const createApp$2 = ((...args) => {
    const app = ensureRenderer().createApp(...args);
    {
      injectNativeTagCheck(app);
      injectCompilerOptionsCheck(app);
    }
    const { mount } = app;
    app.mount = (containerOrSelector) => {
      const container = normalizeContainer(containerOrSelector);
      if (!container) return;
      const component = app._component;
      if (!isFunction$3(component) && !component.render && !component.template) {
        component.template = container.innerHTML;
      }
      if (container.nodeType === 1) {
        container.textContent = "";
      }
      const proxy = mount(container, false, resolveRootNamespace(container));
      if (container instanceof Element) {
        container.removeAttribute("v-cloak");
        container.setAttribute("data-v-app", "");
      }
      return proxy;
    };
    return app;
  });
  function resolveRootNamespace(container) {
    if (container instanceof SVGElement) {
      return "svg";
    }
    if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
      return "mathml";
    }
  }
  function injectNativeTagCheck(app) {
    Object.defineProperty(app.config, "isNativeTag", {
      value: (tag) => isHTMLTag(tag) || isSVGTag(tag) || isMathMLTag(tag),
      writable: false
    });
  }
  function injectCompilerOptionsCheck(app) {
    {
      const isCustomElement = app.config.isCustomElement;
      Object.defineProperty(app.config, "isCustomElement", {
        get() {
          return isCustomElement;
        },
        set() {
          warn(
            `The \`isCustomElement\` config option is deprecated. Use \`compilerOptions.isCustomElement\` instead.`
          );
        }
      });
      const compilerOptions = app.config.compilerOptions;
      const msg = `The \`compilerOptions\` config option is only respected when using a build of Vue.js that includes the runtime compiler (aka "full build"). Since you are using the runtime-only build, \`compilerOptions\` must be passed to \`@vue/compiler-dom\` in the build setup instead.
- For vue-loader: pass it via vue-loader's \`compilerOptions\` loader option.
- For vue-cli: see https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader
- For vite: pass it via @vitejs/plugin-vue options. See https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-sfc`;
      Object.defineProperty(app.config, "compilerOptions", {
        get() {
          warn(msg);
          return compilerOptions;
        },
        set() {
          warn(msg);
        }
      });
    }
  }
  function normalizeContainer(container) {
    if (isString$2(container)) {
      const res2 = document.querySelector(container);
      if (!res2) {
        warn(
          `Failed to mount app: mount target selector "${container}" returned null.`
        );
      }
      return res2;
    }
    if (window.ShadowRoot && container instanceof window.ShadowRoot && container.mode === "closed") {
      warn(
        `mounting on a ShadowRoot with \`{mode: "closed"}\` may lead to unpredictable bugs`
      );
    }
    return container;
  }
  /**
  * vue v3.5.25
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  function initDev() {
    {
      initCustomFormatter();
    }
  }
  {
    initDev();
  }
  /*!
   * FilePond 4.32.10
   * Licensed under MIT, https://opensource.org/licenses/MIT/
   * Please visit https://pqina.nl/filepond/ for details.
   */
  const isNode = (value) => value instanceof HTMLElement;
  const createStore = (initialState, queries2 = [], actions2 = []) => {
    const state2 = {
      ...initialState
    };
    const actionQueue = [];
    const dispatchQueue = [];
    const getState = () => ({ ...state2 });
    const processActionQueue = () => {
      const queue2 = [...actionQueue];
      actionQueue.length = 0;
      return queue2;
    };
    const processDispatchQueue = () => {
      const queue2 = [...dispatchQueue];
      dispatchQueue.length = 0;
      queue2.forEach(({ type: type2, data: data2 }) => {
        dispatch(type2, data2);
      });
    };
    const dispatch = (type2, data2, isBlocking) => {
      if (isBlocking && !document.hidden) {
        dispatchQueue.push({ type: type2, data: data2 });
        return;
      }
      if (actionHandlers[type2]) {
        actionHandlers[type2](data2);
      }
      actionQueue.push({
        type: type2,
        data: data2
      });
    };
    const query = (str, ...args) => queryHandles[str] ? queryHandles[str](...args) : null;
    const api2 = {
      getState,
      processActionQueue,
      processDispatchQueue,
      dispatch,
      query
    };
    let queryHandles = {};
    queries2.forEach((query2) => {
      queryHandles = {
        ...query2(state2),
        ...queryHandles
      };
    });
    let actionHandlers = {};
    actions2.forEach((action) => {
      actionHandlers = {
        ...action(dispatch, query, state2),
        ...actionHandlers
      };
    });
    return api2;
  };
  const defineProperty = (obj, property, definition) => {
    if (typeof definition === "function") {
      obj[property] = definition;
      return;
    }
    Object.defineProperty(obj, property, { ...definition });
  };
  const forin = (obj, cb) => {
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue;
      }
      cb(key, obj[key]);
    }
  };
  const createObject = (definition) => {
    const obj = {};
    forin(definition, (property) => {
      defineProperty(obj, property, definition[property]);
    });
    return obj;
  };
  const attr = (node, name2, value = null) => {
    if (value === null) {
      return node.getAttribute(name2) || node.hasAttribute(name2);
    }
    node.setAttribute(name2, value);
  };
  const ns = "http://www.w3.org/2000/svg";
  const svgElements = ["svg", "path"];
  const isSVGElement = (tag) => svgElements.includes(tag);
  const createElement$1 = (tag, className, attributes = {}) => {
    if (typeof className === "object") {
      attributes = className;
      className = null;
    }
    const element = isSVGElement(tag) ? document.createElementNS(ns, tag) : document.createElement(tag);
    if (className) {
      if (isSVGElement(tag)) {
        attr(element, "class", className);
      } else {
        element.className = className;
      }
    }
    forin(attributes, (name2, value) => {
      attr(element, name2, value);
    });
    return element;
  };
  const appendChild = (parent) => (child, index) => {
    if (typeof index !== "undefined" && parent.children[index]) {
      parent.insertBefore(child, parent.children[index]);
    } else {
      parent.appendChild(child);
    }
  };
  const appendChildView = (parent, childViews) => (view, index) => {
    if (typeof index !== "undefined") {
      childViews.splice(index, 0, view);
    } else {
      childViews.push(view);
    }
    return view;
  };
  const removeChildView = (parent, childViews) => (view) => {
    childViews.splice(childViews.indexOf(view), 1);
    if (view.element.parentNode) {
      parent.removeChild(view.element);
    }
    return view;
  };
  const IS_BROWSER = (() => typeof window !== "undefined" && typeof window.document !== "undefined")();
  const isBrowser$2 = () => IS_BROWSER;
  const testElement = isBrowser$2() ? createElement$1("svg") : {};
  const getChildCount = "children" in testElement ? (el) => el.children.length : (el) => el.childNodes.length;
  const getViewRect = (elementRect, childViews, offset, scale) => {
    const left = offset[0] || elementRect.left;
    const top = offset[1] || elementRect.top;
    const right = left + elementRect.width;
    const bottom = top + elementRect.height * (scale[1] || 1);
    const rect = {
      // the rectangle of the element itself
      element: {
        ...elementRect
      },
      // the rectangle of the element expanded to contain its children, does not include any margins
      inner: {
        left: elementRect.left,
        top: elementRect.top,
        right: elementRect.right,
        bottom: elementRect.bottom
      },
      // the rectangle of the element expanded to contain its children including own margin and child margins
      // margins will be added after we've recalculated the size
      outer: {
        left,
        top,
        right,
        bottom
      }
    };
    childViews.filter((childView) => !childView.isRectIgnored()).map((childView) => childView.rect).forEach((childViewRect) => {
      expandRect(rect.inner, { ...childViewRect.inner });
      expandRect(rect.outer, { ...childViewRect.outer });
    });
    calculateRectSize(rect.inner);
    rect.outer.bottom += rect.element.marginBottom;
    rect.outer.right += rect.element.marginRight;
    calculateRectSize(rect.outer);
    return rect;
  };
  const expandRect = (parent, child) => {
    child.top += parent.top;
    child.right += parent.left;
    child.bottom += parent.top;
    child.left += parent.left;
    if (child.bottom > parent.bottom) {
      parent.bottom = child.bottom;
    }
    if (child.right > parent.right) {
      parent.right = child.right;
    }
  };
  const calculateRectSize = (rect) => {
    rect.width = rect.right - rect.left;
    rect.height = rect.bottom - rect.top;
  };
  const isNumber$1 = (value) => typeof value === "number";
  const thereYet = (position, destination, velocity, errorMargin = 1e-3) => {
    return Math.abs(position - destination) < errorMargin && Math.abs(velocity) < errorMargin;
  };
  const spring = (
    // default options
    ({ stiffness = 0.5, damping = 0.75, mass = 10 } = {}) => {
      let target = null;
      let position = null;
      let velocity = 0;
      let resting = false;
      const interpolate = (ts, skipToEndState) => {
        if (resting) return;
        if (!(isNumber$1(target) && isNumber$1(position))) {
          resting = true;
          velocity = 0;
          return;
        }
        const f = -(position - target) * stiffness;
        velocity += f / mass;
        position += velocity;
        velocity *= damping;
        if (thereYet(position, target, velocity) || skipToEndState) {
          position = target;
          velocity = 0;
          resting = true;
          api2.onupdate(position);
          api2.oncomplete(position);
        } else {
          api2.onupdate(position);
        }
      };
      const setTarget = (value) => {
        if (isNumber$1(value) && !isNumber$1(position)) {
          position = value;
        }
        if (target === null) {
          target = value;
          position = value;
        }
        target = value;
        if (position === target || typeof target === "undefined") {
          resting = true;
          velocity = 0;
          api2.onupdate(position);
          api2.oncomplete(position);
          return;
        }
        resting = false;
      };
      const api2 = createObject({
        interpolate,
        target: {
          set: setTarget,
          get: () => target
        },
        resting: {
          get: () => resting
        },
        onupdate: (value) => {
        },
        oncomplete: (value) => {
        }
      });
      return api2;
    }
  );
  const easeInOutQuad = (t2) => t2 < 0.5 ? 2 * t2 * t2 : -1 + (4 - 2 * t2) * t2;
  const tween = (
    // default values
    ({ duration = 500, easing = easeInOutQuad, delay = 0 } = {}) => {
      let start = null;
      let t2;
      let p2;
      let resting = true;
      let reverse = false;
      let target = null;
      const interpolate = (ts, skipToEndState) => {
        if (resting || target === null) return;
        if (start === null) {
          start = ts;
        }
        if (ts - start < delay) return;
        t2 = ts - start - delay;
        if (t2 >= duration || skipToEndState) {
          t2 = 1;
          p2 = reverse ? 0 : 1;
          api2.onupdate(p2 * target);
          api2.oncomplete(p2 * target);
          resting = true;
        } else {
          p2 = t2 / duration;
          api2.onupdate((t2 >= 0 ? easing(reverse ? 1 - p2 : p2) : 0) * target);
        }
      };
      const api2 = createObject({
        interpolate,
        target: {
          get: () => reverse ? 0 : target,
          set: (value) => {
            if (target === null) {
              target = value;
              api2.onupdate(value);
              api2.oncomplete(value);
              return;
            }
            if (value < target) {
              target = 1;
              reverse = true;
            } else {
              reverse = false;
              target = value;
            }
            resting = false;
            start = null;
          }
        },
        resting: {
          get: () => resting
        },
        onupdate: (value) => {
        },
        oncomplete: (value) => {
        }
      });
      return api2;
    }
  );
  const animator = {
    spring,
    tween
  };
  const createAnimator = (definition, category, property) => {
    const def2 = definition[category] && typeof definition[category][property] === "object" ? definition[category][property] : definition[category] || definition;
    const type2 = typeof def2 === "string" ? def2 : def2.type;
    const props2 = typeof def2 === "object" ? { ...def2 } : {};
    return animator[type2] ? animator[type2](props2) : null;
  };
  const addGetSet = (keys, obj, props2, overwrite = false) => {
    obj = Array.isArray(obj) ? obj : [obj];
    obj.forEach((o2) => {
      keys.forEach((key) => {
        let name2 = key;
        let getter = () => props2[key];
        let setter = (value) => props2[key] = value;
        if (typeof key === "object") {
          name2 = key.key;
          getter = key.getter || getter;
          setter = key.setter || setter;
        }
        if (o2[name2] && !overwrite) {
          return;
        }
        o2[name2] = {
          get: getter,
          set: setter
        };
      });
    });
  };
  const animations = ({ mixinConfig, viewProps, viewInternalAPI, viewExternalAPI }) => {
    const initialProps = { ...viewProps };
    const animations2 = [];
    forin(mixinConfig, (property, animation) => {
      const animator2 = createAnimator(animation);
      if (!animator2) {
        return;
      }
      animator2.onupdate = (value) => {
        viewProps[property] = value;
      };
      animator2.target = initialProps[property];
      const prop = {
        key: property,
        setter: (value) => {
          if (animator2.target === value) {
            return;
          }
          animator2.target = value;
        },
        getter: () => viewProps[property]
      };
      addGetSet([prop], [viewInternalAPI, viewExternalAPI], viewProps, true);
      animations2.push(animator2);
    });
    return {
      write: (ts) => {
        let skipToEndState = document.hidden;
        let resting = true;
        animations2.forEach((animation) => {
          if (!animation.resting) resting = false;
          animation.interpolate(ts, skipToEndState);
        });
        return resting;
      },
      destroy: () => {
      }
    };
  };
  const addEvent = (element) => (type2, fn2) => {
    element.addEventListener(type2, fn2);
  };
  const removeEvent = (element) => (type2, fn2) => {
    element.removeEventListener(type2, fn2);
  };
  const listeners = ({
    mixinConfig,
    viewProps,
    viewInternalAPI,
    viewExternalAPI,
    viewState,
    view
  }) => {
    const events2 = [];
    const add = addEvent(view.element);
    const remove2 = removeEvent(view.element);
    viewExternalAPI.on = (type2, fn2) => {
      events2.push({
        type: type2,
        fn: fn2
      });
      add(type2, fn2);
    };
    viewExternalAPI.off = (type2, fn2) => {
      events2.splice(events2.findIndex((event) => event.type === type2 && event.fn === fn2), 1);
      remove2(type2, fn2);
    };
    return {
      write: () => {
        return true;
      },
      destroy: () => {
        events2.forEach((event) => {
          remove2(event.type, event.fn);
        });
      }
    };
  };
  const apis = ({ mixinConfig, viewProps, viewExternalAPI }) => {
    addGetSet(mixinConfig, viewExternalAPI, viewProps);
  };
  const isDefined = (value) => value != null;
  const defaults$1 = {
    opacity: 1,
    scaleX: 1,
    scaleY: 1,
    translateX: 0,
    translateY: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    originX: 0,
    originY: 0
  };
  const styles$3 = ({ mixinConfig, viewProps, viewInternalAPI, viewExternalAPI, view }) => {
    const initialProps = { ...viewProps };
    const currentProps = {};
    addGetSet(mixinConfig, [viewInternalAPI, viewExternalAPI], viewProps);
    const getOffset = () => [viewProps["translateX"] || 0, viewProps["translateY"] || 0];
    const getScale = () => [viewProps["scaleX"] || 0, viewProps["scaleY"] || 0];
    const getRect = () => view.rect ? getViewRect(view.rect, view.childViews, getOffset(), getScale()) : null;
    viewInternalAPI.rect = { get: getRect };
    viewExternalAPI.rect = { get: getRect };
    mixinConfig.forEach((key) => {
      viewProps[key] = typeof initialProps[key] === "undefined" ? defaults$1[key] : initialProps[key];
    });
    return {
      write: () => {
        if (!propsHaveChanged(currentProps, viewProps)) {
          return;
        }
        applyStyles(view.element, viewProps);
        Object.assign(currentProps, { ...viewProps });
        return true;
      },
      destroy: () => {
      }
    };
  };
  const propsHaveChanged = (currentProps, newProps) => {
    if (Object.keys(currentProps).length !== Object.keys(newProps).length) {
      return true;
    }
    for (const prop in newProps) {
      if (newProps[prop] !== currentProps[prop]) {
        return true;
      }
    }
    return false;
  };
  const applyStyles = (element, {
    opacity,
    perspective,
    translateX,
    translateY,
    scaleX,
    scaleY,
    rotateX,
    rotateY,
    rotateZ,
    originX,
    originY,
    width,
    height
  }) => {
    let transforms = "";
    let styles2 = "";
    if (isDefined(originX) || isDefined(originY)) {
      styles2 += `transform-origin: ${originX || 0}px ${originY || 0}px;`;
    }
    if (isDefined(perspective)) {
      transforms += `perspective(${perspective}px) `;
    }
    if (isDefined(translateX) || isDefined(translateY)) {
      transforms += `translate3d(${translateX || 0}px, ${translateY || 0}px, 0) `;
    }
    if (isDefined(scaleX) || isDefined(scaleY)) {
      transforms += `scale3d(${isDefined(scaleX) ? scaleX : 1}, ${isDefined(scaleY) ? scaleY : 1}, 1) `;
    }
    if (isDefined(rotateZ)) {
      transforms += `rotateZ(${rotateZ}rad) `;
    }
    if (isDefined(rotateX)) {
      transforms += `rotateX(${rotateX}rad) `;
    }
    if (isDefined(rotateY)) {
      transforms += `rotateY(${rotateY}rad) `;
    }
    if (transforms.length) {
      styles2 += `transform:${transforms};`;
    }
    if (isDefined(opacity)) {
      styles2 += `opacity:${opacity};`;
      if (opacity === 0) {
        styles2 += `visibility:hidden;`;
      }
      if (opacity < 1) {
        styles2 += `pointer-events:none;`;
      }
    }
    if (isDefined(height)) {
      styles2 += `height:${height}px;`;
    }
    if (isDefined(width)) {
      styles2 += `width:${width}px;`;
    }
    const elementCurrentStyle = element.elementCurrentStyle || "";
    if (styles2.length !== elementCurrentStyle.length || styles2 !== elementCurrentStyle) {
      element.style.cssText = styles2;
      element.elementCurrentStyle = styles2;
    }
  };
  const Mixins = {
    styles: styles$3,
    listeners,
    animations,
    apis
  };
  const updateRect = (rect = {}, element = {}, style = {}) => {
    if (!element.layoutCalculated) {
      rect.paddingTop = parseInt(style.paddingTop, 10) || 0;
      rect.marginTop = parseInt(style.marginTop, 10) || 0;
      rect.marginRight = parseInt(style.marginRight, 10) || 0;
      rect.marginBottom = parseInt(style.marginBottom, 10) || 0;
      rect.marginLeft = parseInt(style.marginLeft, 10) || 0;
      element.layoutCalculated = true;
    }
    rect.left = element.offsetLeft || 0;
    rect.top = element.offsetTop || 0;
    rect.width = element.offsetWidth || 0;
    rect.height = element.offsetHeight || 0;
    rect.right = rect.left + rect.width;
    rect.bottom = rect.top + rect.height;
    rect.scrollTop = element.scrollTop;
    rect.hidden = element.offsetParent === null;
    return rect;
  };
  const createView = (
    // default view definition
    ({
      // element definition
      tag = "div",
      name: name2 = null,
      attributes = {},
      // view interaction
      read = () => {
      },
      write: write2 = () => {
      },
      create: create2 = () => {
      },
      destroy: destroy2 = () => {
      },
      // hooks
      filterFrameActionsForChild = (child, actions2) => actions2,
      didCreateView = () => {
      },
      didWriteView = () => {
      },
      // rect related
      ignoreRect = false,
      ignoreRectUpdate = false,
      // mixins
      mixins = []
    } = {}) => (store, props2 = {}) => {
      const element = createElement$1(tag, `filepond--${name2}`, attributes);
      const style = window.getComputedStyle(element, null);
      const rect = updateRect();
      let frameRect = null;
      let isResting = false;
      const childViews = [];
      const activeMixins = [];
      const ref2 = {};
      const state2 = {};
      const writers = [
        write2
        // default writer
      ];
      const readers = [
        read
        // default reader
      ];
      const destroyers = [
        destroy2
        // default destroy
      ];
      const getElement = () => element;
      const getChildViews = () => childViews.concat();
      const getReference = () => ref2;
      const createChildView = (store2) => (view, props3) => view(store2, props3);
      const getRect = () => {
        if (frameRect) {
          return frameRect;
        }
        frameRect = getViewRect(rect, childViews, [0, 0], [1, 1]);
        return frameRect;
      };
      const getStyle = () => style;
      const _read = () => {
        frameRect = null;
        childViews.forEach((child) => child._read());
        const shouldUpdate = !(ignoreRectUpdate && rect.width && rect.height);
        if (shouldUpdate) {
          updateRect(rect, element, style);
        }
        const api2 = { root: internalAPI, props: props2, rect };
        readers.forEach((reader) => reader(api2));
      };
      const _write = (ts, frameActions, shouldOptimize) => {
        let resting = frameActions.length === 0;
        writers.forEach((writer) => {
          const writerResting = writer({
            props: props2,
            root: internalAPI,
            actions: frameActions,
            timestamp: ts,
            shouldOptimize
          });
          if (writerResting === false) {
            resting = false;
          }
        });
        activeMixins.forEach((mixin) => {
          const mixinResting = mixin.write(ts);
          if (mixinResting === false) {
            resting = false;
          }
        });
        childViews.filter((child) => !!child.element.parentNode).forEach((child) => {
          const childResting = child._write(
            ts,
            filterFrameActionsForChild(child, frameActions),
            shouldOptimize
          );
          if (!childResting) {
            resting = false;
          }
        });
        childViews.forEach((child, index) => {
          if (child.element.parentNode) {
            return;
          }
          internalAPI.appendChild(child.element, index);
          child._read();
          child._write(
            ts,
            filterFrameActionsForChild(child, frameActions),
            shouldOptimize
          );
          resting = false;
        });
        isResting = resting;
        didWriteView({
          props: props2,
          root: internalAPI,
          actions: frameActions,
          timestamp: ts
        });
        return resting;
      };
      const _destroy = () => {
        activeMixins.forEach((mixin) => mixin.destroy());
        destroyers.forEach((destroyer) => {
          destroyer({ root: internalAPI, props: props2 });
        });
        childViews.forEach((child) => child._destroy());
      };
      const sharedAPIDefinition = {
        element: {
          get: getElement
        },
        style: {
          get: getStyle
        },
        childViews: {
          get: getChildViews
        }
      };
      const internalAPIDefinition = {
        ...sharedAPIDefinition,
        rect: {
          get: getRect
        },
        // access to custom children references
        ref: {
          get: getReference
        },
        // dom modifiers
        is: (needle) => name2 === needle,
        appendChild: appendChild(element),
        createChildView: createChildView(store),
        linkView: (view) => {
          childViews.push(view);
          return view;
        },
        unlinkView: (view) => {
          childViews.splice(childViews.indexOf(view), 1);
        },
        appendChildView: appendChildView(element, childViews),
        removeChildView: removeChildView(element, childViews),
        registerWriter: (writer) => writers.push(writer),
        registerReader: (reader) => readers.push(reader),
        registerDestroyer: (destroyer) => destroyers.push(destroyer),
        invalidateLayout: () => element.layoutCalculated = false,
        // access to data store
        dispatch: store.dispatch,
        query: store.query
      };
      const externalAPIDefinition = {
        element: {
          get: getElement
        },
        childViews: {
          get: getChildViews
        },
        rect: {
          get: getRect
        },
        resting: {
          get: () => isResting
        },
        isRectIgnored: () => ignoreRect,
        _read,
        _write,
        _destroy
      };
      const mixinAPIDefinition = {
        ...sharedAPIDefinition,
        rect: {
          get: () => rect
        }
      };
      Object.keys(mixins).sort((a, b) => {
        if (a === "styles") {
          return 1;
        } else if (b === "styles") {
          return -1;
        }
        return 0;
      }).forEach((key) => {
        const mixinAPI = Mixins[key]({
          mixinConfig: mixins[key],
          viewProps: props2,
          viewState: state2,
          viewInternalAPI: internalAPIDefinition,
          viewExternalAPI: externalAPIDefinition,
          view: createObject(mixinAPIDefinition)
        });
        if (mixinAPI) {
          activeMixins.push(mixinAPI);
        }
      });
      const internalAPI = createObject(internalAPIDefinition);
      create2({
        root: internalAPI,
        props: props2
      });
      const childCount = getChildCount(element);
      childViews.forEach((child, index) => {
        internalAPI.appendChild(child.element, childCount + index);
      });
      didCreateView(internalAPI);
      return createObject(externalAPIDefinition);
    }
  );
  const createPainter = (read, write2, fps = 60) => {
    const name2 = "__framePainter";
    if (window[name2]) {
      window[name2].readers.push(read);
      window[name2].writers.push(write2);
      return;
    }
    window[name2] = {
      readers: [read],
      writers: [write2]
    };
    const painter = window[name2];
    const interval = 1e3 / fps;
    let last = null;
    let id = null;
    let requestTick = null;
    let cancelTick = null;
    const setTimerType = () => {
      if (document.hidden) {
        requestTick = () => window.setTimeout(() => tick(performance.now()), interval);
        cancelTick = () => window.clearTimeout(id);
      } else {
        requestTick = () => window.requestAnimationFrame(tick);
        cancelTick = () => window.cancelAnimationFrame(id);
      }
    };
    document.addEventListener("visibilitychange", () => {
      if (cancelTick) cancelTick();
      setTimerType();
      tick(performance.now());
    });
    const tick = (ts) => {
      id = requestTick(tick);
      if (!last) {
        last = ts;
      }
      const delta = ts - last;
      if (delta <= interval) {
        return;
      }
      last = ts - delta % interval;
      painter.readers.forEach((read2) => read2());
      painter.writers.forEach((write3) => write3(ts));
    };
    setTimerType();
    tick(performance.now());
    return {
      pause: () => {
        cancelTick(id);
      }
    };
  };
  const createRoute = (routes, fn2) => ({ root: root2, props: props2, actions: actions2 = [], timestamp, shouldOptimize }) => {
    actions2.filter((action) => routes[action.type]).forEach(
      (action) => routes[action.type]({ root: root2, props: props2, action: action.data, timestamp, shouldOptimize })
    );
    if (fn2) {
      fn2({ root: root2, props: props2, actions: actions2, timestamp, shouldOptimize });
    }
  };
  const insertBefore = (newNode, referenceNode) => referenceNode.parentNode.insertBefore(newNode, referenceNode);
  const insertAfter = (newNode, referenceNode) => {
    return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  };
  const isArray$1 = (value) => Array.isArray(value);
  const isEmpty = (value) => value == null;
  const trim$1 = (str) => str.trim();
  const toString$1 = (value) => "" + value;
  const toArray$2 = (value, splitter = ",") => {
    if (isEmpty(value)) {
      return [];
    }
    if (isArray$1(value)) {
      return value;
    }
    return toString$1(value).split(splitter).map(trim$1).filter((str) => str.length);
  };
  const isBoolean$1 = (value) => typeof value === "boolean";
  const toBoolean = (value) => isBoolean$1(value) ? value : value === "true";
  const isString$1 = (value) => typeof value === "string";
  const toNumber = (value) => isNumber$1(value) ? value : isString$1(value) ? toString$1(value).replace(/[a-z]+/gi, "") : 0;
  const toInt = (value) => parseInt(toNumber(value), 10);
  const toFloat = (value) => parseFloat(toNumber(value));
  const isInt = (value) => isNumber$1(value) && isFinite(value) && Math.floor(value) === value;
  const toBytes = (value, base = 1e3) => {
    if (isInt(value)) {
      return value;
    }
    let naturalFileSize = toString$1(value).trim();
    if (/MB$/i.test(naturalFileSize)) {
      naturalFileSize = naturalFileSize.replace(/MB$i/, "").trim();
      return toInt(naturalFileSize) * base * base;
    }
    if (/KB/i.test(naturalFileSize)) {
      naturalFileSize = naturalFileSize.replace(/KB$i/, "").trim();
      return toInt(naturalFileSize) * base;
    }
    return toInt(naturalFileSize);
  };
  const isFunction$2 = (value) => typeof value === "function";
  const toFunctionReference = (string) => {
    let ref2 = self;
    let levels = string.split(".");
    let level = null;
    while (level = levels.shift()) {
      ref2 = ref2[level];
      if (!ref2) {
        return null;
      }
    }
    return ref2;
  };
  const methods = {
    process: "POST",
    patch: "PATCH",
    revert: "DELETE",
    fetch: "GET",
    restore: "GET",
    load: "GET"
  };
  const createServerAPI = (outline) => {
    const api2 = {};
    api2.url = isString$1(outline) ? outline : outline.url || "";
    api2.timeout = outline.timeout ? parseInt(outline.timeout, 10) : 0;
    api2.headers = outline.headers ? outline.headers : {};
    forin(methods, (key) => {
      api2[key] = createAction(key, outline[key], methods[key], api2.timeout, api2.headers);
    });
    api2.process = outline.process || isString$1(outline) || outline.url ? api2.process : null;
    api2.remove = outline.remove || null;
    delete api2.headers;
    return api2;
  };
  const createAction = (name2, outline, method, timeout, headers) => {
    if (outline === null) {
      return null;
    }
    if (typeof outline === "function") {
      return outline;
    }
    const action = {
      url: method === "GET" || method === "PATCH" ? `?${name2}=` : "",
      method,
      headers,
      withCredentials: false,
      timeout,
      onload: null,
      ondata: null,
      onerror: null
    };
    if (isString$1(outline)) {
      action.url = outline;
      return action;
    }
    Object.assign(action, outline);
    if (isString$1(action.headers)) {
      const parts = action.headers.split(/:(.+)/);
      action.headers = {
        header: parts[0],
        value: parts[1]
      };
    }
    action.withCredentials = toBoolean(action.withCredentials);
    return action;
  };
  const toServerAPI = (value) => createServerAPI(value);
  const isNull = (value) => value === null;
  const isObject$1 = (value) => typeof value === "object" && value !== null;
  const isAPI = (value) => {
    return isObject$1(value) && isString$1(value.url) && isObject$1(value.process) && isObject$1(value.revert) && isObject$1(value.restore) && isObject$1(value.fetch);
  };
  const getType = (value) => {
    if (isArray$1(value)) {
      return "array";
    }
    if (isNull(value)) {
      return "null";
    }
    if (isInt(value)) {
      return "int";
    }
    if (/^[0-9]+ ?(?:GB|MB|KB)$/gi.test(value)) {
      return "bytes";
    }
    if (isAPI(value)) {
      return "api";
    }
    return typeof value;
  };
  const replaceSingleQuotes = (str) => str.replace(/{\s*'/g, '{"').replace(/'\s*}/g, '"}').replace(/'\s*:/g, '":').replace(/:\s*'/g, ':"').replace(/,\s*'/g, ',"').replace(/'\s*,/g, '",');
  const conversionTable = {
    array: toArray$2,
    boolean: toBoolean,
    int: (value) => getType(value) === "bytes" ? toBytes(value) : toInt(value),
    number: toFloat,
    float: toFloat,
    bytes: toBytes,
    string: (value) => isFunction$2(value) ? value : toString$1(value),
    function: (value) => toFunctionReference(value),
    serverapi: toServerAPI,
    object: (value) => {
      try {
        return JSON.parse(replaceSingleQuotes(value));
      } catch (e) {
        return null;
      }
    }
  };
  const convertTo = (value, type2) => conversionTable[type2](value);
  const getValueByType = (newValue, defaultValue, valueType) => {
    if (newValue === defaultValue) {
      return newValue;
    }
    let newValueType = getType(newValue);
    if (newValueType !== valueType) {
      const convertedValue = convertTo(newValue, valueType);
      newValueType = getType(convertedValue);
      if (convertedValue === null) {
        throw `Trying to assign value with incorrect type to "${option}", allowed type: "${valueType}"`;
      } else {
        newValue = convertedValue;
      }
    }
    return newValue;
  };
  const createOption = (defaultValue, valueType) => {
    let currentValue = defaultValue;
    return {
      enumerable: true,
      get: () => currentValue,
      set: (newValue) => {
        currentValue = getValueByType(newValue, defaultValue, valueType);
      }
    };
  };
  const createOptions = (options) => {
    const obj = {};
    forin(options, (prop) => {
      const optionDefinition = options[prop];
      obj[prop] = createOption(optionDefinition[0], optionDefinition[1]);
    });
    return createObject(obj);
  };
  const createInitialState = (options) => ({
    // model
    items: [],
    // timeout used for calling update items
    listUpdateTimeout: null,
    // timeout used for stacking metadata updates
    itemUpdateTimeout: null,
    // queue of items waiting to be processed
    processingQueue: [],
    // options
    options: createOptions(options)
  });
  const fromCamels = (string, separator = "-") => string.split(/(?=[A-Z])/).map((part) => part.toLowerCase()).join(separator);
  const createOptionAPI = (store, options) => {
    const obj = {};
    forin(options, (key) => {
      obj[key] = {
        get: () => store.getState().options[key],
        set: (value) => {
          store.dispatch(`SET_${fromCamels(key, "_").toUpperCase()}`, {
            value
          });
        }
      };
    });
    return obj;
  };
  const createOptionActions = (options) => (dispatch, query, state2) => {
    const obj = {};
    forin(options, (key) => {
      const name2 = fromCamels(key, "_").toUpperCase();
      obj[`SET_${name2}`] = (action) => {
        try {
          state2.options[key] = action.value;
        } catch (e) {
        }
        dispatch(`DID_SET_${name2}`, { value: state2.options[key] });
      };
    });
    return obj;
  };
  const createOptionQueries = (options) => (state2) => {
    const obj = {};
    forin(options, (key) => {
      obj[`GET_${fromCamels(key, "_").toUpperCase()}`] = (action) => state2.options[key];
    });
    return obj;
  };
  const InteractionMethod = {
    API: 1,
    DROP: 2,
    BROWSE: 3,
    PASTE: 4,
    NONE: 5
  };
  const getUniqueId = () => Math.random().toString(36).substring(2, 11);
  const arrayRemove = (arr, index) => arr.splice(index, 1);
  const run = (cb, sync) => {
    if (sync) {
      cb();
    } else if (document.hidden) {
      Promise.resolve(1).then(cb);
    } else {
      setTimeout(cb, 0);
    }
  };
  const on = () => {
    const listeners2 = [];
    const off = (event, cb) => {
      arrayRemove(
        listeners2,
        listeners2.findIndex((listener2) => listener2.event === event && (listener2.cb === cb || !cb))
      );
    };
    const fire = (event, args, sync) => {
      listeners2.filter((listener2) => listener2.event === event).map((listener2) => listener2.cb).forEach((cb) => run(() => cb(...args), sync));
    };
    return {
      fireSync: (event, ...args) => {
        fire(event, args, true);
      },
      fire: (event, ...args) => {
        fire(event, args, false);
      },
      on: (event, cb) => {
        listeners2.push({ event, cb });
      },
      onOnce: (event, cb) => {
        listeners2.push({
          event,
          cb: (...args) => {
            off(event, cb);
            cb(...args);
          }
        });
      },
      off
    };
  };
  const copyObjectPropertiesToObject = (src, target, excluded) => {
    Object.getOwnPropertyNames(src).filter((property) => !excluded.includes(property)).forEach(
      (key) => Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(src, key))
    );
  };
  const PRIVATE = [
    "fire",
    "process",
    "revert",
    "load",
    "on",
    "off",
    "onOnce",
    "retryLoad",
    "extend",
    "archive",
    "archived",
    "release",
    "released",
    "requestProcessing",
    "freeze"
  ];
  const createItemAPI = (item2) => {
    const api2 = {};
    copyObjectPropertiesToObject(item2, api2, PRIVATE);
    return api2;
  };
  const removeReleasedItems = (items) => {
    items.forEach((item2, index) => {
      if (item2.released) {
        arrayRemove(items, index);
      }
    });
  };
  const ItemStatus = {
    INIT: 1,
    IDLE: 2,
    PROCESSING_QUEUED: 9,
    PROCESSING: 3,
    PROCESSING_COMPLETE: 5,
    PROCESSING_ERROR: 6,
    PROCESSING_REVERT_ERROR: 10,
    LOADING: 7,
    LOAD_ERROR: 8
  };
  const FileOrigin = {
    INPUT: 1,
    LIMBO: 2,
    LOCAL: 3
  };
  const getNonNumeric = (str) => /[^0-9]+/.exec(str);
  const getDecimalSeparator = () => getNonNumeric(1.1.toLocaleString())[0];
  const getThousandsSeparator = () => {
    const decimalSeparator = getDecimalSeparator();
    const thousandsStringWithSeparator = 1e3.toLocaleString();
    const thousandsStringWithoutSeparator = 1e3.toString();
    if (thousandsStringWithSeparator !== thousandsStringWithoutSeparator) {
      return getNonNumeric(thousandsStringWithSeparator)[0];
    }
    return decimalSeparator === "." ? "," : ".";
  };
  const Type = {
    BOOLEAN: "boolean",
    INT: "int",
    NUMBER: "number",
    STRING: "string",
    ARRAY: "array",
    OBJECT: "object",
    FUNCTION: "function",
    ACTION: "action",
    SERVER_API: "serverapi",
    REGEX: "regex"
  };
  const filters = [];
  const applyFilterChain = (key, value, utils2) => new Promise((resolve2, reject) => {
    const matchingFilters = filters.filter((f) => f.key === key).map((f) => f.cb);
    if (matchingFilters.length === 0) {
      resolve2(value);
      return;
    }
    const initialFilter = matchingFilters.shift();
    matchingFilters.reduce(
      // loop over promises passing value to next promise
      (current, next) => current.then((value2) => next(value2, utils2)),
      // call initial filter, will return a promise
      initialFilter(value, utils2)
      // all executed
    ).then((value2) => resolve2(value2)).catch((error2) => reject(error2));
  });
  const applyFilters = (key, value, utils2) => filters.filter((f) => f.key === key).map((f) => f.cb(value, utils2));
  const addFilter = (key, cb) => filters.push({ key, cb });
  const extendDefaultOptions = (additionalOptions) => Object.assign(defaultOptions, additionalOptions);
  const getOptions = () => ({ ...defaultOptions });
  const setOptions = (opts) => {
    forin(opts, (key, value) => {
      if (!defaultOptions[key]) {
        return;
      }
      defaultOptions[key][0] = getValueByType(
        value,
        defaultOptions[key][0],
        defaultOptions[key][1]
      );
    });
  };
  const defaultOptions = {
    // the id to add to the root element
    id: [null, Type.STRING],
    // input field name to use
    name: ["filepond", Type.STRING],
    // disable the field
    disabled: [false, Type.BOOLEAN],
    // classname to put on wrapper
    className: [null, Type.STRING],
    // is the field required
    required: [false, Type.BOOLEAN],
    // Allow media capture when value is set
    captureMethod: [null, Type.STRING],
    // - "camera", "microphone" or "camcorder",
    // - Does not work with multiple on apple devices
    // - If set, acceptedFileTypes must be made to match with media wildcard "image/*", "audio/*" or "video/*"
    // sync `acceptedFileTypes` property with `accept` attribute
    allowSyncAcceptAttribute: [true, Type.BOOLEAN],
    // Feature toggles
    allowDrop: [true, Type.BOOLEAN],
    // Allow dropping of files
    allowBrowse: [true, Type.BOOLEAN],
    // Allow browsing the file system
    allowPaste: [true, Type.BOOLEAN],
    // Allow pasting files
    allowMultiple: [false, Type.BOOLEAN],
    // Allow multiple files (disabled by default, as multiple attribute is also required on input to allow multiple)
    allowReplace: [true, Type.BOOLEAN],
    // Allow dropping a file on other file to replace it (only works when multiple is set to false)
    allowRevert: [true, Type.BOOLEAN],
    // Allows user to revert file upload
    allowRemove: [true, Type.BOOLEAN],
    // Allow user to remove a file
    allowProcess: [true, Type.BOOLEAN],
    // Allows user to process a file, when set to false, this removes the file upload button
    allowReorder: [false, Type.BOOLEAN],
    // Allow reordering of files
    allowDirectoriesOnly: [false, Type.BOOLEAN],
    // Allow only selecting directories with browse (no support for filtering dnd at this point)
    // Try store file if `server` not set
    storeAsFile: [false, Type.BOOLEAN],
    // Revert mode
    forceRevert: [false, Type.BOOLEAN],
    // Set to 'force' to require the file to be reverted before removal
    // Input requirements
    maxFiles: [null, Type.INT],
    // Max number of files
    checkValidity: [false, Type.BOOLEAN],
    // Enables custom validity messages
    // Where to put file
    itemInsertLocationFreedom: [true, Type.BOOLEAN],
    // Set to false to always add items to begin or end of list
    itemInsertLocation: ["before", Type.STRING],
    // Default index in list to add items that have been dropped at the top of the list
    itemInsertInterval: [75, Type.INT],
    // Drag 'n Drop related
    dropOnPage: [false, Type.BOOLEAN],
    // Allow dropping of files anywhere on page (prevents browser from opening file if dropped outside of Up)
    dropOnElement: [true, Type.BOOLEAN],
    // Drop needs to happen on element (set to false to also load drops outside of Up)
    dropValidation: [false, Type.BOOLEAN],
    // Enable or disable validating files on drop
    ignoredFiles: [[".ds_store", "thumbs.db", "desktop.ini"], Type.ARRAY],
    // Upload related
    instantUpload: [true, Type.BOOLEAN],
    // Should upload files immediately on drop
    maxParallelUploads: [2, Type.INT],
    // Maximum files to upload in parallel
    allowMinimumUploadDuration: [true, Type.BOOLEAN],
    // if true uploads take at least 750 ms, this ensures the user sees the upload progress giving trust the upload actually happened
    // Chunks
    chunkUploads: [false, Type.BOOLEAN],
    // Enable chunked uploads
    chunkForce: [false, Type.BOOLEAN],
    // Force use of chunk uploads even for files smaller than chunk size
    chunkSize: [5e6, Type.INT],
    // Size of chunks (5MB default)
    chunkRetryDelays: [[500, 1e3, 3e3], Type.ARRAY],
    // Amount of times to retry upload of a chunk when it fails
    // The server api end points to use for uploading (see docs)
    server: [null, Type.SERVER_API],
    // File size calculations, can set to 1024, this is only used for display, properties use file size base 1000
    fileSizeBase: [1e3, Type.INT],
    // Labels and status messages
    labelFileSizeBytes: ["bytes", Type.STRING],
    labelFileSizeKilobytes: ["KB", Type.STRING],
    labelFileSizeMegabytes: ["MB", Type.STRING],
    labelFileSizeGigabytes: ["GB", Type.STRING],
    labelDecimalSeparator: [getDecimalSeparator(), Type.STRING],
    // Default is locale separator
    labelThousandsSeparator: [getThousandsSeparator(), Type.STRING],
    // Default is locale separator
    labelIdle: [
      'Drag & Drop your files or <span class="filepond--label-action">Browse</span>',
      Type.STRING
    ],
    labelInvalidField: ["Field contains invalid files", Type.STRING],
    labelFileWaitingForSize: ["Waiting for size", Type.STRING],
    labelFileSizeNotAvailable: ["Size not available", Type.STRING],
    labelFileCountSingular: ["file in list", Type.STRING],
    labelFileCountPlural: ["files in list", Type.STRING],
    labelFileLoading: ["Loading", Type.STRING],
    labelFileAdded: ["Added", Type.STRING],
    // assistive only
    labelFileLoadError: ["Error during load", Type.STRING],
    labelFileRemoved: ["Removed", Type.STRING],
    // assistive only
    labelFileRemoveError: ["Error during remove", Type.STRING],
    labelFileProcessing: ["Uploading", Type.STRING],
    labelFileProcessingComplete: ["Upload complete", Type.STRING],
    labelFileProcessingAborted: ["Upload cancelled", Type.STRING],
    labelFileProcessingError: ["Error during upload", Type.STRING],
    labelFileProcessingRevertError: ["Error during revert", Type.STRING],
    labelTapToCancel: ["tap to cancel", Type.STRING],
    labelTapToRetry: ["tap to retry", Type.STRING],
    labelTapToUndo: ["tap to undo", Type.STRING],
    labelButtonRemoveItem: ["Remove", Type.STRING],
    labelButtonAbortItemLoad: ["Abort", Type.STRING],
    labelButtonRetryItemLoad: ["Retry", Type.STRING],
    labelButtonAbortItemProcessing: ["Cancel", Type.STRING],
    labelButtonUndoItemProcessing: ["Undo", Type.STRING],
    labelButtonRetryItemProcessing: ["Retry", Type.STRING],
    labelButtonProcessItem: ["Upload", Type.STRING],
    // make sure width and height plus viewpox are even numbers so icons are nicely centered
    iconRemove: [
      '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M11.586 13l-2.293 2.293a1 1 0 0 0 1.414 1.414L13 14.414l2.293 2.293a1 1 0 0 0 1.414-1.414L14.414 13l2.293-2.293a1 1 0 0 0-1.414-1.414L13 11.586l-2.293-2.293a1 1 0 0 0-1.414 1.414L11.586 13z" fill="currentColor" fill-rule="nonzero"/></svg>',
      Type.STRING
    ],
    iconProcess: [
      '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M14 10.414v3.585a1 1 0 0 1-2 0v-3.585l-1.293 1.293a1 1 0 0 1-1.414-1.415l3-3a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1-1.414 1.415L14 10.414zM9 18a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2H9z" fill="currentColor" fill-rule="evenodd"/></svg>',
      Type.STRING
    ],
    iconRetry: [
      '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M10.81 9.185l-.038.02A4.997 4.997 0 0 0 8 13.683a5 5 0 0 0 5 5 5 5 0 0 0 5-5 1 1 0 0 1 2 0A7 7 0 1 1 9.722 7.496l-.842-.21a.999.999 0 1 1 .484-1.94l3.23.806c.535.133.86.675.73 1.21l-.804 3.233a.997.997 0 0 1-1.21.73.997.997 0 0 1-.73-1.21l.23-.928v-.002z" fill="currentColor" fill-rule="nonzero"/></svg>',
      Type.STRING
    ],
    iconUndo: [
      '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M9.185 10.81l.02-.038A4.997 4.997 0 0 1 13.683 8a5 5 0 0 1 5 5 5 5 0 0 1-5 5 1 1 0 0 0 0 2A7 7 0 1 0 7.496 9.722l-.21-.842a.999.999 0 1 0-1.94.484l.806 3.23c.133.535.675.86 1.21.73l3.233-.803a.997.997 0 0 0 .73-1.21.997.997 0 0 0-1.21-.73l-.928.23-.002-.001z" fill="currentColor" fill-rule="nonzero"/></svg>',
      Type.STRING
    ],
    iconDone: [
      '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M18.293 9.293a1 1 0 0 1 1.414 1.414l-7.002 7a1 1 0 0 1-1.414 0l-3.998-4a1 1 0 1 1 1.414-1.414L12 15.586l6.294-6.293z" fill="currentColor" fill-rule="nonzero"/></svg>',
      Type.STRING
    ],
    // event handlers
    oninit: [null, Type.FUNCTION],
    onwarning: [null, Type.FUNCTION],
    onerror: [null, Type.FUNCTION],
    onactivatefile: [null, Type.FUNCTION],
    oninitfile: [null, Type.FUNCTION],
    onaddfilestart: [null, Type.FUNCTION],
    onaddfileprogress: [null, Type.FUNCTION],
    onaddfile: [null, Type.FUNCTION],
    onprocessfilestart: [null, Type.FUNCTION],
    onprocessfileprogress: [null, Type.FUNCTION],
    onprocessfileabort: [null, Type.FUNCTION],
    onprocessfilerevert: [null, Type.FUNCTION],
    onprocessfile: [null, Type.FUNCTION],
    onprocessfiles: [null, Type.FUNCTION],
    onremovefile: [null, Type.FUNCTION],
    onpreparefile: [null, Type.FUNCTION],
    onupdatefiles: [null, Type.FUNCTION],
    onreorderfiles: [null, Type.FUNCTION],
    // hooks
    beforeDropFile: [null, Type.FUNCTION],
    beforeAddFile: [null, Type.FUNCTION],
    beforeRemoveFile: [null, Type.FUNCTION],
    beforePrepareFile: [null, Type.FUNCTION],
    // styles
    stylePanelLayout: [null, Type.STRING],
    // null 'integrated', 'compact', 'circle'
    stylePanelAspectRatio: [null, Type.STRING],
    // null or '3:2' or 1
    styleItemPanelAspectRatio: [null, Type.STRING],
    styleButtonRemoveItemPosition: ["left", Type.STRING],
    styleButtonProcessItemPosition: ["right", Type.STRING],
    styleLoadIndicatorPosition: ["right", Type.STRING],
    styleProgressIndicatorPosition: ["right", Type.STRING],
    styleButtonRemoveItemAlign: [false, Type.BOOLEAN],
    // custom initial files array
    files: [[], Type.ARRAY],
    // show support by displaying credits
    credits: [["https://pqina.nl/", "Powered by PQINA"], Type.ARRAY]
  };
  const getItemByQuery = (items, query) => {
    if (isEmpty(query)) {
      return items[0] || null;
    }
    if (isInt(query)) {
      return items[query] || null;
    }
    if (typeof query === "object") {
      query = query.id;
    }
    return items.find((item2) => item2.id === query) || null;
  };
  const getNumericAspectRatioFromString = (aspectRatio) => {
    if (isEmpty(aspectRatio)) {
      return aspectRatio;
    }
    if (/:/.test(aspectRatio)) {
      const parts = aspectRatio.split(":");
      return parts[1] / parts[0];
    }
    return parseFloat(aspectRatio);
  };
  const getActiveItems = (items) => items.filter((item2) => !item2.archived);
  const Status = {
    EMPTY: 0,
    IDLE: 1,
    // waiting
    ERROR: 2,
    // a file is in error state
    BUSY: 3,
    // busy processing or loading
    READY: 4
    // all files uploaded
  };
  let res = null;
  const canUpdateFileInput = () => {
    if (res === null) {
      try {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(new File(["hello world"], "This_Works.txt"));
        const el = document.createElement("input");
        el.setAttribute("type", "file");
        el.files = dataTransfer.files;
        res = el.files.length === 1;
      } catch (err) {
        res = false;
      }
    }
    return res;
  };
  const ITEM_ERROR = [
    ItemStatus.LOAD_ERROR,
    ItemStatus.PROCESSING_ERROR,
    ItemStatus.PROCESSING_REVERT_ERROR
  ];
  const ITEM_BUSY = [
    ItemStatus.LOADING,
    ItemStatus.PROCESSING,
    ItemStatus.PROCESSING_QUEUED,
    ItemStatus.INIT
  ];
  const ITEM_READY = [ItemStatus.PROCESSING_COMPLETE];
  const isItemInErrorState = (item2) => ITEM_ERROR.includes(item2.status);
  const isItemInBusyState = (item2) => ITEM_BUSY.includes(item2.status);
  const isItemInReadyState = (item2) => ITEM_READY.includes(item2.status);
  const isAsync = (state2) => isObject$1(state2.options.server) && (isObject$1(state2.options.server.process) || isFunction$2(state2.options.server.process));
  const queries = (state2) => ({
    GET_STATUS: () => {
      const items = getActiveItems(state2.items);
      const { EMPTY, ERROR, BUSY, IDLE, READY } = Status;
      if (items.length === 0) return EMPTY;
      if (items.some(isItemInErrorState)) return ERROR;
      if (items.some(isItemInBusyState)) return BUSY;
      if (items.some(isItemInReadyState)) return READY;
      return IDLE;
    },
    GET_ITEM: (query) => getItemByQuery(state2.items, query),
    GET_ACTIVE_ITEM: (query) => getItemByQuery(getActiveItems(state2.items), query),
    GET_ACTIVE_ITEMS: () => getActiveItems(state2.items),
    GET_ITEMS: () => state2.items,
    GET_ITEM_NAME: (query) => {
      const item2 = getItemByQuery(state2.items, query);
      return item2 ? item2.filename : null;
    },
    GET_ITEM_SIZE: (query) => {
      const item2 = getItemByQuery(state2.items, query);
      return item2 ? item2.fileSize : null;
    },
    GET_STYLES: () => Object.keys(state2.options).filter((key) => /^style/.test(key)).map((option2) => ({
      name: option2,
      value: state2.options[option2]
    })),
    GET_PANEL_ASPECT_RATIO: () => {
      const isShapeCircle = /circle/.test(state2.options.stylePanelLayout);
      const aspectRatio = isShapeCircle ? 1 : getNumericAspectRatioFromString(state2.options.stylePanelAspectRatio);
      return aspectRatio;
    },
    GET_ITEM_PANEL_ASPECT_RATIO: () => state2.options.styleItemPanelAspectRatio,
    GET_ITEMS_BY_STATUS: (status) => getActiveItems(state2.items).filter((item2) => item2.status === status),
    GET_TOTAL_ITEMS: () => getActiveItems(state2.items).length,
    SHOULD_UPDATE_FILE_INPUT: () => state2.options.storeAsFile && canUpdateFileInput() && !isAsync(state2),
    IS_ASYNC: () => isAsync(state2),
    GET_FILE_SIZE_LABELS: (query) => ({
      labelBytes: query("GET_LABEL_FILE_SIZE_BYTES") || void 0,
      labelKilobytes: query("GET_LABEL_FILE_SIZE_KILOBYTES") || void 0,
      labelMegabytes: query("GET_LABEL_FILE_SIZE_MEGABYTES") || void 0,
      labelGigabytes: query("GET_LABEL_FILE_SIZE_GIGABYTES") || void 0
    })
  });
  const hasRoomForItem = (state2) => {
    const count = getActiveItems(state2.items).length;
    if (!state2.options.allowMultiple) {
      return count === 0;
    }
    const maxFileCount = state2.options.maxFiles;
    if (maxFileCount === null) {
      return true;
    }
    if (count < maxFileCount) {
      return true;
    }
    return false;
  };
  const limit = (value, min2, max2) => Math.max(Math.min(max2, value), min2);
  const arrayInsert = (arr, index, item2) => arr.splice(index, 0, item2);
  const insertItem = (items, item2, index) => {
    if (isEmpty(item2)) {
      return null;
    }
    if (typeof index === "undefined") {
      items.push(item2);
      return item2;
    }
    index = limit(index, 0, items.length);
    arrayInsert(items, index, item2);
    return item2;
  };
  const isBase64DataURI = (str) => /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*)\s*$/i.test(
    str
  );
  const getFilenameFromURL = (url) => `${url}`.split("/").pop().split("?").shift();
  const getExtensionFromFilename = (name2) => name2.split(".").pop();
  const guesstimateExtension = (type2) => {
    if (typeof type2 !== "string") {
      return "";
    }
    const subtype = type2.split("/").pop();
    if (/svg/.test(subtype)) {
      return "svg";
    }
    if (/zip|compressed/.test(subtype)) {
      return "zip";
    }
    if (/plain/.test(subtype)) {
      return "txt";
    }
    if (/msword/.test(subtype)) {
      return "doc";
    }
    if (/[a-z]+/.test(subtype)) {
      if (subtype === "jpeg") {
        return "jpg";
      }
      return subtype;
    }
    return "";
  };
  const leftPad = (value, padding = "") => (padding + value).slice(-padding.length);
  const getDateString = (date = /* @__PURE__ */ new Date()) => `${date.getFullYear()}-${leftPad(date.getMonth() + 1, "00")}-${leftPad(
    date.getDate(),
    "00"
  )}_${leftPad(date.getHours(), "00")}-${leftPad(date.getMinutes(), "00")}-${leftPad(
    date.getSeconds(),
    "00"
  )}`;
  const getFileFromBlob = (blob2, filename, type2 = null, extension = null) => {
    const file2 = typeof type2 === "string" ? blob2.slice(0, blob2.size, type2) : blob2.slice(0, blob2.size, blob2.type);
    file2.lastModifiedDate = /* @__PURE__ */ new Date();
    if (blob2._relativePath) file2._relativePath = blob2._relativePath;
    if (!isString$1(filename)) {
      filename = getDateString();
    }
    if (filename && extension === null && getExtensionFromFilename(filename)) {
      file2.name = filename;
    } else {
      extension = extension || guesstimateExtension(file2.type);
      file2.name = filename + (extension ? "." + extension : "");
    }
    return file2;
  };
  const getBlobBuilder = () => {
    return window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
  };
  const createBlob = (arrayBuffer, mimeType) => {
    const BB = getBlobBuilder();
    if (BB) {
      const bb = new BB();
      bb.append(arrayBuffer);
      return bb.getBlob(mimeType);
    }
    return new Blob([arrayBuffer], {
      type: mimeType
    });
  };
  const getBlobFromByteStringWithMimeType = (byteString, mimeType) => {
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return createBlob(ab, mimeType);
  };
  const getMimeTypeFromBase64DataURI = (dataURI) => {
    return (/^data:(.+);/.exec(dataURI) || [])[1] || null;
  };
  const getBase64DataFromBase64DataURI = (dataURI) => {
    const data2 = dataURI.split(",")[1];
    return data2.replace(/\s/g, "");
  };
  const getByteStringFromBase64DataURI = (dataURI) => {
    return atob(getBase64DataFromBase64DataURI(dataURI));
  };
  const getBlobFromBase64DataURI = (dataURI) => {
    const mimeType = getMimeTypeFromBase64DataURI(dataURI);
    const byteString = getByteStringFromBase64DataURI(dataURI);
    return getBlobFromByteStringWithMimeType(byteString, mimeType);
  };
  const getFileFromBase64DataURI = (dataURI, filename, extension) => {
    return getFileFromBlob(getBlobFromBase64DataURI(dataURI), filename, null, extension);
  };
  const getFileNameFromHeader = (header) => {
    if (!/^content-disposition:/i.test(header)) return null;
    const matches = header.split(/filename=|filename\*=.+''/).splice(1).map((name2) => name2.trim().replace(/^["']|[;"']{0,2}$/g, "")).filter((name2) => name2.length);
    return matches.length ? decodeURI(matches[matches.length - 1]) : null;
  };
  const getFileSizeFromHeader = (header) => {
    if (/content-length:/i.test(header)) {
      const size = header.match(/[0-9]+/)[0];
      return size ? parseInt(size, 10) : null;
    }
    return null;
  };
  const getTranfserIdFromHeader = (header) => {
    if (/x-content-transfer-id:/i.test(header)) {
      const id = (header.split(":")[1] || "").trim();
      return id || null;
    }
    return null;
  };
  const getFileInfoFromHeaders = (headers) => {
    const info = {
      source: null,
      name: null,
      size: null
    };
    const rows = headers.split("\n");
    for (let header of rows) {
      const name2 = getFileNameFromHeader(header);
      if (name2) {
        info.name = name2;
        continue;
      }
      const size = getFileSizeFromHeader(header);
      if (size) {
        info.size = size;
        continue;
      }
      const source = getTranfserIdFromHeader(header);
      if (source) {
        info.source = source;
        continue;
      }
    }
    return info;
  };
  const createFileLoader = (fetchFn) => {
    const state2 = {
      source: null,
      complete: false,
      progress: 0,
      size: null,
      timestamp: null,
      duration: 0,
      request: null
    };
    const getProgress = () => state2.progress;
    const abort = () => {
      if (state2.request && state2.request.abort) {
        state2.request.abort();
      }
    };
    const load = () => {
      const source = state2.source;
      api2.fire("init", source);
      if (source instanceof File) {
        api2.fire("load", source);
      } else if (source instanceof Blob) {
        api2.fire("load", getFileFromBlob(source, source.name));
      } else if (isBase64DataURI(source)) {
        api2.fire("load", getFileFromBase64DataURI(source));
      } else {
        loadURL(source);
      }
    };
    const loadURL = (url) => {
      if (!fetchFn) {
        api2.fire("error", {
          type: "error",
          body: "Can't load URL",
          code: 400
        });
        return;
      }
      state2.timestamp = Date.now();
      state2.request = fetchFn(
        url,
        (response) => {
          state2.duration = Date.now() - state2.timestamp;
          state2.complete = true;
          if (response instanceof Blob) {
            response = getFileFromBlob(response, response.name || getFilenameFromURL(url));
          }
          api2.fire(
            "load",
            // if has received blob, we go with blob, if no response, we return null
            response instanceof Blob ? response : response ? response.body : null
          );
        },
        (error2) => {
          api2.fire(
            "error",
            typeof error2 === "string" ? {
              type: "error",
              code: 0,
              body: error2
            } : error2
          );
        },
        (computable, current, total) => {
          if (total) {
            state2.size = total;
          }
          state2.duration = Date.now() - state2.timestamp;
          if (!computable) {
            state2.progress = null;
            return;
          }
          state2.progress = current / total;
          api2.fire("progress", state2.progress);
        },
        () => {
          api2.fire("abort");
        },
        (response) => {
          const fileinfo = getFileInfoFromHeaders(
            typeof response === "string" ? response : response.headers
          );
          api2.fire("meta", {
            size: state2.size || fileinfo.size,
            filename: fileinfo.name,
            source: fileinfo.source
          });
        }
      );
    };
    const api2 = {
      ...on(),
      setSource: (source) => state2.source = source,
      getProgress,
      // file load progress
      abort,
      // abort file load
      load
      // start load
    };
    return api2;
  };
  const isGet = (method) => /GET|HEAD/.test(method);
  const sendRequest = (data2, url, options) => {
    const api2 = {
      onheaders: () => {
      },
      onprogress: () => {
      },
      onload: () => {
      },
      ontimeout: () => {
      },
      onerror: () => {
      },
      onabort: () => {
      },
      abort: () => {
        aborted = true;
        xhr.abort();
      }
    };
    let aborted = false;
    let headersReceived = false;
    options = {
      method: "POST",
      headers: {},
      withCredentials: false,
      ...options
    };
    url = encodeURI(url);
    if (isGet(options.method) && data2) {
      url = `${url}${encodeURIComponent(typeof data2 === "string" ? data2 : JSON.stringify(data2))}`;
    }
    const xhr = new XMLHttpRequest();
    const process2 = isGet(options.method) ? xhr : xhr.upload;
    process2.onprogress = (e) => {
      if (aborted) {
        return;
      }
      api2.onprogress(e.lengthComputable, e.loaded, e.total);
    };
    xhr.onreadystatechange = () => {
      if (xhr.readyState < 2) {
        return;
      }
      if (xhr.readyState === 4 && xhr.status === 0) {
        return;
      }
      if (headersReceived) {
        return;
      }
      headersReceived = true;
      api2.onheaders(xhr);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        api2.onload(xhr);
      } else {
        api2.onerror(xhr);
      }
    };
    xhr.onerror = () => api2.onerror(xhr);
    xhr.onabort = () => {
      aborted = true;
      api2.onabort();
    };
    xhr.ontimeout = () => api2.ontimeout(xhr);
    xhr.open(options.method, url, true);
    if (isInt(options.timeout)) {
      xhr.timeout = options.timeout;
    }
    Object.keys(options.headers).forEach((key) => {
      const value = unescape(encodeURIComponent(options.headers[key]));
      xhr.setRequestHeader(key, value);
    });
    if (options.responseType) {
      xhr.responseType = options.responseType;
    }
    if (options.withCredentials) {
      xhr.withCredentials = true;
    }
    xhr.send(data2);
    return api2;
  };
  const createResponse = (type2, code, body, headers) => ({
    type: type2,
    code,
    body,
    headers
  });
  const createTimeoutResponse = (cb) => (xhr) => {
    cb(createResponse("error", 0, "Timeout", xhr.getAllResponseHeaders()));
  };
  const hasQS = (str) => /\?/.test(str);
  const buildURL$1 = (...parts) => {
    let url = "";
    parts.forEach((part) => {
      url += hasQS(url) && hasQS(part) ? part.replace(/\?/, "&") : part;
    });
    return url;
  };
  const createFetchFunction = (apiUrl = "", action) => {
    if (typeof action === "function") {
      return action;
    }
    if (!action || !isString$1(action.url)) {
      return null;
    }
    const onload = action.onload || ((res2) => res2);
    const onerror = action.onerror || ((res2) => null);
    return (url, load, error2, progress, abort, headers) => {
      const request = sendRequest(url, buildURL$1(apiUrl, action.url), {
        ...action,
        responseType: "blob"
      });
      request.onload = (xhr) => {
        const headers2 = xhr.getAllResponseHeaders();
        const filename = getFileInfoFromHeaders(headers2).name || getFilenameFromURL(url);
        load(
          createResponse(
            "load",
            xhr.status,
            action.method === "HEAD" ? null : getFileFromBlob(onload(xhr.response), filename),
            headers2
          )
        );
      };
      request.onerror = (xhr) => {
        error2(
          createResponse(
            "error",
            xhr.status,
            onerror(xhr.response) || xhr.statusText,
            xhr.getAllResponseHeaders()
          )
        );
      };
      request.onheaders = (xhr) => {
        headers(createResponse("headers", xhr.status, null, xhr.getAllResponseHeaders()));
      };
      request.ontimeout = createTimeoutResponse(error2);
      request.onprogress = progress;
      request.onabort = abort;
      return request;
    };
  };
  const ChunkStatus = {
    QUEUED: 0,
    COMPLETE: 1,
    PROCESSING: 2,
    ERROR: 3,
    WAITING: 4
  };
  const processFileChunked = (apiUrl, action, name2, file2, metadata, load, error2, progress, abort, transfer, options) => {
    const chunks = [];
    const { chunkTransferId, chunkServer, chunkSize, chunkRetryDelays } = options;
    const state2 = {
      serverId: chunkTransferId,
      aborted: false
    };
    const ondata = action.ondata || ((fd) => fd);
    const onload = action.onload || ((xhr, method) => method === "HEAD" ? xhr.getResponseHeader("Upload-Offset") : xhr.response);
    const onerror = action.onerror || ((res2) => null);
    const requestTransferId = (cb) => {
      const formData = new FormData();
      if (isObject$1(metadata)) formData.append(name2, JSON.stringify(metadata));
      const headers = typeof action.headers === "function" ? action.headers(file2, metadata) : {
        ...action.headers,
        "Upload-Length": file2.size
      };
      const requestParams = {
        ...action,
        headers
      };
      const request = sendRequest(ondata(formData), buildURL$1(apiUrl, action.url), requestParams);
      request.onload = (xhr) => cb(onload(xhr, requestParams.method));
      request.onerror = (xhr) => error2(
        createResponse(
          "error",
          xhr.status,
          onerror(xhr.response) || xhr.statusText,
          xhr.getAllResponseHeaders()
        )
      );
      request.ontimeout = createTimeoutResponse(error2);
    };
    const requestTransferOffset = (cb) => {
      const requestUrl = buildURL$1(apiUrl, chunkServer.url, state2.serverId);
      const headers = typeof action.headers === "function" ? action.headers(state2.serverId) : {
        ...action.headers
      };
      const requestParams = {
        headers,
        method: "HEAD"
      };
      const request = sendRequest(null, requestUrl, requestParams);
      request.onload = (xhr) => cb(onload(xhr, requestParams.method));
      request.onerror = (xhr) => error2(
        createResponse(
          "error",
          xhr.status,
          onerror(xhr.response) || xhr.statusText,
          xhr.getAllResponseHeaders()
        )
      );
      request.ontimeout = createTimeoutResponse(error2);
    };
    const lastChunkIndex = Math.floor(file2.size / chunkSize);
    for (let i = 0; i <= lastChunkIndex; i++) {
      const offset = i * chunkSize;
      const data2 = file2.slice(offset, offset + chunkSize, "application/offset+octet-stream");
      chunks[i] = {
        index: i,
        size: data2.size,
        offset,
        data: data2,
        file: file2,
        progress: 0,
        retries: [...chunkRetryDelays],
        status: ChunkStatus.QUEUED,
        error: null,
        request: null,
        timeout: null
      };
    }
    const completeProcessingChunks = () => load(state2.serverId);
    const canProcessChunk = (chunk) => chunk.status === ChunkStatus.QUEUED || chunk.status === ChunkStatus.ERROR;
    const processChunk = (chunk) => {
      if (state2.aborted) return;
      chunk = chunk || chunks.find(canProcessChunk);
      if (!chunk) {
        if (chunks.every((chunk2) => chunk2.status === ChunkStatus.COMPLETE)) {
          completeProcessingChunks();
        }
        return;
      }
      chunk.status = ChunkStatus.PROCESSING;
      chunk.progress = null;
      const ondata2 = chunkServer.ondata || ((fd) => fd);
      const onerror2 = chunkServer.onerror || ((res2) => null);
      const onload2 = chunkServer.onload || (() => {
      });
      const requestUrl = buildURL$1(apiUrl, chunkServer.url, state2.serverId);
      const headers = typeof chunkServer.headers === "function" ? chunkServer.headers(chunk) : {
        ...chunkServer.headers,
        "Content-Type": "application/offset+octet-stream",
        "Upload-Offset": chunk.offset,
        "Upload-Length": file2.size,
        "Upload-Name": file2.name
      };
      const request = chunk.request = sendRequest(ondata2(chunk.data), requestUrl, {
        ...chunkServer,
        headers
      });
      request.onload = (xhr) => {
        onload2(xhr, chunk.index, chunks.length);
        chunk.status = ChunkStatus.COMPLETE;
        chunk.request = null;
        processChunks();
      };
      request.onprogress = (lengthComputable, loaded2, total) => {
        chunk.progress = lengthComputable ? loaded2 : null;
        updateTotalProgress();
      };
      request.onerror = (xhr) => {
        chunk.status = ChunkStatus.ERROR;
        chunk.request = null;
        chunk.error = onerror2(xhr.response) || xhr.statusText;
        if (!retryProcessChunk(chunk)) {
          error2(
            createResponse(
              "error",
              xhr.status,
              onerror2(xhr.response) || xhr.statusText,
              xhr.getAllResponseHeaders()
            )
          );
        }
      };
      request.ontimeout = (xhr) => {
        chunk.status = ChunkStatus.ERROR;
        chunk.request = null;
        if (!retryProcessChunk(chunk)) {
          createTimeoutResponse(error2)(xhr);
        }
      };
      request.onabort = () => {
        chunk.status = ChunkStatus.QUEUED;
        chunk.request = null;
        abort();
      };
    };
    const retryProcessChunk = (chunk) => {
      if (chunk.retries.length === 0) return false;
      chunk.status = ChunkStatus.WAITING;
      clearTimeout(chunk.timeout);
      chunk.timeout = setTimeout(() => {
        processChunk(chunk);
      }, chunk.retries.shift());
      return true;
    };
    const updateTotalProgress = () => {
      const totalBytesTransfered = chunks.reduce((p2, chunk) => {
        if (p2 === null || chunk.progress === null) return null;
        return p2 + chunk.progress;
      }, 0);
      if (totalBytesTransfered === null) return progress(false, 0, 0);
      const totalSize = chunks.reduce((total, chunk) => total + chunk.size, 0);
      progress(true, totalBytesTransfered, totalSize);
    };
    const processChunks = () => {
      const totalProcessing = chunks.filter((chunk) => chunk.status === ChunkStatus.PROCESSING).length;
      if (totalProcessing >= 1) return;
      processChunk();
    };
    const abortChunks = () => {
      chunks.forEach((chunk) => {
        clearTimeout(chunk.timeout);
        if (chunk.request) {
          chunk.request.abort();
        }
      });
    };
    if (!state2.serverId) {
      requestTransferId((serverId) => {
        if (state2.aborted) return;
        transfer(serverId);
        state2.serverId = serverId;
        processChunks();
      });
    } else {
      requestTransferOffset((offset) => {
        if (state2.aborted) return;
        chunks.filter((chunk) => chunk.offset < offset).forEach((chunk) => {
          chunk.status = ChunkStatus.COMPLETE;
          chunk.progress = chunk.size;
        });
        processChunks();
      });
    }
    return {
      abort: () => {
        state2.aborted = true;
        abortChunks();
      }
    };
  };
  const createFileProcessorFunction = (apiUrl, action, name2, options) => (file2, metadata, load, error2, progress, abort, transfer) => {
    if (!file2) return;
    const canChunkUpload = options.chunkUploads;
    const shouldChunkUpload = canChunkUpload && file2.size > options.chunkSize;
    const willChunkUpload = canChunkUpload && (shouldChunkUpload || options.chunkForce);
    if (file2 instanceof Blob && willChunkUpload)
      return processFileChunked(
        apiUrl,
        action,
        name2,
        file2,
        metadata,
        load,
        error2,
        progress,
        abort,
        transfer,
        options
      );
    const ondata = action.ondata || ((fd) => fd);
    const onload = action.onload || ((res2) => res2);
    const onerror = action.onerror || ((res2) => null);
    const headers = typeof action.headers === "function" ? action.headers(file2, metadata) || {} : {
      ...action.headers
    };
    const requestParams = {
      ...action,
      headers
    };
    var formData = new FormData();
    if (isObject$1(metadata)) {
      formData.append(name2, JSON.stringify(metadata));
    }
    (file2 instanceof Blob ? [{ name: null, file: file2 }] : file2).forEach((item2) => {
      formData.append(
        name2,
        item2.file,
        item2.name === null ? item2.file.name : `${item2.name}${item2.file.name}`
      );
    });
    const request = sendRequest(ondata(formData), buildURL$1(apiUrl, action.url), requestParams);
    request.onload = (xhr) => {
      load(createResponse("load", xhr.status, onload(xhr.response), xhr.getAllResponseHeaders()));
    };
    request.onerror = (xhr) => {
      error2(
        createResponse(
          "error",
          xhr.status,
          onerror(xhr.response) || xhr.statusText,
          xhr.getAllResponseHeaders()
        )
      );
    };
    request.ontimeout = createTimeoutResponse(error2);
    request.onprogress = progress;
    request.onabort = abort;
    return request;
  };
  const createProcessorFunction = (apiUrl = "", action, name2, options) => {
    if (typeof action === "function") return (...params) => action(name2, ...params, options);
    if (!action || !isString$1(action.url)) return null;
    return createFileProcessorFunction(apiUrl, action, name2, options);
  };
  const createRevertFunction = (apiUrl = "", action) => {
    if (typeof action === "function") {
      return action;
    }
    if (!action || !isString$1(action.url)) {
      return (uniqueFileId, load) => load();
    }
    const onload = action.onload || ((res2) => res2);
    const onerror = action.onerror || ((res2) => null);
    return (uniqueFileId, load, error2) => {
      const request = sendRequest(
        uniqueFileId,
        apiUrl + action.url,
        action
        // contains method, headers and withCredentials properties
      );
      request.onload = (xhr) => {
        load(
          createResponse(
            "load",
            xhr.status,
            onload(xhr.response),
            xhr.getAllResponseHeaders()
          )
        );
      };
      request.onerror = (xhr) => {
        error2(
          createResponse(
            "error",
            xhr.status,
            onerror(xhr.response) || xhr.statusText,
            xhr.getAllResponseHeaders()
          )
        );
      };
      request.ontimeout = createTimeoutResponse(error2);
      return request;
    };
  };
  const getRandomNumber = (min2 = 0, max2 = 1) => min2 + Math.random() * (max2 - min2);
  const createPerceivedPerformanceUpdater = (cb, duration = 1e3, offset = 0, tickMin = 25, tickMax = 250) => {
    let timeout = null;
    const start = Date.now();
    const tick = () => {
      let runtime = Date.now() - start;
      let delay = getRandomNumber(tickMin, tickMax);
      if (runtime + delay > duration) {
        delay = runtime + delay - duration;
      }
      let progress = runtime / duration;
      if (progress >= 1 || document.hidden) {
        cb(1);
        return;
      }
      cb(progress);
      timeout = setTimeout(tick, delay);
    };
    if (duration > 0) tick();
    return {
      clear: () => {
        clearTimeout(timeout);
      }
    };
  };
  const createFileProcessor = (processFn, options) => {
    const state2 = {
      complete: false,
      perceivedProgress: 0,
      perceivedPerformanceUpdater: null,
      progress: null,
      timestamp: null,
      perceivedDuration: 0,
      duration: 0,
      request: null,
      response: null
    };
    const { allowMinimumUploadDuration } = options;
    const process2 = (file2, metadata) => {
      const progressFn = () => {
        if (state2.duration === 0 || state2.progress === null) return;
        api2.fire("progress", api2.getProgress());
      };
      const completeFn = () => {
        state2.complete = true;
        api2.fire("load-perceived", state2.response.body);
      };
      api2.fire("start");
      state2.timestamp = Date.now();
      state2.perceivedPerformanceUpdater = createPerceivedPerformanceUpdater(
        (progress) => {
          state2.perceivedProgress = progress;
          state2.perceivedDuration = Date.now() - state2.timestamp;
          progressFn();
          if (state2.response && state2.perceivedProgress === 1 && !state2.complete) {
            completeFn();
          }
        },
        // random delay as in a list of files you start noticing
        // files uploading at the exact same speed
        allowMinimumUploadDuration ? getRandomNumber(750, 1500) : 0
      );
      state2.request = processFn(
        // the file to process
        file2,
        // the metadata to send along
        metadata,
        // callbacks (load, error, progress, abort, transfer)
        // load expects the body to be a server id if
        // you want to make use of revert
        (response) => {
          state2.response = isObject$1(response) ? response : {
            type: "load",
            code: 200,
            body: `${response}`,
            headers: {}
          };
          state2.duration = Date.now() - state2.timestamp;
          state2.progress = 1;
          api2.fire("load", state2.response.body);
          if (!allowMinimumUploadDuration || allowMinimumUploadDuration && state2.perceivedProgress === 1) {
            completeFn();
          }
        },
        // error is expected to be an object with type, code, body
        (error2) => {
          state2.perceivedPerformanceUpdater.clear();
          api2.fire(
            "error",
            isObject$1(error2) ? error2 : {
              type: "error",
              code: 0,
              body: `${error2}`
            }
          );
        },
        // actual processing progress
        (computable, current, total) => {
          state2.duration = Date.now() - state2.timestamp;
          state2.progress = computable ? current / total : null;
          progressFn();
        },
        // abort does not expect a value
        () => {
          state2.perceivedPerformanceUpdater.clear();
          api2.fire("abort", state2.response ? state2.response.body : null);
        },
        // register the id for this transfer
        (transferId) => {
          api2.fire("transfer", transferId);
        }
      );
    };
    const abort = () => {
      if (!state2.request) return;
      state2.perceivedPerformanceUpdater.clear();
      if (state2.request.abort) state2.request.abort();
      state2.complete = true;
    };
    const reset = () => {
      abort();
      state2.complete = false;
      state2.perceivedProgress = 0;
      state2.progress = 0;
      state2.timestamp = null;
      state2.perceivedDuration = 0;
      state2.duration = 0;
      state2.request = null;
      state2.response = null;
    };
    const getProgress = allowMinimumUploadDuration ? () => state2.progress ? Math.min(state2.progress, state2.perceivedProgress) : null : () => state2.progress || null;
    const getDuration = allowMinimumUploadDuration ? () => Math.min(state2.duration, state2.perceivedDuration) : () => state2.duration;
    const api2 = {
      ...on(),
      process: process2,
      // start processing file
      abort,
      // abort active process request
      getProgress,
      getDuration,
      reset
    };
    return api2;
  };
  const getFilenameWithoutExtension = (name2) => name2.substring(0, name2.lastIndexOf(".")) || name2;
  const createFileStub = (source) => {
    let data2 = [source.name, source.size, source.type];
    if (source instanceof Blob || isBase64DataURI(source)) {
      data2[0] = source.name || getDateString();
    } else if (isBase64DataURI(source)) {
      data2[1] = source.length;
      data2[2] = getMimeTypeFromBase64DataURI(source);
    } else if (isString$1(source)) {
      data2[0] = getFilenameFromURL(source);
      data2[1] = 0;
      data2[2] = "application/octet-stream";
    }
    return {
      name: data2[0],
      size: data2[1],
      type: data2[2]
    };
  };
  const isFile$1 = (value) => !!(value instanceof File || value instanceof Blob && value.name);
  const deepCloneObject = (src) => {
    if (!isObject$1(src)) return src;
    const target = isArray$1(src) ? [] : {};
    for (const key in src) {
      if (!src.hasOwnProperty(key)) continue;
      const v = src[key];
      target[key] = v && isObject$1(v) ? deepCloneObject(v) : v;
    }
    return target;
  };
  const createItem = (origin2 = null, serverFileReference = null, file2 = null) => {
    const id = getUniqueId();
    const state2 = {
      // is archived
      archived: false,
      // if is frozen, no longer fires events
      frozen: false,
      // removed from view
      released: false,
      // original source
      source: null,
      // file model reference
      file: file2,
      // id of file on server
      serverFileReference,
      // id of file transfer on server
      transferId: null,
      // is aborted
      processingAborted: false,
      // current item status
      status: serverFileReference ? ItemStatus.PROCESSING_COMPLETE : ItemStatus.INIT,
      // active processes
      activeLoader: null,
      activeProcessor: null
    };
    let abortProcessingRequestComplete = null;
    const metadata = {};
    const setStatus = (status) => state2.status = status;
    const fire = (event, ...params) => {
      if (state2.released || state2.frozen) return;
      api2.fire(event, ...params);
    };
    const getFileExtension = () => getExtensionFromFilename(state2.file.name);
    const getFileType = () => state2.file.type;
    const getFileSize = () => state2.file.size;
    const getFile = () => state2.file;
    const load = (source, loader, onload) => {
      state2.source = source;
      api2.fireSync("init");
      if (state2.file) {
        api2.fireSync("load-skip");
        return;
      }
      state2.file = createFileStub(source);
      loader.on("init", () => {
        fire("load-init");
      });
      loader.on("meta", (meta) => {
        state2.file.size = meta.size;
        state2.file.filename = meta.filename;
        if (meta.source) {
          origin2 = FileOrigin.LIMBO;
          state2.serverFileReference = meta.source;
          state2.status = ItemStatus.PROCESSING_COMPLETE;
        }
        fire("load-meta");
      });
      loader.on("progress", (progress) => {
        setStatus(ItemStatus.LOADING);
        fire("load-progress", progress);
      });
      loader.on("error", (error2) => {
        setStatus(ItemStatus.LOAD_ERROR);
        fire("load-request-error", error2);
      });
      loader.on("abort", () => {
        setStatus(ItemStatus.INIT);
        fire("load-abort");
      });
      loader.on("load", (file3) => {
        state2.activeLoader = null;
        const success = (result) => {
          state2.file = isFile$1(result) ? result : state2.file;
          if (origin2 === FileOrigin.LIMBO && state2.serverFileReference) {
            setStatus(ItemStatus.PROCESSING_COMPLETE);
          } else {
            setStatus(ItemStatus.IDLE);
          }
          fire("load");
        };
        const error2 = (result) => {
          state2.file = file3;
          fire("load-meta");
          setStatus(ItemStatus.LOAD_ERROR);
          fire("load-file-error", result);
        };
        if (state2.serverFileReference) {
          success(file3);
          return;
        }
        onload(file3, success, error2);
      });
      loader.setSource(source);
      state2.activeLoader = loader;
      loader.load();
    };
    const retryLoad = () => {
      if (!state2.activeLoader) {
        return;
      }
      state2.activeLoader.load();
    };
    const abortLoad = () => {
      if (state2.activeLoader) {
        state2.activeLoader.abort();
        return;
      }
      setStatus(ItemStatus.INIT);
      fire("load-abort");
    };
    const process2 = (processor, onprocess) => {
      if (state2.processingAborted) {
        state2.processingAborted = false;
        return;
      }
      setStatus(ItemStatus.PROCESSING);
      abortProcessingRequestComplete = null;
      if (!(state2.file instanceof Blob)) {
        api2.on("load", () => {
          process2(processor, onprocess);
        });
        return;
      }
      processor.on("load", (serverFileReference2) => {
        state2.transferId = null;
        state2.serverFileReference = serverFileReference2;
      });
      processor.on("transfer", (transferId) => {
        state2.transferId = transferId;
      });
      processor.on("load-perceived", (serverFileReference2) => {
        state2.activeProcessor = null;
        state2.transferId = null;
        state2.serverFileReference = serverFileReference2;
        setStatus(ItemStatus.PROCESSING_COMPLETE);
        fire("process-complete", serverFileReference2);
      });
      processor.on("start", () => {
        fire("process-start");
      });
      processor.on("error", (error3) => {
        state2.activeProcessor = null;
        setStatus(ItemStatus.PROCESSING_ERROR);
        fire("process-error", error3);
      });
      processor.on("abort", (serverFileReference2) => {
        state2.activeProcessor = null;
        state2.serverFileReference = serverFileReference2;
        setStatus(ItemStatus.IDLE);
        fire("process-abort");
        if (abortProcessingRequestComplete) {
          abortProcessingRequestComplete();
        }
      });
      processor.on("progress", (progress) => {
        fire("process-progress", progress);
      });
      const success = (file3) => {
        if (state2.archived) return;
        processor.process(file3, { ...metadata });
      };
      const error2 = console.error;
      onprocess(state2.file, success, error2);
      state2.activeProcessor = processor;
    };
    const requestProcessing = () => {
      state2.processingAborted = false;
      setStatus(ItemStatus.PROCESSING_QUEUED);
    };
    const abortProcessing = () => new Promise((resolve2) => {
      if (!state2.activeProcessor) {
        state2.processingAborted = true;
        setStatus(ItemStatus.IDLE);
        fire("process-abort");
        resolve2();
        return;
      }
      abortProcessingRequestComplete = () => {
        resolve2();
      };
      state2.activeProcessor.abort();
    });
    const revert = (revertFileUpload, forceRevert) => new Promise((resolve2, reject) => {
      const serverTransferId = state2.serverFileReference !== null ? state2.serverFileReference : state2.transferId;
      if (serverTransferId === null) {
        resolve2();
        return;
      }
      revertFileUpload(
        serverTransferId,
        () => {
          state2.serverFileReference = null;
          state2.transferId = null;
          resolve2();
        },
        (error2) => {
          if (!forceRevert) {
            resolve2();
            return;
          }
          setStatus(ItemStatus.PROCESSING_REVERT_ERROR);
          fire("process-revert-error");
          reject(error2);
        }
      );
      setStatus(ItemStatus.IDLE);
      fire("process-revert");
    });
    const setMetadata = (key, value, silent) => {
      const keys = key.split(".");
      const root2 = keys[0];
      const last = keys.pop();
      let data2 = metadata;
      keys.forEach((key2) => data2 = data2[key2]);
      if (JSON.stringify(data2[last]) === JSON.stringify(value)) return;
      data2[last] = value;
      fire("metadata-update", {
        key: root2,
        value: metadata[root2],
        silent
      });
    };
    const getMetadata = (key) => deepCloneObject(key ? metadata[key] : metadata);
    const api2 = {
      id: { get: () => id },
      origin: { get: () => origin2, set: (value) => origin2 = value },
      serverId: { get: () => state2.serverFileReference },
      transferId: { get: () => state2.transferId },
      status: { get: () => state2.status },
      filename: { get: () => state2.file.name },
      filenameWithoutExtension: { get: () => getFilenameWithoutExtension(state2.file.name) },
      fileExtension: { get: getFileExtension },
      fileType: { get: getFileType },
      fileSize: { get: getFileSize },
      file: { get: getFile },
      relativePath: { get: () => state2.file._relativePath },
      source: { get: () => state2.source },
      getMetadata,
      setMetadata: (key, value, silent) => {
        if (isObject$1(key)) {
          const data2 = key;
          Object.keys(data2).forEach((key2) => {
            setMetadata(key2, data2[key2], value);
          });
          return key;
        }
        setMetadata(key, value, silent);
        return value;
      },
      extend: (name2, handler) => itemAPI[name2] = handler,
      abortLoad,
      retryLoad,
      requestProcessing,
      abortProcessing,
      load,
      process: process2,
      revert,
      ...on(),
      freeze: () => state2.frozen = true,
      release: () => state2.released = true,
      released: { get: () => state2.released },
      archive: () => state2.archived = true,
      archived: { get: () => state2.archived },
      // replace source and file object
      setFile: (file3) => state2.file = file3
    };
    const itemAPI = createObject(api2);
    return itemAPI;
  };
  const getItemIndexByQuery = (items, query) => {
    if (isEmpty(query)) {
      return 0;
    }
    if (!isString$1(query)) {
      return -1;
    }
    return items.findIndex((item2) => item2.id === query);
  };
  const getItemById = (items, itemId) => {
    const index = getItemIndexByQuery(items, itemId);
    if (index < 0) {
      return;
    }
    return items[index] || null;
  };
  const fetchBlob = (url, load, error2, progress, abort, headers) => {
    const request = sendRequest(null, url, {
      method: "GET",
      responseType: "blob"
    });
    request.onload = (xhr) => {
      const headers2 = xhr.getAllResponseHeaders();
      const filename = getFileInfoFromHeaders(headers2).name || getFilenameFromURL(url);
      load(createResponse("load", xhr.status, getFileFromBlob(xhr.response, filename), headers2));
    };
    request.onerror = (xhr) => {
      error2(createResponse("error", xhr.status, xhr.statusText, xhr.getAllResponseHeaders()));
    };
    request.onheaders = (xhr) => {
      headers(createResponse("headers", xhr.status, null, xhr.getAllResponseHeaders()));
    };
    request.ontimeout = createTimeoutResponse(error2);
    request.onprogress = progress;
    request.onabort = abort;
    return request;
  };
  const getDomainFromURL = (url) => {
    if (url.indexOf("//") === 0) {
      url = location.protocol + url;
    }
    return url.toLowerCase().replace("blob:", "").replace(/([a-z])?:\/\//, "$1").split("/")[0];
  };
  const isExternalURL = (url) => (url.indexOf(":") > -1 || url.indexOf("//") > -1) && getDomainFromURL(location.href) !== getDomainFromURL(url);
  const dynamicLabel = (label) => (...params) => isFunction$2(label) ? label(...params) : label;
  const isMockItem = (item2) => !isFile$1(item2.file);
  const listUpdated = (dispatch, state2) => {
    clearTimeout(state2.listUpdateTimeout);
    state2.listUpdateTimeout = setTimeout(() => {
      dispatch("DID_UPDATE_ITEMS", { items: getActiveItems(state2.items) });
    }, 0);
  };
  const optionalPromise = (fn2, ...params) => new Promise((resolve2) => {
    if (!fn2) {
      return resolve2(true);
    }
    const result = fn2(...params);
    if (result == null) {
      return resolve2(true);
    }
    if (typeof result === "boolean") {
      return resolve2(result);
    }
    if (typeof result.then === "function") {
      result.then(resolve2);
    }
  });
  const sortItems = (state2, compare) => {
    state2.items.sort((a, b) => compare(createItemAPI(a), createItemAPI(b)));
  };
  const getItemByQueryFromState = (state2, itemHandler) => ({
    query,
    success = () => {
    },
    failure = () => {
    },
    ...options
  } = {}) => {
    const item2 = getItemByQuery(state2.items, query);
    if (!item2) {
      failure({
        error: createResponse("error", 0, "Item not found"),
        file: null
      });
      return;
    }
    itemHandler(item2, success, failure, options || {});
  };
  const actions = (dispatch, query, state2) => ({
    /**
     * Aborts all ongoing processes
     */
    ABORT_ALL: () => {
      getActiveItems(state2.items).forEach((item2) => {
        item2.freeze();
        item2.abortLoad();
        item2.abortProcessing();
      });
    },
    /**
     * Sets initial files
     */
    DID_SET_FILES: ({ value = [] }) => {
      const files = value.map((file2) => ({
        source: file2.source ? file2.source : file2,
        options: file2.options
      }));
      let activeItems = getActiveItems(state2.items);
      activeItems.forEach((item2) => {
        if (!files.find((file2) => file2.source === item2.source || file2.source === item2.file)) {
          dispatch("REMOVE_ITEM", { query: item2, remove: false });
        }
      });
      activeItems = getActiveItems(state2.items);
      files.forEach((file2, index) => {
        if (activeItems.find((item2) => item2.source === file2.source || item2.file === file2.source))
          return;
        dispatch("ADD_ITEM", {
          ...file2,
          interactionMethod: InteractionMethod.NONE,
          index
        });
      });
    },
    DID_UPDATE_ITEM_METADATA: ({ id, action, change }) => {
      if (change.silent) return;
      clearTimeout(state2.itemUpdateTimeout);
      state2.itemUpdateTimeout = setTimeout(() => {
        const item2 = getItemById(state2.items, id);
        if (!query("IS_ASYNC")) {
          applyFilterChain("SHOULD_PREPARE_OUTPUT", false, {
            item: item2,
            query,
            action,
            change
          }).then((shouldPrepareOutput) => {
            const beforePrepareFile = query("GET_BEFORE_PREPARE_FILE");
            if (beforePrepareFile)
              shouldPrepareOutput = beforePrepareFile(item2, shouldPrepareOutput);
            if (!shouldPrepareOutput) return;
            dispatch(
              "REQUEST_PREPARE_OUTPUT",
              {
                query: id,
                item: item2,
                success: (file2) => {
                  dispatch("DID_PREPARE_OUTPUT", { id, file: file2 });
                }
              },
              true
            );
          });
          return;
        }
        if (item2.origin === FileOrigin.LOCAL) {
          dispatch("DID_LOAD_ITEM", {
            id: item2.id,
            error: null,
            serverFileReference: item2.source
          });
        }
        const upload = () => {
          setTimeout(() => {
            dispatch("REQUEST_ITEM_PROCESSING", { query: id });
          }, 32);
        };
        const revert = (doUpload) => {
          item2.revert(
            createRevertFunction(state2.options.server.url, state2.options.server.revert),
            query("GET_FORCE_REVERT")
          ).then(doUpload ? upload : () => {
          }).catch(() => {
          });
        };
        const abort = (doUpload) => {
          item2.abortProcessing().then(doUpload ? upload : () => {
          });
        };
        if (item2.status === ItemStatus.PROCESSING_COMPLETE) {
          return revert(state2.options.instantUpload);
        }
        if (item2.status === ItemStatus.PROCESSING) {
          return abort(state2.options.instantUpload);
        }
        if (state2.options.instantUpload) {
          upload();
        }
      }, 0);
    },
    MOVE_ITEM: ({ query: query2, index }) => {
      const item2 = getItemByQuery(state2.items, query2);
      if (!item2) return;
      const currentIndex = state2.items.indexOf(item2);
      index = limit(index, 0, state2.items.length - 1);
      if (currentIndex === index) return;
      state2.items.splice(index, 0, state2.items.splice(currentIndex, 1)[0]);
    },
    SORT: ({ compare }) => {
      sortItems(state2, compare);
      dispatch("DID_SORT_ITEMS", {
        items: query("GET_ACTIVE_ITEMS")
      });
    },
    ADD_ITEMS: ({ items, index, interactionMethod, success = () => {
    }, failure = () => {
    } }) => {
      let currentIndex = index;
      if (index === -1 || typeof index === "undefined") {
        const insertLocation = query("GET_ITEM_INSERT_LOCATION");
        const totalItems = query("GET_TOTAL_ITEMS");
        currentIndex = insertLocation === "before" ? 0 : totalItems;
      }
      const ignoredFiles = query("GET_IGNORED_FILES");
      const isValidFile = (source) => isFile$1(source) ? !ignoredFiles.includes(source.name.toLowerCase()) : !isEmpty(source);
      const validItems = items.filter(isValidFile);
      const promises = validItems.map(
        (source) => new Promise((resolve2, reject) => {
          dispatch("ADD_ITEM", {
            interactionMethod,
            source: source.source || source,
            success: resolve2,
            failure: reject,
            index: currentIndex++,
            options: source.options || {}
          });
        })
      );
      Promise.all(promises).then(success).catch(failure);
    },
    /**
     * @param source
     * @param index
     * @param interactionMethod
     */
    ADD_ITEM: ({
      source,
      index = -1,
      interactionMethod,
      success = () => {
      },
      failure = () => {
      },
      options = {}
    }) => {
      if (isEmpty(source)) {
        failure({
          error: createResponse("error", 0, "No source"),
          file: null
        });
        return;
      }
      if (isFile$1(source) && state2.options.ignoredFiles.includes(source.name.toLowerCase())) {
        return;
      }
      if (!hasRoomForItem(state2)) {
        if (state2.options.allowMultiple || !state2.options.allowMultiple && !state2.options.allowReplace) {
          const error2 = createResponse("warning", 0, "Max files");
          dispatch("DID_THROW_MAX_FILES", {
            source,
            error: error2
          });
          failure({ error: error2, file: null });
          return;
        }
        const item3 = getActiveItems(state2.items)[0];
        if (item3.status === ItemStatus.PROCESSING_COMPLETE || item3.status === ItemStatus.PROCESSING_REVERT_ERROR) {
          const forceRevert = query("GET_FORCE_REVERT");
          item3.revert(
            createRevertFunction(state2.options.server.url, state2.options.server.revert),
            forceRevert
          ).then(() => {
            if (!forceRevert) return;
            dispatch("ADD_ITEM", {
              source,
              index,
              interactionMethod,
              success,
              failure,
              options
            });
          }).catch(() => {
          });
          if (forceRevert) return;
        }
        dispatch("REMOVE_ITEM", { query: item3.id });
      }
      const origin2 = options.type === "local" ? FileOrigin.LOCAL : options.type === "limbo" ? FileOrigin.LIMBO : FileOrigin.INPUT;
      const item2 = createItem(
        // where did this file come from
        origin2,
        // an input file never has a server file reference
        origin2 === FileOrigin.INPUT ? null : source,
        // file mock data, if defined
        options.file
      );
      Object.keys(options.metadata || {}).forEach((key) => {
        item2.setMetadata(key, options.metadata[key]);
      });
      applyFilters("DID_CREATE_ITEM", item2, { query, dispatch });
      const itemInsertLocation = query("GET_ITEM_INSERT_LOCATION");
      if (!state2.options.itemInsertLocationFreedom) {
        index = itemInsertLocation === "before" ? -1 : state2.items.length;
      }
      insertItem(state2.items, item2, index);
      if (isFunction$2(itemInsertLocation) && source) {
        sortItems(state2, itemInsertLocation);
      }
      const id = item2.id;
      item2.on("init", () => {
        dispatch("DID_INIT_ITEM", { id });
      });
      item2.on("load-init", () => {
        dispatch("DID_START_ITEM_LOAD", { id });
      });
      item2.on("load-meta", () => {
        dispatch("DID_UPDATE_ITEM_META", { id });
      });
      item2.on("load-progress", (progress) => {
        dispatch("DID_UPDATE_ITEM_LOAD_PROGRESS", { id, progress });
      });
      item2.on("load-request-error", (error2) => {
        const mainStatus = dynamicLabel(state2.options.labelFileLoadError)(error2);
        if (error2.code >= 400 && error2.code < 500) {
          dispatch("DID_THROW_ITEM_INVALID", {
            id,
            error: error2,
            status: {
              main: mainStatus,
              sub: `${error2.code} (${error2.body})`
            }
          });
          failure({ error: error2, file: createItemAPI(item2) });
          return;
        }
        dispatch("DID_THROW_ITEM_LOAD_ERROR", {
          id,
          error: error2,
          status: {
            main: mainStatus,
            sub: state2.options.labelTapToRetry
          }
        });
      });
      item2.on("load-file-error", (error2) => {
        dispatch("DID_THROW_ITEM_INVALID", {
          id,
          error: error2.status,
          status: error2.status
        });
        failure({ error: error2.status, file: createItemAPI(item2) });
      });
      item2.on("load-abort", () => {
        dispatch("REMOVE_ITEM", { query: id });
      });
      item2.on("load-skip", () => {
        item2.on("metadata-update", (change) => {
          if (!isFile$1(item2.file)) return;
          dispatch("DID_UPDATE_ITEM_METADATA", { id, change });
        });
        dispatch("COMPLETE_LOAD_ITEM", {
          query: id,
          item: item2,
          data: {
            source,
            success
          }
        });
      });
      item2.on("load", () => {
        const handleAdd = (shouldAdd) => {
          if (!shouldAdd) {
            dispatch("REMOVE_ITEM", {
              query: id
            });
            return;
          }
          item2.on("metadata-update", (change) => {
            dispatch("DID_UPDATE_ITEM_METADATA", { id, change });
          });
          applyFilterChain("SHOULD_PREPARE_OUTPUT", false, { item: item2, query }).then(
            (shouldPrepareOutput) => {
              const beforePrepareFile = query("GET_BEFORE_PREPARE_FILE");
              if (beforePrepareFile)
                shouldPrepareOutput = beforePrepareFile(item2, shouldPrepareOutput);
              const loadComplete = () => {
                dispatch("COMPLETE_LOAD_ITEM", {
                  query: id,
                  item: item2,
                  data: {
                    source,
                    success
                  }
                });
                listUpdated(dispatch, state2);
              };
              if (shouldPrepareOutput) {
                dispatch(
                  "REQUEST_PREPARE_OUTPUT",
                  {
                    query: id,
                    item: item2,
                    success: (file2) => {
                      dispatch("DID_PREPARE_OUTPUT", { id, file: file2 });
                      loadComplete();
                    }
                  },
                  true
                );
                return;
              }
              loadComplete();
            }
          );
        };
        applyFilterChain("DID_LOAD_ITEM", item2, { query, dispatch }).then(() => {
          optionalPromise(query("GET_BEFORE_ADD_FILE"), createItemAPI(item2)).then(
            handleAdd
          );
        }).catch((e) => {
          if (!e || !e.error || !e.status) return handleAdd(false);
          dispatch("DID_THROW_ITEM_INVALID", {
            id,
            error: e.error,
            status: e.status
          });
        });
      });
      item2.on("process-start", () => {
        dispatch("DID_START_ITEM_PROCESSING", { id });
      });
      item2.on("process-progress", (progress) => {
        dispatch("DID_UPDATE_ITEM_PROCESS_PROGRESS", { id, progress });
      });
      item2.on("process-error", (error2) => {
        dispatch("DID_THROW_ITEM_PROCESSING_ERROR", {
          id,
          error: error2,
          status: {
            main: dynamicLabel(state2.options.labelFileProcessingError)(error2),
            sub: state2.options.labelTapToRetry
          }
        });
      });
      item2.on("process-revert-error", (error2) => {
        dispatch("DID_THROW_ITEM_PROCESSING_REVERT_ERROR", {
          id,
          error: error2,
          status: {
            main: dynamicLabel(state2.options.labelFileProcessingRevertError)(error2),
            sub: state2.options.labelTapToRetry
          }
        });
      });
      item2.on("process-complete", (serverFileReference) => {
        dispatch("DID_COMPLETE_ITEM_PROCESSING", {
          id,
          error: null,
          serverFileReference
        });
        dispatch("DID_DEFINE_VALUE", { id, value: serverFileReference });
      });
      item2.on("process-abort", () => {
        dispatch("DID_ABORT_ITEM_PROCESSING", { id });
      });
      item2.on("process-revert", () => {
        dispatch("DID_REVERT_ITEM_PROCESSING", { id });
        dispatch("DID_DEFINE_VALUE", { id, value: null });
      });
      dispatch("DID_ADD_ITEM", { id, index, interactionMethod });
      listUpdated(dispatch, state2);
      const { url, load, restore, fetch: fetch2 } = state2.options.server || {};
      item2.load(
        source,
        // this creates a function that loads the file based on the type of file (string, base64, blob, file) and location of file (local, remote, limbo)
        createFileLoader(
          origin2 === FileOrigin.INPUT ? (
            // input, if is remote, see if should use custom fetch, else use default fetchBlob
            isString$1(source) && isExternalURL(source) ? fetch2 ? createFetchFunction(url, fetch2) : fetchBlob : fetchBlob
          ) : (
            // limbo or local
            origin2 === FileOrigin.LIMBO ? createFetchFunction(url, restore) : createFetchFunction(url, load)
          )
          // local
        ),
        // called when the file is loaded so it can be piped through the filters
        (file2, success2, error2) => {
          applyFilterChain("LOAD_FILE", file2, { query }).then(success2).catch(error2);
        }
      );
    },
    REQUEST_PREPARE_OUTPUT: ({ item: item2, success, failure = () => {
    } }) => {
      const err = {
        error: createResponse("error", 0, "Item not found"),
        file: null
      };
      if (item2.archived) return failure(err);
      applyFilterChain("PREPARE_OUTPUT", item2.file, { query, item: item2 }).then((result) => {
        applyFilterChain("COMPLETE_PREPARE_OUTPUT", result, { query, item: item2 }).then((result2) => {
          if (item2.archived) return failure(err);
          success(result2);
        });
      });
    },
    COMPLETE_LOAD_ITEM: ({ item: item2, data: data2 }) => {
      const { success, source } = data2;
      const itemInsertLocation = query("GET_ITEM_INSERT_LOCATION");
      if (isFunction$2(itemInsertLocation) && source) {
        sortItems(state2, itemInsertLocation);
      }
      dispatch("DID_LOAD_ITEM", {
        id: item2.id,
        error: null,
        serverFileReference: item2.origin === FileOrigin.INPUT ? null : source
      });
      success(createItemAPI(item2));
      if (item2.origin === FileOrigin.LOCAL) {
        dispatch("DID_LOAD_LOCAL_ITEM", { id: item2.id });
        return;
      }
      if (item2.origin === FileOrigin.LIMBO) {
        dispatch("DID_COMPLETE_ITEM_PROCESSING", {
          id: item2.id,
          error: null,
          serverFileReference: source
        });
        dispatch("DID_DEFINE_VALUE", {
          id: item2.id,
          value: item2.serverId || source
        });
        return;
      }
      if (query("IS_ASYNC") && state2.options.instantUpload) {
        dispatch("REQUEST_ITEM_PROCESSING", { query: item2.id });
      }
    },
    RETRY_ITEM_LOAD: getItemByQueryFromState(state2, (item2) => {
      item2.retryLoad();
    }),
    REQUEST_ITEM_PREPARE: getItemByQueryFromState(state2, (item2, success, failure) => {
      dispatch(
        "REQUEST_PREPARE_OUTPUT",
        {
          query: item2.id,
          item: item2,
          success: (file2) => {
            dispatch("DID_PREPARE_OUTPUT", { id: item2.id, file: file2 });
            success({
              file: item2,
              output: file2
            });
          },
          failure
        },
        true
      );
    }),
    REQUEST_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2, success, failure) => {
      const itemCanBeQueuedForProcessing = (
        // waiting for something
        item2.status === ItemStatus.IDLE || // processing went wrong earlier
        item2.status === ItemStatus.PROCESSING_ERROR
      );
      if (!itemCanBeQueuedForProcessing) {
        const processNow = () => dispatch("REQUEST_ITEM_PROCESSING", { query: item2, success, failure });
        const process2 = () => document.hidden ? processNow() : setTimeout(processNow, 32);
        if (item2.status === ItemStatus.PROCESSING_COMPLETE || item2.status === ItemStatus.PROCESSING_REVERT_ERROR) {
          item2.revert(
            createRevertFunction(state2.options.server.url, state2.options.server.revert),
            query("GET_FORCE_REVERT")
          ).then(process2).catch(() => {
          });
        } else if (item2.status === ItemStatus.PROCESSING) {
          item2.abortProcessing().then(process2);
        }
        return;
      }
      if (item2.status === ItemStatus.PROCESSING_QUEUED) return;
      item2.requestProcessing();
      dispatch("DID_REQUEST_ITEM_PROCESSING", { id: item2.id });
      dispatch("PROCESS_ITEM", { query: item2, success, failure }, true);
    }),
    PROCESS_ITEM: getItemByQueryFromState(state2, (item2, success, failure) => {
      const maxParallelUploads = query("GET_MAX_PARALLEL_UPLOADS");
      const totalCurrentUploads = query("GET_ITEMS_BY_STATUS", ItemStatus.PROCESSING).length;
      if (totalCurrentUploads === maxParallelUploads) {
        state2.processingQueue.push({
          id: item2.id,
          success,
          failure
        });
        return;
      }
      if (item2.status === ItemStatus.PROCESSING) return;
      const processNext = () => {
        const queueEntry = state2.processingQueue.shift();
        if (!queueEntry) return;
        const { id, success: success2, failure: failure2 } = queueEntry;
        const itemReference = getItemByQuery(state2.items, id);
        if (!itemReference || itemReference.archived) {
          processNext();
          return;
        }
        dispatch("PROCESS_ITEM", { query: id, success: success2, failure: failure2 }, true);
      };
      item2.onOnce("process-complete", () => {
        success(createItemAPI(item2));
        processNext();
        const server = state2.options.server;
        const instantUpload = state2.options.instantUpload;
        if (instantUpload && item2.origin === FileOrigin.LOCAL && isFunction$2(server.remove)) {
          const noop2 = () => {
          };
          item2.origin = FileOrigin.LIMBO;
          state2.options.server.remove(item2.source, noop2, noop2);
        }
        const allItemsProcessed = query("GET_ITEMS_BY_STATUS", ItemStatus.PROCESSING_COMPLETE).length === state2.items.length;
        if (allItemsProcessed) {
          dispatch("DID_COMPLETE_ITEM_PROCESSING_ALL");
        }
      });
      item2.onOnce("process-error", (error2) => {
        failure({ error: error2, file: createItemAPI(item2) });
        processNext();
      });
      const options = state2.options;
      item2.process(
        createFileProcessor(
          createProcessorFunction(options.server.url, options.server.process, options.name, {
            chunkTransferId: item2.transferId,
            chunkServer: options.server.patch,
            chunkUploads: options.chunkUploads,
            chunkForce: options.chunkForce,
            chunkSize: options.chunkSize,
            chunkRetryDelays: options.chunkRetryDelays
          }),
          {
            allowMinimumUploadDuration: query("GET_ALLOW_MINIMUM_UPLOAD_DURATION")
          }
        ),
        // called when the file is about to be processed so it can be piped through the transform filters
        (file2, success2, error2) => {
          applyFilterChain("PREPARE_OUTPUT", file2, { query, item: item2 }).then((file3) => {
            dispatch("DID_PREPARE_OUTPUT", { id: item2.id, file: file3 });
            success2(file3);
          }).catch(error2);
        }
      );
    }),
    RETRY_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2) => {
      dispatch("REQUEST_ITEM_PROCESSING", { query: item2 });
    }),
    REQUEST_REMOVE_ITEM: getItemByQueryFromState(state2, (item2) => {
      optionalPromise(query("GET_BEFORE_REMOVE_FILE"), createItemAPI(item2)).then((shouldRemove) => {
        if (!shouldRemove) {
          return;
        }
        dispatch("REMOVE_ITEM", { query: item2 });
      });
    }),
    RELEASE_ITEM: getItemByQueryFromState(state2, (item2) => {
      item2.release();
    }),
    REMOVE_ITEM: getItemByQueryFromState(state2, (item2, success, failure, options) => {
      const removeFromView = () => {
        const id = item2.id;
        getItemById(state2.items, id).archive();
        dispatch("DID_REMOVE_ITEM", { error: null, id, item: item2 });
        listUpdated(dispatch, state2);
        success(createItemAPI(item2));
      };
      const server = state2.options.server;
      if (item2.origin === FileOrigin.LOCAL && server && isFunction$2(server.remove) && options.remove !== false) {
        dispatch("DID_START_ITEM_REMOVE", { id: item2.id });
        server.remove(
          item2.source,
          () => removeFromView(),
          (status) => {
            dispatch("DID_THROW_ITEM_REMOVE_ERROR", {
              id: item2.id,
              error: createResponse("error", 0, status, null),
              status: {
                main: dynamicLabel(state2.options.labelFileRemoveError)(status),
                sub: state2.options.labelTapToRetry
              }
            });
          }
        );
      } else {
        if (options.revert && item2.origin !== FileOrigin.LOCAL && item2.serverId !== null || // if chunked uploads are enabled and we're uploading in chunks for this specific file
        // or if the file isn't big enough for chunked uploads but chunkForce is set then call
        // revert before removing from the view...
        state2.options.chunkUploads && item2.file.size > state2.options.chunkSize || state2.options.chunkUploads && state2.options.chunkForce) {
          item2.revert(
            createRevertFunction(state2.options.server.url, state2.options.server.revert),
            query("GET_FORCE_REVERT")
          );
        }
        removeFromView();
      }
    }),
    ABORT_ITEM_LOAD: getItemByQueryFromState(state2, (item2) => {
      item2.abortLoad();
    }),
    ABORT_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2) => {
      if (item2.serverId) {
        dispatch("REVERT_ITEM_PROCESSING", { id: item2.id });
        return;
      }
      item2.abortProcessing().then(() => {
        const shouldRemove = state2.options.instantUpload;
        if (shouldRemove) {
          dispatch("REMOVE_ITEM", { query: item2.id });
        }
      });
    }),
    REQUEST_REVERT_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2) => {
      if (!state2.options.instantUpload) {
        dispatch("REVERT_ITEM_PROCESSING", { query: item2 });
        return;
      }
      const handleRevert = (shouldRevert) => {
        if (!shouldRevert) return;
        dispatch("REVERT_ITEM_PROCESSING", { query: item2 });
      };
      const fn2 = query("GET_BEFORE_REMOVE_FILE");
      if (!fn2) {
        return handleRevert(true);
      }
      const requestRemoveResult = fn2(createItemAPI(item2));
      if (requestRemoveResult == null) {
        return handleRevert(true);
      }
      if (typeof requestRemoveResult === "boolean") {
        return handleRevert(requestRemoveResult);
      }
      if (typeof requestRemoveResult.then === "function") {
        requestRemoveResult.then(handleRevert);
      }
    }),
    REVERT_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2) => {
      item2.revert(
        createRevertFunction(state2.options.server.url, state2.options.server.revert),
        query("GET_FORCE_REVERT")
      ).then(() => {
        const shouldRemove = state2.options.instantUpload || isMockItem(item2);
        if (shouldRemove) {
          dispatch("REMOVE_ITEM", { query: item2.id });
        }
      }).catch(() => {
      });
    }),
    SET_OPTIONS: ({ options }) => {
      const optionKeys = Object.keys(options);
      const prioritizedOptionKeys = PrioritizedOptions.filter((key) => optionKeys.includes(key));
      const orderedOptionKeys = [
        // add prioritized first if passed to options, else remove
        ...prioritizedOptionKeys,
        // prevent duplicate keys
        ...Object.keys(options).filter((key) => !prioritizedOptionKeys.includes(key))
      ];
      orderedOptionKeys.forEach((key) => {
        dispatch(`SET_${fromCamels(key, "_").toUpperCase()}`, {
          value: options[key]
        });
      });
    }
  });
  const PrioritizedOptions = [
    "server"
    // must be processed before "files"
  ];
  const formatFilename = (name2) => name2;
  const createElement$1$1 = (tagName) => {
    return document.createElement(tagName);
  };
  const text = (node, value) => {
    let textNode = node.childNodes[0];
    if (!textNode) {
      textNode = document.createTextNode(value);
      node.appendChild(textNode);
    } else if (value !== textNode.nodeValue) {
      textNode.nodeValue = value;
    }
  };
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees % 360 - 90) * Math.PI / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };
  const describeArc = (x2, y, radius, startAngle, endAngle, arcSweep) => {
    const start = polarToCartesian(x2, y, radius, endAngle);
    const end2 = polarToCartesian(x2, y, radius, startAngle);
    return ["M", start.x, start.y, "A", radius, radius, 0, arcSweep, 0, end2.x, end2.y].join(" ");
  };
  const percentageArc = (x2, y, radius, from, to) => {
    let arcSweep = 1;
    if (to > from && to - from <= 0.5) {
      arcSweep = 0;
    }
    if (from > to && from - to >= 0.5) {
      arcSweep = 0;
    }
    return describeArc(
      x2,
      y,
      radius,
      Math.min(0.9999, from) * 360,
      Math.min(0.9999, to) * 360,
      arcSweep
    );
  };
  const create = ({ root: root2, props: props2 }) => {
    props2.spin = false;
    props2.progress = 0;
    props2.opacity = 0;
    const svg = createElement$1("svg");
    root2.ref.path = createElement$1("path", {
      "stroke-width": 2,
      "stroke-linecap": "round"
    });
    svg.appendChild(root2.ref.path);
    root2.ref.svg = svg;
    root2.appendChild(svg);
  };
  const write = ({ root: root2, props: props2 }) => {
    if (props2.opacity === 0) {
      return;
    }
    if (props2.align) {
      root2.element.dataset.align = props2.align;
    }
    const ringStrokeWidth = parseInt(attr(root2.ref.path, "stroke-width"), 10);
    const size = root2.rect.element.width * 0.5;
    let ringFrom = 0;
    let ringTo = 0;
    if (props2.spin) {
      ringFrom = 0;
      ringTo = 0.5;
    } else {
      ringFrom = 0;
      ringTo = props2.progress;
    }
    const coordinates = percentageArc(size, size, size - ringStrokeWidth, ringFrom, ringTo);
    attr(root2.ref.path, "d", coordinates);
    attr(root2.ref.path, "stroke-opacity", props2.spin || props2.progress > 0 ? 1 : 0);
  };
  const progressIndicator = createView({
    tag: "div",
    name: "progress-indicator",
    ignoreRectUpdate: true,
    ignoreRect: true,
    create,
    write,
    mixins: {
      apis: ["progress", "spin", "align"],
      styles: ["opacity"],
      animations: {
        opacity: { type: "tween", duration: 500 },
        progress: {
          type: "spring",
          stiffness: 0.95,
          damping: 0.65,
          mass: 10
        }
      }
    }
  });
  const create$1 = ({ root: root2, props: props2 }) => {
    root2.element.innerHTML = (props2.icon || "") + `<span>${props2.label}</span>`;
    props2.isDisabled = false;
  };
  const write$1 = ({ root: root2, props: props2 }) => {
    const { isDisabled } = props2;
    const shouldDisable = root2.query("GET_DISABLED") || props2.opacity === 0;
    if (shouldDisable && !isDisabled) {
      props2.isDisabled = true;
      attr(root2.element, "disabled", "disabled");
    } else if (!shouldDisable && isDisabled) {
      props2.isDisabled = false;
      root2.element.removeAttribute("disabled");
    }
  };
  const fileActionButton = createView({
    tag: "button",
    attributes: {
      type: "button"
    },
    ignoreRect: true,
    ignoreRectUpdate: true,
    name: "file-action-button",
    mixins: {
      apis: ["label"],
      styles: ["translateX", "translateY", "scaleX", "scaleY", "opacity"],
      animations: {
        scaleX: "spring",
        scaleY: "spring",
        translateX: "spring",
        translateY: "spring",
        opacity: { type: "tween", duration: 250 }
      },
      listeners: true
    },
    create: create$1,
    write: write$1
  });
  const toNaturalFileSize = (bytes, decimalSeparator = ".", base = 1e3, options = {}) => {
    const {
      labelBytes = "bytes",
      labelKilobytes = "KB",
      labelMegabytes = "MB",
      labelGigabytes = "GB"
    } = options;
    bytes = Math.round(Math.abs(bytes));
    const KB = base;
    const MB = base * base;
    const GB = base * base * base;
    if (bytes < KB) {
      return `${bytes} ${labelBytes}`;
    }
    if (bytes < MB) {
      return `${Math.floor(bytes / KB)} ${labelKilobytes}`;
    }
    if (bytes < GB) {
      return `${removeDecimalsWhenZero(bytes / MB, 1, decimalSeparator)} ${labelMegabytes}`;
    }
    return `${removeDecimalsWhenZero(bytes / GB, 2, decimalSeparator)} ${labelGigabytes}`;
  };
  const removeDecimalsWhenZero = (value, decimalCount, separator) => {
    return value.toFixed(decimalCount).split(".").filter((part) => part !== "0").join(separator);
  };
  const create$2 = ({ root: root2, props: props2 }) => {
    const fileName = createElement$1$1("span");
    fileName.className = "filepond--file-info-main";
    attr(fileName, "aria-hidden", "true");
    root2.appendChild(fileName);
    root2.ref.fileName = fileName;
    const fileSize = createElement$1$1("span");
    fileSize.className = "filepond--file-info-sub";
    root2.appendChild(fileSize);
    root2.ref.fileSize = fileSize;
    text(fileSize, root2.query("GET_LABEL_FILE_WAITING_FOR_SIZE"));
    text(fileName, formatFilename(root2.query("GET_ITEM_NAME", props2.id)));
  };
  const updateFile = ({ root: root2, props: props2 }) => {
    text(
      root2.ref.fileSize,
      toNaturalFileSize(
        root2.query("GET_ITEM_SIZE", props2.id),
        ".",
        root2.query("GET_FILE_SIZE_BASE"),
        root2.query("GET_FILE_SIZE_LABELS", root2.query)
      )
    );
    text(root2.ref.fileName, formatFilename(root2.query("GET_ITEM_NAME", props2.id)));
  };
  const updateFileSizeOnError = ({ root: root2, props: props2 }) => {
    if (isInt(root2.query("GET_ITEM_SIZE", props2.id))) {
      updateFile({ root: root2, props: props2 });
      return;
    }
    text(root2.ref.fileSize, root2.query("GET_LABEL_FILE_SIZE_NOT_AVAILABLE"));
  };
  const fileInfo = createView({
    name: "file-info",
    ignoreRect: true,
    ignoreRectUpdate: true,
    write: createRoute({
      DID_LOAD_ITEM: updateFile,
      DID_UPDATE_ITEM_META: updateFile,
      DID_THROW_ITEM_LOAD_ERROR: updateFileSizeOnError,
      DID_THROW_ITEM_INVALID: updateFileSizeOnError
    }),
    didCreateView: (root2) => {
      applyFilters("CREATE_VIEW", { ...root2, view: root2 });
    },
    create: create$2,
    mixins: {
      styles: ["translateX", "translateY"],
      animations: {
        translateX: "spring",
        translateY: "spring"
      }
    }
  });
  const toPercentage = (value) => Math.round(value * 100);
  const create$3 = ({ root: root2 }) => {
    const main = createElement$1$1("span");
    main.className = "filepond--file-status-main";
    root2.appendChild(main);
    root2.ref.main = main;
    const sub = createElement$1$1("span");
    sub.className = "filepond--file-status-sub";
    root2.appendChild(sub);
    root2.ref.sub = sub;
    didSetItemLoadProgress({ root: root2, action: { progress: null } });
  };
  const didSetItemLoadProgress = ({ root: root2, action }) => {
    const title = action.progress === null ? root2.query("GET_LABEL_FILE_LOADING") : `${root2.query("GET_LABEL_FILE_LOADING")} ${toPercentage(action.progress)}%`;
    text(root2.ref.main, title);
    text(root2.ref.sub, root2.query("GET_LABEL_TAP_TO_CANCEL"));
  };
  const didSetItemProcessProgress = ({ root: root2, action }) => {
    const title = action.progress === null ? root2.query("GET_LABEL_FILE_PROCESSING") : `${root2.query("GET_LABEL_FILE_PROCESSING")} ${toPercentage(action.progress)}%`;
    text(root2.ref.main, title);
    text(root2.ref.sub, root2.query("GET_LABEL_TAP_TO_CANCEL"));
  };
  const didRequestItemProcessing = ({ root: root2 }) => {
    text(root2.ref.main, root2.query("GET_LABEL_FILE_PROCESSING"));
    text(root2.ref.sub, root2.query("GET_LABEL_TAP_TO_CANCEL"));
  };
  const didAbortItemProcessing = ({ root: root2 }) => {
    text(root2.ref.main, root2.query("GET_LABEL_FILE_PROCESSING_ABORTED"));
    text(root2.ref.sub, root2.query("GET_LABEL_TAP_TO_RETRY"));
  };
  const didCompleteItemProcessing = ({ root: root2 }) => {
    text(root2.ref.main, root2.query("GET_LABEL_FILE_PROCESSING_COMPLETE"));
    text(root2.ref.sub, root2.query("GET_LABEL_TAP_TO_UNDO"));
  };
  const clear = ({ root: root2 }) => {
    text(root2.ref.main, "");
    text(root2.ref.sub, "");
  };
  const error = ({ root: root2, action }) => {
    text(root2.ref.main, action.status.main);
    text(root2.ref.sub, action.status.sub);
  };
  const fileStatus = createView({
    name: "file-status",
    ignoreRect: true,
    ignoreRectUpdate: true,
    write: createRoute({
      DID_LOAD_ITEM: clear,
      DID_REVERT_ITEM_PROCESSING: clear,
      DID_REQUEST_ITEM_PROCESSING: didRequestItemProcessing,
      DID_ABORT_ITEM_PROCESSING: didAbortItemProcessing,
      DID_COMPLETE_ITEM_PROCESSING: didCompleteItemProcessing,
      DID_UPDATE_ITEM_PROCESS_PROGRESS: didSetItemProcessProgress,
      DID_UPDATE_ITEM_LOAD_PROGRESS: didSetItemLoadProgress,
      DID_THROW_ITEM_LOAD_ERROR: error,
      DID_THROW_ITEM_INVALID: error,
      DID_THROW_ITEM_PROCESSING_ERROR: error,
      DID_THROW_ITEM_PROCESSING_REVERT_ERROR: error,
      DID_THROW_ITEM_REMOVE_ERROR: error
    }),
    didCreateView: (root2) => {
      applyFilters("CREATE_VIEW", { ...root2, view: root2 });
    },
    create: create$3,
    mixins: {
      styles: ["translateX", "translateY", "opacity"],
      animations: {
        opacity: { type: "tween", duration: 250 },
        translateX: "spring",
        translateY: "spring"
      }
    }
  });
  const Buttons = {
    AbortItemLoad: {
      label: "GET_LABEL_BUTTON_ABORT_ITEM_LOAD",
      action: "ABORT_ITEM_LOAD",
      className: "filepond--action-abort-item-load",
      align: "LOAD_INDICATOR_POSITION"
      // right
    },
    RetryItemLoad: {
      label: "GET_LABEL_BUTTON_RETRY_ITEM_LOAD",
      action: "RETRY_ITEM_LOAD",
      icon: "GET_ICON_RETRY",
      className: "filepond--action-retry-item-load",
      align: "BUTTON_PROCESS_ITEM_POSITION"
      // right
    },
    RemoveItem: {
      label: "GET_LABEL_BUTTON_REMOVE_ITEM",
      action: "REQUEST_REMOVE_ITEM",
      icon: "GET_ICON_REMOVE",
      className: "filepond--action-remove-item",
      align: "BUTTON_REMOVE_ITEM_POSITION"
      // left
    },
    ProcessItem: {
      label: "GET_LABEL_BUTTON_PROCESS_ITEM",
      action: "REQUEST_ITEM_PROCESSING",
      icon: "GET_ICON_PROCESS",
      className: "filepond--action-process-item",
      align: "BUTTON_PROCESS_ITEM_POSITION"
      // right
    },
    AbortItemProcessing: {
      label: "GET_LABEL_BUTTON_ABORT_ITEM_PROCESSING",
      action: "ABORT_ITEM_PROCESSING",
      className: "filepond--action-abort-item-processing",
      align: "BUTTON_PROCESS_ITEM_POSITION"
      // right
    },
    RetryItemProcessing: {
      label: "GET_LABEL_BUTTON_RETRY_ITEM_PROCESSING",
      action: "RETRY_ITEM_PROCESSING",
      icon: "GET_ICON_RETRY",
      className: "filepond--action-retry-item-processing",
      align: "BUTTON_PROCESS_ITEM_POSITION"
      // right
    },
    RevertItemProcessing: {
      label: "GET_LABEL_BUTTON_UNDO_ITEM_PROCESSING",
      action: "REQUEST_REVERT_ITEM_PROCESSING",
      icon: "GET_ICON_UNDO",
      className: "filepond--action-revert-item-processing",
      align: "BUTTON_PROCESS_ITEM_POSITION"
      // right
    }
  };
  const ButtonKeys = [];
  forin(Buttons, (key) => {
    ButtonKeys.push(key);
  });
  const calculateFileInfoOffset = (root2) => {
    if (getRemoveIndicatorAligment(root2) === "right") return 0;
    const buttonRect = root2.ref.buttonRemoveItem.rect.element;
    return buttonRect.hidden ? null : buttonRect.width + buttonRect.left;
  };
  const calculateButtonWidth = (root2) => {
    const buttonRect = root2.ref.buttonAbortItemLoad.rect.element;
    return buttonRect.width;
  };
  const calculateFileVerticalCenterOffset = (root2) => Math.floor(root2.ref.buttonRemoveItem.rect.element.height / 4);
  const calculateFileHorizontalCenterOffset = (root2) => Math.floor(root2.ref.buttonRemoveItem.rect.element.left / 2);
  const getLoadIndicatorAlignment = (root2) => root2.query("GET_STYLE_LOAD_INDICATOR_POSITION");
  const getProcessIndicatorAlignment = (root2) => root2.query("GET_STYLE_PROGRESS_INDICATOR_POSITION");
  const getRemoveIndicatorAligment = (root2) => root2.query("GET_STYLE_BUTTON_REMOVE_ITEM_POSITION");
  const DefaultStyle = {
    buttonAbortItemLoad: { opacity: 0 },
    buttonRetryItemLoad: { opacity: 0 },
    buttonRemoveItem: { opacity: 0 },
    buttonProcessItem: { opacity: 0 },
    buttonAbortItemProcessing: { opacity: 0 },
    buttonRetryItemProcessing: { opacity: 0 },
    buttonRevertItemProcessing: { opacity: 0 },
    loadProgressIndicator: { opacity: 0, align: getLoadIndicatorAlignment },
    processProgressIndicator: { opacity: 0, align: getProcessIndicatorAlignment },
    processingCompleteIndicator: { opacity: 0, scaleX: 0.75, scaleY: 0.75 },
    info: { translateX: 0, translateY: 0, opacity: 0 },
    status: { translateX: 0, translateY: 0, opacity: 0 }
  };
  const IdleStyle = {
    buttonRemoveItem: { opacity: 1 },
    buttonProcessItem: { opacity: 1 },
    info: { translateX: calculateFileInfoOffset },
    status: { translateX: calculateFileInfoOffset }
  };
  const ProcessingStyle = {
    buttonAbortItemProcessing: { opacity: 1 },
    processProgressIndicator: { opacity: 1 },
    status: { opacity: 1 }
  };
  const StyleMap = {
    DID_THROW_ITEM_INVALID: {
      buttonRemoveItem: { opacity: 1 },
      info: { translateX: calculateFileInfoOffset },
      status: { translateX: calculateFileInfoOffset, opacity: 1 }
    },
    DID_START_ITEM_LOAD: {
      buttonAbortItemLoad: { opacity: 1 },
      loadProgressIndicator: { opacity: 1 },
      status: { opacity: 1 }
    },
    DID_THROW_ITEM_LOAD_ERROR: {
      buttonRetryItemLoad: { opacity: 1 },
      buttonRemoveItem: { opacity: 1 },
      info: { translateX: calculateFileInfoOffset },
      status: { opacity: 1 }
    },
    DID_START_ITEM_REMOVE: {
      processProgressIndicator: { opacity: 1, align: getRemoveIndicatorAligment },
      info: { translateX: calculateFileInfoOffset },
      status: { opacity: 0 }
    },
    DID_THROW_ITEM_REMOVE_ERROR: {
      processProgressIndicator: { opacity: 0, align: getRemoveIndicatorAligment },
      buttonRemoveItem: { opacity: 1 },
      info: { translateX: calculateFileInfoOffset },
      status: { opacity: 1, translateX: calculateFileInfoOffset }
    },
    DID_LOAD_ITEM: IdleStyle,
    DID_LOAD_LOCAL_ITEM: {
      buttonRemoveItem: { opacity: 1 },
      info: { translateX: calculateFileInfoOffset },
      status: { translateX: calculateFileInfoOffset }
    },
    DID_START_ITEM_PROCESSING: ProcessingStyle,
    DID_REQUEST_ITEM_PROCESSING: ProcessingStyle,
    DID_UPDATE_ITEM_PROCESS_PROGRESS: ProcessingStyle,
    DID_COMPLETE_ITEM_PROCESSING: {
      buttonRevertItemProcessing: { opacity: 1 },
      info: { opacity: 1 },
      status: { opacity: 1 }
    },
    DID_THROW_ITEM_PROCESSING_ERROR: {
      buttonRemoveItem: { opacity: 1 },
      buttonRetryItemProcessing: { opacity: 1 },
      status: { opacity: 1 },
      info: { translateX: calculateFileInfoOffset }
    },
    DID_THROW_ITEM_PROCESSING_REVERT_ERROR: {
      buttonRevertItemProcessing: { opacity: 1 },
      status: { opacity: 1 },
      info: { opacity: 1 }
    },
    DID_ABORT_ITEM_PROCESSING: {
      buttonRemoveItem: { opacity: 1 },
      buttonProcessItem: { opacity: 1 },
      info: { translateX: calculateFileInfoOffset },
      status: { opacity: 1 }
    },
    DID_REVERT_ITEM_PROCESSING: IdleStyle
  };
  const processingCompleteIndicatorView = createView({
    create: ({ root: root2 }) => {
      root2.element.innerHTML = root2.query("GET_ICON_DONE");
    },
    name: "processing-complete-indicator",
    ignoreRect: true,
    mixins: {
      styles: ["scaleX", "scaleY", "opacity"],
      animations: {
        scaleX: "spring",
        scaleY: "spring",
        opacity: { type: "tween", duration: 250 }
      }
    }
  });
  const create$4 = ({ root: root2, props: props2 }) => {
    const LocalButtons = Object.keys(Buttons).reduce((prev, curr) => {
      prev[curr] = { ...Buttons[curr] };
      return prev;
    }, {});
    const { id } = props2;
    const allowRevert = root2.query("GET_ALLOW_REVERT");
    const allowRemove = root2.query("GET_ALLOW_REMOVE");
    const allowProcess = root2.query("GET_ALLOW_PROCESS");
    const instantUpload = root2.query("GET_INSTANT_UPLOAD");
    const isAsync2 = root2.query("IS_ASYNC");
    const alignRemoveItemButton = root2.query("GET_STYLE_BUTTON_REMOVE_ITEM_ALIGN");
    let buttonFilter;
    if (isAsync2) {
      if (allowProcess && !allowRevert) {
        buttonFilter = (key) => !/RevertItemProcessing/.test(key);
      } else if (!allowProcess && allowRevert) {
        buttonFilter = (key) => !/ProcessItem|RetryItemProcessing|AbortItemProcessing/.test(key);
      } else if (!allowProcess && !allowRevert) {
        buttonFilter = (key) => !/Process/.test(key);
      }
    } else {
      buttonFilter = (key) => !/Process/.test(key);
    }
    const enabledButtons = buttonFilter ? ButtonKeys.filter(buttonFilter) : ButtonKeys.concat();
    if (instantUpload && allowRevert) {
      LocalButtons["RevertItemProcessing"].label = "GET_LABEL_BUTTON_REMOVE_ITEM";
      LocalButtons["RevertItemProcessing"].icon = "GET_ICON_REMOVE";
    }
    if (isAsync2 && !allowRevert) {
      const map2 = StyleMap["DID_COMPLETE_ITEM_PROCESSING"];
      map2.info.translateX = calculateFileHorizontalCenterOffset;
      map2.info.translateY = calculateFileVerticalCenterOffset;
      map2.status.translateY = calculateFileVerticalCenterOffset;
      map2.processingCompleteIndicator = { opacity: 1, scaleX: 1, scaleY: 1 };
    }
    if (isAsync2 && !allowProcess) {
      [
        "DID_START_ITEM_PROCESSING",
        "DID_REQUEST_ITEM_PROCESSING",
        "DID_UPDATE_ITEM_PROCESS_PROGRESS",
        "DID_THROW_ITEM_PROCESSING_ERROR"
      ].forEach((key) => {
        StyleMap[key].status.translateY = calculateFileVerticalCenterOffset;
      });
      StyleMap["DID_THROW_ITEM_PROCESSING_ERROR"].status.translateX = calculateButtonWidth;
    }
    if (alignRemoveItemButton && allowRevert) {
      LocalButtons["RevertItemProcessing"].align = "BUTTON_REMOVE_ITEM_POSITION";
      const map2 = StyleMap["DID_COMPLETE_ITEM_PROCESSING"];
      map2.info.translateX = calculateFileInfoOffset;
      map2.status.translateY = calculateFileVerticalCenterOffset;
      map2.processingCompleteIndicator = { opacity: 1, scaleX: 1, scaleY: 1 };
    }
    if (!allowRemove) {
      LocalButtons["RemoveItem"].disabled = true;
    }
    forin(LocalButtons, (key, definition) => {
      const buttonView = root2.createChildView(fileActionButton, {
        label: root2.query(definition.label),
        icon: root2.query(definition.icon),
        opacity: 0
      });
      if (enabledButtons.includes(key)) {
        root2.appendChildView(buttonView);
      }
      if (definition.disabled) {
        buttonView.element.setAttribute("disabled", "disabled");
        buttonView.element.setAttribute("hidden", "hidden");
      }
      buttonView.element.dataset.align = root2.query(`GET_STYLE_${definition.align}`);
      buttonView.element.classList.add(definition.className);
      buttonView.on("click", (e) => {
        e.stopPropagation();
        if (definition.disabled) return;
        root2.dispatch(definition.action, { query: id });
      });
      root2.ref[`button${key}`] = buttonView;
    });
    root2.ref.processingCompleteIndicator = root2.appendChildView(
      root2.createChildView(processingCompleteIndicatorView)
    );
    root2.ref.processingCompleteIndicator.element.dataset.align = root2.query(
      `GET_STYLE_BUTTON_PROCESS_ITEM_POSITION`
    );
    root2.ref.info = root2.appendChildView(root2.createChildView(fileInfo, { id }));
    root2.ref.status = root2.appendChildView(root2.createChildView(fileStatus, { id }));
    const loadIndicatorView = root2.appendChildView(
      root2.createChildView(progressIndicator, {
        opacity: 0,
        align: root2.query(`GET_STYLE_LOAD_INDICATOR_POSITION`)
      })
    );
    loadIndicatorView.element.classList.add("filepond--load-indicator");
    root2.ref.loadProgressIndicator = loadIndicatorView;
    const progressIndicatorView = root2.appendChildView(
      root2.createChildView(progressIndicator, {
        opacity: 0,
        align: root2.query(`GET_STYLE_PROGRESS_INDICATOR_POSITION`)
      })
    );
    progressIndicatorView.element.classList.add("filepond--process-indicator");
    root2.ref.processProgressIndicator = progressIndicatorView;
    root2.ref.activeStyles = [];
  };
  const write$2 = ({ root: root2, actions: actions2, props: props2 }) => {
    route({ root: root2, actions: actions2, props: props2 });
    let action = actions2.concat().filter((action2) => /^DID_/.test(action2.type)).reverse().find((action2) => StyleMap[action2.type]);
    if (action) {
      root2.ref.activeStyles = [];
      const stylesToApply = StyleMap[action.type];
      forin(DefaultStyle, (name2, defaultStyles) => {
        const control = root2.ref[name2];
        forin(defaultStyles, (key, defaultValue) => {
          const value = stylesToApply[name2] && typeof stylesToApply[name2][key] !== "undefined" ? stylesToApply[name2][key] : defaultValue;
          root2.ref.activeStyles.push({ control, key, value });
        });
      });
    }
    root2.ref.activeStyles.forEach(({ control, key, value }) => {
      control[key] = typeof value === "function" ? value(root2) : value;
    });
  };
  const route = createRoute({
    DID_SET_LABEL_BUTTON_ABORT_ITEM_PROCESSING: ({ root: root2, action }) => {
      root2.ref.buttonAbortItemProcessing.label = action.value;
    },
    DID_SET_LABEL_BUTTON_ABORT_ITEM_LOAD: ({ root: root2, action }) => {
      root2.ref.buttonAbortItemLoad.label = action.value;
    },
    DID_SET_LABEL_BUTTON_ABORT_ITEM_REMOVAL: ({ root: root2, action }) => {
      root2.ref.buttonAbortItemRemoval.label = action.value;
    },
    DID_REQUEST_ITEM_PROCESSING: ({ root: root2 }) => {
      root2.ref.processProgressIndicator.spin = true;
      root2.ref.processProgressIndicator.progress = 0;
    },
    DID_START_ITEM_LOAD: ({ root: root2 }) => {
      root2.ref.loadProgressIndicator.spin = true;
      root2.ref.loadProgressIndicator.progress = 0;
    },
    DID_START_ITEM_REMOVE: ({ root: root2 }) => {
      root2.ref.processProgressIndicator.spin = true;
      root2.ref.processProgressIndicator.progress = 0;
    },
    DID_UPDATE_ITEM_LOAD_PROGRESS: ({ root: root2, action }) => {
      root2.ref.loadProgressIndicator.spin = false;
      root2.ref.loadProgressIndicator.progress = action.progress;
    },
    DID_UPDATE_ITEM_PROCESS_PROGRESS: ({ root: root2, action }) => {
      root2.ref.processProgressIndicator.spin = false;
      root2.ref.processProgressIndicator.progress = action.progress;
    }
  });
  const file = createView({
    create: create$4,
    write: write$2,
    didCreateView: (root2) => {
      applyFilters("CREATE_VIEW", { ...root2, view: root2 });
    },
    name: "file"
  });
  const create$5 = ({ root: root2, props: props2 }) => {
    root2.ref.fileName = createElement$1$1("legend");
    root2.appendChild(root2.ref.fileName);
    root2.ref.file = root2.appendChildView(root2.createChildView(file, { id: props2.id }));
    root2.ref.data = false;
  };
  const didLoadItem = ({ root: root2, props: props2 }) => {
    text(root2.ref.fileName, formatFilename(root2.query("GET_ITEM_NAME", props2.id)));
  };
  const fileWrapper = createView({
    create: create$5,
    ignoreRect: true,
    write: createRoute({
      DID_LOAD_ITEM: didLoadItem
    }),
    didCreateView: (root2) => {
      applyFilters("CREATE_VIEW", { ...root2, view: root2 });
    },
    tag: "fieldset",
    name: "file-wrapper"
  });
  const PANEL_SPRING_PROPS = { type: "spring", damping: 0.6, mass: 7 };
  const create$6 = ({ root: root2, props: props2 }) => {
    [
      {
        name: "top"
      },
      {
        name: "center",
        props: {
          translateY: null,
          scaleY: null
        },
        mixins: {
          animations: {
            scaleY: PANEL_SPRING_PROPS
          },
          styles: ["translateY", "scaleY"]
        }
      },
      {
        name: "bottom",
        props: {
          translateY: null
        },
        mixins: {
          animations: {
            translateY: PANEL_SPRING_PROPS
          },
          styles: ["translateY"]
        }
      }
    ].forEach((section) => {
      createSection(root2, section, props2.name);
    });
    root2.element.classList.add(`filepond--${props2.name}`);
    root2.ref.scalable = null;
  };
  const createSection = (root2, section, className) => {
    const viewConstructor = createView({
      name: `panel-${section.name} filepond--${className}`,
      mixins: section.mixins,
      ignoreRectUpdate: true
    });
    const view = root2.createChildView(viewConstructor, section.props);
    root2.ref[section.name] = root2.appendChildView(view);
  };
  const write$3 = ({ root: root2, props: props2 }) => {
    if (root2.ref.scalable === null || props2.scalable !== root2.ref.scalable) {
      root2.ref.scalable = isBoolean$1(props2.scalable) ? props2.scalable : true;
      root2.element.dataset.scalable = root2.ref.scalable;
    }
    if (!props2.height) return;
    const topRect = root2.ref.top.rect.element;
    const bottomRect = root2.ref.bottom.rect.element;
    const height = Math.max(topRect.height + bottomRect.height, props2.height);
    root2.ref.center.translateY = topRect.height;
    root2.ref.center.scaleY = (height - topRect.height - bottomRect.height) / 100;
    root2.ref.bottom.translateY = height - bottomRect.height;
  };
  const panel = createView({
    name: "panel",
    read: ({ root: root2, props: props2 }) => props2.heightCurrent = root2.ref.bottom.translateY,
    write: write$3,
    create: create$6,
    ignoreRect: true,
    mixins: {
      apis: ["height", "heightCurrent", "scalable"]
    }
  });
  const createDragHelper = (items) => {
    const itemIds = items.map((item2) => item2.id);
    let prevIndex = void 0;
    return {
      setIndex: (index) => {
        prevIndex = index;
      },
      getIndex: () => prevIndex,
      getItemIndex: (item2) => itemIds.indexOf(item2.id)
    };
  };
  const ITEM_TRANSLATE_SPRING = {
    type: "spring",
    stiffness: 0.75,
    damping: 0.45,
    mass: 10
  };
  const ITEM_SCALE_SPRING = "spring";
  const StateMap = {
    DID_START_ITEM_LOAD: "busy",
    DID_UPDATE_ITEM_LOAD_PROGRESS: "loading",
    DID_THROW_ITEM_INVALID: "load-invalid",
    DID_THROW_ITEM_LOAD_ERROR: "load-error",
    DID_LOAD_ITEM: "idle",
    DID_THROW_ITEM_REMOVE_ERROR: "remove-error",
    DID_START_ITEM_REMOVE: "busy",
    DID_START_ITEM_PROCESSING: "busy processing",
    DID_REQUEST_ITEM_PROCESSING: "busy processing",
    DID_UPDATE_ITEM_PROCESS_PROGRESS: "processing",
    DID_COMPLETE_ITEM_PROCESSING: "processing-complete",
    DID_THROW_ITEM_PROCESSING_ERROR: "processing-error",
    DID_THROW_ITEM_PROCESSING_REVERT_ERROR: "processing-revert-error",
    DID_ABORT_ITEM_PROCESSING: "cancelled",
    DID_REVERT_ITEM_PROCESSING: "idle"
  };
  const create$7 = ({ root: root2, props: props2 }) => {
    root2.ref.handleClick = (e) => root2.dispatch("DID_ACTIVATE_ITEM", { id: props2.id });
    root2.element.id = `filepond--item-${props2.id}`;
    root2.element.addEventListener("click", root2.ref.handleClick);
    root2.ref.container = root2.appendChildView(root2.createChildView(fileWrapper, { id: props2.id }));
    root2.ref.panel = root2.appendChildView(root2.createChildView(panel, { name: "item-panel" }));
    root2.ref.panel.height = null;
    props2.markedForRemoval = false;
    if (!root2.query("GET_ALLOW_REORDER")) return;
    root2.element.dataset.dragState = "idle";
    const grab = (e) => {
      if (!e.isPrimary) return;
      let removedActivateListener = false;
      const origin2 = {
        x: e.pageX,
        y: e.pageY
      };
      props2.dragOrigin = {
        x: root2.translateX,
        y: root2.translateY
      };
      props2.dragCenter = {
        x: e.offsetX,
        y: e.offsetY
      };
      const dragState = createDragHelper(root2.query("GET_ACTIVE_ITEMS"));
      root2.dispatch("DID_GRAB_ITEM", { id: props2.id, dragState });
      const drag = (e2) => {
        if (!e2.isPrimary) return;
        e2.stopPropagation();
        e2.preventDefault();
        props2.dragOffset = {
          x: e2.pageX - origin2.x,
          y: e2.pageY - origin2.y
        };
        const dist = props2.dragOffset.x * props2.dragOffset.x + props2.dragOffset.y * props2.dragOffset.y;
        if (dist > 16 && !removedActivateListener) {
          removedActivateListener = true;
          root2.element.removeEventListener("click", root2.ref.handleClick);
        }
        root2.dispatch("DID_DRAG_ITEM", { id: props2.id, dragState });
      };
      const drop2 = (e2) => {
        if (!e2.isPrimary) return;
        props2.dragOffset = {
          x: e2.pageX - origin2.x,
          y: e2.pageY - origin2.y
        };
        reset();
      };
      const cancel = () => {
        reset();
      };
      const reset = () => {
        document.removeEventListener("pointercancel", cancel);
        document.removeEventListener("pointermove", drag);
        document.removeEventListener("pointerup", drop2);
        root2.dispatch("DID_DROP_ITEM", { id: props2.id, dragState });
        if (removedActivateListener) {
          setTimeout(() => root2.element.addEventListener("click", root2.ref.handleClick), 0);
        }
      };
      document.addEventListener("pointercancel", cancel);
      document.addEventListener("pointermove", drag);
      document.addEventListener("pointerup", drop2);
    };
    root2.element.addEventListener("pointerdown", grab);
  };
  const route$1 = createRoute({
    DID_UPDATE_PANEL_HEIGHT: ({ root: root2, action }) => {
      root2.height = action.height;
    }
  });
  const write$4 = createRoute(
    {
      DID_GRAB_ITEM: ({ root: root2, props: props2 }) => {
        props2.dragOrigin = {
          x: root2.translateX,
          y: root2.translateY
        };
      },
      DID_DRAG_ITEM: ({ root: root2 }) => {
        root2.element.dataset.dragState = "drag";
      },
      DID_DROP_ITEM: ({ root: root2, props: props2 }) => {
        props2.dragOffset = null;
        props2.dragOrigin = null;
        root2.element.dataset.dragState = "drop";
      }
    },
    ({ root: root2, actions: actions2, props: props2, shouldOptimize }) => {
      if (root2.element.dataset.dragState === "drop") {
        if (root2.scaleX <= 1) {
          root2.element.dataset.dragState = "idle";
        }
      }
      let action = actions2.concat().filter((action2) => /^DID_/.test(action2.type)).reverse().find((action2) => StateMap[action2.type]);
      if (action && action.type !== props2.currentState) {
        props2.currentState = action.type;
        root2.element.dataset.filepondItemState = StateMap[props2.currentState] || "";
      }
      const aspectRatio = root2.query("GET_ITEM_PANEL_ASPECT_RATIO") || root2.query("GET_PANEL_ASPECT_RATIO");
      if (!aspectRatio) {
        route$1({ root: root2, actions: actions2, props: props2 });
        if (!root2.height && root2.ref.container.rect.element.height > 0) {
          root2.height = root2.ref.container.rect.element.height;
        }
      } else if (!shouldOptimize) {
        root2.height = root2.rect.element.width * aspectRatio;
      }
      if (shouldOptimize) {
        root2.ref.panel.height = null;
      }
      root2.ref.panel.height = root2.height;
    }
  );
  const item = createView({
    create: create$7,
    write: write$4,
    destroy: ({ root: root2, props: props2 }) => {
      root2.element.removeEventListener("click", root2.ref.handleClick);
      root2.dispatch("RELEASE_ITEM", { query: props2.id });
    },
    tag: "li",
    name: "item",
    mixins: {
      apis: [
        "id",
        "interactionMethod",
        "markedForRemoval",
        "spawnDate",
        "dragCenter",
        "dragOrigin",
        "dragOffset"
      ],
      styles: ["translateX", "translateY", "scaleX", "scaleY", "opacity", "height"],
      animations: {
        scaleX: ITEM_SCALE_SPRING,
        scaleY: ITEM_SCALE_SPRING,
        translateX: ITEM_TRANSLATE_SPRING,
        translateY: ITEM_TRANSLATE_SPRING,
        opacity: { type: "tween", duration: 150 }
      }
    }
  });
  var getItemsPerRow = (horizontalSpace, itemWidth) => {
    return Math.max(1, Math.floor((horizontalSpace + 1) / itemWidth));
  };
  const getItemIndexByPosition = (view, children, positionInView) => {
    if (!positionInView) return;
    const horizontalSpace = view.rect.element.width;
    const l = children.length;
    let last = null;
    if (l === 0 || positionInView.top < children[0].rect.element.top) return -1;
    const item2 = children[0];
    const itemRect = item2.rect.element;
    const itemHorizontalMargin = itemRect.marginLeft + itemRect.marginRight;
    const itemWidth = itemRect.width + itemHorizontalMargin;
    const itemsPerRow = getItemsPerRow(horizontalSpace, itemWidth);
    if (itemsPerRow === 1) {
      for (let index = 0; index < l; index++) {
        const child = children[index];
        const childMid = child.rect.outer.top + child.rect.element.height * 0.5;
        if (positionInView.top < childMid) {
          return index;
        }
      }
      return l;
    }
    const itemVerticalMargin = itemRect.marginTop + itemRect.marginBottom;
    const itemHeight = itemRect.height + itemVerticalMargin;
    for (let index = 0; index < l; index++) {
      const indexX = index % itemsPerRow;
      const indexY = Math.floor(index / itemsPerRow);
      const offsetX = indexX * itemWidth;
      const offsetY = indexY * itemHeight;
      const itemTop = offsetY - itemRect.marginTop;
      const itemRight = offsetX + itemWidth;
      const itemBottom = offsetY + itemHeight + itemRect.marginBottom;
      if (positionInView.top < itemBottom && positionInView.top > itemTop) {
        if (positionInView.left < itemRight) {
          return index;
        } else if (index !== l - 1) {
          last = index;
        } else {
          last = null;
        }
      }
    }
    if (last !== null) {
      return last;
    }
    return l;
  };
  const dropAreaDimensions = {
    height: 0,
    width: 0,
    get getHeight() {
      return this.height;
    },
    set setHeight(val) {
      if (this.height === 0 || val === 0) this.height = val;
    },
    get getWidth() {
      return this.width;
    },
    set setWidth(val) {
      if (this.width === 0 || val === 0) this.width = val;
    }
  };
  const create$8 = ({ root: root2 }) => {
    attr(root2.element, "role", "list");
    root2.ref.lastItemSpanwDate = Date.now();
  };
  const addItemView = ({ root: root2, action }) => {
    const { id, index, interactionMethod } = action;
    root2.ref.addIndex = index;
    const now = Date.now();
    let spawnDate = now;
    let opacity = 1;
    if (interactionMethod !== InteractionMethod.NONE) {
      opacity = 0;
      const cooldown = root2.query("GET_ITEM_INSERT_INTERVAL");
      const dist = now - root2.ref.lastItemSpanwDate;
      spawnDate = dist < cooldown ? now + (cooldown - dist) : now;
    }
    root2.ref.lastItemSpanwDate = spawnDate;
    root2.appendChildView(
      root2.createChildView(
        // view type
        item,
        // props
        {
          spawnDate,
          id,
          opacity,
          interactionMethod
        }
      ),
      index
    );
  };
  const moveItem = (item2, x2, y, vx = 0, vy = 1) => {
    if (item2.dragOffset) {
      item2.translateX = null;
      item2.translateY = null;
      item2.translateX = item2.dragOrigin.x + item2.dragOffset.x;
      item2.translateY = item2.dragOrigin.y + item2.dragOffset.y;
      item2.scaleX = 1.025;
      item2.scaleY = 1.025;
    } else {
      item2.translateX = x2;
      item2.translateY = y;
      if (Date.now() > item2.spawnDate) {
        if (item2.opacity === 0) {
          introItemView(item2, x2, y, vx, vy);
        }
        item2.scaleX = 1;
        item2.scaleY = 1;
        item2.opacity = 1;
      }
    }
  };
  const introItemView = (item2, x2, y, vx, vy) => {
    if (item2.interactionMethod === InteractionMethod.NONE) {
      item2.translateX = null;
      item2.translateX = x2;
      item2.translateY = null;
      item2.translateY = y;
    } else if (item2.interactionMethod === InteractionMethod.DROP) {
      item2.translateX = null;
      item2.translateX = x2 - vx * 20;
      item2.translateY = null;
      item2.translateY = y - vy * 10;
      item2.scaleX = 0.8;
      item2.scaleY = 0.8;
    } else if (item2.interactionMethod === InteractionMethod.BROWSE) {
      item2.translateY = null;
      item2.translateY = y - 30;
    } else if (item2.interactionMethod === InteractionMethod.API) {
      item2.translateX = null;
      item2.translateX = x2 - 30;
      item2.translateY = null;
    }
  };
  const removeItemView = ({ root: root2, action }) => {
    const { id } = action;
    const view = root2.childViews.find((child) => child.id === id);
    if (!view) {
      return;
    }
    view.scaleX = 0.9;
    view.scaleY = 0.9;
    view.opacity = 0;
    view.markedForRemoval = true;
  };
  const getItemHeight = (child) => child.rect.element.height + child.rect.element.marginBottom + child.rect.element.marginTop;
  const getItemWidth = (child) => child.rect.element.width + child.rect.element.marginLeft * 0.5 + child.rect.element.marginRight * 0.5;
  const dragItem = ({ root: root2, action }) => {
    const { id, dragState } = action;
    const item2 = root2.query("GET_ITEM", { id });
    const view = root2.childViews.find((child) => child.id === id);
    const numItems = root2.childViews.length;
    const oldIndex = dragState.getItemIndex(item2);
    if (!view) return;
    const dragPosition = {
      x: view.dragOrigin.x + view.dragOffset.x + view.dragCenter.x,
      y: view.dragOrigin.y + view.dragOffset.y + view.dragCenter.y
    };
    const dragHeight = getItemHeight(view);
    const dragWidth = getItemWidth(view);
    let cols = Math.floor(root2.rect.outer.width / dragWidth);
    if (cols > numItems) cols = numItems;
    const rows = Math.floor(numItems / cols + 1);
    dropAreaDimensions.setHeight = dragHeight * rows;
    dropAreaDimensions.setWidth = dragWidth * cols;
    var location2 = {
      y: Math.floor(dragPosition.y / dragHeight),
      x: Math.floor(dragPosition.x / dragWidth),
      getGridIndex: function getGridIndex() {
        if (dragPosition.y > dropAreaDimensions.getHeight || dragPosition.y < 0 || dragPosition.x > dropAreaDimensions.getWidth || dragPosition.x < 0)
          return oldIndex;
        return this.y * cols + this.x;
      },
      getColIndex: function getColIndex() {
        const items = root2.query("GET_ACTIVE_ITEMS");
        const visibleChildren = root2.childViews.filter((child) => child.rect.element.height);
        const children = items.map(
          (item3) => visibleChildren.find((childView) => childView.id === item3.id)
        );
        const currentIndex2 = children.findIndex((child) => child === view);
        const dragHeight2 = getItemHeight(view);
        const l = children.length;
        let idx = l;
        let childHeight = 0;
        let childBottom = 0;
        let childTop = 0;
        for (let i = 0; i < l; i++) {
          childHeight = getItemHeight(children[i]);
          childTop = childBottom;
          childBottom = childTop + childHeight;
          if (dragPosition.y < childBottom) {
            if (currentIndex2 > i) {
              if (dragPosition.y < childTop + dragHeight2) {
                idx = i;
                break;
              }
              continue;
            }
            idx = i;
            break;
          }
        }
        return idx;
      }
    };
    const index = cols > 1 ? location2.getGridIndex() : location2.getColIndex();
    root2.dispatch("MOVE_ITEM", { query: view, index });
    const currentIndex = dragState.getIndex();
    if (currentIndex === void 0 || currentIndex !== index) {
      dragState.setIndex(index);
      if (currentIndex === void 0) return;
      root2.dispatch("DID_REORDER_ITEMS", {
        items: root2.query("GET_ACTIVE_ITEMS"),
        origin: oldIndex,
        target: index
      });
    }
  };
  const route$2 = createRoute({
    DID_ADD_ITEM: addItemView,
    DID_REMOVE_ITEM: removeItemView,
    DID_DRAG_ITEM: dragItem
  });
  const write$5 = ({ root: root2, props: props2, actions: actions2, shouldOptimize }) => {
    route$2({ root: root2, props: props2, actions: actions2 });
    const { dragCoordinates } = props2;
    const horizontalSpace = root2.rect.element.width;
    const visibleChildren = root2.childViews.filter((child) => child.rect.element.height);
    const children = root2.query("GET_ACTIVE_ITEMS").map((item2) => visibleChildren.find((child) => child.id === item2.id)).filter((item2) => item2);
    const dragIndex = dragCoordinates ? getItemIndexByPosition(root2, children, dragCoordinates) : null;
    const addIndex = root2.ref.addIndex || null;
    root2.ref.addIndex = null;
    let dragIndexOffset = 0;
    let removeIndexOffset = 0;
    let addIndexOffset = 0;
    if (children.length === 0) return;
    const childRect = children[0].rect.element;
    const itemVerticalMargin = childRect.marginTop + childRect.marginBottom;
    const itemHorizontalMargin = childRect.marginLeft + childRect.marginRight;
    const itemWidth = childRect.width + itemHorizontalMargin;
    const itemHeight = childRect.height + itemVerticalMargin;
    const itemsPerRow = getItemsPerRow(horizontalSpace, itemWidth);
    if (itemsPerRow === 1) {
      let offsetY = 0;
      let dragOffset = 0;
      children.forEach((child, index) => {
        if (dragIndex) {
          let dist = index - dragIndex;
          if (dist === -2) {
            dragOffset = -itemVerticalMargin * 0.25;
          } else if (dist === -1) {
            dragOffset = -itemVerticalMargin * 0.75;
          } else if (dist === 0) {
            dragOffset = itemVerticalMargin * 0.75;
          } else if (dist === 1) {
            dragOffset = itemVerticalMargin * 0.25;
          } else {
            dragOffset = 0;
          }
        }
        if (shouldOptimize) {
          child.translateX = null;
          child.translateY = null;
        }
        if (!child.markedForRemoval) {
          moveItem(child, 0, offsetY + dragOffset);
        }
        let itemHeight2 = child.rect.element.height + itemVerticalMargin;
        let visualHeight = itemHeight2 * (child.markedForRemoval ? child.opacity : 1);
        offsetY += visualHeight;
      });
    } else {
      let prevX = 0;
      let prevY = 0;
      children.forEach((child, index) => {
        if (index === dragIndex) {
          dragIndexOffset = 1;
        }
        if (index === addIndex) {
          addIndexOffset += 1;
        }
        if (child.markedForRemoval && child.opacity < 0.5) {
          removeIndexOffset -= 1;
        }
        const visualIndex = index + addIndexOffset + dragIndexOffset + removeIndexOffset;
        const indexX = visualIndex % itemsPerRow;
        const indexY = Math.floor(visualIndex / itemsPerRow);
        const offsetX = indexX * itemWidth;
        const offsetY = indexY * itemHeight;
        const vectorX = Math.sign(offsetX - prevX);
        const vectorY = Math.sign(offsetY - prevY);
        prevX = offsetX;
        prevY = offsetY;
        if (child.markedForRemoval) return;
        if (shouldOptimize) {
          child.translateX = null;
          child.translateY = null;
        }
        moveItem(child, offsetX, offsetY, vectorX, vectorY);
      });
    }
  };
  const filterSetItemActions = (child, actions2) => actions2.filter((action) => {
    if (action.data && action.data.id) {
      return child.id === action.data.id;
    }
    return true;
  });
  const list = createView({
    create: create$8,
    write: write$5,
    tag: "ul",
    name: "list",
    didWriteView: ({ root: root2 }) => {
      root2.childViews.filter((view) => view.markedForRemoval && view.opacity === 0 && view.resting).forEach((view) => {
        view._destroy();
        root2.removeChildView(view);
      });
    },
    filterFrameActionsForChild: filterSetItemActions,
    mixins: {
      apis: ["dragCoordinates"]
    }
  });
  const create$9 = ({ root: root2, props: props2 }) => {
    root2.ref.list = root2.appendChildView(root2.createChildView(list));
    props2.dragCoordinates = null;
    props2.overflowing = false;
  };
  const storeDragCoordinates = ({ root: root2, props: props2, action }) => {
    if (!root2.query("GET_ITEM_INSERT_LOCATION_FREEDOM")) return;
    props2.dragCoordinates = {
      left: action.position.scopeLeft - root2.ref.list.rect.element.left,
      top: action.position.scopeTop - (root2.rect.outer.top + root2.rect.element.marginTop + root2.rect.element.scrollTop)
    };
  };
  const clearDragCoordinates = ({ props: props2 }) => {
    props2.dragCoordinates = null;
  };
  const route$3 = createRoute({
    DID_DRAG: storeDragCoordinates,
    DID_END_DRAG: clearDragCoordinates
  });
  const write$6 = ({ root: root2, props: props2, actions: actions2 }) => {
    route$3({ root: root2, props: props2, actions: actions2 });
    root2.ref.list.dragCoordinates = props2.dragCoordinates;
    if (props2.overflowing && !props2.overflow) {
      props2.overflowing = false;
      root2.element.dataset.state = "";
      root2.height = null;
    }
    if (props2.overflow) {
      const newHeight = Math.round(props2.overflow);
      if (newHeight !== root2.height) {
        props2.overflowing = true;
        root2.element.dataset.state = "overflow";
        root2.height = newHeight;
      }
    }
  };
  const listScroller = createView({
    create: create$9,
    write: write$6,
    name: "list-scroller",
    mixins: {
      apis: ["overflow", "dragCoordinates"],
      styles: ["height", "translateY"],
      animations: {
        translateY: "spring"
      }
    }
  });
  const attrToggle = (element, name2, state2, enabledValue = "") => {
    if (state2) {
      attr(element, name2, enabledValue);
    } else {
      element.removeAttribute(name2);
    }
  };
  const resetFileInput = (input) => {
    if (!input || input.value === "") {
      return;
    }
    try {
      input.value = "";
    } catch (err) {
    }
    if (input.value) {
      const form = createElement$1$1("form");
      const parentNode = input.parentNode;
      const ref2 = input.nextSibling;
      form.appendChild(input);
      form.reset();
      if (ref2) {
        parentNode.insertBefore(input, ref2);
      } else {
        parentNode.appendChild(input);
      }
    }
  };
  const create$a = ({ root: root2, props: props2 }) => {
    root2.element.id = `filepond--browser-${props2.id}`;
    attr(root2.element, "name", root2.query("GET_NAME"));
    attr(root2.element, "aria-controls", `filepond--assistant-${props2.id}`);
    attr(root2.element, "aria-labelledby", `filepond--drop-label-${props2.id}`);
    setAcceptedFileTypes({ root: root2, action: { value: root2.query("GET_ACCEPTED_FILE_TYPES") } });
    toggleAllowMultiple({ root: root2, action: { value: root2.query("GET_ALLOW_MULTIPLE") } });
    toggleDirectoryFilter({ root: root2, action: { value: root2.query("GET_ALLOW_DIRECTORIES_ONLY") } });
    toggleDisabled({ root: root2 });
    toggleRequired({ root: root2, action: { value: root2.query("GET_REQUIRED") } });
    setCaptureMethod({ root: root2, action: { value: root2.query("GET_CAPTURE_METHOD") } });
    root2.ref.handleChange = (e) => {
      if (!root2.element.value) {
        return;
      }
      const files = Array.from(root2.element.files).map((file2) => {
        file2._relativePath = file2.webkitRelativePath;
        return file2;
      });
      setTimeout(() => {
        props2.onload(files);
        resetFileInput(root2.element);
      }, 250);
    };
    root2.element.addEventListener("change", root2.ref.handleChange);
  };
  const setAcceptedFileTypes = ({ root: root2, action }) => {
    if (!root2.query("GET_ALLOW_SYNC_ACCEPT_ATTRIBUTE")) return;
    attrToggle(root2.element, "accept", !!action.value, action.value ? action.value.join(",") : "");
  };
  const toggleAllowMultiple = ({ root: root2, action }) => {
    attrToggle(root2.element, "multiple", action.value);
  };
  const toggleDirectoryFilter = ({ root: root2, action }) => {
    attrToggle(root2.element, "webkitdirectory", action.value);
  };
  const toggleDisabled = ({ root: root2 }) => {
    const isDisabled = root2.query("GET_DISABLED");
    const doesAllowBrowse = root2.query("GET_ALLOW_BROWSE");
    const disableField = isDisabled || !doesAllowBrowse;
    attrToggle(root2.element, "disabled", disableField);
  };
  const toggleRequired = ({ root: root2, action }) => {
    if (!action.value) {
      attrToggle(root2.element, "required", false);
    } else if (root2.query("GET_TOTAL_ITEMS") === 0) {
      attrToggle(root2.element, "required", true);
    }
  };
  const setCaptureMethod = ({ root: root2, action }) => {
    attrToggle(root2.element, "capture", !!action.value, action.value === true ? "" : action.value);
  };
  const updateRequiredStatus = ({ root: root2 }) => {
    const { element } = root2;
    if (root2.query("GET_TOTAL_ITEMS") > 0) {
      attrToggle(element, "required", false);
      attrToggle(element, "name", false);
      const activeItems = root2.query("GET_ACTIVE_ITEMS");
      let hasInvalidField = false;
      for (let i = 0; i < activeItems.length; i++) {
        if (activeItems[i].status === ItemStatus.LOAD_ERROR) {
          hasInvalidField = true;
        }
      }
      root2.element.setCustomValidity(
        hasInvalidField ? root2.query("GET_LABEL_INVALID_FIELD") : ""
      );
    } else {
      attrToggle(element, "name", true, root2.query("GET_NAME"));
      const shouldCheckValidity = root2.query("GET_CHECK_VALIDITY");
      if (shouldCheckValidity) {
        element.setCustomValidity("");
      }
      if (root2.query("GET_REQUIRED")) {
        attrToggle(element, "required", true);
      }
    }
  };
  const updateFieldValidityStatus = ({ root: root2 }) => {
    const shouldCheckValidity = root2.query("GET_CHECK_VALIDITY");
    if (!shouldCheckValidity) return;
    root2.element.setCustomValidity(root2.query("GET_LABEL_INVALID_FIELD"));
  };
  const browser = createView({
    tag: "input",
    name: "browser",
    ignoreRect: true,
    ignoreRectUpdate: true,
    attributes: {
      type: "file"
    },
    create: create$a,
    destroy: ({ root: root2 }) => {
      root2.element.removeEventListener("change", root2.ref.handleChange);
    },
    write: createRoute({
      DID_LOAD_ITEM: updateRequiredStatus,
      DID_REMOVE_ITEM: updateRequiredStatus,
      DID_THROW_ITEM_INVALID: updateFieldValidityStatus,
      DID_SET_DISABLED: toggleDisabled,
      DID_SET_ALLOW_BROWSE: toggleDisabled,
      DID_SET_ALLOW_DIRECTORIES_ONLY: toggleDirectoryFilter,
      DID_SET_ALLOW_MULTIPLE: toggleAllowMultiple,
      DID_SET_ACCEPTED_FILE_TYPES: setAcceptedFileTypes,
      DID_SET_CAPTURE_METHOD: setCaptureMethod,
      DID_SET_REQUIRED: toggleRequired
    })
  });
  const Key = {
    ENTER: 13,
    SPACE: 32
  };
  const create$b = ({ root: root2, props: props2 }) => {
    const label = createElement$1$1("label");
    attr(label, "for", `filepond--browser-${props2.id}`);
    attr(label, "id", `filepond--drop-label-${props2.id}`);
    root2.ref.handleKeyDown = (e) => {
      const isActivationKey = e.keyCode === Key.ENTER || e.keyCode === Key.SPACE;
      if (!isActivationKey) return;
      e.preventDefault();
      root2.ref.label.click();
    };
    root2.ref.handleClick = (e) => {
      const isLabelClick = e.target === label || label.contains(e.target);
      if (isLabelClick) return;
      root2.ref.label.click();
    };
    label.addEventListener("keydown", root2.ref.handleKeyDown);
    root2.element.addEventListener("click", root2.ref.handleClick);
    updateLabelValue(label, props2.caption);
    root2.appendChild(label);
    root2.ref.label = label;
  };
  const updateLabelValue = (label, value) => {
    label.innerHTML = value;
    const clickable = label.querySelector(".filepond--label-action");
    if (clickable) {
      attr(clickable, "tabindex", "0");
    }
    return value;
  };
  const dropLabel = createView({
    name: "drop-label",
    ignoreRect: true,
    create: create$b,
    destroy: ({ root: root2 }) => {
      root2.ref.label.addEventListener("keydown", root2.ref.handleKeyDown);
      root2.element.removeEventListener("click", root2.ref.handleClick);
    },
    write: createRoute({
      DID_SET_LABEL_IDLE: ({ root: root2, action }) => {
        updateLabelValue(root2.ref.label, action.value);
      }
    }),
    mixins: {
      styles: ["opacity", "translateX", "translateY"],
      animations: {
        opacity: { type: "tween", duration: 150 },
        translateX: "spring",
        translateY: "spring"
      }
    }
  });
  const blob = createView({
    name: "drip-blob",
    ignoreRect: true,
    mixins: {
      styles: ["translateX", "translateY", "scaleX", "scaleY", "opacity"],
      animations: {
        scaleX: "spring",
        scaleY: "spring",
        translateX: "spring",
        translateY: "spring",
        opacity: { type: "tween", duration: 250 }
      }
    }
  });
  const addBlob = ({ root: root2 }) => {
    const centerX = root2.rect.element.width * 0.5;
    const centerY = root2.rect.element.height * 0.5;
    root2.ref.blob = root2.appendChildView(
      root2.createChildView(blob, {
        opacity: 0,
        scaleX: 2.5,
        scaleY: 2.5,
        translateX: centerX,
        translateY: centerY
      })
    );
  };
  const moveBlob = ({ root: root2, action }) => {
    if (!root2.ref.blob) {
      addBlob({ root: root2 });
      return;
    }
    root2.ref.blob.translateX = action.position.scopeLeft;
    root2.ref.blob.translateY = action.position.scopeTop;
    root2.ref.blob.scaleX = 1;
    root2.ref.blob.scaleY = 1;
    root2.ref.blob.opacity = 1;
  };
  const hideBlob = ({ root: root2 }) => {
    if (!root2.ref.blob) {
      return;
    }
    root2.ref.blob.opacity = 0;
  };
  const explodeBlob = ({ root: root2 }) => {
    if (!root2.ref.blob) {
      return;
    }
    root2.ref.blob.scaleX = 2.5;
    root2.ref.blob.scaleY = 2.5;
    root2.ref.blob.opacity = 0;
  };
  const write$7 = ({ root: root2, props: props2, actions: actions2 }) => {
    route$4({ root: root2, props: props2, actions: actions2 });
    const { blob: blob2 } = root2.ref;
    if (actions2.length === 0 && blob2 && blob2.opacity === 0) {
      root2.removeChildView(blob2);
      root2.ref.blob = null;
    }
  };
  const route$4 = createRoute({
    DID_DRAG: moveBlob,
    DID_DROP: explodeBlob,
    DID_END_DRAG: hideBlob
  });
  const drip = createView({
    ignoreRect: true,
    ignoreRectUpdate: true,
    name: "drip",
    write: write$7
  });
  const setInputFiles = (element, files) => {
    try {
      const dataTransfer = new DataTransfer();
      files.forEach((file2) => {
        if (file2 instanceof File) {
          dataTransfer.items.add(file2);
        } else {
          dataTransfer.items.add(
            new File([file2], file2.name, {
              type: file2.type
            })
          );
        }
      });
      element.files = dataTransfer.files;
    } catch (err) {
      return false;
    }
    return true;
  };
  const create$c = ({ root: root2 }) => {
    root2.ref.fields = {};
    const legend = document.createElement("legend");
    legend.textContent = "Files";
    root2.element.appendChild(legend);
  };
  const getField = (root2, id) => root2.ref.fields[id];
  const syncFieldPositionsWithItems = (root2) => {
    root2.query("GET_ACTIVE_ITEMS").forEach((item2) => {
      if (!root2.ref.fields[item2.id]) return;
      root2.element.appendChild(root2.ref.fields[item2.id]);
    });
  };
  const didReorderItems = ({ root: root2 }) => syncFieldPositionsWithItems(root2);
  const didAddItem = ({ root: root2, action }) => {
    const fileItem = root2.query("GET_ITEM", action.id);
    const isLocalFile = fileItem.origin === FileOrigin.LOCAL;
    const shouldUseFileInput = !isLocalFile && root2.query("SHOULD_UPDATE_FILE_INPUT");
    const dataContainer = createElement$1$1("input");
    dataContainer.type = shouldUseFileInput ? "file" : "hidden";
    dataContainer.name = root2.query("GET_NAME");
    root2.ref.fields[action.id] = dataContainer;
    syncFieldPositionsWithItems(root2);
  };
  const didLoadItem$1 = ({ root: root2, action }) => {
    const field = getField(root2, action.id);
    if (!field) return;
    if (action.serverFileReference !== null) field.value = action.serverFileReference;
    if (!root2.query("SHOULD_UPDATE_FILE_INPUT")) return;
    const fileItem = root2.query("GET_ITEM", action.id);
    setInputFiles(field, [fileItem.file]);
  };
  const didPrepareOutput = ({ root: root2, action }) => {
    if (!root2.query("SHOULD_UPDATE_FILE_INPUT")) return;
    setTimeout(() => {
      const field = getField(root2, action.id);
      if (!field) return;
      setInputFiles(field, [action.file]);
    }, 0);
  };
  const didSetDisabled = ({ root: root2 }) => {
    root2.element.disabled = root2.query("GET_DISABLED");
  };
  const didRemoveItem = ({ root: root2, action }) => {
    const field = getField(root2, action.id);
    if (!field) return;
    if (field.parentNode) field.parentNode.removeChild(field);
    delete root2.ref.fields[action.id];
  };
  const didDefineValue = ({ root: root2, action }) => {
    const field = getField(root2, action.id);
    if (!field) return;
    if (action.value === null) {
      field.removeAttribute("value");
    } else {
      if (field.type != "file") {
        field.value = action.value;
      }
    }
    syncFieldPositionsWithItems(root2);
  };
  const write$8 = createRoute({
    DID_SET_DISABLED: didSetDisabled,
    DID_ADD_ITEM: didAddItem,
    DID_LOAD_ITEM: didLoadItem$1,
    DID_REMOVE_ITEM: didRemoveItem,
    DID_DEFINE_VALUE: didDefineValue,
    DID_PREPARE_OUTPUT: didPrepareOutput,
    DID_REORDER_ITEMS: didReorderItems,
    DID_SORT_ITEMS: didReorderItems
  });
  const data = createView({
    tag: "fieldset",
    name: "data",
    create: create$c,
    write: write$8,
    ignoreRect: true
  });
  const getRootNode = (element) => "getRootNode" in element ? element.getRootNode() : document;
  const images = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "tiff"];
  const text$1 = ["css", "csv", "html", "txt"];
  const map = {
    zip: "zip|compressed",
    epub: "application/epub+zip"
  };
  const guesstimateMimeType = (extension = "") => {
    extension = extension.toLowerCase();
    if (images.includes(extension)) {
      return "image/" + (extension === "jpg" ? "jpeg" : extension === "svg" ? "svg+xml" : extension);
    }
    if (text$1.includes(extension)) {
      return "text/" + extension;
    }
    return map[extension] || "";
  };
  const requestDataTransferItems = (dataTransfer) => new Promise((resolve2, reject) => {
    const links = getLinks(dataTransfer);
    if (links.length && !hasFiles(dataTransfer)) {
      return resolve2(links);
    }
    getFiles(dataTransfer).then(resolve2);
  });
  const hasFiles = (dataTransfer) => {
    if (dataTransfer.files) return dataTransfer.files.length > 0;
    return false;
  };
  const getFiles = (dataTransfer) => new Promise((resolve2, reject) => {
    const promisedFiles = (dataTransfer.items ? Array.from(dataTransfer.items) : []).filter((item2) => isFileSystemItem(item2)).map((item2) => getFilesFromItem(item2));
    if (!promisedFiles.length) {
      resolve2(dataTransfer.files ? Array.from(dataTransfer.files) : []);
      return;
    }
    Promise.all(promisedFiles).then((returnedFileGroups) => {
      const files = [];
      returnedFileGroups.forEach((group) => {
        files.push.apply(files, group);
      });
      resolve2(
        files.filter((file2) => file2).map((file2) => {
          if (!file2._relativePath) file2._relativePath = file2.webkitRelativePath;
          return file2;
        })
      );
    }).catch(console.error);
  });
  const isFileSystemItem = (item2) => {
    if (isEntry(item2)) {
      const entry = getAsEntry(item2);
      if (entry) {
        return entry.isFile || entry.isDirectory;
      }
    }
    return item2.kind === "file";
  };
  const getFilesFromItem = (item2) => new Promise((resolve2, reject) => {
    if (isDirectoryEntry(item2)) {
      getFilesInDirectory(getAsEntry(item2)).then(resolve2).catch(reject);
      return;
    }
    resolve2([item2.getAsFile()]);
  });
  const getFilesInDirectory = (entry) => new Promise((resolve2, reject) => {
    const files = [];
    let dirCounter = 0;
    let fileCounter = 0;
    const resolveIfDone = () => {
      if (fileCounter === 0 && dirCounter === 0) {
        resolve2(files);
      }
    };
    const readEntries = (dirEntry) => {
      dirCounter++;
      const directoryReader = dirEntry.createReader();
      const readBatch = () => {
        directoryReader.readEntries((entries) => {
          if (entries.length === 0) {
            dirCounter--;
            resolveIfDone();
            return;
          }
          entries.forEach((entry2) => {
            if (entry2.isDirectory) {
              readEntries(entry2);
            } else {
              fileCounter++;
              entry2.file((file2) => {
                const correctedFile = correctMissingFileType(file2);
                if (entry2.fullPath) correctedFile._relativePath = entry2.fullPath;
                files.push(correctedFile);
                fileCounter--;
                resolveIfDone();
              });
            }
          });
          readBatch();
        }, reject);
      };
      readBatch();
    };
    readEntries(entry);
  });
  const correctMissingFileType = (file2) => {
    if (file2.type.length) return file2;
    const date = file2.lastModifiedDate;
    const name2 = file2.name;
    const type2 = guesstimateMimeType(getExtensionFromFilename(file2.name));
    if (!type2.length) return file2;
    file2 = file2.slice(0, file2.size, type2);
    file2.name = name2;
    file2.lastModifiedDate = date;
    return file2;
  };
  const isDirectoryEntry = (item2) => isEntry(item2) && (getAsEntry(item2) || {}).isDirectory;
  const isEntry = (item2) => "webkitGetAsEntry" in item2;
  const getAsEntry = (item2) => item2.webkitGetAsEntry();
  const getLinks = (dataTransfer) => {
    let links = [];
    try {
      links = getLinksFromTransferMetaData(dataTransfer);
      if (links.length) {
        return links;
      }
      links = getLinksFromTransferURLData(dataTransfer);
    } catch (e) {
    }
    return links;
  };
  const getLinksFromTransferURLData = (dataTransfer) => {
    let data2 = dataTransfer.getData("url");
    if (typeof data2 === "string" && data2.length) {
      return [data2];
    }
    return [];
  };
  const getLinksFromTransferMetaData = (dataTransfer) => {
    let data2 = dataTransfer.getData("text/html");
    if (typeof data2 === "string" && data2.length) {
      const matches = data2.match(/src\s*=\s*"(.+?)"/);
      if (matches) {
        return [matches[1]];
      }
    }
    return [];
  };
  const dragNDropObservers = [];
  const eventPosition = (e) => ({
    pageLeft: e.pageX,
    pageTop: e.pageY,
    scopeLeft: e.offsetX || e.layerX,
    scopeTop: e.offsetY || e.layerY
  });
  const createDragNDropClient = (element, scopeToObserve, filterElement) => {
    const observer = getDragNDropObserver(scopeToObserve);
    const client = {
      element,
      filterElement,
      state: null,
      ondrop: () => {
      },
      onenter: () => {
      },
      ondrag: () => {
      },
      onexit: () => {
      },
      onload: () => {
      },
      allowdrop: () => {
      }
    };
    client.destroy = observer.addListener(client);
    return client;
  };
  const getDragNDropObserver = (element) => {
    const observer = dragNDropObservers.find((item2) => item2.element === element);
    if (observer) {
      return observer;
    }
    const newObserver = createDragNDropObserver(element);
    dragNDropObservers.push(newObserver);
    return newObserver;
  };
  const createDragNDropObserver = (element) => {
    const clients = [];
    const routes = {
      dragenter,
      dragover,
      dragleave,
      drop
    };
    const handlers = {};
    forin(routes, (event, createHandler) => {
      handlers[event] = createHandler(element, clients);
      element.addEventListener(event, handlers[event], false);
    });
    const observer = {
      element,
      addListener: (client) => {
        clients.push(client);
        return () => {
          clients.splice(clients.indexOf(client), 1);
          if (clients.length === 0) {
            dragNDropObservers.splice(dragNDropObservers.indexOf(observer), 1);
            forin(routes, (event) => {
              element.removeEventListener(event, handlers[event], false);
            });
          }
        };
      }
    };
    return observer;
  };
  const elementFromPoint = (root2, point) => {
    if (!("elementFromPoint" in root2)) {
      root2 = document;
    }
    return root2.elementFromPoint(point.x, point.y);
  };
  const isEventTarget = (e, target) => {
    const root2 = getRootNode(target);
    const elementAtPosition = elementFromPoint(root2, {
      x: e.pageX - window.pageXOffset,
      y: e.pageY - window.pageYOffset
    });
    return elementAtPosition === target || target.contains(elementAtPosition);
  };
  let initialTarget = null;
  const setDropEffect = (dataTransfer, effect) => {
    try {
      dataTransfer.dropEffect = effect;
    } catch (e) {
    }
  };
  const dragenter = (root2, clients) => (e) => {
    e.preventDefault();
    initialTarget = e.target;
    clients.forEach((client) => {
      const { element, onenter } = client;
      if (isEventTarget(e, element)) {
        client.state = "enter";
        onenter(eventPosition(e));
      }
    });
  };
  const dragover = (root2, clients) => (e) => {
    e.preventDefault();
    const dataTransfer = e.dataTransfer;
    requestDataTransferItems(dataTransfer).then((items) => {
      let overDropTarget = false;
      clients.some((client) => {
        const { filterElement, element, onenter, onexit, ondrag, allowdrop } = client;
        setDropEffect(dataTransfer, "copy");
        const allowsTransfer = allowdrop(items);
        if (!allowsTransfer) {
          setDropEffect(dataTransfer, "none");
          return;
        }
        if (isEventTarget(e, element)) {
          overDropTarget = true;
          if (client.state === null) {
            client.state = "enter";
            onenter(eventPosition(e));
            return;
          }
          client.state = "over";
          if (filterElement && !allowsTransfer) {
            setDropEffect(dataTransfer, "none");
            return;
          }
          ondrag(eventPosition(e));
        } else {
          if (filterElement && !overDropTarget) {
            setDropEffect(dataTransfer, "none");
          }
          if (client.state) {
            client.state = null;
            onexit(eventPosition(e));
          }
        }
      });
    });
  };
  const drop = (root2, clients) => (e) => {
    e.preventDefault();
    const dataTransfer = e.dataTransfer;
    requestDataTransferItems(dataTransfer).then((items) => {
      clients.forEach((client) => {
        const { filterElement, element, ondrop, onexit, allowdrop } = client;
        client.state = null;
        if (filterElement && !isEventTarget(e, element)) return;
        if (!allowdrop(items)) return onexit(eventPosition(e));
        ondrop(eventPosition(e), items);
      });
    });
  };
  const dragleave = (root2, clients) => (e) => {
    if (initialTarget !== e.target) {
      return;
    }
    clients.forEach((client) => {
      const { onexit } = client;
      client.state = null;
      onexit(eventPosition(e));
    });
  };
  const createHopper = (scope, validateItems, options) => {
    scope.classList.add("filepond--hopper");
    const { catchesDropsOnPage, requiresDropOnElement, filterItems = (items) => items } = options;
    const client = createDragNDropClient(
      scope,
      catchesDropsOnPage ? document.documentElement : scope,
      requiresDropOnElement
    );
    let lastState = "";
    let currentState = "";
    client.allowdrop = (items) => {
      return validateItems(filterItems(items));
    };
    client.ondrop = (position, items) => {
      const filteredItems = filterItems(items);
      if (!validateItems(filteredItems)) {
        api2.ondragend(position);
        return;
      }
      currentState = "drag-drop";
      api2.onload(filteredItems, position);
    };
    client.ondrag = (position) => {
      api2.ondrag(position);
    };
    client.onenter = (position) => {
      currentState = "drag-over";
      api2.ondragstart(position);
    };
    client.onexit = (position) => {
      currentState = "drag-exit";
      api2.ondragend(position);
    };
    const api2 = {
      updateHopperState: () => {
        if (lastState !== currentState) {
          scope.dataset.hopperState = currentState;
          lastState = currentState;
        }
      },
      onload: () => {
      },
      ondragstart: () => {
      },
      ondrag: () => {
      },
      ondragend: () => {
      },
      destroy: () => {
        client.destroy();
      }
    };
    return api2;
  };
  let listening = false;
  const listeners$1 = [];
  const handlePaste = (e) => {
    const activeEl = document.activeElement;
    const isActiveElementEditable = activeEl && (/textarea|input/i.test(activeEl.nodeName) || activeEl.getAttribute("contenteditable") === "true" || activeEl.getAttribute("contenteditable") === "");
    if (isActiveElementEditable) {
      let inScope = false;
      let element = activeEl;
      while (element !== document.body) {
        if (element.classList.contains("filepond--root")) {
          inScope = true;
          break;
        }
        element = element.parentNode;
      }
      if (!inScope) return;
    }
    requestDataTransferItems(e.clipboardData).then((files) => {
      if (!files.length) {
        return;
      }
      listeners$1.forEach((listener2) => listener2(files));
    });
  };
  const listen = (cb) => {
    if (listeners$1.includes(cb)) {
      return;
    }
    listeners$1.push(cb);
    if (listening) {
      return;
    }
    listening = true;
    document.addEventListener("paste", handlePaste);
  };
  const unlisten = (listener2) => {
    arrayRemove(listeners$1, listeners$1.indexOf(listener2));
    if (listeners$1.length === 0) {
      document.removeEventListener("paste", handlePaste);
      listening = false;
    }
  };
  const createPaster = () => {
    const cb = (files) => {
      api2.onload(files);
    };
    const api2 = {
      destroy: () => {
        unlisten(cb);
      },
      onload: () => {
      }
    };
    listen(cb);
    return api2;
  };
  const create$d = ({ root: root2, props: props2 }) => {
    root2.element.id = `filepond--assistant-${props2.id}`;
    attr(root2.element, "role", "alert");
    attr(root2.element, "aria-live", "polite");
    attr(root2.element, "aria-relevant", "additions");
  };
  let addFilesNotificationTimeout = null;
  let notificationClearTimeout = null;
  const filenames = [];
  const assist = (root2, message) => {
    root2.element.textContent = message;
  };
  const clear$1 = (root2) => {
    root2.element.textContent = "";
  };
  const listModified = (root2, filename, label) => {
    const total = root2.query("GET_TOTAL_ITEMS");
    assist(
      root2,
      `${label} ${filename}, ${total} ${total === 1 ? root2.query("GET_LABEL_FILE_COUNT_SINGULAR") : root2.query("GET_LABEL_FILE_COUNT_PLURAL")}`
    );
    clearTimeout(notificationClearTimeout);
    notificationClearTimeout = setTimeout(() => {
      clear$1(root2);
    }, 1500);
  };
  const isUsingFilePond = (root2) => root2.element.parentNode.contains(document.activeElement);
  const itemAdded = ({ root: root2, action }) => {
    if (!isUsingFilePond(root2)) {
      return;
    }
    root2.element.textContent = "";
    const item2 = root2.query("GET_ITEM", action.id);
    filenames.push(item2.filename);
    clearTimeout(addFilesNotificationTimeout);
    addFilesNotificationTimeout = setTimeout(() => {
      listModified(root2, filenames.join(", "), root2.query("GET_LABEL_FILE_ADDED"));
      filenames.length = 0;
    }, 750);
  };
  const itemRemoved = ({ root: root2, action }) => {
    if (!isUsingFilePond(root2)) {
      return;
    }
    const item2 = action.item;
    listModified(root2, item2.filename, root2.query("GET_LABEL_FILE_REMOVED"));
  };
  const itemProcessed = ({ root: root2, action }) => {
    const item2 = root2.query("GET_ITEM", action.id);
    const filename = item2.filename;
    const label = root2.query("GET_LABEL_FILE_PROCESSING_COMPLETE");
    assist(root2, `${filename} ${label}`);
  };
  const itemProcessedUndo = ({ root: root2, action }) => {
    const item2 = root2.query("GET_ITEM", action.id);
    const filename = item2.filename;
    const label = root2.query("GET_LABEL_FILE_PROCESSING_ABORTED");
    assist(root2, `${filename} ${label}`);
  };
  const itemError = ({ root: root2, action }) => {
    const item2 = root2.query("GET_ITEM", action.id);
    const filename = item2.filename;
    assist(root2, `${action.status.main} ${filename} ${action.status.sub}`);
  };
  const assistant = createView({
    create: create$d,
    ignoreRect: true,
    ignoreRectUpdate: true,
    write: createRoute({
      DID_LOAD_ITEM: itemAdded,
      DID_REMOVE_ITEM: itemRemoved,
      DID_COMPLETE_ITEM_PROCESSING: itemProcessed,
      DID_ABORT_ITEM_PROCESSING: itemProcessedUndo,
      DID_REVERT_ITEM_PROCESSING: itemProcessedUndo,
      DID_THROW_ITEM_REMOVE_ERROR: itemError,
      DID_THROW_ITEM_LOAD_ERROR: itemError,
      DID_THROW_ITEM_INVALID: itemError,
      DID_THROW_ITEM_PROCESSING_ERROR: itemError
    }),
    tag: "span",
    name: "assistant"
  });
  const toCamels = (string, separator = "-") => string.replace(new RegExp(`${separator}.`, "g"), (sub) => sub.charAt(1).toUpperCase());
  const debounce = (func, interval = 16, immidiateOnly = true) => {
    let last = Date.now();
    let timeout = null;
    return (...args) => {
      clearTimeout(timeout);
      const dist = Date.now() - last;
      const fn2 = () => {
        last = Date.now();
        func(...args);
      };
      if (dist < interval) {
        if (!immidiateOnly) {
          timeout = setTimeout(fn2, interval - dist);
        }
      } else {
        fn2();
      }
    };
  };
  const MAX_FILES_LIMIT = 1e6;
  const prevent = (e) => e.preventDefault();
  const create$e = ({ root: root2, props: props2 }) => {
    const id = root2.query("GET_ID");
    if (id) {
      root2.element.id = id;
    }
    const className = root2.query("GET_CLASS_NAME");
    if (className) {
      className.split(" ").filter((name2) => name2.length).forEach((name2) => {
        root2.element.classList.add(name2);
      });
    }
    root2.ref.label = root2.appendChildView(
      root2.createChildView(dropLabel, {
        ...props2,
        translateY: null,
        caption: root2.query("GET_LABEL_IDLE")
      })
    );
    root2.ref.list = root2.appendChildView(root2.createChildView(listScroller, { translateY: null }));
    root2.ref.panel = root2.appendChildView(root2.createChildView(panel, { name: "panel-root" }));
    root2.ref.assistant = root2.appendChildView(root2.createChildView(assistant, { ...props2 }));
    root2.ref.data = root2.appendChildView(root2.createChildView(data, { ...props2 }));
    root2.ref.measure = createElement$1$1("div");
    root2.ref.measure.style.height = "100%";
    root2.element.appendChild(root2.ref.measure);
    root2.ref.bounds = null;
    root2.query("GET_STYLES").filter((style) => !isEmpty(style.value)).map(({ name: name2, value }) => {
      root2.element.dataset[name2] = value;
    });
    root2.ref.widthPrevious = null;
    root2.ref.widthUpdated = debounce(() => {
      root2.ref.updateHistory = [];
      root2.dispatch("DID_RESIZE_ROOT");
    }, 250);
    root2.ref.previousAspectRatio = null;
    root2.ref.updateHistory = [];
    const canHover = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    const hasPointerEvents = "PointerEvent" in window;
    if (root2.query("GET_ALLOW_REORDER") && hasPointerEvents && !canHover) {
      root2.element.addEventListener("touchmove", prevent, { passive: false });
      root2.element.addEventListener("gesturestart", prevent);
    }
    const credits = root2.query("GET_CREDITS");
    const hasCredits = credits.length === 2;
    if (hasCredits) {
      const frag = document.createElement("a");
      frag.className = "filepond--credits";
      frag.href = credits[0];
      frag.tabIndex = -1;
      frag.target = "_blank";
      frag.rel = "noopener noreferrer nofollow";
      frag.textContent = credits[1];
      root2.element.appendChild(frag);
      root2.ref.credits = frag;
    }
  };
  const write$9 = ({ root: root2, props: props2, actions: actions2 }) => {
    route$5({ root: root2, props: props2, actions: actions2 });
    actions2.filter((action) => /^DID_SET_STYLE_/.test(action.type)).filter((action) => !isEmpty(action.data.value)).map(({ type: type2, data: data2 }) => {
      const name2 = toCamels(type2.substring(8).toLowerCase(), "_");
      root2.element.dataset[name2] = data2.value;
      root2.invalidateLayout();
    });
    if (root2.rect.element.hidden) return;
    if (root2.rect.element.width !== root2.ref.widthPrevious) {
      root2.ref.widthPrevious = root2.rect.element.width;
      root2.ref.widthUpdated();
    }
    let bounds = root2.ref.bounds;
    if (!bounds) {
      bounds = root2.ref.bounds = calculateRootBoundingBoxHeight(root2);
      root2.element.removeChild(root2.ref.measure);
      root2.ref.measure = null;
    }
    const { hopper, label, list: list2, panel: panel2 } = root2.ref;
    if (hopper) {
      hopper.updateHopperState();
    }
    const aspectRatio = root2.query("GET_PANEL_ASPECT_RATIO");
    const isMultiItem = root2.query("GET_ALLOW_MULTIPLE");
    const totalItems = root2.query("GET_TOTAL_ITEMS");
    const maxItems = isMultiItem ? root2.query("GET_MAX_FILES") || MAX_FILES_LIMIT : 1;
    const atMaxCapacity = totalItems === maxItems;
    const addAction = actions2.find((action) => action.type === "DID_ADD_ITEM");
    if (atMaxCapacity && addAction) {
      const interactionMethod = addAction.data.interactionMethod;
      label.opacity = 0;
      if (isMultiItem) {
        label.translateY = -40;
      } else {
        if (interactionMethod === InteractionMethod.API) {
          label.translateX = 40;
        } else if (interactionMethod === InteractionMethod.BROWSE) {
          label.translateY = 40;
        } else {
          label.translateY = 30;
        }
      }
    } else if (!atMaxCapacity) {
      label.opacity = 1;
      label.translateX = 0;
      label.translateY = 0;
    }
    const listItemMargin = calculateListItemMargin(root2);
    const listHeight = calculateListHeight(root2);
    const labelHeight = label.rect.element.height;
    const currentLabelHeight = !isMultiItem || atMaxCapacity ? 0 : labelHeight;
    const listMarginTop = atMaxCapacity ? list2.rect.element.marginTop : 0;
    const listMarginBottom = totalItems === 0 ? 0 : list2.rect.element.marginBottom;
    const visualHeight = currentLabelHeight + listMarginTop + listHeight.visual + listMarginBottom;
    const boundsHeight = currentLabelHeight + listMarginTop + listHeight.bounds + listMarginBottom;
    list2.translateY = Math.max(0, currentLabelHeight - list2.rect.element.marginTop) - listItemMargin.top;
    if (aspectRatio) {
      const width = root2.rect.element.width;
      const height = width * aspectRatio;
      if (aspectRatio !== root2.ref.previousAspectRatio) {
        root2.ref.previousAspectRatio = aspectRatio;
        root2.ref.updateHistory = [];
      }
      const history = root2.ref.updateHistory;
      history.push(width);
      const MAX_BOUNCES = 2;
      if (history.length > MAX_BOUNCES * 2) {
        const l = history.length;
        const bottom = l - 10;
        let bounces = 0;
        for (let i = l; i >= bottom; i--) {
          if (history[i] === history[i - 2]) {
            bounces++;
          }
          if (bounces >= MAX_BOUNCES) {
            return;
          }
        }
      }
      panel2.scalable = false;
      panel2.height = height;
      const listAvailableHeight = (
        // the height of the panel minus the label height
        height - currentLabelHeight - // the room we leave open between the end of the list and the panel bottom
        (listMarginBottom - listItemMargin.bottom) - // if we're full we need to leave some room between the top of the panel and the list
        (atMaxCapacity ? listMarginTop : 0)
      );
      if (listHeight.visual > listAvailableHeight) {
        list2.overflow = listAvailableHeight;
      } else {
        list2.overflow = null;
      }
      root2.height = height;
    } else if (bounds.fixedHeight) {
      panel2.scalable = false;
      const listAvailableHeight = (
        // the height of the panel minus the label height
        bounds.fixedHeight - currentLabelHeight - // the room we leave open between the end of the list and the panel bottom
        (listMarginBottom - listItemMargin.bottom) - // if we're full we need to leave some room between the top of the panel and the list
        (atMaxCapacity ? listMarginTop : 0)
      );
      if (listHeight.visual > listAvailableHeight) {
        list2.overflow = listAvailableHeight;
      } else {
        list2.overflow = null;
      }
    } else if (bounds.cappedHeight) {
      const isCappedHeight = visualHeight >= bounds.cappedHeight;
      const panelHeight = Math.min(bounds.cappedHeight, visualHeight);
      panel2.scalable = true;
      panel2.height = isCappedHeight ? panelHeight : panelHeight - listItemMargin.top - listItemMargin.bottom;
      const listAvailableHeight = (
        // the height of the panel minus the label height
        panelHeight - currentLabelHeight - // the room we leave open between the end of the list and the panel bottom
        (listMarginBottom - listItemMargin.bottom) - // if we're full we need to leave some room between the top of the panel and the list
        (atMaxCapacity ? listMarginTop : 0)
      );
      if (visualHeight > bounds.cappedHeight && listHeight.visual > listAvailableHeight) {
        list2.overflow = listAvailableHeight;
      } else {
        list2.overflow = null;
      }
      root2.height = Math.min(
        bounds.cappedHeight,
        boundsHeight - listItemMargin.top - listItemMargin.bottom
      );
    } else {
      const itemMargin = totalItems > 0 ? listItemMargin.top + listItemMargin.bottom : 0;
      panel2.scalable = true;
      panel2.height = Math.max(labelHeight, visualHeight - itemMargin);
      root2.height = Math.max(labelHeight, boundsHeight - itemMargin);
    }
    if (root2.ref.credits && panel2.heightCurrent)
      root2.ref.credits.style.transform = `translateY(${panel2.heightCurrent}px)`;
  };
  const calculateListItemMargin = (root2) => {
    const item2 = root2.ref.list.childViews[0].childViews[0];
    return item2 ? {
      top: item2.rect.element.marginTop,
      bottom: item2.rect.element.marginBottom
    } : {
      top: 0,
      bottom: 0
    };
  };
  const calculateListHeight = (root2) => {
    let visual = 0;
    let bounds = 0;
    const scrollList = root2.ref.list;
    const itemList = scrollList.childViews[0];
    const visibleChildren = itemList.childViews.filter((child) => child.rect.element.height);
    const children = root2.query("GET_ACTIVE_ITEMS").map((item2) => visibleChildren.find((child) => child.id === item2.id)).filter((item2) => item2);
    if (children.length === 0) return { visual, bounds };
    const horizontalSpace = itemList.rect.element.width;
    const dragIndex = getItemIndexByPosition(itemList, children, scrollList.dragCoordinates);
    const childRect = children[0].rect.element;
    const itemVerticalMargin = childRect.marginTop + childRect.marginBottom;
    const itemHorizontalMargin = childRect.marginLeft + childRect.marginRight;
    const itemWidth = childRect.width + itemHorizontalMargin;
    const itemHeight = childRect.height + itemVerticalMargin;
    const newItem = typeof dragIndex !== "undefined" && dragIndex >= 0 ? 1 : 0;
    const removedItem = children.find((child) => child.markedForRemoval && child.opacity < 0.45) ? -1 : 0;
    const verticalItemCount = children.length + newItem + removedItem;
    const itemsPerRow = getItemsPerRow(horizontalSpace, itemWidth);
    if (itemsPerRow === 1) {
      children.forEach((item2) => {
        const height = item2.rect.element.height + itemVerticalMargin;
        bounds += height;
        visual += height * item2.opacity;
      });
    } else {
      bounds = Math.ceil(verticalItemCount / itemsPerRow) * itemHeight;
      visual = bounds;
    }
    return { visual, bounds };
  };
  const calculateRootBoundingBoxHeight = (root2) => {
    const height = root2.ref.measureHeight || null;
    const cappedHeight = parseInt(root2.style.maxHeight, 10) || null;
    const fixedHeight = height === 0 ? null : height;
    return {
      cappedHeight,
      fixedHeight
    };
  };
  const exceedsMaxFiles = (root2, items) => {
    const allowReplace = root2.query("GET_ALLOW_REPLACE");
    const allowMultiple = root2.query("GET_ALLOW_MULTIPLE");
    const totalItems = root2.query("GET_TOTAL_ITEMS");
    let maxItems = root2.query("GET_MAX_FILES");
    const totalBrowseItems = items.length;
    if (!allowMultiple && totalBrowseItems > 1) {
      root2.dispatch("DID_THROW_MAX_FILES", {
        source: items,
        error: createResponse("warning", 0, "Max files")
      });
      return true;
    }
    maxItems = allowMultiple ? maxItems : 1;
    if (!allowMultiple && allowReplace) {
      return false;
    }
    const hasMaxItems = isInt(maxItems);
    if (hasMaxItems && totalItems + totalBrowseItems > maxItems) {
      root2.dispatch("DID_THROW_MAX_FILES", {
        source: items,
        error: createResponse("warning", 0, "Max files")
      });
      return true;
    }
    return false;
  };
  const getDragIndex = (list2, children, position) => {
    const itemList = list2.childViews[0];
    return getItemIndexByPosition(itemList, children, {
      left: position.scopeLeft - itemList.rect.element.left,
      top: position.scopeTop - (list2.rect.outer.top + list2.rect.element.marginTop + list2.rect.element.scrollTop)
    });
  };
  const toggleDrop = (root2) => {
    const isAllowed = root2.query("GET_ALLOW_DROP");
    const isDisabled = root2.query("GET_DISABLED");
    const enabled = isAllowed && !isDisabled;
    if (enabled && !root2.ref.hopper) {
      const hopper = createHopper(
        root2.element,
        (items) => {
          const beforeDropFile = root2.query("GET_BEFORE_DROP_FILE") || (() => true);
          const dropValidation = root2.query("GET_DROP_VALIDATION");
          return dropValidation ? items.every(
            (item2) => applyFilters("ALLOW_HOPPER_ITEM", item2, {
              query: root2.query
            }).every((result) => result === true) && beforeDropFile(item2)
          ) : true;
        },
        {
          filterItems: (items) => {
            const ignoredFiles = root2.query("GET_IGNORED_FILES");
            return items.filter((item2) => {
              if (isFile$1(item2)) {
                return !ignoredFiles.includes(item2.name.toLowerCase());
              }
              return true;
            });
          },
          catchesDropsOnPage: root2.query("GET_DROP_ON_PAGE"),
          requiresDropOnElement: root2.query("GET_DROP_ON_ELEMENT")
        }
      );
      hopper.onload = (items, position) => {
        const list2 = root2.ref.list.childViews[0];
        const visibleChildren = list2.childViews.filter((child) => child.rect.element.height);
        const children = root2.query("GET_ACTIVE_ITEMS").map((item2) => visibleChildren.find((child) => child.id === item2.id)).filter((item2) => item2);
        applyFilterChain("ADD_ITEMS", items, { dispatch: root2.dispatch }).then((queue2) => {
          if (exceedsMaxFiles(root2, queue2)) return false;
          root2.dispatch("ADD_ITEMS", {
            items: queue2,
            index: getDragIndex(root2.ref.list, children, position),
            interactionMethod: InteractionMethod.DROP
          });
        });
        root2.dispatch("DID_DROP", { position });
        root2.dispatch("DID_END_DRAG", { position });
      };
      hopper.ondragstart = (position) => {
        root2.dispatch("DID_START_DRAG", { position });
      };
      hopper.ondrag = debounce((position) => {
        root2.dispatch("DID_DRAG", { position });
      });
      hopper.ondragend = (position) => {
        root2.dispatch("DID_END_DRAG", { position });
      };
      root2.ref.hopper = hopper;
      root2.ref.drip = root2.appendChildView(root2.createChildView(drip));
    } else if (!enabled && root2.ref.hopper) {
      root2.ref.hopper.destroy();
      root2.ref.hopper = null;
      root2.removeChildView(root2.ref.drip);
    }
  };
  const toggleBrowse = (root2, props2) => {
    const isAllowed = root2.query("GET_ALLOW_BROWSE");
    const isDisabled = root2.query("GET_DISABLED");
    const enabled = isAllowed && !isDisabled;
    if (enabled && !root2.ref.browser) {
      root2.ref.browser = root2.appendChildView(
        root2.createChildView(browser, {
          ...props2,
          onload: (items) => {
            applyFilterChain("ADD_ITEMS", items, {
              dispatch: root2.dispatch
            }).then((queue2) => {
              if (exceedsMaxFiles(root2, queue2)) return false;
              root2.dispatch("ADD_ITEMS", {
                items: queue2,
                index: -1,
                interactionMethod: InteractionMethod.BROWSE
              });
            });
          }
        }),
        0
      );
    } else if (!enabled && root2.ref.browser) {
      root2.removeChildView(root2.ref.browser);
      root2.ref.browser = null;
    }
  };
  const togglePaste = (root2) => {
    const isAllowed = root2.query("GET_ALLOW_PASTE");
    const isDisabled = root2.query("GET_DISABLED");
    const enabled = isAllowed && !isDisabled;
    if (enabled && !root2.ref.paster) {
      root2.ref.paster = createPaster();
      root2.ref.paster.onload = (items) => {
        applyFilterChain("ADD_ITEMS", items, { dispatch: root2.dispatch }).then((queue2) => {
          if (exceedsMaxFiles(root2, queue2)) return false;
          root2.dispatch("ADD_ITEMS", {
            items: queue2,
            index: -1,
            interactionMethod: InteractionMethod.PASTE
          });
        });
      };
    } else if (!enabled && root2.ref.paster) {
      root2.ref.paster.destroy();
      root2.ref.paster = null;
    }
  };
  const route$5 = createRoute({
    DID_SET_ALLOW_BROWSE: ({ root: root2, props: props2 }) => {
      toggleBrowse(root2, props2);
    },
    DID_SET_ALLOW_DROP: ({ root: root2 }) => {
      toggleDrop(root2);
    },
    DID_SET_ALLOW_PASTE: ({ root: root2 }) => {
      togglePaste(root2);
    },
    DID_SET_DISABLED: ({ root: root2, props: props2 }) => {
      toggleDrop(root2);
      togglePaste(root2);
      toggleBrowse(root2, props2);
      const isDisabled = root2.query("GET_DISABLED");
      if (isDisabled) {
        root2.element.dataset.disabled = "disabled";
      } else {
        root2.element.removeAttribute("data-disabled");
      }
    }
  });
  const root = createView({
    name: "root",
    read: ({ root: root2 }) => {
      if (root2.ref.measure) {
        root2.ref.measureHeight = root2.ref.measure.offsetHeight;
      }
    },
    create: create$e,
    write: write$9,
    destroy: ({ root: root2 }) => {
      if (root2.ref.paster) {
        root2.ref.paster.destroy();
      }
      if (root2.ref.hopper) {
        root2.ref.hopper.destroy();
      }
      root2.element.removeEventListener("touchmove", prevent);
      root2.element.removeEventListener("gesturestart", prevent);
    },
    mixins: {
      styles: ["height"]
    }
  });
  const createApp = (initialOptions = {}) => {
    let originalElement = null;
    const defaultOptions2 = getOptions();
    const store = createStore(
      // initial state (should be serializable)
      createInitialState(defaultOptions2),
      // queries
      [queries, createOptionQueries(defaultOptions2)],
      // action handlers
      [actions, createOptionActions(defaultOptions2)]
    );
    store.dispatch("SET_OPTIONS", { options: initialOptions });
    const visibilityHandler = () => {
      if (document.hidden) return;
      store.dispatch("KICK");
    };
    document.addEventListener("visibilitychange", visibilityHandler);
    let resizeDoneTimer = null;
    let isResizing = false;
    let isResizingHorizontally = false;
    let initialWindowWidth = null;
    let currentWindowWidth = null;
    const resizeHandler = () => {
      if (!isResizing) {
        isResizing = true;
      }
      clearTimeout(resizeDoneTimer);
      resizeDoneTimer = setTimeout(() => {
        isResizing = false;
        initialWindowWidth = null;
        currentWindowWidth = null;
        if (isResizingHorizontally) {
          isResizingHorizontally = false;
          store.dispatch("DID_STOP_RESIZE");
        }
      }, 500);
    };
    window.addEventListener("resize", resizeHandler);
    const view = root(store, { id: getUniqueId() });
    let isResting = false;
    let isHidden = false;
    const readWriteApi = {
      // necessary for update loop
      /**
       * Reads from dom (never call manually)
       * @private
       */
      _read: () => {
        if (isResizing) {
          currentWindowWidth = window.innerWidth;
          if (!initialWindowWidth) {
            initialWindowWidth = currentWindowWidth;
          }
          if (!isResizingHorizontally && currentWindowWidth !== initialWindowWidth) {
            store.dispatch("DID_START_RESIZE");
            isResizingHorizontally = true;
          }
        }
        if (isHidden && isResting) {
          isResting = view.element.offsetParent === null;
        }
        if (isResting) return;
        view._read();
        isHidden = view.rect.element.hidden;
      },
      /**
       * Writes to dom (never call manually)
       * @private
       */
      _write: (ts) => {
        const actions2 = store.processActionQueue().filter((action) => !/^SET_/.test(action.type));
        if (isResting && !actions2.length) return;
        routeActionsToEvents(actions2);
        isResting = view._write(ts, actions2, isResizingHorizontally);
        removeReleasedItems(store.query("GET_ITEMS"));
        if (isResting) {
          store.processDispatchQueue();
        }
      }
    };
    const createEvent = (name2) => (data2) => {
      const event = {
        type: name2
      };
      if (!data2) {
        return event;
      }
      if (data2.hasOwnProperty("error")) {
        event.error = data2.error ? { ...data2.error } : null;
      }
      if (data2.status) {
        event.status = { ...data2.status };
      }
      if (data2.file) {
        event.output = data2.file;
      }
      if (data2.source) {
        event.file = data2.source;
      } else if (data2.item || data2.id) {
        const item2 = data2.item ? data2.item : store.query("GET_ITEM", data2.id);
        event.file = item2 ? createItemAPI(item2) : null;
      }
      if (data2.items) {
        event.items = data2.items.map(createItemAPI);
      }
      if (/progress/.test(name2)) {
        event.progress = data2.progress;
      }
      if (data2.hasOwnProperty("origin") && data2.hasOwnProperty("target")) {
        event.origin = data2.origin;
        event.target = data2.target;
      }
      return event;
    };
    const eventRoutes = {
      DID_DESTROY: createEvent("destroy"),
      DID_INIT: createEvent("init"),
      DID_THROW_MAX_FILES: createEvent("warning"),
      DID_INIT_ITEM: createEvent("initfile"),
      DID_START_ITEM_LOAD: createEvent("addfilestart"),
      DID_UPDATE_ITEM_LOAD_PROGRESS: createEvent("addfileprogress"),
      DID_LOAD_ITEM: createEvent("addfile"),
      DID_THROW_ITEM_INVALID: [createEvent("error"), createEvent("addfile")],
      DID_THROW_ITEM_LOAD_ERROR: [createEvent("error"), createEvent("addfile")],
      DID_THROW_ITEM_REMOVE_ERROR: [createEvent("error"), createEvent("removefile")],
      DID_PREPARE_OUTPUT: createEvent("preparefile"),
      DID_START_ITEM_PROCESSING: createEvent("processfilestart"),
      DID_UPDATE_ITEM_PROCESS_PROGRESS: createEvent("processfileprogress"),
      DID_ABORT_ITEM_PROCESSING: createEvent("processfileabort"),
      DID_COMPLETE_ITEM_PROCESSING: createEvent("processfile"),
      DID_COMPLETE_ITEM_PROCESSING_ALL: createEvent("processfiles"),
      DID_REVERT_ITEM_PROCESSING: createEvent("processfilerevert"),
      DID_THROW_ITEM_PROCESSING_ERROR: [createEvent("error"), createEvent("processfile")],
      DID_REMOVE_ITEM: createEvent("removefile"),
      DID_UPDATE_ITEMS: createEvent("updatefiles"),
      DID_ACTIVATE_ITEM: createEvent("activatefile"),
      DID_REORDER_ITEMS: createEvent("reorderfiles")
    };
    const exposeEvent = (event) => {
      const detail = { pond: exports$1, ...event };
      delete detail.type;
      view.element.dispatchEvent(
        new CustomEvent(`FilePond:${event.type}`, {
          // event info
          detail,
          // event behaviour
          bubbles: true,
          cancelable: true,
          composed: true
          // triggers listeners outside of shadow root
        })
      );
      const params = [];
      if (event.hasOwnProperty("error")) {
        params.push(event.error);
      }
      if (event.hasOwnProperty("file")) {
        params.push(event.file);
      }
      const filtered = ["type", "error", "file"];
      Object.keys(event).filter((key) => !filtered.includes(key)).forEach((key) => params.push(event[key]));
      exports$1.fire(event.type, ...params);
      const handler = store.query(`GET_ON${event.type.toUpperCase()}`);
      if (handler) {
        handler(...params);
      }
    };
    const routeActionsToEvents = (actions2) => {
      if (!actions2.length) return;
      actions2.filter((action) => eventRoutes[action.type]).forEach((action) => {
        const routes = eventRoutes[action.type];
        (Array.isArray(routes) ? routes : [routes]).forEach((route2) => {
          if (action.type === "DID_INIT_ITEM") {
            exposeEvent(route2(action.data));
          } else {
            setTimeout(() => {
              exposeEvent(route2(action.data));
            }, 0);
          }
        });
      });
    };
    const setOptions2 = (options) => store.dispatch("SET_OPTIONS", { options });
    const getFile = (query) => store.query("GET_ACTIVE_ITEM", query);
    const prepareFile = (query) => new Promise((resolve2, reject) => {
      store.dispatch("REQUEST_ITEM_PREPARE", {
        query,
        success: (item2) => {
          resolve2(item2);
        },
        failure: (error2) => {
          reject(error2);
        }
      });
    });
    const addFile = (source, options = {}) => new Promise((resolve2, reject) => {
      addFiles([{ source, options }], { index: options.index }).then((items) => resolve2(items && items[0])).catch(reject);
    });
    const isFilePondFile = (obj) => obj.file && obj.id;
    const removeFile = (query, options) => {
      if (typeof query === "object" && !isFilePondFile(query) && !options) {
        options = query;
        query = void 0;
      }
      store.dispatch("REMOVE_ITEM", { ...options, query });
      return store.query("GET_ACTIVE_ITEM", query) === null;
    };
    const addFiles = (...args) => new Promise((resolve2, reject) => {
      const sources = [];
      const options = {};
      if (isArray$1(args[0])) {
        sources.push.apply(sources, args[0]);
        Object.assign(options, args[1] || {});
      } else {
        const lastArgument = args[args.length - 1];
        if (typeof lastArgument === "object" && !(lastArgument instanceof Blob)) {
          Object.assign(options, args.pop());
        }
        sources.push(...args);
      }
      store.dispatch("ADD_ITEMS", {
        items: sources,
        index: options.index,
        interactionMethod: InteractionMethod.API,
        success: resolve2,
        failure: reject
      });
    });
    const getFiles2 = () => store.query("GET_ACTIVE_ITEMS");
    const processFile = (query) => new Promise((resolve2, reject) => {
      store.dispatch("REQUEST_ITEM_PROCESSING", {
        query,
        success: (item2) => {
          resolve2(item2);
        },
        failure: (error2) => {
          reject(error2);
        }
      });
    });
    const prepareFiles = (...args) => {
      const queries2 = Array.isArray(args[0]) ? args[0] : args;
      const items = queries2.length ? queries2 : getFiles2();
      return Promise.all(items.map(prepareFile));
    };
    const processFiles = (...args) => {
      const queries2 = Array.isArray(args[0]) ? args[0] : args;
      if (!queries2.length) {
        const files = getFiles2().filter(
          (item2) => !(item2.status === ItemStatus.IDLE && item2.origin === FileOrigin.LOCAL) && item2.status !== ItemStatus.PROCESSING && item2.status !== ItemStatus.PROCESSING_COMPLETE && item2.status !== ItemStatus.PROCESSING_REVERT_ERROR
        );
        return Promise.all(files.map(processFile));
      }
      return Promise.all(queries2.map(processFile));
    };
    const removeFiles = (...args) => {
      const queries2 = Array.isArray(args[0]) ? args[0] : args;
      let options;
      if (typeof queries2[queries2.length - 1] === "object") {
        options = queries2.pop();
      } else if (Array.isArray(args[0])) {
        options = args[1];
      }
      const files = getFiles2();
      if (!queries2.length) return Promise.all(files.map((file2) => removeFile(file2, options)));
      const mappedQueries = queries2.map((query) => isNumber$1(query) ? files[query] ? files[query].id : null : query).filter((query) => query);
      return mappedQueries.map((q) => removeFile(q, options));
    };
    const exports$1 = {
      // supports events
      ...on(),
      // inject private api methods
      ...readWriteApi,
      // inject all getters and setters
      ...createOptionAPI(store, defaultOptions2),
      /**
       * Override options defined in options object
       * @param options
       */
      setOptions: setOptions2,
      /**
       * Load the given file
       * @param source - the source of the file (either a File, base64 data uri or url)
       * @param options - object, { index: 0 }
       */
      addFile,
      /**
       * Load the given files
       * @param sources - the sources of the files to load
       * @param options - object, { index: 0 }
       */
      addFiles,
      /**
       * Returns the file objects matching the given query
       * @param query { string, number, null }
       */
      getFile,
      /**
       * Upload file with given name
       * @param query { string, number, null  }
       */
      processFile,
      /**
       * Request prepare output for file with given name
       * @param query { string, number, null  }
       */
      prepareFile,
      /**
       * Removes a file by its name
       * @param query { string, number, null  }
       */
      removeFile,
      /**
       * Moves a file to a new location in the files list
       */
      moveFile: (query, index) => store.dispatch("MOVE_ITEM", { query, index }),
      /**
       * Returns all files (wrapped in public api)
       */
      getFiles: getFiles2,
      /**
       * Starts uploading all files
       */
      processFiles,
      /**
       * Clears all files from the files list
       */
      removeFiles,
      /**
       * Starts preparing output of all files
       */
      prepareFiles,
      /**
       * Sort list of files
       */
      sort: (compare) => store.dispatch("SORT", { compare }),
      /**
       * Browse the file system for a file
       */
      browse: () => {
        var input = view.element.querySelector("input[type=file]");
        if (input) {
          input.click();
        }
      },
      /**
       * Destroys the app
       */
      destroy: () => {
        exports$1.fire("destroy", view.element);
        store.dispatch("ABORT_ALL");
        view._destroy();
        window.removeEventListener("resize", resizeHandler);
        document.removeEventListener("visibilitychange", visibilityHandler);
        store.dispatch("DID_DESTROY");
      },
      /**
       * Inserts the plugin before the target element
       */
      insertBefore: (element) => insertBefore(view.element, element),
      /**
       * Inserts the plugin after the target element
       */
      insertAfter: (element) => insertAfter(view.element, element),
      /**
       * Appends the plugin to the target element
       */
      appendTo: (element) => element.appendChild(view.element),
      /**
       * Replaces an element with the app
       */
      replaceElement: (element) => {
        insertBefore(view.element, element);
        element.parentNode.removeChild(element);
        originalElement = element;
      },
      /**
       * Restores the original element
       */
      restoreElement: () => {
        if (!originalElement) {
          return;
        }
        insertAfter(originalElement, view.element);
        view.element.parentNode.removeChild(view.element);
        originalElement = null;
      },
      /**
       * Returns true if the app root is attached to given element
       * @param element
       */
      isAttachedTo: (element) => view.element === element || originalElement === element,
      /**
       * Returns the root element
       */
      element: {
        get: () => view.element
      },
      /**
       * Returns the current pond status
       */
      status: {
        get: () => store.query("GET_STATUS")
      }
    };
    store.dispatch("DID_INIT");
    return createObject(exports$1);
  };
  const createAppObject = (customOptions = {}) => {
    const defaultOptions2 = {};
    forin(getOptions(), (key, value) => {
      defaultOptions2[key] = value[0];
    });
    const app = createApp({
      // default options
      ...defaultOptions2,
      // custom options
      ...customOptions
    });
    return app;
  };
  const lowerCaseFirstLetter = (string) => string.charAt(0).toLowerCase() + string.slice(1);
  const attributeNameToPropertyName = (attributeName) => toCamels(attributeName.replace(/^data-/, ""));
  const mapObject = (object, propertyMap) => {
    forin(propertyMap, (selector, mapping) => {
      forin(object, (property, value) => {
        const selectorRegExp = new RegExp(selector);
        const matches = selectorRegExp.test(property);
        if (!matches) {
          return;
        }
        delete object[property];
        if (mapping === false) {
          return;
        }
        if (isString$1(mapping)) {
          object[mapping] = value;
          return;
        }
        const group = mapping.group;
        if (isObject$1(mapping) && !object[group]) {
          object[group] = {};
        }
        object[group][lowerCaseFirstLetter(property.replace(selectorRegExp, ""))] = value;
      });
      if (mapping.mapping) {
        mapObject(object[mapping.group], mapping.mapping);
      }
    });
  };
  const getAttributesAsObject = (node, attributeMapping = {}) => {
    const attributes = [];
    forin(node.attributes, (index) => {
      attributes.push(node.attributes[index]);
    });
    const output = attributes.filter((attribute) => attribute.name).reduce((obj, attribute) => {
      const value = attr(node, attribute.name);
      obj[attributeNameToPropertyName(attribute.name)] = value === attribute.name ? true : value;
      return obj;
    }, {});
    mapObject(output, attributeMapping);
    return output;
  };
  const createAppAtElement = (element, options = {}) => {
    const attributeMapping = {
      // translate to other name
      "^class$": "className",
      "^multiple$": "allowMultiple",
      "^capture$": "captureMethod",
      "^webkitdirectory$": "allowDirectoriesOnly",
      // group under single property
      "^server": {
        group: "server",
        mapping: {
          "^process": {
            group: "process"
          },
          "^revert": {
            group: "revert"
          },
          "^fetch": {
            group: "fetch"
          },
          "^restore": {
            group: "restore"
          },
          "^load": {
            group: "load"
          }
        }
      },
      // don't include in object
      "^type$": false,
      "^files$": false
    };
    applyFilters("SET_ATTRIBUTE_TO_OPTION_MAP", attributeMapping);
    const mergedOptions = {
      ...options
    };
    const attributeOptions = getAttributesAsObject(
      element.nodeName === "FIELDSET" ? element.querySelector("input[type=file]") : element,
      attributeMapping
    );
    Object.keys(attributeOptions).forEach((key) => {
      if (isObject$1(attributeOptions[key])) {
        if (!isObject$1(mergedOptions[key])) {
          mergedOptions[key] = {};
        }
        Object.assign(mergedOptions[key], attributeOptions[key]);
      } else {
        mergedOptions[key] = attributeOptions[key];
      }
    });
    mergedOptions.files = (options.files || []).concat(
      Array.from(element.querySelectorAll("input:not([type=file])")).map((input) => ({
        source: input.value,
        options: {
          type: input.dataset.type
        }
      }))
    );
    const app = createAppObject(mergedOptions);
    if (element.files) {
      Array.from(element.files).forEach((file2) => {
        app.addFile(file2);
      });
    }
    app.replaceElement(element);
    return app;
  };
  const createApp$1 = (...args) => isNode(args[0]) ? createAppAtElement(...args) : createAppObject(...args);
  const PRIVATE_METHODS = ["fire", "_read", "_write"];
  const createAppAPI = (app) => {
    const api2 = {};
    copyObjectPropertiesToObject(app, api2, PRIVATE_METHODS);
    return api2;
  };
  const replaceInString = (string, replacements) => string.replace(/(?:{([a-zA-Z]+)})/g, (match, group) => replacements[group]);
  const createWorker = (fn2) => {
    const workerBlob = new Blob(["(", fn2.toString(), ")()"], {
      type: "application/javascript"
    });
    const workerURL = URL.createObjectURL(workerBlob);
    const worker = new Worker(workerURL);
    return {
      transfer: (message, cb) => {
      },
      post: (message, cb, transferList) => {
        const id = getUniqueId();
        worker.onmessage = (e) => {
          if (e.data.id === id) {
            cb(e.data.message);
          }
        };
        worker.postMessage(
          {
            id,
            message
          },
          transferList
        );
      },
      terminate: () => {
        worker.terminate();
        URL.revokeObjectURL(workerURL);
      }
    };
  };
  const loadImage = (url) => new Promise((resolve2, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve2(img);
    };
    img.onerror = (e) => {
      reject(e);
    };
    img.src = url;
  });
  const renameFile = (file2, name2) => {
    const renamedFile = file2.slice(0, file2.size, file2.type);
    renamedFile.lastModifiedDate = file2.lastModifiedDate;
    renamedFile.name = name2;
    return renamedFile;
  };
  const copyFile = (file2) => renameFile(file2, file2.name);
  const registeredPlugins = [];
  const createAppPlugin = (plugin2) => {
    if (registeredPlugins.includes(plugin2)) {
      return;
    }
    registeredPlugins.push(plugin2);
    const pluginOutline = plugin2({
      addFilter,
      utils: {
        Type,
        forin,
        isString: isString$1,
        isFile: isFile$1,
        toNaturalFileSize,
        replaceInString,
        getExtensionFromFilename,
        getFilenameWithoutExtension,
        guesstimateMimeType,
        getFileFromBlob,
        getFilenameFromURL,
        createRoute,
        createWorker,
        createView,
        createItemAPI,
        loadImage,
        copyFile,
        renameFile,
        createBlob,
        applyFilterChain,
        text,
        getNumericAspectRatioFromString
      },
      views: {
        fileActionButton
      }
    });
    extendDefaultOptions(pluginOutline.options);
  };
  const isOperaMini = () => Object.prototype.toString.call(window.operamini) === "[object OperaMini]";
  const hasPromises = () => "Promise" in window;
  const hasBlobSlice = () => "slice" in Blob.prototype;
  const hasCreateObjectURL = () => "URL" in window && "createObjectURL" in window.URL;
  const hasVisibility = () => "visibilityState" in document;
  const hasTiming = () => "performance" in window;
  const hasCSSSupports = () => "supports" in (window.CSS || {});
  const isIE11 = () => /MSIE|Trident/.test(window.navigator.userAgent);
  const supported = (() => {
    const isSupported2 = (
      // Has to be a browser
      isBrowser$2() && // Can't run on Opera Mini due to lack of everything
      !isOperaMini() && // Require these APIs to feature detect a modern browser
      hasVisibility() && hasPromises() && hasBlobSlice() && hasCreateObjectURL() && hasTiming() && // doesn't need CSSSupports but is a good way to detect Safari 9+ (we do want to support IE11 though)
      (hasCSSSupports() || isIE11())
    );
    return () => isSupported2;
  })();
  const state = {
    // active app instances, used to redraw the apps and to find the later
    apps: []
  };
  const name = "filepond";
  const fn = () => {
  };
  let OptionTypes = {};
  let create$f = fn;
  let destroy = fn;
  let parse$3 = fn;
  let find = fn;
  let registerPlugin = fn;
  let getOptions$1 = fn;
  let setOptions$1 = fn;
  if (supported()) {
    createPainter(
      () => {
        state.apps.forEach((app) => app._read());
      },
      (ts) => {
        state.apps.forEach((app) => app._write(ts));
      }
    );
    const dispatch = () => {
      document.dispatchEvent(
        new CustomEvent("FilePond:loaded", {
          detail: {
            supported,
            create: create$f,
            destroy,
            parse: parse$3,
            find,
            registerPlugin,
            setOptions: setOptions$1
          }
        })
      );
      document.removeEventListener("DOMContentLoaded", dispatch);
    };
    if (document.readyState !== "loading") {
      setTimeout(() => dispatch(), 0);
    } else {
      document.addEventListener("DOMContentLoaded", dispatch);
    }
    const updateOptionTypes = () => forin(getOptions(), (key, value) => {
      OptionTypes[key] = value[1];
    });
    OptionTypes = {};
    updateOptionTypes();
    create$f = (...args) => {
      const app = createApp$1(...args);
      app.on("destroy", destroy);
      state.apps.push(app);
      return createAppAPI(app);
    };
    destroy = (hook) => {
      const indexToRemove = state.apps.findIndex((app) => app.isAttachedTo(hook));
      if (indexToRemove >= 0) {
        const app = state.apps.splice(indexToRemove, 1)[0];
        app.restoreElement();
        return true;
      }
      return false;
    };
    parse$3 = (context) => {
      const matchedHooks = Array.from(context.querySelectorAll(`.${name}`));
      const newHooks = matchedHooks.filter(
        (newHook) => !state.apps.find((app) => app.isAttachedTo(newHook))
      );
      return newHooks.map((hook) => create$f(hook));
    };
    find = (hook) => {
      const app = state.apps.find((app2) => app2.isAttachedTo(hook));
      if (!app) {
        return null;
      }
      return createAppAPI(app);
    };
    registerPlugin = (...plugins2) => {
      plugins2.forEach(createAppPlugin);
      updateOptionTypes();
    };
    getOptions$1 = () => {
      const opts = {};
      forin(getOptions(), (key, value) => {
        opts[key] = value[0];
      });
      return opts;
    };
    setOptions$1 = (opts) => {
      if (isObject$1(opts)) {
        state.apps.forEach((app) => {
          app.setOptions(opts);
        });
        setOptions(opts);
      }
      return getOptions$1();
    };
  }
  /*!
   * vue-filepond v7.0.4
   * A handy FilePond adapter component for Vue
   * 
   * Copyright (c) 2023 PQINA
   * https://pqina.nl/filepond
   * 
   * Licensed under the MIT license.
   */
  const filteredComponentMethods = [
    "setOptions",
    "on",
    "off",
    "onOnce",
    "appendTo",
    "insertAfter",
    "insertBefore",
    "isAttachedTo",
    "replaceElement",
    "restoreElement",
    "destroy"
  ];
  const isSupported = supported();
  const getNativeConstructorFromType = (type2) => ({
    string: String,
    boolean: Boolean,
    array: Array,
    function: Function,
    int: Number,
    serverapi: Object,
    object: Object
  })[type2];
  const props = {};
  const events = [];
  const instances = [];
  let globalOptions = {};
  const vueFilePond = (...plugins2) => {
    registerPlugin(...plugins2);
    events.length = 0;
    for (const prop in OptionTypes) {
      if (/^on/.test(prop)) {
        events.push(prop);
        continue;
      }
      let valid_types = [String, getNativeConstructorFromType(OptionTypes[prop])];
      if (prop == "labelFileProcessingError") {
        valid_types.push(Function);
      }
      props[prop] = {
        type: valid_types,
        // set this default value so we know which props have been explicitely set by user on component
        default: void 0
      };
    }
    return {
      name: "FilePond",
      props,
      render() {
        const attributes = Object.entries({
          id: this.id,
          name: this.name,
          type: "file",
          class: this.className,
          required: this.required,
          multiple: this.allowMultiple,
          accept: this.acceptedFileTypes,
          capture: this.captureMethod
        }).reduce((attributes2, [key, value]) => {
          if (value !== void 0) attributes2[key] = value;
          return attributes2;
        }, {});
        return h(
          "div",
          {
            class: {
              "filepond--wrapper": true
            }
          },
          [h("input", attributes)]
        );
      },
      created() {
        this.watchers = Object.keys(props).map((key) => {
          return this.$watch(key, (next) => {
            if (!this._pond) return;
            this._pond[key] = next;
          });
        });
      },
      // Will setup FilePond instance when mounted
      mounted() {
        if (!isSupported) return;
        this._element = this.$el.querySelector("input");
        const options = events.reduce((obj, value) => {
          obj[value] = (...args) => {
            this.$emit("input", this._pond ? this._pond.getFiles() : []);
            this.$emit(value.substr(2), ...args);
          };
          return obj;
        }, {});
        const passedProps = {};
        Object.keys(props).forEach((key) => {
          if (this[key] === void 0) return;
          passedProps[key] = this[key];
        });
        this._pond = create$f(
          this._element,
          Object.assign({}, globalOptions, options, passedProps)
        );
        Object.keys(this._pond).filter((key) => !filteredComponentMethods.includes(key)).forEach((key) => {
          this[key] = this._pond[key];
        });
        instances.push(this._pond);
      },
      // Will clean up FilePond instance when unmounted
      beforeUnmount() {
        const { detached } = this.$options;
        if (!this.$el.offsetParent) {
          detached.call(this);
          return;
        }
        const mutationHandler = (mutations, observer2) => {
          const removedNodes = (mutations[0] || {}).removedNodes || [];
          const removedNode = removedNodes[0];
          if (!removedNode || !removedNode.contains(this.$el)) return;
          observer2.disconnect();
          detached.call(this);
        };
        const observer = new MutationObserver(mutationHandler);
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true
        });
      },
      // called when the component root node has been detached
      detached() {
        this.watchers.forEach((unwatch) => unwatch());
        if (!this._pond) return;
        this._pond.destroy();
        const index = instances.indexOf(this._pond);
        if (index >= 0) {
          instances.splice(index, 1);
        }
        this._pond = null;
      }
    };
  };
  /*!
   * FilePondPluginFileValidateType 1.2.9
   * Licensed under MIT, https://opensource.org/licenses/MIT/
   * Please visit https://pqina.nl/filepond/ for details.
   */
  const plugin$1 = ({ addFilter: addFilter2, utils: utils2 }) => {
    const {
      Type: Type2,
      isString: isString2,
      replaceInString: replaceInString2,
      guesstimateMimeType: guesstimateMimeType2,
      getExtensionFromFilename: getExtensionFromFilename2,
      getFilenameFromURL: getFilenameFromURL2
    } = utils2;
    const mimeTypeMatchesWildCard = (mimeType, wildcard) => {
      const mimeTypeGroup = (/^[^/]+/.exec(mimeType) || []).pop();
      const wildcardGroup = wildcard.slice(0, -2);
      return mimeTypeGroup === wildcardGroup;
    };
    const isValidMimeType = (acceptedTypes, userInputType) => acceptedTypes.some((acceptedType) => {
      if (/\*$/.test(acceptedType)) {
        return mimeTypeMatchesWildCard(userInputType, acceptedType);
      }
      return acceptedType === userInputType;
    });
    const getItemType = (item2) => {
      let type2 = "";
      if (isString2(item2)) {
        const filename = getFilenameFromURL2(item2);
        const extension = getExtensionFromFilename2(filename);
        if (extension) {
          type2 = guesstimateMimeType2(extension);
        }
      } else {
        type2 = item2.type;
      }
      return type2;
    };
    const validateFile = (item2, acceptedFileTypes, typeDetector) => {
      if (acceptedFileTypes.length === 0) {
        return true;
      }
      const type2 = getItemType(item2);
      if (!typeDetector) {
        return isValidMimeType(acceptedFileTypes, type2);
      }
      return new Promise((resolve2, reject) => {
        typeDetector(item2, type2).then((detectedType) => {
          if (isValidMimeType(acceptedFileTypes, detectedType)) {
            resolve2();
          } else {
            reject();
          }
        }).catch(reject);
      });
    };
    const applyMimeTypeMap = (map2) => (acceptedFileType) => map2[acceptedFileType] === null ? false : map2[acceptedFileType] || acceptedFileType;
    addFilter2(
      "SET_ATTRIBUTE_TO_OPTION_MAP",
      (map2) => Object.assign(map2, {
        accept: "acceptedFileTypes"
      })
    );
    addFilter2("ALLOW_HOPPER_ITEM", (file2, { query }) => {
      if (!query("GET_ALLOW_FILE_TYPE_VALIDATION")) {
        return true;
      }
      return validateFile(file2, query("GET_ACCEPTED_FILE_TYPES"));
    });
    addFilter2(
      "LOAD_FILE",
      (file2, { query }) => new Promise((resolve2, reject) => {
        if (!query("GET_ALLOW_FILE_TYPE_VALIDATION")) {
          resolve2(file2);
          return;
        }
        const acceptedFileTypes = query("GET_ACCEPTED_FILE_TYPES");
        const typeDetector = query("GET_FILE_VALIDATE_TYPE_DETECT_TYPE");
        const validationResult = validateFile(file2, acceptedFileTypes, typeDetector);
        const handleRejection = () => {
          const acceptedFileTypesMapped = acceptedFileTypes.map(
            applyMimeTypeMap(
              query("GET_FILE_VALIDATE_TYPE_LABEL_EXPECTED_TYPES_MAP")
            )
          ).filter((label) => label !== false);
          const acceptedFileTypesMappedUnique = acceptedFileTypesMapped.filter(
            (item2, index) => acceptedFileTypesMapped.indexOf(item2) === index
          );
          reject({
            status: {
              main: query("GET_LABEL_FILE_TYPE_NOT_ALLOWED"),
              sub: replaceInString2(
                query("GET_FILE_VALIDATE_TYPE_LABEL_EXPECTED_TYPES"),
                {
                  allTypes: acceptedFileTypesMappedUnique.join(", "),
                  allButLastType: acceptedFileTypesMappedUnique.slice(0, -1).join(", "),
                  lastType: acceptedFileTypesMappedUnique[acceptedFileTypesMappedUnique.length - 1]
                }
              )
            }
          });
        };
        if (typeof validationResult === "boolean") {
          if (!validationResult) {
            return handleRejection();
          }
          return resolve2(file2);
        }
        validationResult.then(() => {
          resolve2(file2);
        }).catch(handleRejection);
      })
    );
    return {
      // default options
      options: {
        // Enable or disable file type validation
        allowFileTypeValidation: [true, Type2.BOOLEAN],
        // What file types to accept
        acceptedFileTypes: [[], Type2.ARRAY],
        // - must be comma separated
        // - mime types: image/png, image/jpeg, image/gif
        // - extensions: .png, .jpg, .jpeg ( not enabled yet )
        // - wildcards: image/*
        // label to show when a type is not allowed
        labelFileTypeNotAllowed: ["File is of invalid type", Type2.STRING],
        // nicer label
        fileValidateTypeLabelExpectedTypes: [
          "Expects {allButLastType} or {lastType}",
          Type2.STRING
        ],
        // map mime types to extensions
        fileValidateTypeLabelExpectedTypesMap: [{}, Type2.OBJECT],
        // Custom function to detect type of file
        fileValidateTypeDetectType: [null, Type2.FUNCTION]
      }
    };
  };
  const isBrowser$1 = typeof window !== "undefined" && typeof window.document !== "undefined";
  if (isBrowser$1) {
    document.dispatchEvent(new CustomEvent("FilePond:pluginloaded", { detail: plugin$1 }));
  }
  /*!
   * FilePondPluginFileValidateSize 2.2.8
   * Licensed under MIT, https://opensource.org/licenses/MIT/
   * Please visit https://pqina.nl/filepond/ for details.
   */
  const plugin = ({ addFilter: addFilter2, utils: utils2 }) => {
    const { Type: Type2, replaceInString: replaceInString2, toNaturalFileSize: toNaturalFileSize2 } = utils2;
    addFilter2("ALLOW_HOPPER_ITEM", (file2, { query }) => {
      if (!query("GET_ALLOW_FILE_SIZE_VALIDATION")) {
        return true;
      }
      const sizeMax = query("GET_MAX_FILE_SIZE");
      if (sizeMax !== null && file2.size > sizeMax) {
        return false;
      }
      const sizeMin = query("GET_MIN_FILE_SIZE");
      if (sizeMin !== null && file2.size < sizeMin) {
        return false;
      }
      return true;
    });
    addFilter2(
      "LOAD_FILE",
      (file2, { query }) => new Promise((resolve2, reject) => {
        if (!query("GET_ALLOW_FILE_SIZE_VALIDATION")) {
          return resolve2(file2);
        }
        const fileFilter = query("GET_FILE_VALIDATE_SIZE_FILTER");
        if (fileFilter && !fileFilter(file2)) {
          return resolve2(file2);
        }
        const sizeMax = query("GET_MAX_FILE_SIZE");
        if (sizeMax !== null && file2.size > sizeMax) {
          reject({
            status: {
              main: query("GET_LABEL_MAX_FILE_SIZE_EXCEEDED"),
              sub: replaceInString2(query("GET_LABEL_MAX_FILE_SIZE"), {
                filesize: toNaturalFileSize2(
                  sizeMax,
                  ".",
                  query("GET_FILE_SIZE_BASE"),
                  query("GET_FILE_SIZE_LABELS", query)
                )
              })
            }
          });
          return;
        }
        const sizeMin = query("GET_MIN_FILE_SIZE");
        if (sizeMin !== null && file2.size < sizeMin) {
          reject({
            status: {
              main: query("GET_LABEL_MIN_FILE_SIZE_EXCEEDED"),
              sub: replaceInString2(query("GET_LABEL_MIN_FILE_SIZE"), {
                filesize: toNaturalFileSize2(
                  sizeMin,
                  ".",
                  query("GET_FILE_SIZE_BASE"),
                  query("GET_FILE_SIZE_LABELS", query)
                )
              })
            }
          });
          return;
        }
        const totalSizeMax = query("GET_MAX_TOTAL_FILE_SIZE");
        if (totalSizeMax !== null) {
          const currentTotalSize = query("GET_ACTIVE_ITEMS").reduce((total, item2) => {
            return total + item2.fileSize;
          }, 0);
          if (currentTotalSize > totalSizeMax) {
            reject({
              status: {
                main: query("GET_LABEL_MAX_TOTAL_FILE_SIZE_EXCEEDED"),
                sub: replaceInString2(query("GET_LABEL_MAX_TOTAL_FILE_SIZE"), {
                  filesize: toNaturalFileSize2(
                    totalSizeMax,
                    ".",
                    query("GET_FILE_SIZE_BASE"),
                    query("GET_FILE_SIZE_LABELS", query)
                  )
                })
              }
            });
            return;
          }
        }
        resolve2(file2);
      })
    );
    return {
      options: {
        // Enable or disable file type validation
        allowFileSizeValidation: [true, Type2.BOOLEAN],
        // Max individual file size in bytes
        maxFileSize: [null, Type2.INT],
        // Min individual file size in bytes
        minFileSize: [null, Type2.INT],
        // Max total file size in bytes
        maxTotalFileSize: [null, Type2.INT],
        // Filter the files that need to be validated for size
        fileValidateSizeFilter: [null, Type2.FUNCTION],
        // error labels
        labelMinFileSizeExceeded: ["File is too small", Type2.STRING],
        labelMinFileSize: ["Minimum file size is {filesize}", Type2.STRING],
        labelMaxFileSizeExceeded: ["File is too large", Type2.STRING],
        labelMaxFileSize: ["Maximum file size is {filesize}", Type2.STRING],
        labelMaxTotalFileSizeExceeded: ["Maximum total size exceeded", Type2.STRING],
        labelMaxTotalFileSize: ["Maximum total file size is {filesize}", Type2.STRING]
      }
    };
  };
  const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
  if (isBrowser) {
    document.dispatchEvent(new CustomEvent("FilePond:pluginloaded", { detail: plugin }));
  }
  function bind(fn2, thisArg) {
    return function wrap() {
      return fn2.apply(thisArg, arguments);
    };
  }
  const { toString } = Object.prototype;
  const { getPrototypeOf } = Object;
  const { iterator, toStringTag } = Symbol;
  const kindOf = /* @__PURE__ */ ((cache) => (thing) => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  })(/* @__PURE__ */ Object.create(null));
  const kindOfTest = (type2) => {
    type2 = type2.toLowerCase();
    return (thing) => kindOf(thing) === type2;
  };
  const typeOfTest = (type2) => (thing) => typeof thing === type2;
  const { isArray } = Array;
  const isUndefined = typeOfTest("undefined");
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction$1(val.constructor.isBuffer) && val.constructor.isBuffer(val);
  }
  const isArrayBuffer = kindOfTest("ArrayBuffer");
  function isArrayBufferView(val) {
    let result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result;
  }
  const isString = typeOfTest("string");
  const isFunction$1 = typeOfTest("function");
  const isNumber = typeOfTest("number");
  const isObject = (thing) => thing !== null && typeof thing === "object";
  const isBoolean = (thing) => thing === true || thing === false;
  const isPlainObject = (val) => {
    if (kindOf(val) !== "object") {
      return false;
    }
    const prototype2 = getPrototypeOf(val);
    return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(toStringTag in val) && !(iterator in val);
  };
  const isEmptyObject = (val) => {
    if (!isObject(val) || isBuffer(val)) {
      return false;
    }
    try {
      return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
    } catch (e) {
      return false;
    }
  };
  const isDate = kindOfTest("Date");
  const isFile = kindOfTest("File");
  const isBlob = kindOfTest("Blob");
  const isFileList = kindOfTest("FileList");
  const isStream = (val) => isObject(val) && isFunction$1(val.pipe);
  const isFormData = (thing) => {
    let kind;
    return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction$1(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
    kind === "object" && isFunction$1(thing.toString) && thing.toString() === "[object FormData]"));
  };
  const isURLSearchParams = kindOfTest("URLSearchParams");
  const [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
  const trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  function forEach(obj, fn2, { allOwnKeys = false } = {}) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    let i;
    let l;
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (i = 0, l = obj.length; i < l; i++) {
        fn2.call(null, obj[i], i, obj);
      }
    } else {
      if (isBuffer(obj)) {
        return;
      }
      const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
      const len = keys.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys[i];
        fn2.call(null, obj[key], key, obj);
      }
    }
  }
  function findKey(obj, key) {
    if (isBuffer(obj)) {
      return null;
    }
    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i = keys.length;
    let _key;
    while (i-- > 0) {
      _key = keys[i];
      if (key === _key.toLowerCase()) {
        return _key;
      }
    }
    return null;
  }
  const _global = (() => {
    if (typeof globalThis !== "undefined") return globalThis;
    return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
  })();
  const isContextDefined = (context) => !isUndefined(context) && context !== _global;
  function merge() {
    const { caseless, skipUndefined } = isContextDefined(this) && this || {};
    const result = {};
    const assignValue = (val, key) => {
      const targetKey = caseless && findKey(result, key) || key;
      if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
        result[targetKey] = merge(result[targetKey], val);
      } else if (isPlainObject(val)) {
        result[targetKey] = merge({}, val);
      } else if (isArray(val)) {
        result[targetKey] = val.slice();
      } else if (!skipUndefined || !isUndefined(val)) {
        result[targetKey] = val;
      }
    };
    for (let i = 0, l = arguments.length; i < l; i++) {
      arguments[i] && forEach(arguments[i], assignValue);
    }
    return result;
  }
  const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
    forEach(b, (val, key) => {
      if (thisArg && isFunction$1(val)) {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    }, { allOwnKeys });
    return a;
  };
  const stripBOM = (content) => {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  };
  const inherits = (constructor, superConstructor, props2, descriptors2) => {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, "super", {
      value: superConstructor.prototype
    });
    props2 && Object.assign(constructor.prototype, props2);
  };
  const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
    let props2;
    let i;
    let prop;
    const merged = {};
    destObj = destObj || {};
    if (sourceObj == null) return destObj;
    do {
      props2 = Object.getOwnPropertyNames(sourceObj);
      i = props2.length;
      while (i-- > 0) {
        prop = props2[i];
        if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = filter !== false && getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
  };
  const endsWith = (str, searchString, position) => {
    str = String(str);
    if (position === void 0 || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
  const toArray$1 = (thing) => {
    if (!thing) return null;
    if (isArray(thing)) return thing;
    let i = thing.length;
    if (!isNumber(i)) return null;
    const arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  };
  const isTypedArray = /* @__PURE__ */ ((TypedArray) => {
    return (thing) => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
  const forEachEntry = (obj, fn2) => {
    const generator = obj && obj[iterator];
    const _iterator = generator.call(obj);
    let result;
    while ((result = _iterator.next()) && !result.done) {
      const pair = result.value;
      fn2.call(obj, pair[0], pair[1]);
    }
  };
  const matchAll = (regExp, str) => {
    let matches;
    const arr = [];
    while ((matches = regExp.exec(str)) !== null) {
      arr.push(matches);
    }
    return arr;
  };
  const isHTMLForm = kindOfTest("HTMLFormElement");
  const toCamelCase = (str) => {
    return str.toLowerCase().replace(
      /[-_\s]([a-z\d])(\w*)/g,
      function replacer2(m, p1, p2) {
        return p1.toUpperCase() + p2;
      }
    );
  };
  const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
  const isRegExp = kindOfTest("RegExp");
  const reduceDescriptors = (obj, reducer) => {
    const descriptors2 = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};
    forEach(descriptors2, (descriptor, name2) => {
      let ret;
      if ((ret = reducer(descriptor, name2, obj)) !== false) {
        reducedDescriptors[name2] = ret || descriptor;
      }
    });
    Object.defineProperties(obj, reducedDescriptors);
  };
  const freezeMethods = (obj) => {
    reduceDescriptors(obj, (descriptor, name2) => {
      if (isFunction$1(obj) && ["arguments", "caller", "callee"].indexOf(name2) !== -1) {
        return false;
      }
      const value = obj[name2];
      if (!isFunction$1(value)) return;
      descriptor.enumerable = false;
      if ("writable" in descriptor) {
        descriptor.writable = false;
        return;
      }
      if (!descriptor.set) {
        descriptor.set = () => {
          throw Error("Can not rewrite read-only method '" + name2 + "'");
        };
      }
    });
  };
  const toObjectSet = (arrayOrString, delimiter) => {
    const obj = {};
    const define = (arr) => {
      arr.forEach((value) => {
        obj[value] = true;
      });
    };
    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
    return obj;
  };
  const noop$3 = () => {
  };
  const toFiniteNumber = (value, defaultValue) => {
    return value != null && Number.isFinite(value = +value) ? value : defaultValue;
  };
  function isSpecCompliantForm(thing) {
    return !!(thing && isFunction$1(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
  }
  const toJSONObject = (obj) => {
    const stack2 = new Array(10);
    const visit = (source, i) => {
      if (isObject(source)) {
        if (stack2.indexOf(source) >= 0) {
          return;
        }
        if (isBuffer(source)) {
          return source;
        }
        if (!("toJSON" in source)) {
          stack2[i] = source;
          const target = isArray(source) ? [] : {};
          forEach(source, (value, key) => {
            const reducedValue = visit(value, i + 1);
            !isUndefined(reducedValue) && (target[key] = reducedValue);
          });
          stack2[i] = void 0;
          return target;
        }
      }
      return source;
    };
    return visit(obj, 0);
  };
  const isAsyncFn = kindOfTest("AsyncFunction");
  const isThenable = (thing) => thing && (isObject(thing) || isFunction$1(thing)) && isFunction$1(thing.then) && isFunction$1(thing.catch);
  const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
    if (setImmediateSupported) {
      return setImmediate;
    }
    return postMessageSupported ? ((token, callbacks) => {
      _global.addEventListener("message", ({ source, data: data2 }) => {
        if (source === _global && data2 === token) {
          callbacks.length && callbacks.shift()();
        }
      }, false);
      return (cb) => {
        callbacks.push(cb);
        _global.postMessage(token, "*");
      };
    })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
  })(
    typeof setImmediate === "function",
    isFunction$1(_global.postMessage)
  );
  const asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
  const isIterable = (thing) => thing != null && isFunction$1(thing[iterator]);
  const utils$2 = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isEmptyObject,
    isReadableStream,
    isRequest,
    isResponse,
    isHeaders,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isRegExp,
    isFunction: isFunction$1,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray: toArray$1,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty,
    // an alias to avoid ESLint no-prototype-builtins detection
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop: noop$3,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable,
    setImmediate: _setImmediate,
    asap,
    isIterable
  };
  function AxiosError$1(message, code, config2, request, response) {
    Error.call(this);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
    this.message = message;
    this.name = "AxiosError";
    code && (this.code = code);
    config2 && (this.config = config2);
    request && (this.request = request);
    if (response) {
      this.response = response;
      this.status = response.status ? response.status : null;
    }
  }
  utils$2.inherits(AxiosError$1, Error, {
    toJSON: function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: utils$2.toJSONObject(this.config),
        code: this.code,
        status: this.status
      };
    }
  });
  const prototype$1 = AxiosError$1.prototype;
  const descriptors = {};
  [
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL"
    // eslint-disable-next-line func-names
  ].forEach((code) => {
    descriptors[code] = { value: code };
  });
  Object.defineProperties(AxiosError$1, descriptors);
  Object.defineProperty(prototype$1, "isAxiosError", { value: true });
  AxiosError$1.from = (error2, code, config2, request, response, customProps) => {
    const axiosError = Object.create(prototype$1);
    utils$2.toFlatObject(error2, axiosError, function filter(obj) {
      return obj !== Error.prototype;
    }, (prop) => {
      return prop !== "isAxiosError";
    });
    const msg = error2 && error2.message ? error2.message : "Error";
    const errCode = code == null && error2 ? error2.code : code;
    AxiosError$1.call(axiosError, msg, errCode, config2, request, response);
    if (error2 && axiosError.cause == null) {
      Object.defineProperty(axiosError, "cause", { value: error2, configurable: true });
    }
    axiosError.name = error2 && error2.name || "Error";
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
  };
  const httpAdapter = null;
  function isVisitable(thing) {
    return utils$2.isPlainObject(thing) || utils$2.isArray(thing);
  }
  function removeBrackets(key) {
    return utils$2.endsWith(key, "[]") ? key.slice(0, -2) : key;
  }
  function renderKey(path, key, dots) {
    if (!path) return key;
    return path.concat(key).map(function each(token, i) {
      token = removeBrackets(token);
      return !dots && i ? "[" + token + "]" : token;
    }).join(dots ? "." : "");
  }
  function isFlatArray(arr) {
    return utils$2.isArray(arr) && !arr.some(isVisitable);
  }
  const predicates = utils$2.toFlatObject(utils$2, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
  });
  function toFormData$1(obj, formData, options) {
    if (!utils$2.isObject(obj)) {
      throw new TypeError("target must be an object");
    }
    formData = formData || new FormData();
    options = utils$2.toFlatObject(options, {
      metaTokens: true,
      dots: false,
      indexes: false
    }, false, function defined(option2, source) {
      return !utils$2.isUndefined(source[option2]);
    });
    const metaTokens = options.metaTokens;
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
    const useBlob = _Blob && utils$2.isSpecCompliantForm(formData);
    if (!utils$2.isFunction(visitor)) {
      throw new TypeError("visitor must be a function");
    }
    function convertValue(value) {
      if (value === null) return "";
      if (utils$2.isDate(value)) {
        return value.toISOString();
      }
      if (utils$2.isBoolean(value)) {
        return value.toString();
      }
      if (!useBlob && utils$2.isBlob(value)) {
        throw new AxiosError$1("Blob is not supported. Use a Buffer instead.");
      }
      if (utils$2.isArrayBuffer(value) || utils$2.isTypedArray(value)) {
        return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }
    function defaultVisitor(value, key, path) {
      let arr = value;
      if (value && !path && typeof value === "object") {
        if (utils$2.endsWith(key, "{}")) {
          key = metaTokens ? key : key.slice(0, -2);
          value = JSON.stringify(value);
        } else if (utils$2.isArray(value) && isFlatArray(value) || (utils$2.isFileList(value) || utils$2.endsWith(key, "[]")) && (arr = utils$2.toArray(value))) {
          key = removeBrackets(key);
          arr.forEach(function each(el, index) {
            !(utils$2.isUndefined(el) || el === null) && formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
              convertValue(el)
            );
          });
          return false;
        }
      }
      if (isVisitable(value)) {
        return true;
      }
      formData.append(renderKey(path, key, dots), convertValue(value));
      return false;
    }
    const stack2 = [];
    const exposedHelpers = Object.assign(predicates, {
      defaultVisitor,
      convertValue,
      isVisitable
    });
    function build2(value, path) {
      if (utils$2.isUndefined(value)) return;
      if (stack2.indexOf(value) !== -1) {
        throw Error("Circular reference detected in " + path.join("."));
      }
      stack2.push(value);
      utils$2.forEach(value, function each(el, key) {
        const result = !(utils$2.isUndefined(el) || el === null) && visitor.call(
          formData,
          el,
          utils$2.isString(key) ? key.trim() : key,
          path,
          exposedHelpers
        );
        if (result === true) {
          build2(el, path ? path.concat(key) : [key]);
        }
      });
      stack2.pop();
    }
    if (!utils$2.isObject(obj)) {
      throw new TypeError("data must be an object");
    }
    build2(obj);
    return formData;
  }
  function encode$1(str) {
    const charMap = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0"
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer2(match) {
      return charMap[match];
    });
  }
  function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && toFormData$1(params, this, options);
  }
  const prototype = AxiosURLSearchParams.prototype;
  prototype.append = function append(name2, value) {
    this._pairs.push([name2, value]);
  };
  prototype.toString = function toString2(encoder) {
    const _encode = encoder ? function(value) {
      return encoder.call(this, value, encode$1);
    } : encode$1;
    return this._pairs.map(function each(pair) {
      return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "").join("&");
  };
  function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
  }
  function buildURL(url, params, options) {
    if (!params) {
      return url;
    }
    const _encode = options && options.encode || encode;
    if (utils$2.isFunction(options)) {
      options = {
        serialize: options
      };
    }
    const serializeFn = options && options.serialize;
    let serializedParams;
    if (serializeFn) {
      serializedParams = serializeFn(params, options);
    } else {
      serializedParams = utils$2.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
    }
    if (serializedParams) {
      const hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  }
  class InterceptorManager {
    constructor() {
      this.handlers = [];
    }
    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    }
    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     *
     * @returns {void}
     */
    eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    }
    /**
     * Clear all interceptors from the stack
     *
     * @returns {void}
     */
    clear() {
      if (this.handlers) {
        this.handlers = [];
      }
    }
    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     *
     * @returns {void}
     */
    forEach(fn2) {
      utils$2.forEach(this.handlers, function forEachHandler(h2) {
        if (h2 !== null) {
          fn2(h2);
        }
      });
    }
  }
  const transitionalDefaults = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };
  const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
  const FormData$1 = typeof FormData !== "undefined" ? FormData : null;
  const Blob$1 = typeof Blob !== "undefined" ? Blob : null;
  const platform$1 = {
    isBrowser: true,
    classes: {
      URLSearchParams: URLSearchParams$1,
      FormData: FormData$1,
      Blob: Blob$1
    },
    protocols: ["http", "https", "file", "blob", "url", "data"]
  };
  const hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
  const _navigator = typeof navigator === "object" && navigator || void 0;
  const hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
  const hasStandardBrowserWebWorkerEnv = (() => {
    return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
  })();
  const origin = hasBrowserEnv && window.location.href || "http://localhost";
  const utils$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    hasBrowserEnv,
    hasStandardBrowserEnv,
    hasStandardBrowserWebWorkerEnv,
    navigator: _navigator,
    origin
  }, Symbol.toStringTag, { value: "Module" }));
  const platform = {
    ...utils$1,
    ...platform$1
  };
  function toURLEncodedForm(data2, options) {
    return toFormData$1(data2, new platform.classes.URLSearchParams(), {
      visitor: function(value, key, path, helpers) {
        if (platform.isNode && utils$2.isBuffer(value)) {
          this.append(key, value.toString("base64"));
          return false;
        }
        return helpers.defaultVisitor.apply(this, arguments);
      },
      ...options
    });
  }
  function parsePropPath(name2) {
    return utils$2.matchAll(/\w+|\[(\w*)]/g, name2).map((match) => {
      return match[0] === "[]" ? "" : match[1] || match[0];
    });
  }
  function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i;
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      obj[key] = arr[key];
    }
    return obj;
  }
  function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
      let name2 = path[index++];
      if (name2 === "__proto__") return true;
      const isNumericKey = Number.isFinite(+name2);
      const isLast = index >= path.length;
      name2 = !name2 && utils$2.isArray(target) ? target.length : name2;
      if (isLast) {
        if (utils$2.hasOwnProp(target, name2)) {
          target[name2] = [target[name2], value];
        } else {
          target[name2] = value;
        }
        return !isNumericKey;
      }
      if (!target[name2] || !utils$2.isObject(target[name2])) {
        target[name2] = [];
      }
      const result = buildPath(path, value, target[name2], index);
      if (result && utils$2.isArray(target[name2])) {
        target[name2] = arrayToObject(target[name2]);
      }
      return !isNumericKey;
    }
    if (utils$2.isFormData(formData) && utils$2.isFunction(formData.entries)) {
      const obj = {};
      utils$2.forEachEntry(formData, (name2, value) => {
        buildPath(parsePropPath(name2), value, obj, 0);
      });
      return obj;
    }
    return null;
  }
  function stringifySafely(rawValue, parser, encoder) {
    if (utils$2.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils$2.trim(rawValue);
      } catch (e) {
        if (e.name !== "SyntaxError") {
          throw e;
        }
      }
    }
    return (encoder || JSON.stringify)(rawValue);
  }
  const defaults = {
    transitional: transitionalDefaults,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [function transformRequest(data2, headers) {
      const contentType = headers.getContentType() || "";
      const hasJSONContentType = contentType.indexOf("application/json") > -1;
      const isObjectPayload = utils$2.isObject(data2);
      if (isObjectPayload && utils$2.isHTMLForm(data2)) {
        data2 = new FormData(data2);
      }
      const isFormData2 = utils$2.isFormData(data2);
      if (isFormData2) {
        return hasJSONContentType ? JSON.stringify(formDataToJSON(data2)) : data2;
      }
      if (utils$2.isArrayBuffer(data2) || utils$2.isBuffer(data2) || utils$2.isStream(data2) || utils$2.isFile(data2) || utils$2.isBlob(data2) || utils$2.isReadableStream(data2)) {
        return data2;
      }
      if (utils$2.isArrayBufferView(data2)) {
        return data2.buffer;
      }
      if (utils$2.isURLSearchParams(data2)) {
        headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
        return data2.toString();
      }
      let isFileList2;
      if (isObjectPayload) {
        if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
          return toURLEncodedForm(data2, this.formSerializer).toString();
        }
        if ((isFileList2 = utils$2.isFileList(data2)) || contentType.indexOf("multipart/form-data") > -1) {
          const _FormData = this.env && this.env.FormData;
          return toFormData$1(
            isFileList2 ? { "files[]": data2 } : data2,
            _FormData && new _FormData(),
            this.formSerializer
          );
        }
      }
      if (isObjectPayload || hasJSONContentType) {
        headers.setContentType("application/json", false);
        return stringifySafely(data2);
      }
      return data2;
    }],
    transformResponse: [function transformResponse(data2) {
      const transitional = this.transitional || defaults.transitional;
      const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
      const JSONRequested = this.responseType === "json";
      if (utils$2.isResponse(data2) || utils$2.isReadableStream(data2)) {
        return data2;
      }
      if (data2 && utils$2.isString(data2) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
        const silentJSONParsing = transitional && transitional.silentJSONParsing;
        const strictJSONParsing = !silentJSONParsing && JSONRequested;
        try {
          return JSON.parse(data2, this.parseReviver);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === "SyntaxError") {
              throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e;
          }
        }
      }
      return data2;
    }],
    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: platform.classes.FormData,
      Blob: platform.classes.Blob
    },
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": void 0
      }
    }
  };
  utils$2.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
    defaults.headers[method] = {};
  });
  const ignoreDuplicateOf = utils$2.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ]);
  const parseHeaders = (rawHeaders) => {
    const parsed = {};
    let key;
    let val;
    let i;
    rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
      i = line.indexOf(":");
      key = line.substring(0, i).trim().toLowerCase();
      val = line.substring(i + 1).trim();
      if (!key || parsed[key] && ignoreDuplicateOf[key]) {
        return;
      }
      if (key === "set-cookie") {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    });
    return parsed;
  };
  const $internals = Symbol("internals");
  function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
  }
  function normalizeValue(value) {
    if (value === false || value == null) {
      return value;
    }
    return utils$2.isArray(value) ? value.map(normalizeValue) : String(value);
  }
  function parseTokens(str) {
    const tokens = /* @__PURE__ */ Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while (match = tokensRE.exec(str)) {
      tokens[match[1]] = match[2];
    }
    return tokens;
  }
  const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
  function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
    if (utils$2.isFunction(filter)) {
      return filter.call(this, value, header);
    }
    if (isHeaderNameFilter) {
      value = header;
    }
    if (!utils$2.isString(value)) return;
    if (utils$2.isString(filter)) {
      return value.indexOf(filter) !== -1;
    }
    if (utils$2.isRegExp(filter)) {
      return filter.test(value);
    }
  }
  function formatHeader(header) {
    return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w2, char, str) => {
      return char.toUpperCase() + str;
    });
  }
  function buildAccessors(obj, header) {
    const accessorName = utils$2.toCamelCase(" " + header);
    ["get", "set", "has"].forEach((methodName) => {
      Object.defineProperty(obj, methodName + accessorName, {
        value: function(arg1, arg2, arg3) {
          return this[methodName].call(this, header, arg1, arg2, arg3);
        },
        configurable: true
      });
    });
  }
  let AxiosHeaders$1 = class AxiosHeaders {
    constructor(headers) {
      headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
      const self2 = this;
      function setHeader(_value, _header, _rewrite) {
        const lHeader = normalizeHeader(_header);
        if (!lHeader) {
          throw new Error("header name must be a non-empty string");
        }
        const key = utils$2.findKey(self2, lHeader);
        if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
          self2[key || _header] = normalizeValue(_value);
        }
      }
      const setHeaders = (headers, _rewrite) => utils$2.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
      if (utils$2.isPlainObject(header) || header instanceof this.constructor) {
        setHeaders(header, valueOrRewrite);
      } else if (utils$2.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
        setHeaders(parseHeaders(header), valueOrRewrite);
      } else if (utils$2.isObject(header) && utils$2.isIterable(header)) {
        let obj = {}, dest, key;
        for (const entry of header) {
          if (!utils$2.isArray(entry)) {
            throw TypeError("Object iterator must return a key-value pair");
          }
          obj[key = entry[0]] = (dest = obj[key]) ? utils$2.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
        }
        setHeaders(obj, valueOrRewrite);
      } else {
        header != null && setHeader(valueOrRewrite, header, rewrite);
      }
      return this;
    }
    get(header, parser) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils$2.findKey(this, header);
        if (key) {
          const value = this[key];
          if (!parser) {
            return value;
          }
          if (parser === true) {
            return parseTokens(value);
          }
          if (utils$2.isFunction(parser)) {
            return parser.call(this, value, key);
          }
          if (utils$2.isRegExp(parser)) {
            return parser.exec(value);
          }
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(header, matcher) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils$2.findKey(this, header);
        return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
      }
      return false;
    }
    delete(header, matcher) {
      const self2 = this;
      let deleted = false;
      function deleteHeader(_header) {
        _header = normalizeHeader(_header);
        if (_header) {
          const key = utils$2.findKey(self2, _header);
          if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
            delete self2[key];
            deleted = true;
          }
        }
      }
      if (utils$2.isArray(header)) {
        header.forEach(deleteHeader);
      } else {
        deleteHeader(header);
      }
      return deleted;
    }
    clear(matcher) {
      const keys = Object.keys(this);
      let i = keys.length;
      let deleted = false;
      while (i--) {
        const key = keys[i];
        if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
          delete this[key];
          deleted = true;
        }
      }
      return deleted;
    }
    normalize(format) {
      const self2 = this;
      const headers = {};
      utils$2.forEach(this, (value, header) => {
        const key = utils$2.findKey(headers, header);
        if (key) {
          self2[key] = normalizeValue(value);
          delete self2[header];
          return;
        }
        const normalized = format ? formatHeader(header) : String(header).trim();
        if (normalized !== header) {
          delete self2[header];
        }
        self2[normalized] = normalizeValue(value);
        headers[normalized] = true;
      });
      return this;
    }
    concat(...targets) {
      return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
      const obj = /* @__PURE__ */ Object.create(null);
      utils$2.forEach(this, (value, header) => {
        value != null && value !== false && (obj[header] = asStrings && utils$2.isArray(value) ? value.join(", ") : value);
      });
      return obj;
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
    }
    getSetCookie() {
      return this.get("set-cookie") || [];
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(thing) {
      return thing instanceof this ? thing : new this(thing);
    }
    static concat(first, ...targets) {
      const computed2 = new this(first);
      targets.forEach((target) => computed2.set(target));
      return computed2;
    }
    static accessor(header) {
      const internals = this[$internals] = this[$internals] = {
        accessors: {}
      };
      const accessors = internals.accessors;
      const prototype2 = this.prototype;
      function defineAccessor(_header) {
        const lHeader = normalizeHeader(_header);
        if (!accessors[lHeader]) {
          buildAccessors(prototype2, _header);
          accessors[lHeader] = true;
        }
      }
      utils$2.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
      return this;
    }
  };
  AxiosHeaders$1.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
  utils$2.reduceDescriptors(AxiosHeaders$1.prototype, ({ value }, key) => {
    let mapped = key[0].toUpperCase() + key.slice(1);
    return {
      get: () => value,
      set(headerValue) {
        this[mapped] = headerValue;
      }
    };
  });
  utils$2.freezeMethods(AxiosHeaders$1);
  function transformData(fns, response) {
    const config2 = this || defaults;
    const context = response || config2;
    const headers = AxiosHeaders$1.from(context.headers);
    let data2 = context.data;
    utils$2.forEach(fns, function transform(fn2) {
      data2 = fn2.call(config2, data2, headers.normalize(), response ? response.status : void 0);
    });
    headers.normalize();
    return data2;
  }
  function isCancel$1(value) {
    return !!(value && value.__CANCEL__);
  }
  function CanceledError$1(message, config2, request) {
    AxiosError$1.call(this, message == null ? "canceled" : message, AxiosError$1.ERR_CANCELED, config2, request);
    this.name = "CanceledError";
  }
  utils$2.inherits(CanceledError$1, AxiosError$1, {
    __CANCEL__: true
  });
  function settle(resolve2, reject, response) {
    const validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve2(response);
    } else {
      reject(new AxiosError$1(
        "Request failed with status code " + response.status,
        [AxiosError$1.ERR_BAD_REQUEST, AxiosError$1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response
      ));
    }
  }
  function parseProtocol(url) {
    const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || "";
  }
  function speedometer(samplesCount, min2) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;
    min2 = min2 !== void 0 ? min2 : 1e3;
    return function push(chunkLength) {
      const now = Date.now();
      const startedAt = timestamps[tail];
      if (!firstSampleTS) {
        firstSampleTS = now;
      }
      bytes[head] = chunkLength;
      timestamps[head] = now;
      let i = tail;
      let bytesCount = 0;
      while (i !== head) {
        bytesCount += bytes[i++];
        i = i % samplesCount;
      }
      head = (head + 1) % samplesCount;
      if (head === tail) {
        tail = (tail + 1) % samplesCount;
      }
      if (now - firstSampleTS < min2) {
        return;
      }
      const passed = startedAt && now - startedAt;
      return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
    };
  }
  function throttle(fn2, freq) {
    let timestamp = 0;
    let threshold = 1e3 / freq;
    let lastArgs;
    let timer;
    const invoke = (args, now = Date.now()) => {
      timestamp = now;
      lastArgs = null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn2(...args);
    };
    const throttled = (...args) => {
      const now = Date.now();
      const passed = now - timestamp;
      if (passed >= threshold) {
        invoke(args, now);
      } else {
        lastArgs = args;
        if (!timer) {
          timer = setTimeout(() => {
            timer = null;
            invoke(lastArgs);
          }, threshold - passed);
        }
      }
    };
    const flush = () => lastArgs && invoke(lastArgs);
    return [throttled, flush];
  }
  const progressEventReducer = (listener2, isDownloadStream, freq = 3) => {
    let bytesNotified = 0;
    const _speedometer = speedometer(50, 250);
    return throttle((e) => {
      const loaded2 = e.loaded;
      const total = e.lengthComputable ? e.total : void 0;
      const progressBytes = loaded2 - bytesNotified;
      const rate = _speedometer(progressBytes);
      const inRange = loaded2 <= total;
      bytesNotified = loaded2;
      const data2 = {
        loaded: loaded2,
        total,
        progress: total ? loaded2 / total : void 0,
        bytes: progressBytes,
        rate: rate ? rate : void 0,
        estimated: rate && total && inRange ? (total - loaded2) / rate : void 0,
        event: e,
        lengthComputable: total != null,
        [isDownloadStream ? "download" : "upload"]: true
      };
      listener2(data2);
    }, freq);
  };
  const progressEventDecorator = (total, throttled) => {
    const lengthComputable = total != null;
    return [(loaded2) => throttled[0]({
      lengthComputable,
      total,
      loaded: loaded2
    }), throttled[1]];
  };
  const asyncDecorator = (fn2) => (...args) => utils$2.asap(() => fn2(...args));
  const isURLSameOrigin = platform.hasStandardBrowserEnv ? /* @__PURE__ */ ((origin2, isMSIE) => (url) => {
    url = new URL(url, platform.origin);
    return origin2.protocol === url.protocol && origin2.host === url.host && (isMSIE || origin2.port === url.port);
  })(
    new URL(platform.origin),
    platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
  ) : () => true;
  const cookies = platform.hasStandardBrowserEnv ? (
    // Standard browser envs support document.cookie
    {
      write(name2, value, expires, path, domain, secure, sameSite) {
        if (typeof document === "undefined") return;
        const cookie = [`${name2}=${encodeURIComponent(value)}`];
        if (utils$2.isNumber(expires)) {
          cookie.push(`expires=${new Date(expires).toUTCString()}`);
        }
        if (utils$2.isString(path)) {
          cookie.push(`path=${path}`);
        }
        if (utils$2.isString(domain)) {
          cookie.push(`domain=${domain}`);
        }
        if (secure === true) {
          cookie.push("secure");
        }
        if (utils$2.isString(sameSite)) {
          cookie.push(`SameSite=${sameSite}`);
        }
        document.cookie = cookie.join("; ");
      },
      read(name2) {
        if (typeof document === "undefined") return null;
        const match = document.cookie.match(new RegExp("(?:^|; )" + name2 + "=([^;]*)"));
        return match ? decodeURIComponent(match[1]) : null;
      },
      remove(name2) {
        this.write(name2, "", Date.now() - 864e5, "/");
      }
    }
  ) : (
    // Non-standard browser env (web workers, react-native) lack needed support.
    {
      write() {
      },
      read() {
        return null;
      },
      remove() {
      }
    }
  );
  function isAbsoluteURL(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  }
  function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  }
  function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
    let isRelativeUrl = !isAbsoluteURL(requestedURL);
    if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }
  const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;
  function mergeConfig$1(config1, config2) {
    config2 = config2 || {};
    const config3 = {};
    function getMergedValue(target, source, prop, caseless) {
      if (utils$2.isPlainObject(target) && utils$2.isPlainObject(source)) {
        return utils$2.merge.call({ caseless }, target, source);
      } else if (utils$2.isPlainObject(source)) {
        return utils$2.merge({}, source);
      } else if (utils$2.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(a, b, prop, caseless) {
      if (!utils$2.isUndefined(b)) {
        return getMergedValue(a, b, prop, caseless);
      } else if (!utils$2.isUndefined(a)) {
        return getMergedValue(void 0, a, prop, caseless);
      }
    }
    function valueFromConfig2(a, b) {
      if (!utils$2.isUndefined(b)) {
        return getMergedValue(void 0, b);
      }
    }
    function defaultToConfig2(a, b) {
      if (!utils$2.isUndefined(b)) {
        return getMergedValue(void 0, b);
      } else if (!utils$2.isUndefined(a)) {
        return getMergedValue(void 0, a);
      }
    }
    function mergeDirectKeys(a, b, prop) {
      if (prop in config2) {
        return getMergedValue(a, b);
      } else if (prop in config1) {
        return getMergedValue(void 0, a);
      }
    }
    const mergeMap = {
      url: valueFromConfig2,
      method: valueFromConfig2,
      data: valueFromConfig2,
      baseURL: defaultToConfig2,
      transformRequest: defaultToConfig2,
      transformResponse: defaultToConfig2,
      paramsSerializer: defaultToConfig2,
      timeout: defaultToConfig2,
      timeoutMessage: defaultToConfig2,
      withCredentials: defaultToConfig2,
      withXSRFToken: defaultToConfig2,
      adapter: defaultToConfig2,
      responseType: defaultToConfig2,
      xsrfCookieName: defaultToConfig2,
      xsrfHeaderName: defaultToConfig2,
      onUploadProgress: defaultToConfig2,
      onDownloadProgress: defaultToConfig2,
      decompress: defaultToConfig2,
      maxContentLength: defaultToConfig2,
      maxBodyLength: defaultToConfig2,
      beforeRedirect: defaultToConfig2,
      transport: defaultToConfig2,
      httpAgent: defaultToConfig2,
      httpsAgent: defaultToConfig2,
      cancelToken: defaultToConfig2,
      socketPath: defaultToConfig2,
      responseEncoding: defaultToConfig2,
      validateStatus: mergeDirectKeys,
      headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
    };
    utils$2.forEach(Object.keys({ ...config1, ...config2 }), function computeConfigValue(prop) {
      const merge2 = mergeMap[prop] || mergeDeepProperties;
      const configValue = merge2(config1[prop], config2[prop], prop);
      utils$2.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config3[prop] = configValue);
    });
    return config3;
  }
  const resolveConfig = (config2) => {
    const newConfig = mergeConfig$1({}, config2);
    let { data: data2, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
    newConfig.headers = headers = AxiosHeaders$1.from(headers);
    newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config2.params, config2.paramsSerializer);
    if (auth) {
      headers.set(
        "Authorization",
        "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
      );
    }
    if (utils$2.isFormData(data2)) {
      if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
        headers.setContentType(void 0);
      } else if (utils$2.isFunction(data2.getHeaders)) {
        const formHeaders = data2.getHeaders();
        const allowedHeaders = ["content-type", "content-length"];
        Object.entries(formHeaders).forEach(([key, val]) => {
          if (allowedHeaders.includes(key.toLowerCase())) {
            headers.set(key, val);
          }
        });
      }
    }
    if (platform.hasStandardBrowserEnv) {
      withXSRFToken && utils$2.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
      if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin(newConfig.url)) {
        const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);
        if (xsrfValue) {
          headers.set(xsrfHeaderName, xsrfValue);
        }
      }
    }
    return newConfig;
  };
  const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
  const xhrAdapter = isXHRAdapterSupported && function(config2) {
    return new Promise(function dispatchXhrRequest(resolve2, reject) {
      const _config2 = resolveConfig(config2);
      let requestData = _config2.data;
      const requestHeaders = AxiosHeaders$1.from(_config2.headers).normalize();
      let { responseType, onUploadProgress, onDownloadProgress } = _config2;
      let onCanceled;
      let uploadThrottled, downloadThrottled;
      let flushUpload, flushDownload;
      function done() {
        flushUpload && flushUpload();
        flushDownload && flushDownload();
        _config2.cancelToken && _config2.cancelToken.unsubscribe(onCanceled);
        _config2.signal && _config2.signal.removeEventListener("abort", onCanceled);
      }
      let request = new XMLHttpRequest();
      request.open(_config2.method.toUpperCase(), _config2.url, true);
      request.timeout = _config2.timeout;
      function onloadend() {
        if (!request) {
          return;
        }
        const responseHeaders = AxiosHeaders$1.from(
          "getAllResponseHeaders" in request && request.getAllResponseHeaders()
        );
        const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config2,
          request
        };
        settle(function _resolve(value) {
          resolve2(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response);
        request = null;
      }
      if ("onloadend" in request) {
        request.onloadend = onloadend;
      } else {
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
            return;
          }
          setTimeout(onloadend);
        };
      }
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }
        reject(new AxiosError$1("Request aborted", AxiosError$1.ECONNABORTED, config2, request));
        request = null;
      };
      request.onerror = function handleError2(event) {
        const msg = event && event.message ? event.message : "Network Error";
        const err = new AxiosError$1(msg, AxiosError$1.ERR_NETWORK, config2, request);
        err.event = event || null;
        reject(err);
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = _config2.timeout ? "timeout of " + _config2.timeout + "ms exceeded" : "timeout exceeded";
        const transitional = _config2.transitional || transitionalDefaults;
        if (_config2.timeoutErrorMessage) {
          timeoutErrorMessage = _config2.timeoutErrorMessage;
        }
        reject(new AxiosError$1(
          timeoutErrorMessage,
          transitional.clarifyTimeoutError ? AxiosError$1.ETIMEDOUT : AxiosError$1.ECONNABORTED,
          config2,
          request
        ));
        request = null;
      };
      requestData === void 0 && requestHeaders.setContentType(null);
      if ("setRequestHeader" in request) {
        utils$2.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
          request.setRequestHeader(key, val);
        });
      }
      if (!utils$2.isUndefined(_config2.withCredentials)) {
        request.withCredentials = !!_config2.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request.responseType = _config2.responseType;
      }
      if (onDownloadProgress) {
        [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
        request.addEventListener("progress", downloadThrottled);
      }
      if (onUploadProgress && request.upload) {
        [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
        request.upload.addEventListener("progress", uploadThrottled);
        request.upload.addEventListener("loadend", flushUpload);
      }
      if (_config2.cancelToken || _config2.signal) {
        onCanceled = (cancel) => {
          if (!request) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError$1(null, config2, request) : cancel);
          request.abort();
          request = null;
        };
        _config2.cancelToken && _config2.cancelToken.subscribe(onCanceled);
        if (_config2.signal) {
          _config2.signal.aborted ? onCanceled() : _config2.signal.addEventListener("abort", onCanceled);
        }
      }
      const protocol = parseProtocol(_config2.url);
      if (protocol && platform.protocols.indexOf(protocol) === -1) {
        reject(new AxiosError$1("Unsupported protocol " + protocol + ":", AxiosError$1.ERR_BAD_REQUEST, config2));
        return;
      }
      request.send(requestData || null);
    });
  };
  const composeSignals = (signals, timeout) => {
    const { length } = signals = signals ? signals.filter(Boolean) : [];
    if (timeout || length) {
      let controller = new AbortController();
      let aborted;
      const onabort = function(reason) {
        if (!aborted) {
          aborted = true;
          unsubscribe();
          const err = reason instanceof Error ? reason : this.reason;
          controller.abort(err instanceof AxiosError$1 ? err : new CanceledError$1(err instanceof Error ? err.message : err));
        }
      };
      let timer = timeout && setTimeout(() => {
        timer = null;
        onabort(new AxiosError$1(`timeout ${timeout} of ms exceeded`, AxiosError$1.ETIMEDOUT));
      }, timeout);
      const unsubscribe = () => {
        if (signals) {
          timer && clearTimeout(timer);
          timer = null;
          signals.forEach((signal2) => {
            signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
          });
          signals = null;
        }
      };
      signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
      const { signal } = controller;
      signal.unsubscribe = () => utils$2.asap(unsubscribe);
      return signal;
    }
  };
  const streamChunk = function* (chunk, chunkSize) {
    let len = chunk.byteLength;
    if (len < chunkSize) {
      yield chunk;
      return;
    }
    let pos = 0;
    let end2;
    while (pos < len) {
      end2 = pos + chunkSize;
      yield chunk.slice(pos, end2);
      pos = end2;
    }
  };
  const readBytes = async function* (iterable, chunkSize) {
    for await (const chunk of readStream(iterable)) {
      yield* streamChunk(chunk, chunkSize);
    }
  };
  const readStream = async function* (stream) {
    if (stream[Symbol.asyncIterator]) {
      yield* stream;
      return;
    }
    const reader = stream.getReader();
    try {
      for (; ; ) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        yield value;
      }
    } finally {
      await reader.cancel();
    }
  };
  const trackStream = (stream, chunkSize, onProgress, onFinish) => {
    const iterator2 = readBytes(stream, chunkSize);
    let bytes = 0;
    let done;
    let _onFinish = (e) => {
      if (!done) {
        done = true;
        onFinish && onFinish(e);
      }
    };
    return new ReadableStream({
      async pull(controller) {
        try {
          const { done: done2, value } = await iterator2.next();
          if (done2) {
            _onFinish();
            controller.close();
            return;
          }
          let len = value.byteLength;
          if (onProgress) {
            let loadedBytes = bytes += len;
            onProgress(loadedBytes);
          }
          controller.enqueue(new Uint8Array(value));
        } catch (err) {
          _onFinish(err);
          throw err;
        }
      },
      cancel(reason) {
        _onFinish(reason);
        return iterator2.return();
      }
    }, {
      highWaterMark: 2
    });
  };
  const DEFAULT_CHUNK_SIZE = 64 * 1024;
  const { isFunction } = utils$2;
  const globalFetchAPI = (({ Request, Response }) => ({
    Request,
    Response
  }))(utils$2.global);
  const {
    ReadableStream: ReadableStream$1,
    TextEncoder
  } = utils$2.global;
  const test = (fn2, ...args) => {
    try {
      return !!fn2(...args);
    } catch (e) {
      return false;
    }
  };
  const factory = (env) => {
    env = utils$2.merge.call({
      skipUndefined: true
    }, globalFetchAPI, env);
    const { fetch: envFetch, Request, Response } = env;
    const isFetchSupported = envFetch ? isFunction(envFetch) : typeof fetch === "function";
    const isRequestSupported = isFunction(Request);
    const isResponseSupported = isFunction(Response);
    if (!isFetchSupported) {
      return false;
    }
    const isReadableStreamSupported = isFetchSupported && isFunction(ReadableStream$1);
    const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : async (str) => new Uint8Array(await new Request(str).arrayBuffer()));
    const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
      let duplexAccessed = false;
      const hasContentType = new Request(platform.origin, {
        body: new ReadableStream$1(),
        method: "POST",
        get duplex() {
          duplexAccessed = true;
          return "half";
        }
      }).headers.has("Content-Type");
      return duplexAccessed && !hasContentType;
    });
    const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => utils$2.isReadableStream(new Response("").body));
    const resolvers = {
      stream: supportsResponseStream && ((res2) => res2.body)
    };
    isFetchSupported && (() => {
      ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type2) => {
        !resolvers[type2] && (resolvers[type2] = (res2, config2) => {
          let method = res2 && res2[type2];
          if (method) {
            return method.call(res2);
          }
          throw new AxiosError$1(`Response type '${type2}' is not supported`, AxiosError$1.ERR_NOT_SUPPORT, config2);
        });
      });
    })();
    const getBodyLength = async (body) => {
      if (body == null) {
        return 0;
      }
      if (utils$2.isBlob(body)) {
        return body.size;
      }
      if (utils$2.isSpecCompliantForm(body)) {
        const _request = new Request(platform.origin, {
          method: "POST",
          body
        });
        return (await _request.arrayBuffer()).byteLength;
      }
      if (utils$2.isArrayBufferView(body) || utils$2.isArrayBuffer(body)) {
        return body.byteLength;
      }
      if (utils$2.isURLSearchParams(body)) {
        body = body + "";
      }
      if (utils$2.isString(body)) {
        return (await encodeText(body)).byteLength;
      }
    };
    const resolveBodyLength = async (headers, body) => {
      const length = utils$2.toFiniteNumber(headers.getContentLength());
      return length == null ? getBodyLength(body) : length;
    };
    return async (config2) => {
      let {
        url,
        method,
        data: data2,
        signal,
        cancelToken,
        timeout,
        onDownloadProgress,
        onUploadProgress,
        responseType,
        headers,
        withCredentials = "same-origin",
        fetchOptions
      } = resolveConfig(config2);
      let _fetch = envFetch || fetch;
      responseType = responseType ? (responseType + "").toLowerCase() : "text";
      let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
      let request = null;
      const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
        composedSignal.unsubscribe();
      });
      let requestContentLength;
      try {
        if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data2)) !== 0) {
          let _request = new Request(url, {
            method: "POST",
            body: data2,
            duplex: "half"
          });
          let contentTypeHeader;
          if (utils$2.isFormData(data2) && (contentTypeHeader = _request.headers.get("content-type"))) {
            headers.setContentType(contentTypeHeader);
          }
          if (_request.body) {
            const [onProgress, flush] = progressEventDecorator(
              requestContentLength,
              progressEventReducer(asyncDecorator(onUploadProgress))
            );
            data2 = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
          }
        }
        if (!utils$2.isString(withCredentials)) {
          withCredentials = withCredentials ? "include" : "omit";
        }
        const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
        const resolvedOptions = {
          ...fetchOptions,
          signal: composedSignal,
          method: method.toUpperCase(),
          headers: headers.normalize().toJSON(),
          body: data2,
          duplex: "half",
          credentials: isCredentialsSupported ? withCredentials : void 0
        };
        request = isRequestSupported && new Request(url, resolvedOptions);
        let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url, resolvedOptions));
        const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
        if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
          const options = {};
          ["status", "statusText", "headers"].forEach((prop) => {
            options[prop] = response[prop];
          });
          const responseContentLength = utils$2.toFiniteNumber(response.headers.get("content-length"));
          const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
            responseContentLength,
            progressEventReducer(asyncDecorator(onDownloadProgress), true)
          ) || [];
          response = new Response(
            trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
              flush && flush();
              unsubscribe && unsubscribe();
            }),
            options
          );
        }
        responseType = responseType || "text";
        let responseData = await resolvers[utils$2.findKey(resolvers, responseType) || "text"](response, config2);
        !isStreamResponse && unsubscribe && unsubscribe();
        return await new Promise((resolve2, reject) => {
          settle(resolve2, reject, {
            data: responseData,
            headers: AxiosHeaders$1.from(response.headers),
            status: response.status,
            statusText: response.statusText,
            config: config2,
            request
          });
        });
      } catch (err) {
        unsubscribe && unsubscribe();
        if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
          throw Object.assign(
            new AxiosError$1("Network Error", AxiosError$1.ERR_NETWORK, config2, request),
            {
              cause: err.cause || err
            }
          );
        }
        throw AxiosError$1.from(err, err && err.code, config2, request);
      }
    };
  };
  const seedCache = /* @__PURE__ */ new Map();
  const getFetch = (config2) => {
    let env = config2 && config2.env || {};
    const { fetch: fetch2, Request, Response } = env;
    const seeds = [
      Request,
      Response,
      fetch2
    ];
    let len = seeds.length, i = len, seed, target, map2 = seedCache;
    while (i--) {
      seed = seeds[i];
      target = map2.get(seed);
      target === void 0 && map2.set(seed, target = i ? /* @__PURE__ */ new Map() : factory(env));
      map2 = target;
    }
    return target;
  };
  getFetch();
  const knownAdapters = {
    http: httpAdapter,
    xhr: xhrAdapter,
    fetch: {
      get: getFetch
    }
  };
  utils$2.forEach(knownAdapters, (fn2, value) => {
    if (fn2) {
      try {
        Object.defineProperty(fn2, "name", { value });
      } catch (e) {
      }
      Object.defineProperty(fn2, "adapterName", { value });
    }
  });
  const renderReason = (reason) => `- ${reason}`;
  const isResolvedHandle = (adapter) => utils$2.isFunction(adapter) || adapter === null || adapter === false;
  function getAdapter$1(adapters2, config2) {
    adapters2 = utils$2.isArray(adapters2) ? adapters2 : [adapters2];
    const { length } = adapters2;
    let nameOrAdapter;
    let adapter;
    const rejectedReasons = {};
    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters2[i];
      let id;
      adapter = nameOrAdapter;
      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
        if (adapter === void 0) {
          throw new AxiosError$1(`Unknown adapter '${id}'`);
        }
      }
      if (adapter && (utils$2.isFunction(adapter) || (adapter = adapter.get(config2)))) {
        break;
      }
      rejectedReasons[id || "#" + i] = adapter;
    }
    if (!adapter) {
      const reasons = Object.entries(rejectedReasons).map(
        ([id, state2]) => `adapter ${id} ` + (state2 === false ? "is not supported by the environment" : "is not available in the build")
      );
      let s2 = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
      throw new AxiosError$1(
        `There is no suitable adapter to dispatch the request ` + s2,
        "ERR_NOT_SUPPORT"
      );
    }
    return adapter;
  }
  const adapters = {
    /**
     * Resolve an adapter from a list of adapter names or functions.
     * @type {Function}
     */
    getAdapter: getAdapter$1,
    /**
     * Exposes all known adapters
     * @type {Object<string, Function|Object>}
     */
    adapters: knownAdapters
  };
  function throwIfCancellationRequested(config2) {
    if (config2.cancelToken) {
      config2.cancelToken.throwIfRequested();
    }
    if (config2.signal && config2.signal.aborted) {
      throw new CanceledError$1(null, config2);
    }
  }
  function dispatchRequest(config2) {
    throwIfCancellationRequested(config2);
    config2.headers = AxiosHeaders$1.from(config2.headers);
    config2.data = transformData.call(
      config2,
      config2.transformRequest
    );
    if (["post", "put", "patch"].indexOf(config2.method) !== -1) {
      config2.headers.setContentType("application/x-www-form-urlencoded", false);
    }
    const adapter = adapters.getAdapter(config2.adapter || defaults.adapter, config2);
    return adapter(config2).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config2);
      response.data = transformData.call(
        config2,
        config2.transformResponse,
        response
      );
      response.headers = AxiosHeaders$1.from(response.headers);
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel$1(reason)) {
        throwIfCancellationRequested(config2);
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config2,
            config2.transformResponse,
            reason.response
          );
          reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
        }
      }
      return Promise.reject(reason);
    });
  }
  const VERSION$1 = "1.13.2";
  const validators$1 = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach((type2, i) => {
    validators$1[type2] = function validator2(thing) {
      return typeof thing === type2 || "a" + (i < 1 ? "n " : " ") + type2;
    };
  });
  const deprecatedWarnings = {};
  validators$1.transitional = function transitional(validator2, version2, message) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION$1 + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return (value, opt, opts) => {
      if (validator2 === false) {
        throw new AxiosError$1(
          formatMessage(opt, " has been removed" + (version2 ? " in " + version2 : "")),
          AxiosError$1.ERR_DEPRECATED
        );
      }
      if (version2 && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        console.warn(
          formatMessage(
            opt,
            " has been deprecated since v" + version2 + " and will be removed in the near future"
          )
        );
      }
      return validator2 ? validator2(value, opt, opts) : true;
    };
  };
  validators$1.spelling = function spelling(correctSpelling) {
    return (value, opt) => {
      console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
      return true;
    };
  };
  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
      throw new AxiosError$1("options must be an object", AxiosError$1.ERR_BAD_OPTION_VALUE);
    }
    const keys = Object.keys(options);
    let i = keys.length;
    while (i-- > 0) {
      const opt = keys[i];
      const validator2 = schema[opt];
      if (validator2) {
        const value = options[opt];
        const result = value === void 0 || validator2(value, opt, options);
        if (result !== true) {
          throw new AxiosError$1("option " + opt + " must be " + result, AxiosError$1.ERR_BAD_OPTION_VALUE);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw new AxiosError$1("Unknown option " + opt, AxiosError$1.ERR_BAD_OPTION);
      }
    }
  }
  const validator = {
    assertOptions,
    validators: validators$1
  };
  const validators = validator.validators;
  let Axios$1 = class Axios {
    constructor(instanceConfig) {
      this.defaults = instanceConfig || {};
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }
    /**
     * Dispatch a request
     *
     * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
     * @param {?Object} config
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    async request(configOrUrl, config2) {
      try {
        return await this._request(configOrUrl, config2);
      } catch (err) {
        if (err instanceof Error) {
          let dummy = {};
          Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
          const stack2 = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
          try {
            if (!err.stack) {
              err.stack = stack2;
            } else if (stack2 && !String(err.stack).endsWith(stack2.replace(/^.+\n.+\n/, ""))) {
              err.stack += "\n" + stack2;
            }
          } catch (e) {
          }
        }
        throw err;
      }
    }
    _request(configOrUrl, config2) {
      if (typeof configOrUrl === "string") {
        config2 = config2 || {};
        config2.url = configOrUrl;
      } else {
        config2 = configOrUrl || {};
      }
      config2 = mergeConfig$1(this.defaults, config2);
      const { transitional, paramsSerializer, headers } = config2;
      if (transitional !== void 0) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }
      if (paramsSerializer != null) {
        if (utils$2.isFunction(paramsSerializer)) {
          config2.paramsSerializer = {
            serialize: paramsSerializer
          };
        } else {
          validator.assertOptions(paramsSerializer, {
            encode: validators.function,
            serialize: validators.function
          }, true);
        }
      }
      if (config2.allowAbsoluteUrls !== void 0) ;
      else if (this.defaults.allowAbsoluteUrls !== void 0) {
        config2.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
      } else {
        config2.allowAbsoluteUrls = true;
      }
      validator.assertOptions(config2, {
        baseUrl: validators.spelling("baseURL"),
        withXsrfToken: validators.spelling("withXSRFToken")
      }, true);
      config2.method = (config2.method || this.defaults.method || "get").toLowerCase();
      let contextHeaders = headers && utils$2.merge(
        headers.common,
        headers[config2.method]
      );
      headers && utils$2.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (method) => {
          delete headers[method];
        }
      );
      config2.headers = AxiosHeaders$1.concat(contextHeaders, headers);
      const requestInterceptorChain = [];
      let synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config2) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      const responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      let promise;
      let i = 0;
      let len;
      if (!synchronousRequestInterceptors) {
        const chain = [dispatchRequest.bind(this), void 0];
        chain.unshift(...requestInterceptorChain);
        chain.push(...responseInterceptorChain);
        len = chain.length;
        promise = Promise.resolve(config2);
        while (i < len) {
          promise = promise.then(chain[i++], chain[i++]);
        }
        return promise;
      }
      len = requestInterceptorChain.length;
      let newConfig = config2;
      while (i < len) {
        const onFulfilled = requestInterceptorChain[i++];
        const onRejected = requestInterceptorChain[i++];
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error2) {
          onRejected.call(this, error2);
          break;
        }
      }
      try {
        promise = dispatchRequest.call(this, newConfig);
      } catch (error2) {
        return Promise.reject(error2);
      }
      i = 0;
      len = responseInterceptorChain.length;
      while (i < len) {
        promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
      }
      return promise;
    }
    getUri(config2) {
      config2 = mergeConfig$1(this.defaults, config2);
      const fullPath = buildFullPath(config2.baseURL, config2.url, config2.allowAbsoluteUrls);
      return buildURL(fullPath, config2.params, config2.paramsSerializer);
    }
  };
  utils$2.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios$1.prototype[method] = function(url, config2) {
      return this.request(mergeConfig$1(config2 || {}, {
        method,
        url,
        data: (config2 || {}).data
      }));
    };
  });
  utils$2.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data2, config2) {
        return this.request(mergeConfig$1(config2 || {}, {
          method,
          headers: isForm ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url,
          data: data2
        }));
      };
    }
    Axios$1.prototype[method] = generateHTTPMethod();
    Axios$1.prototype[method + "Form"] = generateHTTPMethod(true);
  });
  let CancelToken$1 = class CancelToken2 {
    constructor(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      let resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve2) {
        resolvePromise = resolve2;
      });
      const token = this;
      this.promise.then((cancel) => {
        if (!token._listeners) return;
        let i = token._listeners.length;
        while (i-- > 0) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = (onfulfilled) => {
        let _resolve;
        const promise = new Promise((resolve2) => {
          token.subscribe(resolve2);
          _resolve = resolve2;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message, config2, request) {
        if (token.reason) {
          return;
        }
        token.reason = new CanceledError$1(message, config2, request);
        resolvePromise(token.reason);
      });
    }
    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    }
    /**
     * Subscribe to the cancel signal
     */
    subscribe(listener2) {
      if (this.reason) {
        listener2(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener2);
      } else {
        this._listeners = [listener2];
      }
    }
    /**
     * Unsubscribe from the cancel signal
     */
    unsubscribe(listener2) {
      if (!this._listeners) {
        return;
      }
      const index = this._listeners.indexOf(listener2);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    }
    toAbortSignal() {
      const controller = new AbortController();
      const abort = (err) => {
        controller.abort(err);
      };
      this.subscribe(abort);
      controller.signal.unsubscribe = () => this.unsubscribe(abort);
      return controller.signal;
    }
    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    static source() {
      let cancel;
      const token = new CancelToken2(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    }
  };
  function spread$1(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  }
  function isAxiosError$1(payload) {
    return utils$2.isObject(payload) && payload.isAxiosError === true;
  }
  const HttpStatusCode$1 = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511,
    WebServerIsDown: 521,
    ConnectionTimedOut: 522,
    OriginIsUnreachable: 523,
    TimeoutOccurred: 524,
    SslHandshakeFailed: 525,
    InvalidSslCertificate: 526
  };
  Object.entries(HttpStatusCode$1).forEach(([key, value]) => {
    HttpStatusCode$1[value] = key;
  });
  function createInstance(defaultConfig) {
    const context = new Axios$1(defaultConfig);
    const instance = bind(Axios$1.prototype.request, context);
    utils$2.extend(instance, Axios$1.prototype, context, { allOwnKeys: true });
    utils$2.extend(instance, context, null, { allOwnKeys: true });
    instance.create = function create2(instanceConfig) {
      return createInstance(mergeConfig$1(defaultConfig, instanceConfig));
    };
    return instance;
  }
  const axios = createInstance(defaults);
  axios.Axios = Axios$1;
  axios.CanceledError = CanceledError$1;
  axios.CancelToken = CancelToken$1;
  axios.isCancel = isCancel$1;
  axios.VERSION = VERSION$1;
  axios.toFormData = toFormData$1;
  axios.AxiosError = AxiosError$1;
  axios.Cancel = axios.CanceledError;
  axios.all = function all2(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread$1;
  axios.isAxiosError = isAxiosError$1;
  axios.mergeConfig = mergeConfig$1;
  axios.AxiosHeaders = AxiosHeaders$1;
  axios.formToJSON = (thing) => formDataToJSON(utils$2.isHTMLForm(thing) ? new FormData(thing) : thing);
  axios.getAdapter = adapters.getAdapter;
  axios.HttpStatusCode = HttpStatusCode$1;
  axios.default = axios;
  const {
    Axios,
    AxiosError,
    CanceledError,
    isCancel,
    CancelToken,
    VERSION,
    all,
    Cancel,
    isAxiosError,
    spread,
    toFormData,
    AxiosHeaders,
    HttpStatusCode,
    formToJSON,
    getAdapter,
    mergeConfig
  } = axios;
  var commonjsGlobal$1 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x2) {
    return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
  }
  function getAugmentedNamespace(n) {
    if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
    var f = n.default;
    if (typeof f == "function") {
      var a = function a2() {
        if (this instanceof a2) {
          return Reflect.construct(f, arguments, this.constructor);
        }
        return f.apply(this, arguments);
      };
      a.prototype = f.prototype;
    } else a = {};
    Object.defineProperty(a, "__esModule", { value: true });
    Object.keys(n).forEach(function(k) {
      var d = Object.getOwnPropertyDescriptor(n, k);
      Object.defineProperty(a, k, d.get ? d : {
        enumerable: true,
        get: function() {
          return n[k];
        }
      });
    });
    return a;
  }
  var type;
  var hasRequiredType;
  function requireType() {
    if (hasRequiredType) return type;
    hasRequiredType = 1;
    type = TypeError;
    return type;
  }
  const __viteBrowserExternal = new Proxy({}, {
    get(_, key) {
      throw new Error(`Module "" has been externalized for browser compatibility. Cannot access ".${key}" in client code.  See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
    }
  });
  const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __viteBrowserExternal
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$0 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
  var objectInspect;
  var hasRequiredObjectInspect;
  function requireObjectInspect() {
    if (hasRequiredObjectInspect) return objectInspect;
    hasRequiredObjectInspect = 1;
    var hasMap = typeof Map === "function" && Map.prototype;
    var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
    var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
    var mapForEach = hasMap && Map.prototype.forEach;
    var hasSet = typeof Set === "function" && Set.prototype;
    var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
    var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
    var setForEach = hasSet && Set.prototype.forEach;
    var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
    var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
    var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
    var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
    var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
    var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
    var booleanValueOf = Boolean.prototype.valueOf;
    var objectToString2 = Object.prototype.toString;
    var functionToString = Function.prototype.toString;
    var $match = String.prototype.match;
    var $slice = String.prototype.slice;
    var $replace = String.prototype.replace;
    var $toUpperCase = String.prototype.toUpperCase;
    var $toLowerCase = String.prototype.toLowerCase;
    var $test = RegExp.prototype.test;
    var $concat = Array.prototype.concat;
    var $join = Array.prototype.join;
    var $arrSlice = Array.prototype.slice;
    var $floor = Math.floor;
    var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
    var gOPS = Object.getOwnPropertySymbols;
    var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
    var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
    var toStringTag2 = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
    var isEnumerable = Object.prototype.propertyIsEnumerable;
    var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
      return O.__proto__;
    } : null);
    function addNumericSeparator(num, str) {
      if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) {
        return str;
      }
      var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
      if (typeof num === "number") {
        var int = num < 0 ? -$floor(-num) : $floor(num);
        if (int !== num) {
          var intStr = String(int);
          var dec = $slice.call(str, intStr.length + 1);
          return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
        }
      }
      return $replace.call(str, sepRegex, "$&_");
    }
    var utilInspect = require$$0;
    var inspectCustom = utilInspect.custom;
    var inspectSymbol = isSymbol2(inspectCustom) ? inspectCustom : null;
    var quotes = {
      __proto__: null,
      "double": '"',
      single: "'"
    };
    var quoteREs = {
      __proto__: null,
      "double": /(["\\])/g,
      single: /(['\\])/g
    };
    objectInspect = function inspect_(obj, options, depth, seen) {
      var opts = options || {};
      if (has(opts, "quoteStyle") && !has(quotes, opts.quoteStyle)) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
      }
      if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
      }
      var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
      if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
        throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
      }
      if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
      }
      if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
      }
      var numericSeparator = opts.numericSeparator;
      if (typeof obj === "undefined") {
        return "undefined";
      }
      if (obj === null) {
        return "null";
      }
      if (typeof obj === "boolean") {
        return obj ? "true" : "false";
      }
      if (typeof obj === "string") {
        return inspectString(obj, opts);
      }
      if (typeof obj === "number") {
        if (obj === 0) {
          return Infinity / obj > 0 ? "0" : "-0";
        }
        var str = String(obj);
        return numericSeparator ? addNumericSeparator(obj, str) : str;
      }
      if (typeof obj === "bigint") {
        var bigIntStr = String(obj) + "n";
        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
      }
      var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
      if (typeof depth === "undefined") {
        depth = 0;
      }
      if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") {
        return isArray2(obj) ? "[Array]" : "[Object]";
      }
      var indent = getIndent(opts, depth);
      if (typeof seen === "undefined") {
        seen = [];
      } else if (indexOf(seen, obj) >= 0) {
        return "[Circular]";
      }
      function inspect(value, from, noIndent) {
        if (from) {
          seen = $arrSlice.call(seen);
          seen.push(from);
        }
        if (noIndent) {
          var newOpts = {
            depth: opts.depth
          };
          if (has(opts, "quoteStyle")) {
            newOpts.quoteStyle = opts.quoteStyle;
          }
          return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
      }
      if (typeof obj === "function" && !isRegExp2(obj)) {
        var name2 = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return "[Function" + (name2 ? ": " + name2 : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
      }
      if (isSymbol2(obj)) {
        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
        return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
      }
      if (isElement(obj)) {
        var s2 = "<" + $toLowerCase.call(String(obj.nodeName));
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
          s2 += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
        }
        s2 += ">";
        if (obj.childNodes && obj.childNodes.length) {
          s2 += "...";
        }
        s2 += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
        return s2;
      }
      if (isArray2(obj)) {
        if (obj.length === 0) {
          return "[]";
        }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
          return "[" + indentedJoin(xs, indent) + "]";
        }
        return "[ " + $join.call(xs, ", ") + " ]";
      }
      if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) {
          return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect(obj.cause), parts), ", ") + " }";
        }
        if (parts.length === 0) {
          return "[" + String(obj) + "]";
        }
        return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
      }
      if (typeof obj === "object" && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) {
          return utilInspect(obj, { depth: maxDepth - depth });
        } else if (customInspect !== "symbol" && typeof obj.inspect === "function") {
          return obj.inspect();
        }
      }
      if (isMap2(obj)) {
        var mapParts = [];
        if (mapForEach) {
          mapForEach.call(obj, function(value, key) {
            mapParts.push(inspect(key, obj, true) + " => " + inspect(value, obj));
          });
        }
        return collectionOf("Map", mapSize.call(obj), mapParts, indent);
      }
      if (isSet2(obj)) {
        var setParts = [];
        if (setForEach) {
          setForEach.call(obj, function(value) {
            setParts.push(inspect(value, obj));
          });
        }
        return collectionOf("Set", setSize.call(obj), setParts, indent);
      }
      if (isWeakMap(obj)) {
        return weakCollectionOf("WeakMap");
      }
      if (isWeakSet(obj)) {
        return weakCollectionOf("WeakSet");
      }
      if (isWeakRef(obj)) {
        return weakCollectionOf("WeakRef");
      }
      if (isNumber2(obj)) {
        return markBoxed(inspect(Number(obj)));
      }
      if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
      }
      if (isBoolean2(obj)) {
        return markBoxed(booleanValueOf.call(obj));
      }
      if (isString2(obj)) {
        return markBoxed(inspect(String(obj)));
      }
      if (typeof window !== "undefined" && obj === window) {
        return "{ [object Window] }";
      }
      if (typeof globalThis !== "undefined" && obj === globalThis || typeof commonjsGlobal$1 !== "undefined" && obj === commonjsGlobal$1) {
        return "{ [object globalThis] }";
      }
      if (!isDate2(obj) && !isRegExp2(obj)) {
        var ys = arrObjKeys(obj, inspect);
        var isPlainObject2 = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? "" : "null prototype";
        var stringTag = !isPlainObject2 && toStringTag2 && Object(obj) === obj && toStringTag2 in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
        var constructorTag = isPlainObject2 || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "";
        var tag = constructorTag + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
        if (ys.length === 0) {
          return tag + "{}";
        }
        if (indent) {
          return tag + "{" + indentedJoin(ys, indent) + "}";
        }
        return tag + "{ " + $join.call(ys, ", ") + " }";
      }
      return String(obj);
    };
    function wrapQuotes(s2, defaultStyle, opts) {
      var style = opts.quoteStyle || defaultStyle;
      var quoteChar = quotes[style];
      return quoteChar + s2 + quoteChar;
    }
    function quote(s2) {
      return $replace.call(String(s2), /"/g, "&quot;");
    }
    function canTrustToString(obj) {
      return !toStringTag2 || !(typeof obj === "object" && (toStringTag2 in obj || typeof obj[toStringTag2] !== "undefined"));
    }
    function isArray2(obj) {
      return toStr(obj) === "[object Array]" && canTrustToString(obj);
    }
    function isDate2(obj) {
      return toStr(obj) === "[object Date]" && canTrustToString(obj);
    }
    function isRegExp2(obj) {
      return toStr(obj) === "[object RegExp]" && canTrustToString(obj);
    }
    function isError(obj) {
      return toStr(obj) === "[object Error]" && canTrustToString(obj);
    }
    function isString2(obj) {
      return toStr(obj) === "[object String]" && canTrustToString(obj);
    }
    function isNumber2(obj) {
      return toStr(obj) === "[object Number]" && canTrustToString(obj);
    }
    function isBoolean2(obj) {
      return toStr(obj) === "[object Boolean]" && canTrustToString(obj);
    }
    function isSymbol2(obj) {
      if (hasShammedSymbols) {
        return obj && typeof obj === "object" && obj instanceof Symbol;
      }
      if (typeof obj === "symbol") {
        return true;
      }
      if (!obj || typeof obj !== "object" || !symToString) {
        return false;
      }
      try {
        symToString.call(obj);
        return true;
      } catch (e) {
      }
      return false;
    }
    function isBigInt(obj) {
      if (!obj || typeof obj !== "object" || !bigIntValueOf) {
        return false;
      }
      try {
        bigIntValueOf.call(obj);
        return true;
      } catch (e) {
      }
      return false;
    }
    var hasOwn2 = Object.prototype.hasOwnProperty || function(key) {
      return key in this;
    };
    function has(obj, key) {
      return hasOwn2.call(obj, key);
    }
    function toStr(obj) {
      return objectToString2.call(obj);
    }
    function nameOf(f) {
      if (f.name) {
        return f.name;
      }
      var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
      if (m) {
        return m[1];
      }
      return null;
    }
    function indexOf(xs, x2) {
      if (xs.indexOf) {
        return xs.indexOf(x2);
      }
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x2) {
          return i;
        }
      }
      return -1;
    }
    function isMap2(x2) {
      if (!mapSize || !x2 || typeof x2 !== "object") {
        return false;
      }
      try {
        mapSize.call(x2);
        try {
          setSize.call(x2);
        } catch (s2) {
          return true;
        }
        return x2 instanceof Map;
      } catch (e) {
      }
      return false;
    }
    function isWeakMap(x2) {
      if (!weakMapHas || !x2 || typeof x2 !== "object") {
        return false;
      }
      try {
        weakMapHas.call(x2, weakMapHas);
        try {
          weakSetHas.call(x2, weakSetHas);
        } catch (s2) {
          return true;
        }
        return x2 instanceof WeakMap;
      } catch (e) {
      }
      return false;
    }
    function isWeakRef(x2) {
      if (!weakRefDeref || !x2 || typeof x2 !== "object") {
        return false;
      }
      try {
        weakRefDeref.call(x2);
        return true;
      } catch (e) {
      }
      return false;
    }
    function isSet2(x2) {
      if (!setSize || !x2 || typeof x2 !== "object") {
        return false;
      }
      try {
        setSize.call(x2);
        try {
          mapSize.call(x2);
        } catch (m) {
          return true;
        }
        return x2 instanceof Set;
      } catch (e) {
      }
      return false;
    }
    function isWeakSet(x2) {
      if (!weakSetHas || !x2 || typeof x2 !== "object") {
        return false;
      }
      try {
        weakSetHas.call(x2, weakSetHas);
        try {
          weakMapHas.call(x2, weakMapHas);
        } catch (s2) {
          return true;
        }
        return x2 instanceof WeakSet;
      } catch (e) {
      }
      return false;
    }
    function isElement(x2) {
      if (!x2 || typeof x2 !== "object") {
        return false;
      }
      if (typeof HTMLElement !== "undefined" && x2 instanceof HTMLElement) {
        return true;
      }
      return typeof x2.nodeName === "string" && typeof x2.getAttribute === "function";
    }
    function inspectString(str, opts) {
      if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
      }
      var quoteRE = quoteREs[opts.quoteStyle || "single"];
      quoteRE.lastIndex = 0;
      var s2 = $replace.call($replace.call(str, quoteRE, "\\$1"), /[\x00-\x1f]/g, lowbyte);
      return wrapQuotes(s2, "single", opts);
    }
    function lowbyte(c) {
      var n = c.charCodeAt(0);
      var x2 = {
        8: "b",
        9: "t",
        10: "n",
        12: "f",
        13: "r"
      }[n];
      if (x2) {
        return "\\" + x2;
      }
      return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
    }
    function markBoxed(str) {
      return "Object(" + str + ")";
    }
    function weakCollectionOf(type2) {
      return type2 + " { ? }";
    }
    function collectionOf(type2, size, entries, indent) {
      var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
      return type2 + " (" + size + ") {" + joinedEntries + "}";
    }
    function singleLineValues(xs) {
      for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], "\n") >= 0) {
          return false;
        }
      }
      return true;
    }
    function getIndent(opts, depth) {
      var baseIndent;
      if (opts.indent === "	") {
        baseIndent = "	";
      } else if (typeof opts.indent === "number" && opts.indent > 0) {
        baseIndent = $join.call(Array(opts.indent + 1), " ");
      } else {
        return null;
      }
      return {
        base: baseIndent,
        prev: $join.call(Array(depth + 1), baseIndent)
      };
    }
    function indentedJoin(xs, indent) {
      if (xs.length === 0) {
        return "";
      }
      var lineJoiner = "\n" + indent.prev + indent.base;
      return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
    }
    function arrObjKeys(obj, inspect) {
      var isArr = isArray2(obj);
      var xs = [];
      if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
          xs[i] = has(obj, i) ? inspect(obj[i], obj) : "";
        }
      }
      var syms = typeof gOPS === "function" ? gOPS(obj) : [];
      var symMap;
      if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
          symMap["$" + syms[k]] = syms[k];
        }
      }
      for (var key in obj) {
        if (!has(obj, key)) {
          continue;
        }
        if (isArr && String(Number(key)) === key && key < obj.length) {
          continue;
        }
        if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) {
          continue;
        } else if ($test.call(/[^\w$]/, key)) {
          xs.push(inspect(key, obj) + ": " + inspect(obj[key], obj));
        } else {
          xs.push(key + ": " + inspect(obj[key], obj));
        }
      }
      if (typeof gOPS === "function") {
        for (var j = 0; j < syms.length; j++) {
          if (isEnumerable.call(obj, syms[j])) {
            xs.push("[" + inspect(syms[j]) + "]: " + inspect(obj[syms[j]], obj));
          }
        }
      }
      return xs;
    }
    return objectInspect;
  }
  var sideChannelList;
  var hasRequiredSideChannelList;
  function requireSideChannelList() {
    if (hasRequiredSideChannelList) return sideChannelList;
    hasRequiredSideChannelList = 1;
    var inspect = /* @__PURE__ */ requireObjectInspect();
    var $TypeError = /* @__PURE__ */ requireType();
    var listGetNode = function(list2, key, isDelete) {
      var prev = list2;
      var curr;
      for (; (curr = prev.next) != null; prev = curr) {
        if (curr.key === key) {
          prev.next = curr.next;
          if (!isDelete) {
            curr.next = /** @type {NonNullable<typeof list.next>} */
            list2.next;
            list2.next = curr;
          }
          return curr;
        }
      }
    };
    var listGet = function(objects, key) {
      if (!objects) {
        return void 0;
      }
      var node = listGetNode(objects, key);
      return node && node.value;
    };
    var listSet = function(objects, key, value) {
      var node = listGetNode(objects, key);
      if (node) {
        node.value = value;
      } else {
        objects.next = /** @type {import('./list.d.ts').ListNode<typeof value, typeof key>} */
        {
          // eslint-disable-line no-param-reassign, no-extra-parens
          key,
          next: objects.next,
          value
        };
      }
    };
    var listHas = function(objects, key) {
      if (!objects) {
        return false;
      }
      return !!listGetNode(objects, key);
    };
    var listDelete = function(objects, key) {
      if (objects) {
        return listGetNode(objects, key, true);
      }
    };
    sideChannelList = function getSideChannelList() {
      var $o;
      var channel = {
        assert: function(key) {
          if (!channel.has(key)) {
            throw new $TypeError("Side channel does not contain " + inspect(key));
          }
        },
        "delete": function(key) {
          var root2 = $o && $o.next;
          var deletedNode = listDelete($o, key);
          if (deletedNode && root2 && root2 === deletedNode) {
            $o = void 0;
          }
          return !!deletedNode;
        },
        get: function(key) {
          return listGet($o, key);
        },
        has: function(key) {
          return listHas($o, key);
        },
        set: function(key, value) {
          if (!$o) {
            $o = {
              next: void 0
            };
          }
          listSet(
            /** @type {NonNullable<typeof $o>} */
            $o,
            key,
            value
          );
        }
      };
      return channel;
    };
    return sideChannelList;
  }
  var esObjectAtoms;
  var hasRequiredEsObjectAtoms;
  function requireEsObjectAtoms() {
    if (hasRequiredEsObjectAtoms) return esObjectAtoms;
    hasRequiredEsObjectAtoms = 1;
    esObjectAtoms = Object;
    return esObjectAtoms;
  }
  var esErrors;
  var hasRequiredEsErrors;
  function requireEsErrors() {
    if (hasRequiredEsErrors) return esErrors;
    hasRequiredEsErrors = 1;
    esErrors = Error;
    return esErrors;
  }
  var _eval;
  var hasRequired_eval;
  function require_eval() {
    if (hasRequired_eval) return _eval;
    hasRequired_eval = 1;
    _eval = EvalError;
    return _eval;
  }
  var range;
  var hasRequiredRange;
  function requireRange() {
    if (hasRequiredRange) return range;
    hasRequiredRange = 1;
    range = RangeError;
    return range;
  }
  var ref;
  var hasRequiredRef;
  function requireRef() {
    if (hasRequiredRef) return ref;
    hasRequiredRef = 1;
    ref = ReferenceError;
    return ref;
  }
  var syntax;
  var hasRequiredSyntax;
  function requireSyntax() {
    if (hasRequiredSyntax) return syntax;
    hasRequiredSyntax = 1;
    syntax = SyntaxError;
    return syntax;
  }
  var uri;
  var hasRequiredUri;
  function requireUri() {
    if (hasRequiredUri) return uri;
    hasRequiredUri = 1;
    uri = URIError;
    return uri;
  }
  var abs;
  var hasRequiredAbs;
  function requireAbs() {
    if (hasRequiredAbs) return abs;
    hasRequiredAbs = 1;
    abs = Math.abs;
    return abs;
  }
  var floor;
  var hasRequiredFloor;
  function requireFloor() {
    if (hasRequiredFloor) return floor;
    hasRequiredFloor = 1;
    floor = Math.floor;
    return floor;
  }
  var max;
  var hasRequiredMax;
  function requireMax() {
    if (hasRequiredMax) return max;
    hasRequiredMax = 1;
    max = Math.max;
    return max;
  }
  var min;
  var hasRequiredMin;
  function requireMin() {
    if (hasRequiredMin) return min;
    hasRequiredMin = 1;
    min = Math.min;
    return min;
  }
  var pow;
  var hasRequiredPow;
  function requirePow() {
    if (hasRequiredPow) return pow;
    hasRequiredPow = 1;
    pow = Math.pow;
    return pow;
  }
  var round;
  var hasRequiredRound;
  function requireRound() {
    if (hasRequiredRound) return round;
    hasRequiredRound = 1;
    round = Math.round;
    return round;
  }
  var _isNaN;
  var hasRequired_isNaN;
  function require_isNaN() {
    if (hasRequired_isNaN) return _isNaN;
    hasRequired_isNaN = 1;
    _isNaN = Number.isNaN || function isNaN2(a) {
      return a !== a;
    };
    return _isNaN;
  }
  var sign;
  var hasRequiredSign;
  function requireSign() {
    if (hasRequiredSign) return sign;
    hasRequiredSign = 1;
    var $isNaN = /* @__PURE__ */ require_isNaN();
    sign = function sign2(number) {
      if ($isNaN(number) || number === 0) {
        return number;
      }
      return number < 0 ? -1 : 1;
    };
    return sign;
  }
  var gOPD;
  var hasRequiredGOPD;
  function requireGOPD() {
    if (hasRequiredGOPD) return gOPD;
    hasRequiredGOPD = 1;
    gOPD = Object.getOwnPropertyDescriptor;
    return gOPD;
  }
  var gopd;
  var hasRequiredGopd;
  function requireGopd() {
    if (hasRequiredGopd) return gopd;
    hasRequiredGopd = 1;
    var $gOPD = /* @__PURE__ */ requireGOPD();
    if ($gOPD) {
      try {
        $gOPD([], "length");
      } catch (e) {
        $gOPD = null;
      }
    }
    gopd = $gOPD;
    return gopd;
  }
  var esDefineProperty;
  var hasRequiredEsDefineProperty;
  function requireEsDefineProperty() {
    if (hasRequiredEsDefineProperty) return esDefineProperty;
    hasRequiredEsDefineProperty = 1;
    var $defineProperty = Object.defineProperty || false;
    if ($defineProperty) {
      try {
        $defineProperty({}, "a", { value: 1 });
      } catch (e) {
        $defineProperty = false;
      }
    }
    esDefineProperty = $defineProperty;
    return esDefineProperty;
  }
  var shams;
  var hasRequiredShams;
  function requireShams() {
    if (hasRequiredShams) return shams;
    hasRequiredShams = 1;
    shams = function hasSymbols2() {
      if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
        return false;
      }
      if (typeof Symbol.iterator === "symbol") {
        return true;
      }
      var obj = {};
      var sym = Symbol("test");
      var symObj = Object(sym);
      if (typeof sym === "string") {
        return false;
      }
      if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
        return false;
      }
      if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
        return false;
      }
      var symVal = 42;
      obj[sym] = symVal;
      for (var _ in obj) {
        return false;
      }
      if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
        return false;
      }
      if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
        return false;
      }
      var syms = Object.getOwnPropertySymbols(obj);
      if (syms.length !== 1 || syms[0] !== sym) {
        return false;
      }
      if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
        return false;
      }
      if (typeof Object.getOwnPropertyDescriptor === "function") {
        var descriptor = (
          /** @type {PropertyDescriptor} */
          Object.getOwnPropertyDescriptor(obj, sym)
        );
        if (descriptor.value !== symVal || descriptor.enumerable !== true) {
          return false;
        }
      }
      return true;
    };
    return shams;
  }
  var hasSymbols;
  var hasRequiredHasSymbols;
  function requireHasSymbols() {
    if (hasRequiredHasSymbols) return hasSymbols;
    hasRequiredHasSymbols = 1;
    var origSymbol = typeof Symbol !== "undefined" && Symbol;
    var hasSymbolSham = requireShams();
    hasSymbols = function hasNativeSymbols() {
      if (typeof origSymbol !== "function") {
        return false;
      }
      if (typeof Symbol !== "function") {
        return false;
      }
      if (typeof origSymbol("foo") !== "symbol") {
        return false;
      }
      if (typeof Symbol("bar") !== "symbol") {
        return false;
      }
      return hasSymbolSham();
    };
    return hasSymbols;
  }
  var Reflect_getPrototypeOf;
  var hasRequiredReflect_getPrototypeOf;
  function requireReflect_getPrototypeOf() {
    if (hasRequiredReflect_getPrototypeOf) return Reflect_getPrototypeOf;
    hasRequiredReflect_getPrototypeOf = 1;
    Reflect_getPrototypeOf = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
    return Reflect_getPrototypeOf;
  }
  var Object_getPrototypeOf;
  var hasRequiredObject_getPrototypeOf;
  function requireObject_getPrototypeOf() {
    if (hasRequiredObject_getPrototypeOf) return Object_getPrototypeOf;
    hasRequiredObject_getPrototypeOf = 1;
    var $Object = /* @__PURE__ */ requireEsObjectAtoms();
    Object_getPrototypeOf = $Object.getPrototypeOf || null;
    return Object_getPrototypeOf;
  }
  var implementation;
  var hasRequiredImplementation;
  function requireImplementation() {
    if (hasRequiredImplementation) return implementation;
    hasRequiredImplementation = 1;
    var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
    var toStr = Object.prototype.toString;
    var max2 = Math.max;
    var funcType = "[object Function]";
    var concatty = function concatty2(a, b) {
      var arr = [];
      for (var i = 0; i < a.length; i += 1) {
        arr[i] = a[i];
      }
      for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
      }
      return arr;
    };
    var slicy = function slicy2(arrLike, offset) {
      var arr = [];
      for (var i = offset, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
      }
      return arr;
    };
    var joiny = function(arr, joiner) {
      var str = "";
      for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
          str += joiner;
        }
      }
      return str;
    };
    implementation = function bind2(that) {
      var target = this;
      if (typeof target !== "function" || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
      }
      var args = slicy(arguments, 1);
      var bound;
      var binder = function() {
        if (this instanceof bound) {
          var result = target.apply(
            this,
            concatty(args, arguments)
          );
          if (Object(result) === result) {
            return result;
          }
          return this;
        }
        return target.apply(
          that,
          concatty(args, arguments)
        );
      };
      var boundLength = max2(0, target.length - args.length);
      var boundArgs = [];
      for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = "$" + i;
      }
      bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
      if (target.prototype) {
        var Empty = function Empty2() {
        };
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
      }
      return bound;
    };
    return implementation;
  }
  var functionBind;
  var hasRequiredFunctionBind;
  function requireFunctionBind() {
    if (hasRequiredFunctionBind) return functionBind;
    hasRequiredFunctionBind = 1;
    var implementation2 = requireImplementation();
    functionBind = Function.prototype.bind || implementation2;
    return functionBind;
  }
  var functionCall;
  var hasRequiredFunctionCall;
  function requireFunctionCall() {
    if (hasRequiredFunctionCall) return functionCall;
    hasRequiredFunctionCall = 1;
    functionCall = Function.prototype.call;
    return functionCall;
  }
  var functionApply;
  var hasRequiredFunctionApply;
  function requireFunctionApply() {
    if (hasRequiredFunctionApply) return functionApply;
    hasRequiredFunctionApply = 1;
    functionApply = Function.prototype.apply;
    return functionApply;
  }
  var reflectApply;
  var hasRequiredReflectApply;
  function requireReflectApply() {
    if (hasRequiredReflectApply) return reflectApply;
    hasRequiredReflectApply = 1;
    reflectApply = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
    return reflectApply;
  }
  var actualApply;
  var hasRequiredActualApply;
  function requireActualApply() {
    if (hasRequiredActualApply) return actualApply;
    hasRequiredActualApply = 1;
    var bind2 = requireFunctionBind();
    var $apply = requireFunctionApply();
    var $call = requireFunctionCall();
    var $reflectApply = requireReflectApply();
    actualApply = $reflectApply || bind2.call($call, $apply);
    return actualApply;
  }
  var callBindApplyHelpers;
  var hasRequiredCallBindApplyHelpers;
  function requireCallBindApplyHelpers() {
    if (hasRequiredCallBindApplyHelpers) return callBindApplyHelpers;
    hasRequiredCallBindApplyHelpers = 1;
    var bind2 = requireFunctionBind();
    var $TypeError = /* @__PURE__ */ requireType();
    var $call = requireFunctionCall();
    var $actualApply = requireActualApply();
    callBindApplyHelpers = function callBindBasic(args) {
      if (args.length < 1 || typeof args[0] !== "function") {
        throw new $TypeError("a function is required");
      }
      return $actualApply(bind2, $call, args);
    };
    return callBindApplyHelpers;
  }
  var get;
  var hasRequiredGet;
  function requireGet() {
    if (hasRequiredGet) return get;
    hasRequiredGet = 1;
    var callBind = requireCallBindApplyHelpers();
    var gOPD2 = /* @__PURE__ */ requireGopd();
    var hasProtoAccessor;
    try {
      hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */
      [].__proto__ === Array.prototype;
    } catch (e) {
      if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
        throw e;
      }
    }
    var desc = !!hasProtoAccessor && gOPD2 && gOPD2(
      Object.prototype,
      /** @type {keyof typeof Object.prototype} */
      "__proto__"
    );
    var $Object = Object;
    var $getPrototypeOf = $Object.getPrototypeOf;
    get = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? (
      /** @type {import('./get')} */
      function getDunder(value) {
        return $getPrototypeOf(value == null ? value : $Object(value));
      }
    ) : false;
    return get;
  }
  var getProto;
  var hasRequiredGetProto;
  function requireGetProto() {
    if (hasRequiredGetProto) return getProto;
    hasRequiredGetProto = 1;
    var reflectGetProto = requireReflect_getPrototypeOf();
    var originalGetProto = requireObject_getPrototypeOf();
    var getDunderProto = /* @__PURE__ */ requireGet();
    getProto = reflectGetProto ? function getProto2(O) {
      return reflectGetProto(O);
    } : originalGetProto ? function getProto2(O) {
      if (!O || typeof O !== "object" && typeof O !== "function") {
        throw new TypeError("getProto: not an object");
      }
      return originalGetProto(O);
    } : getDunderProto ? function getProto2(O) {
      return getDunderProto(O);
    } : null;
    return getProto;
  }
  var hasown;
  var hasRequiredHasown;
  function requireHasown() {
    if (hasRequiredHasown) return hasown;
    hasRequiredHasown = 1;
    var call = Function.prototype.call;
    var $hasOwn = Object.prototype.hasOwnProperty;
    var bind2 = requireFunctionBind();
    hasown = bind2.call(call, $hasOwn);
    return hasown;
  }
  var getIntrinsic;
  var hasRequiredGetIntrinsic;
  function requireGetIntrinsic() {
    if (hasRequiredGetIntrinsic) return getIntrinsic;
    hasRequiredGetIntrinsic = 1;
    var undefined$1;
    var $Object = /* @__PURE__ */ requireEsObjectAtoms();
    var $Error = /* @__PURE__ */ requireEsErrors();
    var $EvalError = /* @__PURE__ */ require_eval();
    var $RangeError = /* @__PURE__ */ requireRange();
    var $ReferenceError = /* @__PURE__ */ requireRef();
    var $SyntaxError = /* @__PURE__ */ requireSyntax();
    var $TypeError = /* @__PURE__ */ requireType();
    var $URIError = /* @__PURE__ */ requireUri();
    var abs2 = /* @__PURE__ */ requireAbs();
    var floor2 = /* @__PURE__ */ requireFloor();
    var max2 = /* @__PURE__ */ requireMax();
    var min2 = /* @__PURE__ */ requireMin();
    var pow2 = /* @__PURE__ */ requirePow();
    var round2 = /* @__PURE__ */ requireRound();
    var sign2 = /* @__PURE__ */ requireSign();
    var $Function = Function;
    var getEvalledConstructor = function(expressionSyntax) {
      try {
        return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
      } catch (e) {
      }
    };
    var $gOPD = /* @__PURE__ */ requireGopd();
    var $defineProperty = /* @__PURE__ */ requireEsDefineProperty();
    var throwTypeError = function() {
      throw new $TypeError();
    };
    var ThrowTypeError = $gOPD ? (function() {
      try {
        arguments.callee;
        return throwTypeError;
      } catch (calleeThrows) {
        try {
          return $gOPD(arguments, "callee").get;
        } catch (gOPDthrows) {
          return throwTypeError;
        }
      }
    })() : throwTypeError;
    var hasSymbols2 = requireHasSymbols()();
    var getProto2 = requireGetProto();
    var $ObjectGPO = requireObject_getPrototypeOf();
    var $ReflectGPO = requireReflect_getPrototypeOf();
    var $apply = requireFunctionApply();
    var $call = requireFunctionCall();
    var needsEval = {};
    var TypedArray = typeof Uint8Array === "undefined" || !getProto2 ? undefined$1 : getProto2(Uint8Array);
    var INTRINSICS = {
      __proto__: null,
      "%AggregateError%": typeof AggregateError === "undefined" ? undefined$1 : AggregateError,
      "%Array%": Array,
      "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined$1 : ArrayBuffer,
      "%ArrayIteratorPrototype%": hasSymbols2 && getProto2 ? getProto2([][Symbol.iterator]()) : undefined$1,
      "%AsyncFromSyncIteratorPrototype%": undefined$1,
      "%AsyncFunction%": needsEval,
      "%AsyncGenerator%": needsEval,
      "%AsyncGeneratorFunction%": needsEval,
      "%AsyncIteratorPrototype%": needsEval,
      "%Atomics%": typeof Atomics === "undefined" ? undefined$1 : Atomics,
      "%BigInt%": typeof BigInt === "undefined" ? undefined$1 : BigInt,
      "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined$1 : BigInt64Array,
      "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined$1 : BigUint64Array,
      "%Boolean%": Boolean,
      "%DataView%": typeof DataView === "undefined" ? undefined$1 : DataView,
      "%Date%": Date,
      "%decodeURI%": decodeURI,
      "%decodeURIComponent%": decodeURIComponent,
      "%encodeURI%": encodeURI,
      "%encodeURIComponent%": encodeURIComponent,
      "%Error%": $Error,
      "%eval%": eval,
      // eslint-disable-line no-eval
      "%EvalError%": $EvalError,
      "%Float16Array%": typeof Float16Array === "undefined" ? undefined$1 : Float16Array,
      "%Float32Array%": typeof Float32Array === "undefined" ? undefined$1 : Float32Array,
      "%Float64Array%": typeof Float64Array === "undefined" ? undefined$1 : Float64Array,
      "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined$1 : FinalizationRegistry,
      "%Function%": $Function,
      "%GeneratorFunction%": needsEval,
      "%Int8Array%": typeof Int8Array === "undefined" ? undefined$1 : Int8Array,
      "%Int16Array%": typeof Int16Array === "undefined" ? undefined$1 : Int16Array,
      "%Int32Array%": typeof Int32Array === "undefined" ? undefined$1 : Int32Array,
      "%isFinite%": isFinite,
      "%isNaN%": isNaN,
      "%IteratorPrototype%": hasSymbols2 && getProto2 ? getProto2(getProto2([][Symbol.iterator]())) : undefined$1,
      "%JSON%": typeof JSON === "object" ? JSON : undefined$1,
      "%Map%": typeof Map === "undefined" ? undefined$1 : Map,
      "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols2 || !getProto2 ? undefined$1 : getProto2((/* @__PURE__ */ new Map())[Symbol.iterator]()),
      "%Math%": Math,
      "%Number%": Number,
      "%Object%": $Object,
      "%Object.getOwnPropertyDescriptor%": $gOPD,
      "%parseFloat%": parseFloat,
      "%parseInt%": parseInt,
      "%Promise%": typeof Promise === "undefined" ? undefined$1 : Promise,
      "%Proxy%": typeof Proxy === "undefined" ? undefined$1 : Proxy,
      "%RangeError%": $RangeError,
      "%ReferenceError%": $ReferenceError,
      "%Reflect%": typeof Reflect === "undefined" ? undefined$1 : Reflect,
      "%RegExp%": RegExp,
      "%Set%": typeof Set === "undefined" ? undefined$1 : Set,
      "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols2 || !getProto2 ? undefined$1 : getProto2((/* @__PURE__ */ new Set())[Symbol.iterator]()),
      "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined$1 : SharedArrayBuffer,
      "%String%": String,
      "%StringIteratorPrototype%": hasSymbols2 && getProto2 ? getProto2(""[Symbol.iterator]()) : undefined$1,
      "%Symbol%": hasSymbols2 ? Symbol : undefined$1,
      "%SyntaxError%": $SyntaxError,
      "%ThrowTypeError%": ThrowTypeError,
      "%TypedArray%": TypedArray,
      "%TypeError%": $TypeError,
      "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined$1 : Uint8Array,
      "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined$1 : Uint8ClampedArray,
      "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined$1 : Uint16Array,
      "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined$1 : Uint32Array,
      "%URIError%": $URIError,
      "%WeakMap%": typeof WeakMap === "undefined" ? undefined$1 : WeakMap,
      "%WeakRef%": typeof WeakRef === "undefined" ? undefined$1 : WeakRef,
      "%WeakSet%": typeof WeakSet === "undefined" ? undefined$1 : WeakSet,
      "%Function.prototype.call%": $call,
      "%Function.prototype.apply%": $apply,
      "%Object.defineProperty%": $defineProperty,
      "%Object.getPrototypeOf%": $ObjectGPO,
      "%Math.abs%": abs2,
      "%Math.floor%": floor2,
      "%Math.max%": max2,
      "%Math.min%": min2,
      "%Math.pow%": pow2,
      "%Math.round%": round2,
      "%Math.sign%": sign2,
      "%Reflect.getPrototypeOf%": $ReflectGPO
    };
    if (getProto2) {
      try {
        null.error;
      } catch (e) {
        var errorProto = getProto2(getProto2(e));
        INTRINSICS["%Error.prototype%"] = errorProto;
      }
    }
    var doEval = function doEval2(name2) {
      var value;
      if (name2 === "%AsyncFunction%") {
        value = getEvalledConstructor("async function () {}");
      } else if (name2 === "%GeneratorFunction%") {
        value = getEvalledConstructor("function* () {}");
      } else if (name2 === "%AsyncGeneratorFunction%") {
        value = getEvalledConstructor("async function* () {}");
      } else if (name2 === "%AsyncGenerator%") {
        var fn2 = doEval2("%AsyncGeneratorFunction%");
        if (fn2) {
          value = fn2.prototype;
        }
      } else if (name2 === "%AsyncIteratorPrototype%") {
        var gen = doEval2("%AsyncGenerator%");
        if (gen && getProto2) {
          value = getProto2(gen.prototype);
        }
      }
      INTRINSICS[name2] = value;
      return value;
    };
    var LEGACY_ALIASES = {
      __proto__: null,
      "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
      "%ArrayPrototype%": ["Array", "prototype"],
      "%ArrayProto_entries%": ["Array", "prototype", "entries"],
      "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
      "%ArrayProto_keys%": ["Array", "prototype", "keys"],
      "%ArrayProto_values%": ["Array", "prototype", "values"],
      "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
      "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
      "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
      "%BooleanPrototype%": ["Boolean", "prototype"],
      "%DataViewPrototype%": ["DataView", "prototype"],
      "%DatePrototype%": ["Date", "prototype"],
      "%ErrorPrototype%": ["Error", "prototype"],
      "%EvalErrorPrototype%": ["EvalError", "prototype"],
      "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
      "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
      "%FunctionPrototype%": ["Function", "prototype"],
      "%Generator%": ["GeneratorFunction", "prototype"],
      "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
      "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
      "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
      "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
      "%JSONParse%": ["JSON", "parse"],
      "%JSONStringify%": ["JSON", "stringify"],
      "%MapPrototype%": ["Map", "prototype"],
      "%NumberPrototype%": ["Number", "prototype"],
      "%ObjectPrototype%": ["Object", "prototype"],
      "%ObjProto_toString%": ["Object", "prototype", "toString"],
      "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
      "%PromisePrototype%": ["Promise", "prototype"],
      "%PromiseProto_then%": ["Promise", "prototype", "then"],
      "%Promise_all%": ["Promise", "all"],
      "%Promise_reject%": ["Promise", "reject"],
      "%Promise_resolve%": ["Promise", "resolve"],
      "%RangeErrorPrototype%": ["RangeError", "prototype"],
      "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
      "%RegExpPrototype%": ["RegExp", "prototype"],
      "%SetPrototype%": ["Set", "prototype"],
      "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
      "%StringPrototype%": ["String", "prototype"],
      "%SymbolPrototype%": ["Symbol", "prototype"],
      "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
      "%TypedArrayPrototype%": ["TypedArray", "prototype"],
      "%TypeErrorPrototype%": ["TypeError", "prototype"],
      "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
      "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
      "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
      "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
      "%URIErrorPrototype%": ["URIError", "prototype"],
      "%WeakMapPrototype%": ["WeakMap", "prototype"],
      "%WeakSetPrototype%": ["WeakSet", "prototype"]
    };
    var bind2 = requireFunctionBind();
    var hasOwn2 = /* @__PURE__ */ requireHasown();
    var $concat = bind2.call($call, Array.prototype.concat);
    var $spliceApply = bind2.call($apply, Array.prototype.splice);
    var $replace = bind2.call($call, String.prototype.replace);
    var $strSlice = bind2.call($call, String.prototype.slice);
    var $exec = bind2.call($call, RegExp.prototype.exec);
    var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
    var reEscapeChar = /\\(\\)?/g;
    var stringToPath = function stringToPath2(string) {
      var first = $strSlice(string, 0, 1);
      var last = $strSlice(string, -1);
      if (first === "%" && last !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
      } else if (last === "%" && first !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
      }
      var result = [];
      $replace(string, rePropName, function(match, number, quote, subString) {
        result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
      });
      return result;
    };
    var getBaseIntrinsic = function getBaseIntrinsic2(name2, allowMissing) {
      var intrinsicName = name2;
      var alias;
      if (hasOwn2(LEGACY_ALIASES, intrinsicName)) {
        alias = LEGACY_ALIASES[intrinsicName];
        intrinsicName = "%" + alias[0] + "%";
      }
      if (hasOwn2(INTRINSICS, intrinsicName)) {
        var value = INTRINSICS[intrinsicName];
        if (value === needsEval) {
          value = doEval(intrinsicName);
        }
        if (typeof value === "undefined" && !allowMissing) {
          throw new $TypeError("intrinsic " + name2 + " exists, but is not available. Please file an issue!");
        }
        return {
          alias,
          name: intrinsicName,
          value
        };
      }
      throw new $SyntaxError("intrinsic " + name2 + " does not exist!");
    };
    getIntrinsic = function GetIntrinsic(name2, allowMissing) {
      if (typeof name2 !== "string" || name2.length === 0) {
        throw new $TypeError("intrinsic name must be a non-empty string");
      }
      if (arguments.length > 1 && typeof allowMissing !== "boolean") {
        throw new $TypeError('"allowMissing" argument must be a boolean');
      }
      if ($exec(/^%?[^%]*%?$/, name2) === null) {
        throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
      }
      var parts = stringToPath(name2);
      var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
      var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
      var intrinsicRealName = intrinsic.name;
      var value = intrinsic.value;
      var skipFurtherCaching = false;
      var alias = intrinsic.alias;
      if (alias) {
        intrinsicBaseName = alias[0];
        $spliceApply(parts, $concat([0, 1], alias));
      }
      for (var i = 1, isOwn = true; i < parts.length; i += 1) {
        var part = parts[i];
        var first = $strSlice(part, 0, 1);
        var last = $strSlice(part, -1);
        if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
          throw new $SyntaxError("property names with quotes must have matching quotes");
        }
        if (part === "constructor" || !isOwn) {
          skipFurtherCaching = true;
        }
        intrinsicBaseName += "." + part;
        intrinsicRealName = "%" + intrinsicBaseName + "%";
        if (hasOwn2(INTRINSICS, intrinsicRealName)) {
          value = INTRINSICS[intrinsicRealName];
        } else if (value != null) {
          if (!(part in value)) {
            if (!allowMissing) {
              throw new $TypeError("base intrinsic for " + name2 + " exists, but the property is not available.");
            }
            return void undefined$1;
          }
          if ($gOPD && i + 1 >= parts.length) {
            var desc = $gOPD(value, part);
            isOwn = !!desc;
            if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
              value = desc.get;
            } else {
              value = value[part];
            }
          } else {
            isOwn = hasOwn2(value, part);
            value = value[part];
          }
          if (isOwn && !skipFurtherCaching) {
            INTRINSICS[intrinsicRealName] = value;
          }
        }
      }
      return value;
    };
    return getIntrinsic;
  }
  var callBound;
  var hasRequiredCallBound;
  function requireCallBound() {
    if (hasRequiredCallBound) return callBound;
    hasRequiredCallBound = 1;
    var GetIntrinsic = /* @__PURE__ */ requireGetIntrinsic();
    var callBindBasic = requireCallBindApplyHelpers();
    var $indexOf = callBindBasic([GetIntrinsic("%String.prototype.indexOf%")]);
    callBound = function callBoundIntrinsic(name2, allowMissing) {
      var intrinsic = (
        /** @type {(this: unknown, ...args: unknown[]) => unknown} */
        GetIntrinsic(name2, !!allowMissing)
      );
      if (typeof intrinsic === "function" && $indexOf(name2, ".prototype.") > -1) {
        return callBindBasic(
          /** @type {const} */
          [intrinsic]
        );
      }
      return intrinsic;
    };
    return callBound;
  }
  var sideChannelMap;
  var hasRequiredSideChannelMap;
  function requireSideChannelMap() {
    if (hasRequiredSideChannelMap) return sideChannelMap;
    hasRequiredSideChannelMap = 1;
    var GetIntrinsic = /* @__PURE__ */ requireGetIntrinsic();
    var callBound2 = /* @__PURE__ */ requireCallBound();
    var inspect = /* @__PURE__ */ requireObjectInspect();
    var $TypeError = /* @__PURE__ */ requireType();
    var $Map = GetIntrinsic("%Map%", true);
    var $mapGet = callBound2("Map.prototype.get", true);
    var $mapSet = callBound2("Map.prototype.set", true);
    var $mapHas = callBound2("Map.prototype.has", true);
    var $mapDelete = callBound2("Map.prototype.delete", true);
    var $mapSize = callBound2("Map.prototype.size", true);
    sideChannelMap = !!$Map && /** @type {Exclude<import('.'), false>} */
    function getSideChannelMap() {
      var $m;
      var channel = {
        assert: function(key) {
          if (!channel.has(key)) {
            throw new $TypeError("Side channel does not contain " + inspect(key));
          }
        },
        "delete": function(key) {
          if ($m) {
            var result = $mapDelete($m, key);
            if ($mapSize($m) === 0) {
              $m = void 0;
            }
            return result;
          }
          return false;
        },
        get: function(key) {
          if ($m) {
            return $mapGet($m, key);
          }
        },
        has: function(key) {
          if ($m) {
            return $mapHas($m, key);
          }
          return false;
        },
        set: function(key, value) {
          if (!$m) {
            $m = new $Map();
          }
          $mapSet($m, key, value);
        }
      };
      return channel;
    };
    return sideChannelMap;
  }
  var sideChannelWeakmap;
  var hasRequiredSideChannelWeakmap;
  function requireSideChannelWeakmap() {
    if (hasRequiredSideChannelWeakmap) return sideChannelWeakmap;
    hasRequiredSideChannelWeakmap = 1;
    var GetIntrinsic = /* @__PURE__ */ requireGetIntrinsic();
    var callBound2 = /* @__PURE__ */ requireCallBound();
    var inspect = /* @__PURE__ */ requireObjectInspect();
    var getSideChannelMap = requireSideChannelMap();
    var $TypeError = /* @__PURE__ */ requireType();
    var $WeakMap = GetIntrinsic("%WeakMap%", true);
    var $weakMapGet = callBound2("WeakMap.prototype.get", true);
    var $weakMapSet = callBound2("WeakMap.prototype.set", true);
    var $weakMapHas = callBound2("WeakMap.prototype.has", true);
    var $weakMapDelete = callBound2("WeakMap.prototype.delete", true);
    sideChannelWeakmap = $WeakMap ? (
      /** @type {Exclude<import('.'), false>} */
      function getSideChannelWeakMap() {
        var $wm;
        var $m;
        var channel = {
          assert: function(key) {
            if (!channel.has(key)) {
              throw new $TypeError("Side channel does not contain " + inspect(key));
            }
          },
          "delete": function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapDelete($wm, key);
              }
            } else if (getSideChannelMap) {
              if ($m) {
                return $m["delete"](key);
              }
            }
            return false;
          },
          get: function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapGet($wm, key);
              }
            }
            return $m && $m.get(key);
          },
          has: function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapHas($wm, key);
              }
            }
            return !!$m && $m.has(key);
          },
          set: function(key, value) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if (!$wm) {
                $wm = new $WeakMap();
              }
              $weakMapSet($wm, key, value);
            } else if (getSideChannelMap) {
              if (!$m) {
                $m = getSideChannelMap();
              }
              $m.set(key, value);
            }
          }
        };
        return channel;
      }
    ) : getSideChannelMap;
    return sideChannelWeakmap;
  }
  var sideChannel;
  var hasRequiredSideChannel;
  function requireSideChannel() {
    if (hasRequiredSideChannel) return sideChannel;
    hasRequiredSideChannel = 1;
    var $TypeError = /* @__PURE__ */ requireType();
    var inspect = /* @__PURE__ */ requireObjectInspect();
    var getSideChannelList = requireSideChannelList();
    var getSideChannelMap = requireSideChannelMap();
    var getSideChannelWeakMap = requireSideChannelWeakmap();
    var makeChannel = getSideChannelWeakMap || getSideChannelMap || getSideChannelList;
    sideChannel = function getSideChannel() {
      var $channelData;
      var channel = {
        assert: function(key) {
          if (!channel.has(key)) {
            throw new $TypeError("Side channel does not contain " + inspect(key));
          }
        },
        "delete": function(key) {
          return !!$channelData && $channelData["delete"](key);
        },
        get: function(key) {
          return $channelData && $channelData.get(key);
        },
        has: function(key) {
          return !!$channelData && $channelData.has(key);
        },
        set: function(key, value) {
          if (!$channelData) {
            $channelData = makeChannel();
          }
          $channelData.set(key, value);
        }
      };
      return channel;
    };
    return sideChannel;
  }
  var formats;
  var hasRequiredFormats;
  function requireFormats() {
    if (hasRequiredFormats) return formats;
    hasRequiredFormats = 1;
    var replace2 = String.prototype.replace;
    var percentTwenties = /%20/g;
    var Format = {
      RFC1738: "RFC1738",
      RFC3986: "RFC3986"
    };
    formats = {
      "default": Format.RFC3986,
      formatters: {
        RFC1738: function(value) {
          return replace2.call(value, percentTwenties, "+");
        },
        RFC3986: function(value) {
          return String(value);
        }
      },
      RFC1738: Format.RFC1738,
      RFC3986: Format.RFC3986
    };
    return formats;
  }
  var utils;
  var hasRequiredUtils;
  function requireUtils() {
    if (hasRequiredUtils) return utils;
    hasRequiredUtils = 1;
    var formats2 = /* @__PURE__ */ requireFormats();
    var has = Object.prototype.hasOwnProperty;
    var isArray2 = Array.isArray;
    var hexTable = (function() {
      var array = [];
      for (var i = 0; i < 256; ++i) {
        array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
      }
      return array;
    })();
    var compactQueue = function compactQueue2(queue2) {
      while (queue2.length > 1) {
        var item2 = queue2.pop();
        var obj = item2.obj[item2.prop];
        if (isArray2(obj)) {
          var compacted = [];
          for (var j = 0; j < obj.length; ++j) {
            if (typeof obj[j] !== "undefined") {
              compacted.push(obj[j]);
            }
          }
          item2.obj[item2.prop] = compacted;
        }
      }
    };
    var arrayToObject2 = function arrayToObject3(source, options) {
      var obj = options && options.plainObjects ? { __proto__: null } : {};
      for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== "undefined") {
          obj[i] = source[i];
        }
      }
      return obj;
    };
    var merge2 = function merge3(target, source, options) {
      if (!source) {
        return target;
      }
      if (typeof source !== "object" && typeof source !== "function") {
        if (isArray2(target)) {
          target.push(source);
        } else if (target && typeof target === "object") {
          if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) {
            target[source] = true;
          }
        } else {
          return [target, source];
        }
        return target;
      }
      if (!target || typeof target !== "object") {
        return [target].concat(source);
      }
      var mergeTarget = target;
      if (isArray2(target) && !isArray2(source)) {
        mergeTarget = arrayToObject2(target, options);
      }
      if (isArray2(target) && isArray2(source)) {
        source.forEach(function(item2, i) {
          if (has.call(target, i)) {
            var targetItem = target[i];
            if (targetItem && typeof targetItem === "object" && item2 && typeof item2 === "object") {
              target[i] = merge3(targetItem, item2, options);
            } else {
              target.push(item2);
            }
          } else {
            target[i] = item2;
          }
        });
        return target;
      }
      return Object.keys(source).reduce(function(acc, key) {
        var value = source[key];
        if (has.call(acc, key)) {
          acc[key] = merge3(acc[key], value, options);
        } else {
          acc[key] = value;
        }
        return acc;
      }, mergeTarget);
    };
    var assign = function assignSingleSource(target, source) {
      return Object.keys(source).reduce(function(acc, key) {
        acc[key] = source[key];
        return acc;
      }, target);
    };
    var decode = function(str, defaultDecoder, charset) {
      var strWithoutPlus = str.replace(/\+/g, " ");
      if (charset === "iso-8859-1") {
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
      }
      try {
        return decodeURIComponent(strWithoutPlus);
      } catch (e) {
        return strWithoutPlus;
      }
    };
    var limit2 = 1024;
    var encode2 = function encode3(str, defaultEncoder, charset, kind, format) {
      if (str.length === 0) {
        return str;
      }
      var string = str;
      if (typeof str === "symbol") {
        string = Symbol.prototype.toString.call(str);
      } else if (typeof str !== "string") {
        string = String(str);
      }
      if (charset === "iso-8859-1") {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
          return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
        });
      }
      var out = "";
      for (var j = 0; j < string.length; j += limit2) {
        var segment = string.length >= limit2 ? string.slice(j, j + limit2) : string;
        var arr = [];
        for (var i = 0; i < segment.length; ++i) {
          var c = segment.charCodeAt(i);
          if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === formats2.RFC1738 && (c === 40 || c === 41)) {
            arr[arr.length] = segment.charAt(i);
            continue;
          }
          if (c < 128) {
            arr[arr.length] = hexTable[c];
            continue;
          }
          if (c < 2048) {
            arr[arr.length] = hexTable[192 | c >> 6] + hexTable[128 | c & 63];
            continue;
          }
          if (c < 55296 || c >= 57344) {
            arr[arr.length] = hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
            continue;
          }
          i += 1;
          c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
          arr[arr.length] = hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
        }
        out += arr.join("");
      }
      return out;
    };
    var compact = function compact2(value) {
      var queue2 = [{ obj: { o: value }, prop: "o" }];
      var refs = [];
      for (var i = 0; i < queue2.length; ++i) {
        var item2 = queue2[i];
        var obj = item2.obj[item2.prop];
        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
          var key = keys[j];
          var val = obj[key];
          if (typeof val === "object" && val !== null && refs.indexOf(val) === -1) {
            queue2.push({ obj, prop: key });
            refs.push(val);
          }
        }
      }
      compactQueue(queue2);
      return value;
    };
    var isRegExp2 = function isRegExp3(obj) {
      return Object.prototype.toString.call(obj) === "[object RegExp]";
    };
    var isBuffer2 = function isBuffer3(obj) {
      if (!obj || typeof obj !== "object") {
        return false;
      }
      return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
    };
    var combine = function combine2(a, b) {
      return [].concat(a, b);
    };
    var maybeMap = function maybeMap2(val, fn2) {
      if (isArray2(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
          mapped.push(fn2(val[i]));
        }
        return mapped;
      }
      return fn2(val);
    };
    utils = {
      arrayToObject: arrayToObject2,
      assign,
      combine,
      compact,
      decode,
      encode: encode2,
      isBuffer: isBuffer2,
      isRegExp: isRegExp2,
      maybeMap,
      merge: merge2
    };
    return utils;
  }
  var stringify_1;
  var hasRequiredStringify;
  function requireStringify() {
    if (hasRequiredStringify) return stringify_1;
    hasRequiredStringify = 1;
    var getSideChannel = requireSideChannel();
    var utils2 = /* @__PURE__ */ requireUtils();
    var formats2 = /* @__PURE__ */ requireFormats();
    var has = Object.prototype.hasOwnProperty;
    var arrayPrefixGenerators = {
      brackets: function brackets(prefix) {
        return prefix + "[]";
      },
      comma: "comma",
      indices: function indices(prefix, key) {
        return prefix + "[" + key + "]";
      },
      repeat: function repeat(prefix) {
        return prefix;
      }
    };
    var isArray2 = Array.isArray;
    var push = Array.prototype.push;
    var pushToArray = function(arr, valueOrArray) {
      push.apply(arr, isArray2(valueOrArray) ? valueOrArray : [valueOrArray]);
    };
    var toISO = Date.prototype.toISOString;
    var defaultFormat = formats2["default"];
    var defaults2 = {
      addQueryPrefix: false,
      allowDots: false,
      allowEmptyArrays: false,
      arrayFormat: "indices",
      charset: "utf-8",
      charsetSentinel: false,
      commaRoundTrip: false,
      delimiter: "&",
      encode: true,
      encodeDotInKeys: false,
      encoder: utils2.encode,
      encodeValuesOnly: false,
      filter: void 0,
      format: defaultFormat,
      formatter: formats2.formatters[defaultFormat],
      // deprecated
      indices: false,
      serializeDate: function serializeDate(date) {
        return toISO.call(date);
      },
      skipNulls: false,
      strictNullHandling: false
    };
    var isNonNullishPrimitive = function isNonNullishPrimitive2(v) {
      return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
    };
    var sentinel = {};
    var stringify = function stringify2(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel2) {
      var obj = object;
      var tmpSc = sideChannel2;
      var step = 0;
      var findFlag = false;
      while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
        var pos = tmpSc.get(object);
        step += 1;
        if (typeof pos !== "undefined") {
          if (pos === step) {
            throw new RangeError("Cyclic object value");
          } else {
            findFlag = true;
          }
        }
        if (typeof tmpSc.get(sentinel) === "undefined") {
          step = 0;
        }
      }
      if (typeof filter === "function") {
        obj = filter(prefix, obj);
      } else if (obj instanceof Date) {
        obj = serializeDate(obj);
      } else if (generateArrayPrefix === "comma" && isArray2(obj)) {
        obj = utils2.maybeMap(obj, function(value2) {
          if (value2 instanceof Date) {
            return serializeDate(value2);
          }
          return value2;
        });
      }
      if (obj === null) {
        if (strictNullHandling) {
          return encoder && !encodeValuesOnly ? encoder(prefix, defaults2.encoder, charset, "key", format) : prefix;
        }
        obj = "";
      }
      if (isNonNullishPrimitive(obj) || utils2.isBuffer(obj)) {
        if (encoder) {
          var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults2.encoder, charset, "key", format);
          return [formatter(keyValue) + "=" + formatter(encoder(obj, defaults2.encoder, charset, "value", format))];
        }
        return [formatter(prefix) + "=" + formatter(String(obj))];
      }
      var values = [];
      if (typeof obj === "undefined") {
        return values;
      }
      var objKeys;
      if (generateArrayPrefix === "comma" && isArray2(obj)) {
        if (encodeValuesOnly && encoder) {
          obj = utils2.maybeMap(obj, encoder);
        }
        objKeys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
      } else if (isArray2(filter)) {
        objKeys = filter;
      } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
      }
      var encodedPrefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
      var adjustedPrefix = commaRoundTrip && isArray2(obj) && obj.length === 1 ? encodedPrefix + "[]" : encodedPrefix;
      if (allowEmptyArrays && isArray2(obj) && obj.length === 0) {
        return adjustedPrefix + "[]";
      }
      for (var j = 0; j < objKeys.length; ++j) {
        var key = objKeys[j];
        var value = typeof key === "object" && key && typeof key.value !== "undefined" ? key.value : obj[key];
        if (skipNulls && value === null) {
          continue;
        }
        var encodedKey = allowDots && encodeDotInKeys ? String(key).replace(/\./g, "%2E") : String(key);
        var keyPrefix = isArray2(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix : adjustedPrefix + (allowDots ? "." + encodedKey : "[" + encodedKey + "]");
        sideChannel2.set(object, step);
        var valueSideChannel = getSideChannel();
        valueSideChannel.set(sentinel, sideChannel2);
        pushToArray(values, stringify2(
          value,
          keyPrefix,
          generateArrayPrefix,
          commaRoundTrip,
          allowEmptyArrays,
          strictNullHandling,
          skipNulls,
          encodeDotInKeys,
          generateArrayPrefix === "comma" && encodeValuesOnly && isArray2(obj) ? null : encoder,
          filter,
          sort,
          allowDots,
          serializeDate,
          format,
          formatter,
          encodeValuesOnly,
          charset,
          valueSideChannel
        ));
      }
      return values;
    };
    var normalizeStringifyOptions = function normalizeStringifyOptions2(opts) {
      if (!opts) {
        return defaults2;
      }
      if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
        throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
      }
      if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") {
        throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
      }
      if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
        throw new TypeError("Encoder has to be a function.");
      }
      var charset = opts.charset || defaults2.charset;
      if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
        throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
      }
      var format = formats2["default"];
      if (typeof opts.format !== "undefined") {
        if (!has.call(formats2.formatters, opts.format)) {
          throw new TypeError("Unknown format option provided.");
        }
        format = opts.format;
      }
      var formatter = formats2.formatters[format];
      var filter = defaults2.filter;
      if (typeof opts.filter === "function" || isArray2(opts.filter)) {
        filter = opts.filter;
      }
      var arrayFormat;
      if (opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
      } else if ("indices" in opts) {
        arrayFormat = opts.indices ? "indices" : "repeat";
      } else {
        arrayFormat = defaults2.arrayFormat;
      }
      if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
        throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
      }
      var allowDots = typeof opts.allowDots === "undefined" ? opts.encodeDotInKeys === true ? true : defaults2.allowDots : !!opts.allowDots;
      return {
        addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults2.addQueryPrefix,
        allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults2.allowEmptyArrays,
        arrayFormat,
        charset,
        charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults2.charsetSentinel,
        commaRoundTrip: !!opts.commaRoundTrip,
        delimiter: typeof opts.delimiter === "undefined" ? defaults2.delimiter : opts.delimiter,
        encode: typeof opts.encode === "boolean" ? opts.encode : defaults2.encode,
        encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults2.encodeDotInKeys,
        encoder: typeof opts.encoder === "function" ? opts.encoder : defaults2.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults2.encodeValuesOnly,
        filter,
        format,
        formatter,
        serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults2.serializeDate,
        skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults2.skipNulls,
        sort: typeof opts.sort === "function" ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults2.strictNullHandling
      };
    };
    stringify_1 = function(object, opts) {
      var obj = object;
      var options = normalizeStringifyOptions(opts);
      var objKeys;
      var filter;
      if (typeof options.filter === "function") {
        filter = options.filter;
        obj = filter("", obj);
      } else if (isArray2(options.filter)) {
        filter = options.filter;
        objKeys = filter;
      }
      var keys = [];
      if (typeof obj !== "object" || obj === null) {
        return "";
      }
      var generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
      var commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
      if (!objKeys) {
        objKeys = Object.keys(obj);
      }
      if (options.sort) {
        objKeys.sort(options.sort);
      }
      var sideChannel2 = getSideChannel();
      for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];
        var value = obj[key];
        if (options.skipNulls && value === null) {
          continue;
        }
        pushToArray(keys, stringify(
          value,
          key,
          generateArrayPrefix,
          commaRoundTrip,
          options.allowEmptyArrays,
          options.strictNullHandling,
          options.skipNulls,
          options.encodeDotInKeys,
          options.encode ? options.encoder : null,
          options.filter,
          options.sort,
          options.allowDots,
          options.serializeDate,
          options.format,
          options.formatter,
          options.encodeValuesOnly,
          options.charset,
          sideChannel2
        ));
      }
      var joined = keys.join(options.delimiter);
      var prefix = options.addQueryPrefix === true ? "?" : "";
      if (options.charsetSentinel) {
        if (options.charset === "iso-8859-1") {
          prefix += "utf8=%26%2310003%3B&";
        } else {
          prefix += "utf8=%E2%9C%93&";
        }
      }
      return joined.length > 0 ? prefix + joined : "";
    };
    return stringify_1;
  }
  var parse$2;
  var hasRequiredParse;
  function requireParse() {
    if (hasRequiredParse) return parse$2;
    hasRequiredParse = 1;
    var utils2 = /* @__PURE__ */ requireUtils();
    var has = Object.prototype.hasOwnProperty;
    var isArray2 = Array.isArray;
    var defaults2 = {
      allowDots: false,
      allowEmptyArrays: false,
      allowPrototypes: false,
      allowSparse: false,
      arrayLimit: 20,
      charset: "utf-8",
      charsetSentinel: false,
      comma: false,
      decodeDotInKeys: false,
      decoder: utils2.decode,
      delimiter: "&",
      depth: 5,
      duplicates: "combine",
      ignoreQueryPrefix: false,
      interpretNumericEntities: false,
      parameterLimit: 1e3,
      parseArrays: true,
      plainObjects: false,
      strictDepth: false,
      strictNullHandling: false,
      throwOnLimitExceeded: false
    };
    var interpretNumericEntities = function(str) {
      return str.replace(/&#(\d+);/g, function($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
      });
    };
    var parseArrayValue = function(val, options, currentArrayLength) {
      if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
        return val.split(",");
      }
      if (options.throwOnLimitExceeded && currentArrayLength >= options.arrayLimit) {
        throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
      }
      return val;
    };
    var isoSentinel = "utf8=%26%2310003%3B";
    var charsetSentinel = "utf8=%E2%9C%93";
    var parseValues = function parseQueryStringValues(str, options) {
      var obj = { __proto__: null };
      var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
      cleanStr = cleanStr.replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      var limit2 = options.parameterLimit === Infinity ? void 0 : options.parameterLimit;
      var parts = cleanStr.split(
        options.delimiter,
        options.throwOnLimitExceeded ? limit2 + 1 : limit2
      );
      if (options.throwOnLimitExceeded && parts.length > limit2) {
        throw new RangeError("Parameter limit exceeded. Only " + limit2 + " parameter" + (limit2 === 1 ? "" : "s") + " allowed.");
      }
      var skipIndex = -1;
      var i;
      var charset = options.charset;
      if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
          if (parts[i].indexOf("utf8=") === 0) {
            if (parts[i] === charsetSentinel) {
              charset = "utf-8";
            } else if (parts[i] === isoSentinel) {
              charset = "iso-8859-1";
            }
            skipIndex = i;
            i = parts.length;
          }
        }
      }
      for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
          continue;
        }
        var part = parts[i];
        var bracketEqualsPos = part.indexOf("]=");
        var pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
        var key;
        var val;
        if (pos === -1) {
          key = options.decoder(part, defaults2.decoder, charset, "key");
          val = options.strictNullHandling ? null : "";
        } else {
          key = options.decoder(part.slice(0, pos), defaults2.decoder, charset, "key");
          val = utils2.maybeMap(
            parseArrayValue(
              part.slice(pos + 1),
              options,
              isArray2(obj[key]) ? obj[key].length : 0
            ),
            function(encodedVal) {
              return options.decoder(encodedVal, defaults2.decoder, charset, "value");
            }
          );
        }
        if (val && options.interpretNumericEntities && charset === "iso-8859-1") {
          val = interpretNumericEntities(String(val));
        }
        if (part.indexOf("[]=") > -1) {
          val = isArray2(val) ? [val] : val;
        }
        var existing = has.call(obj, key);
        if (existing && options.duplicates === "combine") {
          obj[key] = utils2.combine(obj[key], val);
        } else if (!existing || options.duplicates === "last") {
          obj[key] = val;
        }
      }
      return obj;
    };
    var parseObject = function(chain, val, options, valuesParsed) {
      var currentArrayLength = 0;
      if (chain.length > 0 && chain[chain.length - 1] === "[]") {
        var parentKey = chain.slice(0, -1).join("");
        currentArrayLength = Array.isArray(val) && val[parentKey] ? val[parentKey].length : 0;
      }
      var leaf = valuesParsed ? val : parseArrayValue(val, options, currentArrayLength);
      for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root2 = chain[i];
        if (root2 === "[]" && options.parseArrays) {
          obj = options.allowEmptyArrays && (leaf === "" || options.strictNullHandling && leaf === null) ? [] : utils2.combine([], leaf);
        } else {
          obj = options.plainObjects ? { __proto__: null } : {};
          var cleanRoot = root2.charAt(0) === "[" && root2.charAt(root2.length - 1) === "]" ? root2.slice(1, -1) : root2;
          var decodedRoot = options.decodeDotInKeys ? cleanRoot.replace(/%2E/g, ".") : cleanRoot;
          var index = parseInt(decodedRoot, 10);
          if (!options.parseArrays && decodedRoot === "") {
            obj = { 0: leaf };
          } else if (!isNaN(index) && root2 !== decodedRoot && String(index) === decodedRoot && index >= 0 && (options.parseArrays && index <= options.arrayLimit)) {
            obj = [];
            obj[index] = leaf;
          } else if (decodedRoot !== "__proto__") {
            obj[decodedRoot] = leaf;
          }
        }
        leaf = obj;
      }
      return leaf;
    };
    var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
      if (!givenKey) {
        return;
      }
      var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, "[$1]") : givenKey;
      var brackets = /(\[[^[\]]*])/;
      var child = /(\[[^[\]]*])/g;
      var segment = options.depth > 0 && brackets.exec(key);
      var parent = segment ? key.slice(0, segment.index) : key;
      var keys = [];
      if (parent) {
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
          if (!options.allowPrototypes) {
            return;
          }
        }
        keys.push(parent);
      }
      var i = 0;
      while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
          if (!options.allowPrototypes) {
            return;
          }
        }
        keys.push(segment[1]);
      }
      if (segment) {
        if (options.strictDepth === true) {
          throw new RangeError("Input depth exceeded depth option of " + options.depth + " and strictDepth is true");
        }
        keys.push("[" + key.slice(segment.index) + "]");
      }
      return parseObject(keys, val, options, valuesParsed);
    };
    var normalizeParseOptions = function normalizeParseOptions2(opts) {
      if (!opts) {
        return defaults2;
      }
      if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
        throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
      }
      if (typeof opts.decodeDotInKeys !== "undefined" && typeof opts.decodeDotInKeys !== "boolean") {
        throw new TypeError("`decodeDotInKeys` option can only be `true` or `false`, when provided");
      }
      if (opts.decoder !== null && typeof opts.decoder !== "undefined" && typeof opts.decoder !== "function") {
        throw new TypeError("Decoder has to be a function.");
      }
      if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
        throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
      }
      if (typeof opts.throwOnLimitExceeded !== "undefined" && typeof opts.throwOnLimitExceeded !== "boolean") {
        throw new TypeError("`throwOnLimitExceeded` option must be a boolean");
      }
      var charset = typeof opts.charset === "undefined" ? defaults2.charset : opts.charset;
      var duplicates = typeof opts.duplicates === "undefined" ? defaults2.duplicates : opts.duplicates;
      if (duplicates !== "combine" && duplicates !== "first" && duplicates !== "last") {
        throw new TypeError("The duplicates option must be either combine, first, or last");
      }
      var allowDots = typeof opts.allowDots === "undefined" ? opts.decodeDotInKeys === true ? true : defaults2.allowDots : !!opts.allowDots;
      return {
        allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults2.allowEmptyArrays,
        allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults2.allowPrototypes,
        allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults2.allowSparse,
        arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults2.arrayLimit,
        charset,
        charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults2.charsetSentinel,
        comma: typeof opts.comma === "boolean" ? opts.comma : defaults2.comma,
        decodeDotInKeys: typeof opts.decodeDotInKeys === "boolean" ? opts.decodeDotInKeys : defaults2.decodeDotInKeys,
        decoder: typeof opts.decoder === "function" ? opts.decoder : defaults2.decoder,
        delimiter: typeof opts.delimiter === "string" || utils2.isRegExp(opts.delimiter) ? opts.delimiter : defaults2.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults2.depth,
        duplicates,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults2.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults2.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults2.plainObjects,
        strictDepth: typeof opts.strictDepth === "boolean" ? !!opts.strictDepth : defaults2.strictDepth,
        strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults2.strictNullHandling,
        throwOnLimitExceeded: typeof opts.throwOnLimitExceeded === "boolean" ? opts.throwOnLimitExceeded : false
      };
    };
    parse$2 = function(str, opts) {
      var options = normalizeParseOptions(opts);
      if (str === "" || str === null || typeof str === "undefined") {
        return options.plainObjects ? { __proto__: null } : {};
      }
      var tempObj = typeof str === "string" ? parseValues(str, options) : str;
      var obj = options.plainObjects ? { __proto__: null } : {};
      var keys = Object.keys(tempObj);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
        obj = utils2.merge(obj, newObj, options);
      }
      if (options.allowSparse === true) {
        return obj;
      }
      return utils2.compact(obj);
    };
    return parse$2;
  }
  var lib;
  var hasRequiredLib;
  function requireLib() {
    if (hasRequiredLib) return lib;
    hasRequiredLib = 1;
    var stringify = /* @__PURE__ */ requireStringify();
    var parse2 = /* @__PURE__ */ requireParse();
    var formats2 = /* @__PURE__ */ requireFormats();
    lib = {
      formats: formats2,
      parse: parse2,
      stringify
    };
    return lib;
  }
  var libExports = /* @__PURE__ */ requireLib();
  const qs = /* @__PURE__ */ getDefaultExportFromCjs(libExports);
  const _export_sfc = (sfc, props2) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props2) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main = {
    __name: "App",
    props: {
      payload: {
        type: Object,
        required: true
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const FilePond = vueFilePond(plugin$1, plugin);
      const props2 = __props;
      const files = ref$1(props2.payload.files || []);
      const maxFileSize = computed(() => {
        var _a, _b;
        return ((_b = (_a = props2.payload) == null ? void 0 : _a.uploaderOptions) == null ? void 0 : _b.maxFilesize) ? `${props2.payload.uploaderOptions.maxFilesize}MB` : null;
      });
      const maxFiles = computed(() => {
        var _a, _b;
        return ((_b = (_a = props2.payload) == null ? void 0 : _a.uploaderOptions) == null ? void 0 : _b.maxFiles) ?? null;
      });
      const allowMultiple = computed(() => {
        var _a, _b;
        return ((_b = (_a = props2.payload) == null ? void 0 : _a.uploaderOptions) == null ? void 0 : _b.allowMultiple) ?? false;
      });
      const showUploader = computed(() => {
        var _a, _b;
        if (allowMultiple.value) {
          if (maxFiles.value !== null) {
            return ((_a = files.value) == null ? void 0 : _a.length) < maxFiles.value;
          }
          return true;
        }
        return ((_b = files.value) == null ? void 0 : _b.length) === 0;
      });
      const showFileList = computed(() => {
        if (allowMultiple.value) {
          return true;
        }
        return !showUploader.value;
      });
      const processUpload = async (file2, metadata, load, error2, progress, requestController) => {
        var _a;
        try {
          const presignedUrlParams = {
            ...props2.payload.settings,
            file: {
              name: file2.name,
              type: file2.type
            }
          };
          const presignedUrl = (await axios.post(`${location.origin}/admin/s3/sign?${qs.stringify(presignedUrlParams)}`, null, {
            signal: requestController.signal
          })).data;
          await axios.put(presignedUrl, file2, {
            headers: {
              "Content-Type": file2.type
            },
            signal: requestController.signal,
            onUploadProgress: (progressEvent) => {
              progress(true, progressEvent.loaded, progressEvent.total);
            }
          });
          const { bucket } = props2.payload.settings;
          const urlParts = new URL(presignedUrl).pathname.slice(1).split("/");
          if (props2.payload.settings.usePathStyleEndpoint) {
            urlParts.shift();
          }
          const key = urlParts.join("/");
          const fileData = {
            name: file2.name,
            size: file2.size,
            type: file2.type,
            region: props2.payload.settings.region,
            lastModified: file2.lastModified,
            customPayload: props2.payload.customPayload,
            bucket,
            key
          };
          const fileCreateResponse = await axios.post(
            `${location.origin}/admin/s3/uploaded`,
            fileData,
            {
              signal: requestController.signal
            }
          );
          files.value.push(fileCreateResponse.data);
          load();
        } catch (e) {
          if (((_a = e == null ? void 0 : e.response) == null ? void 0 : _a.data) && typeof e.response.data === "string") {
            error2(e.response.data);
          } else {
            error2(e.message);
          }
        }
      };
      const filepondServerConfig = computed(() => ({
        // eslint-disable-next-line no-unused-vars
        process: (fieldName, file2, metadata, load, error2, progress, abort, transfer, options) => {
          const requestController = new AbortController();
          processUpload(file2, metadata, load, error2, progress, requestController);
          return {
            abort: () => {
              requestController.abort();
              abort();
            }
          };
        },
        revert: null,
        restore: null,
        load: null,
        fetch: null
      }));
      const getIconClass = (file2) => {
        if (!file2) return null;
        const { type: type2 } = file2;
        if (type2 && type2.indexOf("video") > -1) return "file-video";
        if (type2 && type2.indexOf("image") > -1) return "file-image";
        return "file";
      };
      const removeFile = (file2) => {
        axios.post(
          `${location.origin}/admin/s3/remove/${file2.id}`,
          {
            customPayload: props2.payload.customPayload
          }
        ).then(() => {
          files.value = files.value.filter((f) => f.id !== file2.id);
        });
      };
      const handleFileTypeDetection = (source, type2) => new Promise((resolve2) => {
        if (!type2) {
          if (typeof source.name === "string") {
            const extension = source.name.split(".").pop();
            if (extension) {
              switch (extension) {
                case "psd":
                  resolve2("image/vnd.adobe.photoshop");
                  break;
                default:
                  resolve2(type2);
              }
            }
          }
        }
        resolve2(type2);
      });
      const __returned__ = { FilePond, props: props2, files, maxFileSize, maxFiles, allowMultiple, showUploader, showFileList, processUpload, filepondServerConfig, getIconClass, removeFile, handleFileTypeDetection, ref: ref$1, computed, get vueFilePond() {
        return vueFilePond;
      }, get FilePondPluginFileValidateType() {
        return plugin$1;
      }, get FilePondPluginFileValidateSize() {
        return plugin;
      }, get axios() {
        return axios;
      }, get qs() {
        return qs;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  const _hoisted_1 = { class: "s3-file-upload-component" };
  const _hoisted_2 = { key: 1 };
  const _hoisted_3 = {
    key: 0,
    class: "s3-file-upload-preview-icon"
  };
  const _hoisted_4 = { class: "s3-file-upload-preview-info fill-height flexbox-area-grow" };
  const _hoisted_5 = { class: "s3-file-upload-meta" };
  const _hoisted_6 = ["href"];
  const _hoisted_7 = { class: "s3-file-upload-muted" };
  const _hoisted_8 = ["onClick"];
  const _hoisted_9 = ["id", "name", "value"];
  const _hoisted_10 = ["name", "value"];
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    var _a;
    const _component_fa_icon = resolveComponent("fa-icon");
    return openBlock(), createElementBlock("div", _hoisted_1, [
      $setup.showUploader ? (openBlock(), createBlock($setup["FilePond"], {
        key: 0,
        name: $props.payload.name + "-filepond",
        class: normalizeClass({ "mb-4": $setup.showFileList }),
        "lable-idle": "Drop files here to upload",
        "allow-multiple": $setup.allowMultiple,
        "allow-file-type-validation": $props.payload.uploaderOptions.validateFileType,
        "accepted-file-types": $props.payload.uploaderOptions.acceptedFiles,
        "file-validate-type-detect-type": $setup.handleFileTypeDetection,
        server: $setup.filepondServerConfig,
        "max-file-size": $setup.maxFileSize,
        "max-files": $setup.maxFiles
      }, null, 8, ["name", "class", "allow-multiple", "allow-file-type-validation", "accepted-file-types", "server", "max-file-size", "max-files"])) : createCommentVNode("v-if", true),
      $setup.showFileList ? (openBlock(), createElementBlock("div", _hoisted_2, [
        (openBlock(true), createElementBlock(
          Fragment,
          null,
          renderList($setup.files, (file2) => {
            return openBlock(), createElementBlock(
              "div",
              {
                key: file2.id,
                class: normalizeClass([{ "mt-2": $setup.files.length > 1 }, "s3-file-upload-preview"])
              },
              [
                $setup.getIconClass(file2) ? (openBlock(), createElementBlock("div", _hoisted_3, [
                  createVNode(_component_fa_icon, {
                    icon: ["fas", $setup.getIconClass(file2)]
                  }, null, 8, ["icon"])
                ])) : createCommentVNode("v-if", true),
                createBaseVNode("div", _hoisted_4, [
                  createBaseVNode("div", _hoisted_5, [
                    createBaseVNode("a", {
                      href: file2.presignedUrl ?? file2.location,
                      target: "_blank"
                    }, toDisplayString(file2.name), 9, _hoisted_6),
                    createBaseVNode(
                      "span",
                      _hoisted_7,
                      toDisplayString(file2.size),
                      1
                      /* TEXT */
                    )
                  ])
                ]),
                createBaseVNode("button", {
                  class: "btn uploadfield-item__remove-btn btn-secondary btn--no-text font-icon-cancel btn--icon-md",
                  onClick: withModifiers(($event) => $setup.removeFile(file2), ["prevent"])
                }, null, 8, _hoisted_8)
              ],
              2
              /* CLASS */
            );
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])) : createCommentVNode("v-if", true),
      !$setup.allowMultiple ? (openBlock(), createElementBlock("input", {
        key: 2,
        type: "hidden",
        id: $props.payload.id,
        name: $props.payload.name,
        value: ((_a = $setup.files[0]) == null ? void 0 : _a.id) ?? null
      }, null, 8, _hoisted_9)) : (openBlock(true), createElementBlock(
        Fragment,
        { key: 3 },
        renderList($setup.files, (file2) => {
          return openBlock(), createElementBlock("input", {
            type: "hidden",
            name: $props.payload.name + "[]",
            value: file2.id
          }, null, 8, _hoisted_10);
        }),
        256
        /* UNKEYED_FRAGMENT */
      ))
    ]);
  }
  const S3Upload = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/kd/www/basf/color-materials/apps/backend/vendor/level51/silverstripe-s3upload/client/src/js/App.vue"]]);
  const watchElement = (selector, fn2) => {
    const listeners2 = [];
    const doc2 = window.document;
    const MutationObserver2 = window.MutationObserver || window.WebKitMutationObserver;
    let observer;
    const check = () => {
      for (let i = 0, len = listeners2.length, listener2, elements; i < len; i += 1) {
        listener2 = listeners2[i];
        elements = doc2.querySelectorAll(listener2.selector);
        for (let j = 0, jLen = elements.length, element; j < jLen; j += 1) {
          element = elements[j];
          if (!element.ready) {
            element.ready = true;
            listener2.fn.call(element, element);
          }
        }
      }
    };
    if (!observer) {
      observer = new MutationObserver2(check);
      observer.observe(doc2.documentElement, {
        childList: true,
        subtree: true
      });
    }
    listeners2.push({
      selector,
      fn: fn2
    });
    check();
  };
  /*!
   * Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com
   * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
   * Copyright 2024 Fonticons, Inc.
   */
  function _defineProperty$1(e, r2, t2) {
    return (r2 = _toPropertyKey$1(r2)) in e ? Object.defineProperty(e, r2, {
      value: t2,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e[r2] = t2, e;
  }
  function ownKeys$1(e, r2) {
    var t2 = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o2 = Object.getOwnPropertySymbols(e);
      r2 && (o2 = o2.filter(function(r3) {
        return Object.getOwnPropertyDescriptor(e, r3).enumerable;
      })), t2.push.apply(t2, o2);
    }
    return t2;
  }
  function _objectSpread2$1(e) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t2 = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys$1(Object(t2), true).forEach(function(r3) {
        _defineProperty$1(e, r3, t2[r3]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys$1(Object(t2)).forEach(function(r3) {
        Object.defineProperty(e, r3, Object.getOwnPropertyDescriptor(t2, r3));
      });
    }
    return e;
  }
  function _toPrimitive$1(t2, r2) {
    if ("object" != typeof t2 || !t2) return t2;
    var e = t2[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t2, r2);
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t2);
  }
  function _toPropertyKey$1(t2) {
    var i = _toPrimitive$1(t2, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  const noop = () => {
  };
  let _WINDOW = {};
  let _DOCUMENT = {};
  let _MUTATION_OBSERVER = null;
  let _PERFORMANCE = {
    mark: noop,
    measure: noop
  };
  try {
    if (typeof window !== "undefined") _WINDOW = window;
    if (typeof document !== "undefined") _DOCUMENT = document;
    if (typeof MutationObserver !== "undefined") _MUTATION_OBSERVER = MutationObserver;
    if (typeof performance !== "undefined") _PERFORMANCE = performance;
  } catch (e) {
  }
  const {
    userAgent = ""
  } = _WINDOW.navigator || {};
  const WINDOW = _WINDOW;
  const DOCUMENT = _DOCUMENT;
  const MUTATION_OBSERVER = _MUTATION_OBSERVER;
  const PERFORMANCE = _PERFORMANCE;
  !!WINDOW.document;
  const IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === "function" && typeof DOCUMENT.createElement === "function";
  const IS_IE = ~userAgent.indexOf("MSIE") || ~userAgent.indexOf("Trident/");
  var p = /fa(s|r|l|t|d|dr|dl|dt|b|k|kd|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/, g = /Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i;
  var S = {
    classic: {
      fa: "solid",
      fas: "solid",
      "fa-solid": "solid",
      far: "regular",
      "fa-regular": "regular",
      fal: "light",
      "fa-light": "light",
      fat: "thin",
      "fa-thin": "thin",
      fab: "brands",
      "fa-brands": "brands"
    },
    duotone: {
      fa: "solid",
      fad: "solid",
      "fa-solid": "solid",
      "fa-duotone": "solid",
      fadr: "regular",
      "fa-regular": "regular",
      fadl: "light",
      "fa-light": "light",
      fadt: "thin",
      "fa-thin": "thin"
    },
    sharp: {
      fa: "solid",
      fass: "solid",
      "fa-solid": "solid",
      fasr: "regular",
      "fa-regular": "regular",
      fasl: "light",
      "fa-light": "light",
      fast: "thin",
      "fa-thin": "thin"
    },
    "sharp-duotone": {
      fa: "solid",
      fasds: "solid",
      "fa-solid": "solid",
      fasdr: "regular",
      "fa-regular": "regular",
      fasdl: "light",
      "fa-light": "light",
      fasdt: "thin",
      "fa-thin": "thin"
    }
  }, A = {
    GROUP: "duotone-group",
    PRIMARY: "primary",
    SECONDARY: "secondary"
  }, P = ["fa-classic", "fa-duotone", "fa-sharp", "fa-sharp-duotone"];
  var s = "classic", t = "duotone", r = "sharp", o = "sharp-duotone", L = [s, t, r, o];
  var G = {
    classic: {
      900: "fas",
      400: "far",
      normal: "far",
      300: "fal",
      100: "fat"
    },
    duotone: {
      900: "fad",
      400: "fadr",
      300: "fadl",
      100: "fadt"
    },
    sharp: {
      900: "fass",
      400: "fasr",
      300: "fasl",
      100: "fast"
    },
    "sharp-duotone": {
      900: "fasds",
      400: "fasdr",
      300: "fasdl",
      100: "fasdt"
    }
  };
  var lt = {
    "Font Awesome 6 Free": {
      900: "fas",
      400: "far"
    },
    "Font Awesome 6 Pro": {
      900: "fas",
      400: "far",
      normal: "far",
      300: "fal",
      100: "fat"
    },
    "Font Awesome 6 Brands": {
      400: "fab",
      normal: "fab"
    },
    "Font Awesome 6 Duotone": {
      900: "fad",
      400: "fadr",
      normal: "fadr",
      300: "fadl",
      100: "fadt"
    },
    "Font Awesome 6 Sharp": {
      900: "fass",
      400: "fasr",
      normal: "fasr",
      300: "fasl",
      100: "fast"
    },
    "Font Awesome 6 Sharp Duotone": {
      900: "fasds",
      400: "fasdr",
      normal: "fasdr",
      300: "fasdl",
      100: "fasdt"
    }
  };
  var pt = /* @__PURE__ */ new Map([["classic", {
    defaultShortPrefixId: "fas",
    defaultStyleId: "solid",
    styleIds: ["solid", "regular", "light", "thin", "brands"],
    futureStyleIds: [],
    defaultFontWeight: 900
  }], ["sharp", {
    defaultShortPrefixId: "fass",
    defaultStyleId: "solid",
    styleIds: ["solid", "regular", "light", "thin"],
    futureStyleIds: [],
    defaultFontWeight: 900
  }], ["duotone", {
    defaultShortPrefixId: "fad",
    defaultStyleId: "solid",
    styleIds: ["solid", "regular", "light", "thin"],
    futureStyleIds: [],
    defaultFontWeight: 900
  }], ["sharp-duotone", {
    defaultShortPrefixId: "fasds",
    defaultStyleId: "solid",
    styleIds: ["solid", "regular", "light", "thin"],
    futureStyleIds: [],
    defaultFontWeight: 900
  }]]), xt = {
    classic: {
      solid: "fas",
      regular: "far",
      light: "fal",
      thin: "fat",
      brands: "fab"
    },
    duotone: {
      solid: "fad",
      regular: "fadr",
      light: "fadl",
      thin: "fadt"
    },
    sharp: {
      solid: "fass",
      regular: "fasr",
      light: "fasl",
      thin: "fast"
    },
    "sharp-duotone": {
      solid: "fasds",
      regular: "fasdr",
      light: "fasdl",
      thin: "fasdt"
    }
  };
  var Ft = ["fak", "fa-kit", "fakd", "fa-kit-duotone"], St = {
    kit: {
      fak: "kit",
      "fa-kit": "kit"
    },
    "kit-duotone": {
      fakd: "kit-duotone",
      "fa-kit-duotone": "kit-duotone"
    }
  }, At = ["kit"];
  var Ct = {
    kit: {
      "fa-kit": "fak"
    }
  };
  var Lt = ["fak", "fakd"], Wt = {
    kit: {
      fak: "fa-kit"
    }
  };
  var Et = {
    kit: {
      kit: "fak"
    },
    "kit-duotone": {
      "kit-duotone": "fakd"
    }
  };
  var t$1 = {
    GROUP: "duotone-group",
    SWAP_OPACITY: "swap-opacity",
    PRIMARY: "primary",
    SECONDARY: "secondary"
  }, r$1 = ["fa-classic", "fa-duotone", "fa-sharp", "fa-sharp-duotone"];
  var bt$1 = ["fak", "fa-kit", "fakd", "fa-kit-duotone"];
  var Yt = {
    "Font Awesome Kit": {
      400: "fak",
      normal: "fak"
    },
    "Font Awesome Kit Duotone": {
      400: "fakd",
      normal: "fakd"
    }
  };
  var ua = {
    classic: {
      "fa-brands": "fab",
      "fa-duotone": "fad",
      "fa-light": "fal",
      "fa-regular": "far",
      "fa-solid": "fas",
      "fa-thin": "fat"
    },
    duotone: {
      "fa-regular": "fadr",
      "fa-light": "fadl",
      "fa-thin": "fadt"
    },
    sharp: {
      "fa-solid": "fass",
      "fa-regular": "fasr",
      "fa-light": "fasl",
      "fa-thin": "fast"
    },
    "sharp-duotone": {
      "fa-solid": "fasds",
      "fa-regular": "fasdr",
      "fa-light": "fasdl",
      "fa-thin": "fasdt"
    }
  }, I$1 = {
    classic: ["fas", "far", "fal", "fat", "fad"],
    duotone: ["fadr", "fadl", "fadt"],
    sharp: ["fass", "fasr", "fasl", "fast"],
    "sharp-duotone": ["fasds", "fasdr", "fasdl", "fasdt"]
  }, ga = {
    classic: {
      fab: "fa-brands",
      fad: "fa-duotone",
      fal: "fa-light",
      far: "fa-regular",
      fas: "fa-solid",
      fat: "fa-thin"
    },
    duotone: {
      fadr: "fa-regular",
      fadl: "fa-light",
      fadt: "fa-thin"
    },
    sharp: {
      fass: "fa-solid",
      fasr: "fa-regular",
      fasl: "fa-light",
      fast: "fa-thin"
    },
    "sharp-duotone": {
      fasds: "fa-solid",
      fasdr: "fa-regular",
      fasdl: "fa-light",
      fasdt: "fa-thin"
    }
  }, x = ["fa-solid", "fa-regular", "fa-light", "fa-thin", "fa-duotone", "fa-brands"], Ia = ["fa", "fas", "far", "fal", "fat", "fad", "fadr", "fadl", "fadt", "fab", "fass", "fasr", "fasl", "fast", "fasds", "fasdr", "fasdl", "fasdt", ...r$1, ...x], m$1 = ["solid", "regular", "light", "thin", "duotone", "brands"], c$1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], F$1 = c$1.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), ma = [...Object.keys(I$1), ...m$1, "2xs", "xs", "sm", "lg", "xl", "2xl", "beat", "border", "fade", "beat-fade", "bounce", "flip-both", "flip-horizontal", "flip-vertical", "flip", "fw", "inverse", "layers-counter", "layers-text", "layers", "li", "pull-left", "pull-right", "pulse", "rotate-180", "rotate-270", "rotate-90", "rotate-by", "shake", "spin-pulse", "spin-reverse", "spin", "stack-1x", "stack-2x", "stack", "ul", t$1.GROUP, t$1.SWAP_OPACITY, t$1.PRIMARY, t$1.SECONDARY].concat(c$1.map((a) => "".concat(a, "x"))).concat(F$1.map((a) => "w-".concat(a)));
  var wa = {
    "Font Awesome 5 Free": {
      900: "fas",
      400: "far"
    },
    "Font Awesome 5 Pro": {
      900: "fas",
      400: "far",
      normal: "far",
      300: "fal"
    },
    "Font Awesome 5 Brands": {
      400: "fab",
      normal: "fab"
    },
    "Font Awesome 5 Duotone": {
      900: "fad"
    }
  };
  const NAMESPACE_IDENTIFIER = "___FONT_AWESOME___";
  const UNITS_IN_GRID = 16;
  const DEFAULT_CSS_PREFIX = "fa";
  const DEFAULT_REPLACEMENT_CLASS = "svg-inline--fa";
  const DATA_FA_I2SVG = "data-fa-i2svg";
  const DATA_FA_PSEUDO_ELEMENT = "data-fa-pseudo-element";
  const DATA_FA_PSEUDO_ELEMENT_PENDING = "data-fa-pseudo-element-pending";
  const DATA_PREFIX = "data-prefix";
  const DATA_ICON = "data-icon";
  const HTML_CLASS_I2SVG_BASE_CLASS = "fontawesome-i2svg";
  const MUTATION_APPROACH_ASYNC = "async";
  const TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS = ["HTML", "HEAD", "STYLE", "SCRIPT"];
  const PRODUCTION$1 = (() => {
    try {
      return false;
    } catch (e$$1) {
      return false;
    }
  })();
  function familyProxy(obj) {
    return new Proxy(obj, {
      get(target, prop) {
        return prop in target ? target[prop] : target[s];
      }
    });
  }
  const _PREFIX_TO_STYLE = _objectSpread2$1({}, S);
  _PREFIX_TO_STYLE[s] = _objectSpread2$1(_objectSpread2$1(_objectSpread2$1(_objectSpread2$1({}, {
    "fa-duotone": "duotone"
  }), S[s]), St["kit"]), St["kit-duotone"]);
  const PREFIX_TO_STYLE = familyProxy(_PREFIX_TO_STYLE);
  const _STYLE_TO_PREFIX = _objectSpread2$1({}, xt);
  _STYLE_TO_PREFIX[s] = _objectSpread2$1(_objectSpread2$1(_objectSpread2$1(_objectSpread2$1({}, {
    duotone: "fad"
  }), _STYLE_TO_PREFIX[s]), Et["kit"]), Et["kit-duotone"]);
  const STYLE_TO_PREFIX = familyProxy(_STYLE_TO_PREFIX);
  const _PREFIX_TO_LONG_STYLE = _objectSpread2$1({}, ga);
  _PREFIX_TO_LONG_STYLE[s] = _objectSpread2$1(_objectSpread2$1({}, _PREFIX_TO_LONG_STYLE[s]), Wt["kit"]);
  const PREFIX_TO_LONG_STYLE = familyProxy(_PREFIX_TO_LONG_STYLE);
  const _LONG_STYLE_TO_PREFIX = _objectSpread2$1({}, ua);
  _LONG_STYLE_TO_PREFIX[s] = _objectSpread2$1(_objectSpread2$1({}, _LONG_STYLE_TO_PREFIX[s]), Ct["kit"]);
  familyProxy(_LONG_STYLE_TO_PREFIX);
  const ICON_SELECTION_SYNTAX_PATTERN = p;
  const LAYERS_TEXT_CLASSNAME = "fa-layers-text";
  const FONT_FAMILY_PATTERN = g;
  const _FONT_WEIGHT_TO_PREFIX = _objectSpread2$1({}, G);
  familyProxy(_FONT_WEIGHT_TO_PREFIX);
  const ATTRIBUTES_WATCHED_FOR_MUTATION = ["class", "data-prefix", "data-icon", "data-fa-transform", "data-fa-mask"];
  const DUOTONE_CLASSES = A;
  const RESERVED_CLASSES = [...At, ...ma];
  const initial = WINDOW.FontAwesomeConfig || {};
  function getAttrConfig(attr2) {
    var element = DOCUMENT.querySelector("script[" + attr2 + "]");
    if (element) {
      return element.getAttribute(attr2);
    }
  }
  function coerce(val) {
    if (val === "") return true;
    if (val === "false") return false;
    if (val === "true") return true;
    return val;
  }
  if (DOCUMENT && typeof DOCUMENT.querySelector === "function") {
    const attrs = [["data-family-prefix", "familyPrefix"], ["data-css-prefix", "cssPrefix"], ["data-family-default", "familyDefault"], ["data-style-default", "styleDefault"], ["data-replacement-class", "replacementClass"], ["data-auto-replace-svg", "autoReplaceSvg"], ["data-auto-add-css", "autoAddCss"], ["data-auto-a11y", "autoA11y"], ["data-search-pseudo-elements", "searchPseudoElements"], ["data-observe-mutations", "observeMutations"], ["data-mutate-approach", "mutateApproach"], ["data-keep-original-source", "keepOriginalSource"], ["data-measure-performance", "measurePerformance"], ["data-show-missing-icons", "showMissingIcons"]];
    attrs.forEach((_ref) => {
      let [attr2, key] = _ref;
      const val = coerce(getAttrConfig(attr2));
      if (val !== void 0 && val !== null) {
        initial[key] = val;
      }
    });
  }
  const _default = {
    styleDefault: "solid",
    familyDefault: s,
    cssPrefix: DEFAULT_CSS_PREFIX,
    replacementClass: DEFAULT_REPLACEMENT_CLASS,
    autoReplaceSvg: true,
    autoAddCss: true,
    autoA11y: true,
    searchPseudoElements: false,
    observeMutations: true,
    mutateApproach: "async",
    keepOriginalSource: true,
    measurePerformance: false,
    showMissingIcons: true
  };
  if (initial.familyPrefix) {
    initial.cssPrefix = initial.familyPrefix;
  }
  const _config = _objectSpread2$1(_objectSpread2$1({}, _default), initial);
  if (!_config.autoReplaceSvg) _config.observeMutations = false;
  const config = {};
  Object.keys(_default).forEach((key) => {
    Object.defineProperty(config, key, {
      enumerable: true,
      set: function(val) {
        _config[key] = val;
        _onChangeCb.forEach((cb) => cb(config));
      },
      get: function() {
        return _config[key];
      }
    });
  });
  Object.defineProperty(config, "familyPrefix", {
    enumerable: true,
    set: function(val) {
      _config.cssPrefix = val;
      _onChangeCb.forEach((cb) => cb(config));
    },
    get: function() {
      return _config.cssPrefix;
    }
  });
  WINDOW.FontAwesomeConfig = config;
  const _onChangeCb = [];
  function onChange(cb) {
    _onChangeCb.push(cb);
    return () => {
      _onChangeCb.splice(_onChangeCb.indexOf(cb), 1);
    };
  }
  const d$2 = UNITS_IN_GRID;
  const meaninglessTransform = {
    size: 16,
    x: 0,
    y: 0,
    rotate: 0,
    flipX: false,
    flipY: false
  };
  function insertCss(css2) {
    if (!css2 || !IS_DOM) {
      return;
    }
    const style = DOCUMENT.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerHTML = css2;
    const headChildren = DOCUMENT.head.childNodes;
    let beforeChild = null;
    for (let i = headChildren.length - 1; i > -1; i--) {
      const child = headChildren[i];
      const tagName = (child.tagName || "").toUpperCase();
      if (["STYLE", "LINK"].indexOf(tagName) > -1) {
        beforeChild = child;
      }
    }
    DOCUMENT.head.insertBefore(style, beforeChild);
    return css2;
  }
  const idPool = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  function nextUniqueId() {
    let size = 12;
    let id = "";
    while (size-- > 0) {
      id += idPool[Math.random() * 62 | 0];
    }
    return id;
  }
  function toArray(obj) {
    const array = [];
    for (let i = (obj || []).length >>> 0; i--; ) {
      array[i] = obj[i];
    }
    return array;
  }
  function classArray(node) {
    if (node.classList) {
      return toArray(node.classList);
    } else {
      return (node.getAttribute("class") || "").split(" ").filter((i) => i);
    }
  }
  function htmlEscape(str) {
    return "".concat(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function joinAttributes(attributes) {
    return Object.keys(attributes || {}).reduce((acc, attributeName) => {
      return acc + "".concat(attributeName, '="').concat(htmlEscape(attributes[attributeName]), '" ');
    }, "").trim();
  }
  function joinStyles(styles2) {
    return Object.keys(styles2 || {}).reduce((acc, styleName) => {
      return acc + "".concat(styleName, ": ").concat(styles2[styleName].trim(), ";");
    }, "");
  }
  function transformIsMeaningful(transform) {
    return transform.size !== meaninglessTransform.size || transform.x !== meaninglessTransform.x || transform.y !== meaninglessTransform.y || transform.rotate !== meaninglessTransform.rotate || transform.flipX || transform.flipY;
  }
  function transformForSvg(_ref) {
    let {
      transform,
      containerWidth,
      iconWidth
    } = _ref;
    const outer = {
      transform: "translate(".concat(containerWidth / 2, " 256)")
    };
    const innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
    const innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
    const innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
    const inner = {
      transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
    };
    const path = {
      transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
    };
    return {
      outer,
      inner,
      path
    };
  }
  function transformForCss(_ref2) {
    let {
      transform,
      width = UNITS_IN_GRID,
      height = UNITS_IN_GRID,
      startCentered = false
    } = _ref2;
    let val = "";
    if (startCentered && IS_IE) {
      val += "translate(".concat(transform.x / d$2 - width / 2, "em, ").concat(transform.y / d$2 - height / 2, "em) ");
    } else if (startCentered) {
      val += "translate(calc(-50% + ".concat(transform.x / d$2, "em), calc(-50% + ").concat(transform.y / d$2, "em)) ");
    } else {
      val += "translate(".concat(transform.x / d$2, "em, ").concat(transform.y / d$2, "em) ");
    }
    val += "scale(".concat(transform.size / d$2 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / d$2 * (transform.flipY ? -1 : 1), ") ");
    val += "rotate(".concat(transform.rotate, "deg) ");
    return val;
  }
  var baseStyles = ':root, :host {\n  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Free";\n  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Free";\n  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Pro";\n  --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Pro";\n  --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";\n  --fa-font-duotone-regular: normal 400 1em/1 "Font Awesome 6 Duotone";\n  --fa-font-duotone-light: normal 300 1em/1 "Font Awesome 6 Duotone";\n  --fa-font-duotone-thin: normal 100 1em/1 "Font Awesome 6 Duotone";\n  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";\n  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 6 Sharp";\n  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 6 Sharp";\n  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 6 Sharp";\n  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 6 Sharp";\n  --fa-font-sharp-duotone-solid: normal 900 1em/1 "Font Awesome 6 Sharp Duotone";\n  --fa-font-sharp-duotone-regular: normal 400 1em/1 "Font Awesome 6 Sharp Duotone";\n  --fa-font-sharp-duotone-light: normal 300 1em/1 "Font Awesome 6 Sharp Duotone";\n  --fa-font-sharp-duotone-thin: normal 100 1em/1 "Font Awesome 6 Sharp Duotone";\n}\n\nsvg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {\n  overflow: visible;\n  box-sizing: content-box;\n}\n\n.svg-inline--fa {\n  display: var(--fa-display, inline-block);\n  height: 1em;\n  overflow: visible;\n  vertical-align: -0.125em;\n}\n.svg-inline--fa.fa-2xs {\n  vertical-align: 0.1em;\n}\n.svg-inline--fa.fa-xs {\n  vertical-align: 0em;\n}\n.svg-inline--fa.fa-sm {\n  vertical-align: -0.0714285705em;\n}\n.svg-inline--fa.fa-lg {\n  vertical-align: -0.2em;\n}\n.svg-inline--fa.fa-xl {\n  vertical-align: -0.25em;\n}\n.svg-inline--fa.fa-2xl {\n  vertical-align: -0.3125em;\n}\n.svg-inline--fa.fa-pull-left {\n  margin-right: var(--fa-pull-margin, 0.3em);\n  width: auto;\n}\n.svg-inline--fa.fa-pull-right {\n  margin-left: var(--fa-pull-margin, 0.3em);\n  width: auto;\n}\n.svg-inline--fa.fa-li {\n  width: var(--fa-li-width, 2em);\n  top: 0.25em;\n}\n.svg-inline--fa.fa-fw {\n  width: var(--fa-fw-width, 1.25em);\n}\n\n.fa-layers svg.svg-inline--fa {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.fa-layers-counter, .fa-layers-text {\n  display: inline-block;\n  position: absolute;\n  text-align: center;\n}\n\n.fa-layers {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  text-align: center;\n  vertical-align: -0.125em;\n  width: 1em;\n}\n.fa-layers svg.svg-inline--fa {\n  transform-origin: center center;\n}\n\n.fa-layers-text {\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  transform-origin: center center;\n}\n\n.fa-layers-counter {\n  background-color: var(--fa-counter-background-color, #ff253a);\n  border-radius: var(--fa-counter-border-radius, 1em);\n  box-sizing: border-box;\n  color: var(--fa-inverse, #fff);\n  line-height: var(--fa-counter-line-height, 1);\n  max-width: var(--fa-counter-max-width, 5em);\n  min-width: var(--fa-counter-min-width, 1.5em);\n  overflow: hidden;\n  padding: var(--fa-counter-padding, 0.25em 0.5em);\n  right: var(--fa-right, 0);\n  text-overflow: ellipsis;\n  top: var(--fa-top, 0);\n  transform: scale(var(--fa-counter-scale, 0.25));\n  transform-origin: top right;\n}\n\n.fa-layers-bottom-right {\n  bottom: var(--fa-bottom, 0);\n  right: var(--fa-right, 0);\n  top: auto;\n  transform: scale(var(--fa-layers-scale, 0.25));\n  transform-origin: bottom right;\n}\n\n.fa-layers-bottom-left {\n  bottom: var(--fa-bottom, 0);\n  left: var(--fa-left, 0);\n  right: auto;\n  top: auto;\n  transform: scale(var(--fa-layers-scale, 0.25));\n  transform-origin: bottom left;\n}\n\n.fa-layers-top-right {\n  top: var(--fa-top, 0);\n  right: var(--fa-right, 0);\n  transform: scale(var(--fa-layers-scale, 0.25));\n  transform-origin: top right;\n}\n\n.fa-layers-top-left {\n  left: var(--fa-left, 0);\n  right: auto;\n  top: var(--fa-top, 0);\n  transform: scale(var(--fa-layers-scale, 0.25));\n  transform-origin: top left;\n}\n\n.fa-1x {\n  font-size: 1em;\n}\n\n.fa-2x {\n  font-size: 2em;\n}\n\n.fa-3x {\n  font-size: 3em;\n}\n\n.fa-4x {\n  font-size: 4em;\n}\n\n.fa-5x {\n  font-size: 5em;\n}\n\n.fa-6x {\n  font-size: 6em;\n}\n\n.fa-7x {\n  font-size: 7em;\n}\n\n.fa-8x {\n  font-size: 8em;\n}\n\n.fa-9x {\n  font-size: 9em;\n}\n\n.fa-10x {\n  font-size: 10em;\n}\n\n.fa-2xs {\n  font-size: 0.625em;\n  line-height: 0.1em;\n  vertical-align: 0.225em;\n}\n\n.fa-xs {\n  font-size: 0.75em;\n  line-height: 0.0833333337em;\n  vertical-align: 0.125em;\n}\n\n.fa-sm {\n  font-size: 0.875em;\n  line-height: 0.0714285718em;\n  vertical-align: 0.0535714295em;\n}\n\n.fa-lg {\n  font-size: 1.25em;\n  line-height: 0.05em;\n  vertical-align: -0.075em;\n}\n\n.fa-xl {\n  font-size: 1.5em;\n  line-height: 0.0416666682em;\n  vertical-align: -0.125em;\n}\n\n.fa-2xl {\n  font-size: 2em;\n  line-height: 0.03125em;\n  vertical-align: -0.1875em;\n}\n\n.fa-fw {\n  text-align: center;\n  width: 1.25em;\n}\n\n.fa-ul {\n  list-style-type: none;\n  margin-left: var(--fa-li-margin, 2.5em);\n  padding-left: 0;\n}\n.fa-ul > li {\n  position: relative;\n}\n\n.fa-li {\n  left: calc(-1 * var(--fa-li-width, 2em));\n  position: absolute;\n  text-align: center;\n  width: var(--fa-li-width, 2em);\n  line-height: inherit;\n}\n\n.fa-border {\n  border-color: var(--fa-border-color, #eee);\n  border-radius: var(--fa-border-radius, 0.1em);\n  border-style: var(--fa-border-style, solid);\n  border-width: var(--fa-border-width, 0.08em);\n  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);\n}\n\n.fa-pull-left {\n  float: left;\n  margin-right: var(--fa-pull-margin, 0.3em);\n}\n\n.fa-pull-right {\n  float: right;\n  margin-left: var(--fa-pull-margin, 0.3em);\n}\n\n.fa-beat {\n  animation-name: fa-beat;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-bounce {\n  animation-name: fa-bounce;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));\n}\n\n.fa-fade {\n  animation-name: fa-fade;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n}\n\n.fa-beat-fade {\n  animation-name: fa-beat-fade;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n}\n\n.fa-flip {\n  animation-name: fa-flip;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-shake {\n  animation-name: fa-shake;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-spin {\n  animation-name: fa-spin;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 2s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-spin-reverse {\n  --fa-animation-direction: reverse;\n}\n\n.fa-pulse,\n.fa-spin-pulse {\n  animation-name: fa-spin;\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, steps(8));\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .fa-beat,\n.fa-bounce,\n.fa-fade,\n.fa-beat-fade,\n.fa-flip,\n.fa-pulse,\n.fa-shake,\n.fa-spin,\n.fa-spin-pulse {\n    animation-delay: -1ms;\n    animation-duration: 1ms;\n    animation-iteration-count: 1;\n    transition-delay: 0s;\n    transition-duration: 0s;\n  }\n}\n@keyframes fa-beat {\n  0%, 90% {\n    transform: scale(1);\n  }\n  45% {\n    transform: scale(var(--fa-beat-scale, 1.25));\n  }\n}\n@keyframes fa-bounce {\n  0% {\n    transform: scale(1, 1) translateY(0);\n  }\n  10% {\n    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);\n  }\n  30% {\n    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));\n  }\n  50% {\n    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);\n  }\n  57% {\n    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));\n  }\n  64% {\n    transform: scale(1, 1) translateY(0);\n  }\n  100% {\n    transform: scale(1, 1) translateY(0);\n  }\n}\n@keyframes fa-fade {\n  50% {\n    opacity: var(--fa-fade-opacity, 0.4);\n  }\n}\n@keyframes fa-beat-fade {\n  0%, 100% {\n    opacity: var(--fa-beat-fade-opacity, 0.4);\n    transform: scale(1);\n  }\n  50% {\n    opacity: 1;\n    transform: scale(var(--fa-beat-fade-scale, 1.125));\n  }\n}\n@keyframes fa-flip {\n  50% {\n    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));\n  }\n}\n@keyframes fa-shake {\n  0% {\n    transform: rotate(-15deg);\n  }\n  4% {\n    transform: rotate(15deg);\n  }\n  8%, 24% {\n    transform: rotate(-18deg);\n  }\n  12%, 28% {\n    transform: rotate(18deg);\n  }\n  16% {\n    transform: rotate(-22deg);\n  }\n  20% {\n    transform: rotate(22deg);\n  }\n  32% {\n    transform: rotate(-12deg);\n  }\n  36% {\n    transform: rotate(12deg);\n  }\n  40%, 100% {\n    transform: rotate(0deg);\n  }\n}\n@keyframes fa-spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.fa-rotate-90 {\n  transform: rotate(90deg);\n}\n\n.fa-rotate-180 {\n  transform: rotate(180deg);\n}\n\n.fa-rotate-270 {\n  transform: rotate(270deg);\n}\n\n.fa-flip-horizontal {\n  transform: scale(-1, 1);\n}\n\n.fa-flip-vertical {\n  transform: scale(1, -1);\n}\n\n.fa-flip-both,\n.fa-flip-horizontal.fa-flip-vertical {\n  transform: scale(-1, -1);\n}\n\n.fa-rotate-by {\n  transform: rotate(var(--fa-rotate-angle, 0));\n}\n\n.fa-stack {\n  display: inline-block;\n  vertical-align: middle;\n  height: 2em;\n  position: relative;\n  width: 2.5em;\n}\n\n.fa-stack-1x,\n.fa-stack-2x {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: var(--fa-stack-z-index, auto);\n}\n\n.svg-inline--fa.fa-stack-1x {\n  height: 1em;\n  width: 1.25em;\n}\n.svg-inline--fa.fa-stack-2x {\n  height: 2em;\n  width: 2.5em;\n}\n\n.fa-inverse {\n  color: var(--fa-inverse, #fff);\n}\n\n.sr-only,\n.fa-sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;\n}\n\n.sr-only-focusable:not(:focus),\n.fa-sr-only-focusable:not(:focus) {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;\n}\n\n.svg-inline--fa .fa-primary {\n  fill: var(--fa-primary-color, currentColor);\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa .fa-secondary {\n  fill: var(--fa-secondary-color, currentColor);\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-primary {\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-secondary {\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa mask .fa-primary,\n.svg-inline--fa mask .fa-secondary {\n  fill: black;\n}';
  function css() {
    const dcp = DEFAULT_CSS_PREFIX;
    const drc = DEFAULT_REPLACEMENT_CLASS;
    const fp = config.cssPrefix;
    const rc = config.replacementClass;
    let s2 = baseStyles;
    if (fp !== dcp || rc !== drc) {
      const dPatt = new RegExp("\\.".concat(dcp, "\\-"), "g");
      const customPropPatt = new RegExp("\\--".concat(dcp, "\\-"), "g");
      const rPatt = new RegExp("\\.".concat(drc), "g");
      s2 = s2.replace(dPatt, ".".concat(fp, "-")).replace(customPropPatt, "--".concat(fp, "-")).replace(rPatt, ".".concat(rc));
    }
    return s2;
  }
  let _cssInserted = false;
  function ensureCss() {
    if (config.autoAddCss && !_cssInserted) {
      insertCss(css());
      _cssInserted = true;
    }
  }
  var InjectCSS = {
    mixout() {
      return {
        dom: {
          css,
          insertCss: ensureCss
        }
      };
    },
    hooks() {
      return {
        beforeDOMElementCreation() {
          ensureCss();
        },
        beforeI2svg() {
          ensureCss();
        }
      };
    }
  };
  const w = WINDOW || {};
  if (!w[NAMESPACE_IDENTIFIER]) w[NAMESPACE_IDENTIFIER] = {};
  if (!w[NAMESPACE_IDENTIFIER].styles) w[NAMESPACE_IDENTIFIER].styles = {};
  if (!w[NAMESPACE_IDENTIFIER].hooks) w[NAMESPACE_IDENTIFIER].hooks = {};
  if (!w[NAMESPACE_IDENTIFIER].shims) w[NAMESPACE_IDENTIFIER].shims = [];
  var namespace = w[NAMESPACE_IDENTIFIER];
  const functions = [];
  const listener = function() {
    DOCUMENT.removeEventListener("DOMContentLoaded", listener);
    loaded = 1;
    functions.map((fn2) => fn2());
  };
  let loaded = false;
  if (IS_DOM) {
    loaded = (DOCUMENT.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT.readyState);
    if (!loaded) DOCUMENT.addEventListener("DOMContentLoaded", listener);
  }
  function domready(fn2) {
    if (!IS_DOM) return;
    loaded ? setTimeout(fn2, 0) : functions.push(fn2);
  }
  function toHtml(abstractNodes) {
    const {
      tag,
      attributes = {},
      children = []
    } = abstractNodes;
    if (typeof abstractNodes === "string") {
      return htmlEscape(abstractNodes);
    } else {
      return "<".concat(tag, " ").concat(joinAttributes(attributes), ">").concat(children.map(toHtml).join(""), "</").concat(tag, ">");
    }
  }
  function iconFromMapping(mapping, prefix, iconName) {
    if (mapping && mapping[prefix] && mapping[prefix][iconName]) {
      return {
        prefix,
        iconName,
        icon: mapping[prefix][iconName]
      };
    }
  }
  var reduce = function fastReduceObject(subject, fn2, initialValue, thisContext) {
    var keys = Object.keys(subject), length = keys.length, iterator2 = fn2, i, key, result;
    if (initialValue === void 0) {
      i = 1;
      result = subject[keys[0]];
    } else {
      i = 0;
      result = initialValue;
    }
    for (; i < length; i++) {
      key = keys[i];
      result = iterator2(result, subject[key], key, subject);
    }
    return result;
  };
  function ucs2decode(string) {
    const output = [];
    let counter2 = 0;
    const length = string.length;
    while (counter2 < length) {
      const value = string.charCodeAt(counter2++);
      if (value >= 55296 && value <= 56319 && counter2 < length) {
        const extra = string.charCodeAt(counter2++);
        if ((extra & 64512) == 56320) {
          output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
        } else {
          output.push(value);
          counter2--;
        }
      } else {
        output.push(value);
      }
    }
    return output;
  }
  function toHex(unicode) {
    const decoded = ucs2decode(unicode);
    return decoded.length === 1 ? decoded[0].toString(16) : null;
  }
  function codePointAt(string, index) {
    const size = string.length;
    let first = string.charCodeAt(index);
    let second;
    if (first >= 55296 && first <= 56319 && size > index + 1) {
      second = string.charCodeAt(index + 1);
      if (second >= 56320 && second <= 57343) {
        return (first - 55296) * 1024 + second - 56320 + 65536;
      }
    }
    return first;
  }
  function normalizeIcons(icons) {
    return Object.keys(icons).reduce((acc, iconName) => {
      const icon2 = icons[iconName];
      const expanded = !!icon2.icon;
      if (expanded) {
        acc[icon2.iconName] = icon2.icon;
      } else {
        acc[iconName] = icon2;
      }
      return acc;
    }, {});
  }
  function defineIcons(prefix, icons) {
    let params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const {
      skipHooks = false
    } = params;
    const normalized = normalizeIcons(icons);
    if (typeof namespace.hooks.addPack === "function" && !skipHooks) {
      namespace.hooks.addPack(prefix, normalizeIcons(icons));
    } else {
      namespace.styles[prefix] = _objectSpread2$1(_objectSpread2$1({}, namespace.styles[prefix] || {}), normalized);
    }
    if (prefix === "fas") {
      defineIcons("fa", icons);
    }
  }
  const {
    styles,
    shims
  } = namespace;
  const FAMILY_NAMES = Object.keys(PREFIX_TO_LONG_STYLE);
  const PREFIXES_FOR_FAMILY = FAMILY_NAMES.reduce((acc, familyId) => {
    acc[familyId] = Object.keys(PREFIX_TO_LONG_STYLE[familyId]);
    return acc;
  }, {});
  let _defaultUsablePrefix = null;
  let _byUnicode = {};
  let _byLigature = {};
  let _byOldName = {};
  let _byOldUnicode = {};
  let _byAlias = {};
  function isReserved(name2) {
    return ~RESERVED_CLASSES.indexOf(name2);
  }
  function getIconName(cssPrefix, cls) {
    const parts = cls.split("-");
    const prefix = parts[0];
    const iconName = parts.slice(1).join("-");
    if (prefix === cssPrefix && iconName !== "" && !isReserved(iconName)) {
      return iconName;
    } else {
      return null;
    }
  }
  const build = () => {
    const lookup = (reducer) => {
      return reduce(styles, (o$$1, style, prefix) => {
        o$$1[prefix] = reduce(style, reducer, {});
        return o$$1;
      }, {});
    };
    _byUnicode = lookup((acc, icon2, iconName) => {
      if (icon2[3]) {
        acc[icon2[3]] = iconName;
      }
      if (icon2[2]) {
        const aliases = icon2[2].filter((a$$1) => {
          return typeof a$$1 === "number";
        });
        aliases.forEach((alias) => {
          acc[alias.toString(16)] = iconName;
        });
      }
      return acc;
    });
    _byLigature = lookup((acc, icon2, iconName) => {
      acc[iconName] = iconName;
      if (icon2[2]) {
        const aliases = icon2[2].filter((a$$1) => {
          return typeof a$$1 === "string";
        });
        aliases.forEach((alias) => {
          acc[alias] = iconName;
        });
      }
      return acc;
    });
    _byAlias = lookup((acc, icon2, iconName) => {
      const aliases = icon2[2];
      acc[iconName] = iconName;
      aliases.forEach((alias) => {
        acc[alias] = iconName;
      });
      return acc;
    });
    const hasRegular = "far" in styles || config.autoFetchSvg;
    const shimLookups = reduce(shims, (acc, shim) => {
      const maybeNameMaybeUnicode = shim[0];
      let prefix = shim[1];
      const iconName = shim[2];
      if (prefix === "far" && !hasRegular) {
        prefix = "fas";
      }
      if (typeof maybeNameMaybeUnicode === "string") {
        acc.names[maybeNameMaybeUnicode] = {
          prefix,
          iconName
        };
      }
      if (typeof maybeNameMaybeUnicode === "number") {
        acc.unicodes[maybeNameMaybeUnicode.toString(16)] = {
          prefix,
          iconName
        };
      }
      return acc;
    }, {
      names: {},
      unicodes: {}
    });
    _byOldName = shimLookups.names;
    _byOldUnicode = shimLookups.unicodes;
    _defaultUsablePrefix = getCanonicalPrefix(config.styleDefault, {
      family: config.familyDefault
    });
  };
  onChange((c$$1) => {
    _defaultUsablePrefix = getCanonicalPrefix(c$$1.styleDefault, {
      family: config.familyDefault
    });
  });
  build();
  function byUnicode(prefix, unicode) {
    return (_byUnicode[prefix] || {})[unicode];
  }
  function byLigature(prefix, ligature) {
    return (_byLigature[prefix] || {})[ligature];
  }
  function byAlias(prefix, alias) {
    return (_byAlias[prefix] || {})[alias];
  }
  function byOldName(name2) {
    return _byOldName[name2] || {
      prefix: null,
      iconName: null
    };
  }
  function byOldUnicode(unicode) {
    const oldUnicode = _byOldUnicode[unicode];
    const newUnicode = byUnicode("fas", unicode);
    return oldUnicode || (newUnicode ? {
      prefix: "fas",
      iconName: newUnicode
    } : null) || {
      prefix: null,
      iconName: null
    };
  }
  function getDefaultUsablePrefix() {
    return _defaultUsablePrefix;
  }
  const emptyCanonicalIcon = () => {
    return {
      prefix: null,
      iconName: null,
      rest: []
    };
  };
  function getFamilyId(values) {
    let family = s;
    const famProps = FAMILY_NAMES.reduce((acc, familyId) => {
      acc[familyId] = "".concat(config.cssPrefix, "-").concat(familyId);
      return acc;
    }, {});
    L.forEach((familyId) => {
      if (values.includes(famProps[familyId]) || values.some((v$$1) => PREFIXES_FOR_FAMILY[familyId].includes(v$$1))) {
        family = familyId;
      }
    });
    return family;
  }
  function getCanonicalPrefix(styleOrPrefix) {
    let params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const {
      family = s
    } = params;
    const style = PREFIX_TO_STYLE[family][styleOrPrefix];
    if (family === t && !styleOrPrefix) {
      return "fad";
    }
    const prefix = STYLE_TO_PREFIX[family][styleOrPrefix] || STYLE_TO_PREFIX[family][style];
    const defined = styleOrPrefix in namespace.styles ? styleOrPrefix : null;
    const result = prefix || defined || null;
    return result;
  }
  function moveNonFaClassesToRest(classNames) {
    let rest = [];
    let iconName = null;
    classNames.forEach((cls) => {
      const result = getIconName(config.cssPrefix, cls);
      if (result) {
        iconName = result;
      } else if (cls) {
        rest.push(cls);
      }
    });
    return {
      iconName,
      rest
    };
  }
  function sortedUniqueValues(arr) {
    return arr.sort().filter((value, index, arr2) => {
      return arr2.indexOf(value) === index;
    });
  }
  function getCanonicalIcon(values) {
    let params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const {
      skipLookups = false
    } = params;
    let givenPrefix = null;
    const faCombinedClasses = Ia.concat(bt$1);
    const faStyleOrFamilyClasses = sortedUniqueValues(values.filter((cls) => faCombinedClasses.includes(cls)));
    const nonStyleOrFamilyClasses = sortedUniqueValues(values.filter((cls) => !Ia.includes(cls)));
    const faStyles = faStyleOrFamilyClasses.filter((cls) => {
      givenPrefix = cls;
      return !P.includes(cls);
    });
    const [styleFromValues = null] = faStyles;
    const family = getFamilyId(faStyleOrFamilyClasses);
    const canonical = _objectSpread2$1(_objectSpread2$1({}, moveNonFaClassesToRest(nonStyleOrFamilyClasses)), {}, {
      prefix: getCanonicalPrefix(styleFromValues, {
        family
      })
    });
    return _objectSpread2$1(_objectSpread2$1(_objectSpread2$1({}, canonical), getDefaultCanonicalPrefix({
      values,
      family,
      styles,
      config,
      canonical,
      givenPrefix
    })), applyShimAndAlias(skipLookups, givenPrefix, canonical));
  }
  function applyShimAndAlias(skipLookups, givenPrefix, canonical) {
    let {
      prefix,
      iconName
    } = canonical;
    if (skipLookups || !prefix || !iconName) {
      return {
        prefix,
        iconName
      };
    }
    const shim = givenPrefix === "fa" ? byOldName(iconName) : {};
    const aliasIconName = byAlias(prefix, iconName);
    iconName = shim.iconName || aliasIconName || iconName;
    prefix = shim.prefix || prefix;
    if (prefix === "far" && !styles["far"] && styles["fas"] && !config.autoFetchSvg) {
      prefix = "fas";
    }
    return {
      prefix,
      iconName
    };
  }
  const newCanonicalFamilies = L.filter((familyId) => {
    return familyId !== s || familyId !== t;
  });
  const newCanonicalStyles = Object.keys(ga).filter((key) => key !== s).map((key) => Object.keys(ga[key])).flat();
  function getDefaultCanonicalPrefix(prefixOptions) {
    const {
      values,
      family,
      canonical,
      givenPrefix = "",
      styles: styles2 = {},
      config: config$$1 = {}
    } = prefixOptions;
    const isDuotoneFamily = family === t;
    const valuesHasDuotone = values.includes("fa-duotone") || values.includes("fad");
    const defaultFamilyIsDuotone = config$$1.familyDefault === "duotone";
    const canonicalPrefixIsDuotone = canonical.prefix === "fad" || canonical.prefix === "fa-duotone";
    if (!isDuotoneFamily && (valuesHasDuotone || defaultFamilyIsDuotone || canonicalPrefixIsDuotone)) {
      canonical.prefix = "fad";
    }
    if (values.includes("fa-brands") || values.includes("fab")) {
      canonical.prefix = "fab";
    }
    if (!canonical.prefix && newCanonicalFamilies.includes(family)) {
      const validPrefix = Object.keys(styles2).find((key) => newCanonicalStyles.includes(key));
      if (validPrefix || config$$1.autoFetchSvg) {
        const defaultPrefix = pt.get(family).defaultShortPrefixId;
        canonical.prefix = defaultPrefix;
        canonical.iconName = byAlias(canonical.prefix, canonical.iconName) || canonical.iconName;
      }
    }
    if (canonical.prefix === "fa" || givenPrefix === "fa") {
      canonical.prefix = getDefaultUsablePrefix() || "fas";
    }
    return canonical;
  }
  class Library {
    constructor() {
      this.definitions = {};
    }
    add() {
      for (var _len = arguments.length, definitions = new Array(_len), _key = 0; _key < _len; _key++) {
        definitions[_key] = arguments[_key];
      }
      const additions = definitions.reduce(this._pullDefinitions, {});
      Object.keys(additions).forEach((key) => {
        this.definitions[key] = _objectSpread2$1(_objectSpread2$1({}, this.definitions[key] || {}), additions[key]);
        defineIcons(key, additions[key]);
        const longPrefix = PREFIX_TO_LONG_STYLE[s][key];
        if (longPrefix) defineIcons(longPrefix, additions[key]);
        build();
      });
    }
    reset() {
      this.definitions = {};
    }
    _pullDefinitions(additions, definition) {
      const normalized = definition.prefix && definition.iconName && definition.icon ? {
        0: definition
      } : definition;
      Object.keys(normalized).map((key) => {
        const {
          prefix,
          iconName,
          icon: icon2
        } = normalized[key];
        const aliases = icon2[2];
        if (!additions[prefix]) additions[prefix] = {};
        if (aliases.length > 0) {
          aliases.forEach((alias) => {
            if (typeof alias === "string") {
              additions[prefix][alias] = icon2;
            }
          });
        }
        additions[prefix][iconName] = icon2;
      });
      return additions;
    }
  }
  let _plugins = [];
  let _hooks = {};
  const providers = {};
  const defaultProviderKeys = Object.keys(providers);
  function registerPlugins(nextPlugins, _ref) {
    let {
      mixoutsTo: obj
    } = _ref;
    _plugins = nextPlugins;
    _hooks = {};
    Object.keys(providers).forEach((k) => {
      if (defaultProviderKeys.indexOf(k) === -1) {
        delete providers[k];
      }
    });
    _plugins.forEach((plugin2) => {
      const mixout = plugin2.mixout ? plugin2.mixout() : {};
      Object.keys(mixout).forEach((tk) => {
        if (typeof mixout[tk] === "function") {
          obj[tk] = mixout[tk];
        }
        if (typeof mixout[tk] === "object") {
          Object.keys(mixout[tk]).forEach((sk) => {
            if (!obj[tk]) {
              obj[tk] = {};
            }
            obj[tk][sk] = mixout[tk][sk];
          });
        }
      });
      if (plugin2.hooks) {
        const hooks = plugin2.hooks();
        Object.keys(hooks).forEach((hook) => {
          if (!_hooks[hook]) {
            _hooks[hook] = [];
          }
          _hooks[hook].push(hooks[hook]);
        });
      }
      if (plugin2.provides) {
        plugin2.provides(providers);
      }
    });
    return obj;
  }
  function chainHooks(hook, accumulator) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    const hookFns = _hooks[hook] || [];
    hookFns.forEach((hookFn) => {
      accumulator = hookFn.apply(null, [accumulator, ...args]);
    });
    return accumulator;
  }
  function callHooks(hook) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    const hookFns = _hooks[hook] || [];
    hookFns.forEach((hookFn) => {
      hookFn.apply(null, args);
    });
    return void 0;
  }
  function callProvided() {
    const hook = arguments[0];
    const args = Array.prototype.slice.call(arguments, 1);
    return providers[hook] ? providers[hook].apply(null, args) : void 0;
  }
  function findIconDefinition(iconLookup) {
    if (iconLookup.prefix === "fa") {
      iconLookup.prefix = "fas";
    }
    let {
      iconName
    } = iconLookup;
    const prefix = iconLookup.prefix || getDefaultUsablePrefix();
    if (!iconName) return;
    iconName = byAlias(prefix, iconName) || iconName;
    return iconFromMapping(library.definitions, prefix, iconName) || iconFromMapping(namespace.styles, prefix, iconName);
  }
  const library = new Library();
  const noAuto = () => {
    config.autoReplaceSvg = false;
    config.observeMutations = false;
    callHooks("noAuto");
  };
  const dom = {
    i2svg: function() {
      let params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      if (IS_DOM) {
        callHooks("beforeI2svg", params);
        callProvided("pseudoElements2svg", params);
        return callProvided("i2svg", params);
      } else {
        return Promise.reject(new Error("Operation requires a DOM of some kind."));
      }
    },
    watch: function() {
      let params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      const {
        autoReplaceSvgRoot
      } = params;
      if (config.autoReplaceSvg === false) {
        config.autoReplaceSvg = true;
      }
      config.observeMutations = true;
      domready(() => {
        autoReplace({
          autoReplaceSvgRoot
        });
        callHooks("watch", params);
      });
    }
  };
  const parse = {
    icon: (icon2) => {
      if (icon2 === null) {
        return null;
      }
      if (typeof icon2 === "object" && icon2.prefix && icon2.iconName) {
        return {
          prefix: icon2.prefix,
          iconName: byAlias(icon2.prefix, icon2.iconName) || icon2.iconName
        };
      }
      if (Array.isArray(icon2) && icon2.length === 2) {
        const iconName = icon2[1].indexOf("fa-") === 0 ? icon2[1].slice(3) : icon2[1];
        const prefix = getCanonicalPrefix(icon2[0]);
        return {
          prefix,
          iconName: byAlias(prefix, iconName) || iconName
        };
      }
      if (typeof icon2 === "string" && (icon2.indexOf("".concat(config.cssPrefix, "-")) > -1 || icon2.match(ICON_SELECTION_SYNTAX_PATTERN))) {
        const canonicalIcon = getCanonicalIcon(icon2.split(" "), {
          skipLookups: true
        });
        return {
          prefix: canonicalIcon.prefix || getDefaultUsablePrefix(),
          iconName: byAlias(canonicalIcon.prefix, canonicalIcon.iconName) || canonicalIcon.iconName
        };
      }
      if (typeof icon2 === "string") {
        const prefix = getDefaultUsablePrefix();
        return {
          prefix,
          iconName: byAlias(prefix, icon2) || icon2
        };
      }
    }
  };
  const api = {
    noAuto,
    config,
    dom,
    parse,
    library,
    findIconDefinition,
    toHtml
  };
  const autoReplace = function() {
    let params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    const {
      autoReplaceSvgRoot = DOCUMENT
    } = params;
    if ((Object.keys(namespace.styles).length > 0 || config.autoFetchSvg) && IS_DOM && config.autoReplaceSvg) api.dom.i2svg({
      node: autoReplaceSvgRoot
    });
  };
  function domVariants(val, abstractCreator) {
    Object.defineProperty(val, "abstract", {
      get: abstractCreator
    });
    Object.defineProperty(val, "html", {
      get: function() {
        return val.abstract.map((a) => toHtml(a));
      }
    });
    Object.defineProperty(val, "node", {
      get: function() {
        if (!IS_DOM) return;
        const container = DOCUMENT.createElement("div");
        container.innerHTML = val.html;
        return container.children;
      }
    });
    return val;
  }
  function asIcon(_ref) {
    let {
      children,
      main,
      mask,
      attributes,
      styles: styles2,
      transform
    } = _ref;
    if (transformIsMeaningful(transform) && main.found && !mask.found) {
      const {
        width,
        height
      } = main;
      const offset = {
        x: width / height / 2,
        y: 0.5
      };
      attributes["style"] = joinStyles(_objectSpread2$1(_objectSpread2$1({}, styles2), {}, {
        "transform-origin": "".concat(offset.x + transform.x / 16, "em ").concat(offset.y + transform.y / 16, "em")
      }));
    }
    return [{
      tag: "svg",
      attributes,
      children
    }];
  }
  function asSymbol(_ref) {
    let {
      prefix,
      iconName,
      children,
      attributes,
      symbol
    } = _ref;
    const id = symbol === true ? "".concat(prefix, "-").concat(config.cssPrefix, "-").concat(iconName) : symbol;
    return [{
      tag: "svg",
      attributes: {
        style: "display: none;"
      },
      children: [{
        tag: "symbol",
        attributes: _objectSpread2$1(_objectSpread2$1({}, attributes), {}, {
          id
        }),
        children
      }]
    }];
  }
  function makeInlineSvgAbstract(params) {
    const {
      icons: {
        main,
        mask
      },
      prefix,
      iconName,
      transform,
      symbol,
      title,
      maskId,
      titleId,
      extra,
      watchable = false
    } = params;
    const {
      width,
      height
    } = mask.found ? mask : main;
    const isUploadedIcon = Lt.includes(prefix);
    const attrClass = [config.replacementClass, iconName ? "".concat(config.cssPrefix, "-").concat(iconName) : ""].filter((c$$1) => extra.classes.indexOf(c$$1) === -1).filter((c$$1) => c$$1 !== "" || !!c$$1).concat(extra.classes).join(" ");
    let content = {
      children: [],
      attributes: _objectSpread2$1(_objectSpread2$1({}, extra.attributes), {}, {
        "data-prefix": prefix,
        "data-icon": iconName,
        "class": attrClass,
        "role": extra.attributes.role || "img",
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": "0 0 ".concat(width, " ").concat(height)
      })
    };
    const uploadedIconWidthStyle = isUploadedIcon && !~extra.classes.indexOf("fa-fw") ? {
      width: "".concat(width / height * 16 * 0.0625, "em")
    } : {};
    if (watchable) {
      content.attributes[DATA_FA_I2SVG] = "";
    }
    if (title) {
      content.children.push({
        tag: "title",
        attributes: {
          id: content.attributes["aria-labelledby"] || "title-".concat(titleId || nextUniqueId())
        },
        children: [title]
      });
      delete content.attributes.title;
    }
    const args = _objectSpread2$1(_objectSpread2$1({}, content), {}, {
      prefix,
      iconName,
      main,
      mask,
      maskId,
      transform,
      symbol,
      styles: _objectSpread2$1(_objectSpread2$1({}, uploadedIconWidthStyle), extra.styles)
    });
    const {
      children,
      attributes
    } = mask.found && main.found ? callProvided("generateAbstractMask", args) || {
      children: [],
      attributes: {}
    } : callProvided("generateAbstractIcon", args) || {
      children: [],
      attributes: {}
    };
    args.children = children;
    args.attributes = attributes;
    if (symbol) {
      return asSymbol(args);
    } else {
      return asIcon(args);
    }
  }
  function makeLayersTextAbstract(params) {
    const {
      content,
      width,
      height,
      transform,
      title,
      extra,
      watchable = false
    } = params;
    const attributes = _objectSpread2$1(_objectSpread2$1(_objectSpread2$1({}, extra.attributes), title ? {
      "title": title
    } : {}), {}, {
      "class": extra.classes.join(" ")
    });
    if (watchable) {
      attributes[DATA_FA_I2SVG] = "";
    }
    const styles2 = _objectSpread2$1({}, extra.styles);
    if (transformIsMeaningful(transform)) {
      styles2["transform"] = transformForCss({
        transform,
        startCentered: true,
        width,
        height
      });
      styles2["-webkit-transform"] = styles2["transform"];
    }
    const styleString = joinStyles(styles2);
    if (styleString.length > 0) {
      attributes["style"] = styleString;
    }
    const val = [];
    val.push({
      tag: "span",
      attributes,
      children: [content]
    });
    if (title) {
      val.push({
        tag: "span",
        attributes: {
          class: "sr-only"
        },
        children: [title]
      });
    }
    return val;
  }
  function makeLayersCounterAbstract(params) {
    const {
      content,
      title,
      extra
    } = params;
    const attributes = _objectSpread2$1(_objectSpread2$1(_objectSpread2$1({}, extra.attributes), title ? {
      "title": title
    } : {}), {}, {
      "class": extra.classes.join(" ")
    });
    const styleString = joinStyles(extra.styles);
    if (styleString.length > 0) {
      attributes["style"] = styleString;
    }
    const val = [];
    val.push({
      tag: "span",
      attributes,
      children: [content]
    });
    if (title) {
      val.push({
        tag: "span",
        attributes: {
          class: "sr-only"
        },
        children: [title]
      });
    }
    return val;
  }
  const {
    styles: styles$1
  } = namespace;
  function asFoundIcon(icon2) {
    const width = icon2[0];
    const height = icon2[1];
    const [vectorData] = icon2.slice(4);
    let element = null;
    if (Array.isArray(vectorData)) {
      element = {
        tag: "g",
        attributes: {
          class: "".concat(config.cssPrefix, "-").concat(DUOTONE_CLASSES.GROUP)
        },
        children: [{
          tag: "path",
          attributes: {
            class: "".concat(config.cssPrefix, "-").concat(DUOTONE_CLASSES.SECONDARY),
            fill: "currentColor",
            d: vectorData[0]
          }
        }, {
          tag: "path",
          attributes: {
            class: "".concat(config.cssPrefix, "-").concat(DUOTONE_CLASSES.PRIMARY),
            fill: "currentColor",
            d: vectorData[1]
          }
        }]
      };
    } else {
      element = {
        tag: "path",
        attributes: {
          fill: "currentColor",
          d: vectorData
        }
      };
    }
    return {
      found: true,
      width,
      height,
      icon: element
    };
  }
  const missingIconResolutionMixin = {
    found: false,
    width: 512,
    height: 512
  };
  function maybeNotifyMissing(iconName, prefix) {
    if (!PRODUCTION$1 && !config.showMissingIcons && iconName) {
      console.error('Icon with name "'.concat(iconName, '" and prefix "').concat(prefix, '" is missing.'));
    }
  }
  function findIcon(iconName, prefix) {
    let givenPrefix = prefix;
    if (prefix === "fa" && config.styleDefault !== null) {
      prefix = getDefaultUsablePrefix();
    }
    return new Promise((resolve2, reject) => {
      if (givenPrefix === "fa") {
        const shim = byOldName(iconName) || {};
        iconName = shim.iconName || iconName;
        prefix = shim.prefix || prefix;
      }
      if (iconName && prefix && styles$1[prefix] && styles$1[prefix][iconName]) {
        const icon2 = styles$1[prefix][iconName];
        return resolve2(asFoundIcon(icon2));
      }
      maybeNotifyMissing(iconName, prefix);
      resolve2(_objectSpread2$1(_objectSpread2$1({}, missingIconResolutionMixin), {}, {
        icon: config.showMissingIcons && iconName ? callProvided("missingIconAbstract") || {} : {}
      }));
    });
  }
  const noop$1 = () => {
  };
  const p$2 = config.measurePerformance && PERFORMANCE && PERFORMANCE.mark && PERFORMANCE.measure ? PERFORMANCE : {
    mark: noop$1,
    measure: noop$1
  };
  const preamble = 'FA "6.7.2"';
  const begin = (name2) => {
    p$2.mark("".concat(preamble, " ").concat(name2, " begins"));
    return () => end(name2);
  };
  const end = (name2) => {
    p$2.mark("".concat(preamble, " ").concat(name2, " ends"));
    p$2.measure("".concat(preamble, " ").concat(name2), "".concat(preamble, " ").concat(name2, " begins"), "".concat(preamble, " ").concat(name2, " ends"));
  };
  var perf = {
    begin,
    end
  };
  const noop$2 = () => {
  };
  function isWatched(node) {
    const i2svg = node.getAttribute ? node.getAttribute(DATA_FA_I2SVG) : null;
    return typeof i2svg === "string";
  }
  function hasPrefixAndIcon(node) {
    const prefix = node.getAttribute ? node.getAttribute(DATA_PREFIX) : null;
    const icon2 = node.getAttribute ? node.getAttribute(DATA_ICON) : null;
    return prefix && icon2;
  }
  function hasBeenReplaced(node) {
    return node && node.classList && node.classList.contains && node.classList.contains(config.replacementClass);
  }
  function getMutator() {
    if (config.autoReplaceSvg === true) {
      return mutators.replace;
    }
    const mutator = mutators[config.autoReplaceSvg];
    return mutator || mutators.replace;
  }
  function createElementNS(tag) {
    return DOCUMENT.createElementNS("http://www.w3.org/2000/svg", tag);
  }
  function createElement(tag) {
    return DOCUMENT.createElement(tag);
  }
  function convertSVG(abstractObj) {
    let params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const {
      ceFn = abstractObj.tag === "svg" ? createElementNS : createElement
    } = params;
    if (typeof abstractObj === "string") {
      return DOCUMENT.createTextNode(abstractObj);
    }
    const tag = ceFn(abstractObj.tag);
    Object.keys(abstractObj.attributes || []).forEach(function(key) {
      tag.setAttribute(key, abstractObj.attributes[key]);
    });
    const children = abstractObj.children || [];
    children.forEach(function(child) {
      tag.appendChild(convertSVG(child, {
        ceFn
      }));
    });
    return tag;
  }
  function nodeAsComment(node) {
    let comment = " ".concat(node.outerHTML, " ");
    comment = "".concat(comment, "Font Awesome fontawesome.com ");
    return comment;
  }
  const mutators = {
    replace: function(mutation) {
      const node = mutation[0];
      if (node.parentNode) {
        mutation[1].forEach((abstract) => {
          node.parentNode.insertBefore(convertSVG(abstract), node);
        });
        if (node.getAttribute(DATA_FA_I2SVG) === null && config.keepOriginalSource) {
          let comment = DOCUMENT.createComment(nodeAsComment(node));
          node.parentNode.replaceChild(comment, node);
        } else {
          node.remove();
        }
      }
    },
    nest: function(mutation) {
      const node = mutation[0];
      const abstract = mutation[1];
      if (~classArray(node).indexOf(config.replacementClass)) {
        return mutators.replace(mutation);
      }
      const forSvg = new RegExp("".concat(config.cssPrefix, "-.*"));
      delete abstract[0].attributes.id;
      if (abstract[0].attributes.class) {
        const splitClasses = abstract[0].attributes.class.split(" ").reduce((acc, cls) => {
          if (cls === config.replacementClass || cls.match(forSvg)) {
            acc.toSvg.push(cls);
          } else {
            acc.toNode.push(cls);
          }
          return acc;
        }, {
          toNode: [],
          toSvg: []
        });
        abstract[0].attributes.class = splitClasses.toSvg.join(" ");
        if (splitClasses.toNode.length === 0) {
          node.removeAttribute("class");
        } else {
          node.setAttribute("class", splitClasses.toNode.join(" "));
        }
      }
      const newInnerHTML = abstract.map((a) => toHtml(a)).join("\n");
      node.setAttribute(DATA_FA_I2SVG, "");
      node.innerHTML = newInnerHTML;
    }
  };
  function performOperationSync(op) {
    op();
  }
  function perform(mutations, callback) {
    const callbackFunction = typeof callback === "function" ? callback : noop$2;
    if (mutations.length === 0) {
      callbackFunction();
    } else {
      let frame = performOperationSync;
      if (config.mutateApproach === MUTATION_APPROACH_ASYNC) {
        frame = WINDOW.requestAnimationFrame || performOperationSync;
      }
      frame(() => {
        const mutator = getMutator();
        const mark = perf.begin("mutate");
        mutations.map(mutator);
        mark();
        callbackFunction();
      });
    }
  }
  let disabled = false;
  function disableObservation() {
    disabled = true;
  }
  function enableObservation() {
    disabled = false;
  }
  let mo = null;
  function observe(options) {
    if (!MUTATION_OBSERVER) {
      return;
    }
    if (!config.observeMutations) {
      return;
    }
    const {
      treeCallback = noop$2,
      nodeCallback = noop$2,
      pseudoElementsCallback = noop$2,
      observeMutationsRoot = DOCUMENT
    } = options;
    mo = new MUTATION_OBSERVER((objects) => {
      if (disabled) return;
      const defaultPrefix = getDefaultUsablePrefix();
      toArray(objects).forEach((mutationRecord) => {
        if (mutationRecord.type === "childList" && mutationRecord.addedNodes.length > 0 && !isWatched(mutationRecord.addedNodes[0])) {
          if (config.searchPseudoElements) {
            pseudoElementsCallback(mutationRecord.target);
          }
          treeCallback(mutationRecord.target);
        }
        if (mutationRecord.type === "attributes" && mutationRecord.target.parentNode && config.searchPseudoElements) {
          pseudoElementsCallback(mutationRecord.target.parentNode);
        }
        if (mutationRecord.type === "attributes" && isWatched(mutationRecord.target) && ~ATTRIBUTES_WATCHED_FOR_MUTATION.indexOf(mutationRecord.attributeName)) {
          if (mutationRecord.attributeName === "class" && hasPrefixAndIcon(mutationRecord.target)) {
            const {
              prefix,
              iconName
            } = getCanonicalIcon(classArray(mutationRecord.target));
            mutationRecord.target.setAttribute(DATA_PREFIX, prefix || defaultPrefix);
            if (iconName) mutationRecord.target.setAttribute(DATA_ICON, iconName);
          } else if (hasBeenReplaced(mutationRecord.target)) {
            nodeCallback(mutationRecord.target);
          }
        }
      });
    });
    if (!IS_DOM) return;
    mo.observe(observeMutationsRoot, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true
    });
  }
  function disconnect() {
    if (!mo) return;
    mo.disconnect();
  }
  function styleParser(node) {
    const style = node.getAttribute("style");
    let val = [];
    if (style) {
      val = style.split(";").reduce((acc, style2) => {
        const styles2 = style2.split(":");
        const prop = styles2[0];
        const value = styles2.slice(1);
        if (prop && value.length > 0) {
          acc[prop] = value.join(":").trim();
        }
        return acc;
      }, {});
    }
    return val;
  }
  function classParser(node) {
    const existingPrefix = node.getAttribute("data-prefix");
    const existingIconName = node.getAttribute("data-icon");
    const innerText = node.innerText !== void 0 ? node.innerText.trim() : "";
    let val = getCanonicalIcon(classArray(node));
    if (!val.prefix) {
      val.prefix = getDefaultUsablePrefix();
    }
    if (existingPrefix && existingIconName) {
      val.prefix = existingPrefix;
      val.iconName = existingIconName;
    }
    if (val.iconName && val.prefix) {
      return val;
    }
    if (val.prefix && innerText.length > 0) {
      val.iconName = byLigature(val.prefix, node.innerText) || byUnicode(val.prefix, toHex(node.innerText));
    }
    if (!val.iconName && config.autoFetchSvg && node.firstChild && node.firstChild.nodeType === Node.TEXT_NODE) {
      val.iconName = node.firstChild.data;
    }
    return val;
  }
  function attributesParser(node) {
    const extraAttributes = toArray(node.attributes).reduce((acc, attr2) => {
      if (acc.name !== "class" && acc.name !== "style") {
        acc[attr2.name] = attr2.value;
      }
      return acc;
    }, {});
    const title = node.getAttribute("title");
    const titleId = node.getAttribute("data-fa-title-id");
    if (config.autoA11y) {
      if (title) {
        extraAttributes["aria-labelledby"] = "".concat(config.replacementClass, "-title-").concat(titleId || nextUniqueId());
      } else {
        extraAttributes["aria-hidden"] = "true";
        extraAttributes["focusable"] = "false";
      }
    }
    return extraAttributes;
  }
  function blankMeta() {
    return {
      iconName: null,
      title: null,
      titleId: null,
      prefix: null,
      transform: meaninglessTransform,
      symbol: false,
      mask: {
        iconName: null,
        prefix: null,
        rest: []
      },
      maskId: null,
      extra: {
        classes: [],
        styles: {},
        attributes: {}
      }
    };
  }
  function parseMeta(node) {
    let parser = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      styleParser: true
    };
    const {
      iconName,
      prefix,
      rest: extraClasses
    } = classParser(node);
    const extraAttributes = attributesParser(node);
    const pluginMeta = chainHooks("parseNodeAttributes", {}, node);
    let extraStyles = parser.styleParser ? styleParser(node) : [];
    return _objectSpread2$1({
      iconName,
      title: node.getAttribute("title"),
      titleId: node.getAttribute("data-fa-title-id"),
      prefix,
      transform: meaninglessTransform,
      mask: {
        iconName: null,
        prefix: null,
        rest: []
      },
      maskId: null,
      symbol: false,
      extra: {
        classes: extraClasses,
        styles: extraStyles,
        attributes: extraAttributes
      }
    }, pluginMeta);
  }
  const {
    styles: styles$2
  } = namespace;
  function generateMutation(node) {
    const nodeMeta = config.autoReplaceSvg === "nest" ? parseMeta(node, {
      styleParser: false
    }) : parseMeta(node);
    if (~nodeMeta.extra.classes.indexOf(LAYERS_TEXT_CLASSNAME)) {
      return callProvided("generateLayersText", node, nodeMeta);
    } else {
      return callProvided("generateSvgReplacementMutation", node, nodeMeta);
    }
  }
  function getKnownPrefixes() {
    return [...Ft, ...Ia];
  }
  function onTree(root2) {
    let callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    if (!IS_DOM) return Promise.resolve();
    const htmlClassList = DOCUMENT.documentElement.classList;
    const hclAdd = (suffix) => htmlClassList.add("".concat(HTML_CLASS_I2SVG_BASE_CLASS, "-").concat(suffix));
    const hclRemove = (suffix) => htmlClassList.remove("".concat(HTML_CLASS_I2SVG_BASE_CLASS, "-").concat(suffix));
    const prefixes2 = config.autoFetchSvg ? getKnownPrefixes() : P.concat(Object.keys(styles$2));
    if (!prefixes2.includes("fa")) {
      prefixes2.push("fa");
    }
    const prefixesDomQuery = [".".concat(LAYERS_TEXT_CLASSNAME, ":not([").concat(DATA_FA_I2SVG, "])")].concat(prefixes2.map((p$$1) => ".".concat(p$$1, ":not([").concat(DATA_FA_I2SVG, "])"))).join(", ");
    if (prefixesDomQuery.length === 0) {
      return Promise.resolve();
    }
    let candidates = [];
    try {
      candidates = toArray(root2.querySelectorAll(prefixesDomQuery));
    } catch (e$$1) {
    }
    if (candidates.length > 0) {
      hclAdd("pending");
      hclRemove("complete");
    } else {
      return Promise.resolve();
    }
    const mark = perf.begin("onTree");
    const mutations = candidates.reduce((acc, node) => {
      try {
        const mutation = generateMutation(node);
        if (mutation) {
          acc.push(mutation);
        }
      } catch (e$$1) {
        if (!PRODUCTION$1) {
          if (e$$1.name === "MissingIcon") {
            console.error(e$$1);
          }
        }
      }
      return acc;
    }, []);
    return new Promise((resolve2, reject) => {
      Promise.all(mutations).then((resolvedMutations) => {
        perform(resolvedMutations, () => {
          hclAdd("active");
          hclAdd("complete");
          hclRemove("pending");
          if (typeof callback === "function") callback();
          mark();
          resolve2();
        });
      }).catch((e$$1) => {
        mark();
        reject(e$$1);
      });
    });
  }
  function onNode(node) {
    let callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    generateMutation(node).then((mutation) => {
      if (mutation) {
        perform([mutation], callback);
      }
    });
  }
  function resolveIcons(next) {
    return function(maybeIconDefinition) {
      let params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      const iconDefinition = (maybeIconDefinition || {}).icon ? maybeIconDefinition : findIconDefinition(maybeIconDefinition || {});
      let {
        mask
      } = params;
      if (mask) {
        mask = (mask || {}).icon ? mask : findIconDefinition(mask || {});
      }
      return next(iconDefinition, _objectSpread2$1(_objectSpread2$1({}, params), {}, {
        mask
      }));
    };
  }
  const render$1 = function(iconDefinition) {
    let params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const {
      transform = meaninglessTransform,
      symbol = false,
      mask = null,
      maskId = null,
      title = null,
      titleId = null,
      classes = [],
      attributes = {},
      styles: styles2 = {}
    } = params;
    if (!iconDefinition) return;
    const {
      prefix,
      iconName,
      icon: icon2
    } = iconDefinition;
    return domVariants(_objectSpread2$1({
      type: "icon"
    }, iconDefinition), () => {
      callHooks("beforeDOMElementCreation", {
        iconDefinition,
        params
      });
      if (config.autoA11y) {
        if (title) {
          attributes["aria-labelledby"] = "".concat(config.replacementClass, "-title-").concat(titleId || nextUniqueId());
        } else {
          attributes["aria-hidden"] = "true";
          attributes["focusable"] = "false";
        }
      }
      return makeInlineSvgAbstract({
        icons: {
          main: asFoundIcon(icon2),
          mask: mask ? asFoundIcon(mask.icon) : {
            found: false,
            width: null,
            height: null,
            icon: {}
          }
        },
        prefix,
        iconName,
        transform: _objectSpread2$1(_objectSpread2$1({}, meaninglessTransform), transform),
        symbol,
        title,
        maskId,
        titleId,
        extra: {
          attributes,
          styles: styles2,
          classes
        }
      });
    });
  };
  var ReplaceElements = {
    mixout() {
      return {
        icon: resolveIcons(render$1)
      };
    },
    hooks() {
      return {
        mutationObserverCallbacks(accumulator) {
          accumulator.treeCallback = onTree;
          accumulator.nodeCallback = onNode;
          return accumulator;
        }
      };
    },
    provides(providers$$1) {
      providers$$1.i2svg = function(params) {
        const {
          node = DOCUMENT,
          callback = () => {
          }
        } = params;
        return onTree(node, callback);
      };
      providers$$1.generateSvgReplacementMutation = function(node, nodeMeta) {
        const {
          iconName,
          title,
          titleId,
          prefix,
          transform,
          symbol,
          mask,
          maskId,
          extra
        } = nodeMeta;
        return new Promise((resolve2, reject) => {
          Promise.all([findIcon(iconName, prefix), mask.iconName ? findIcon(mask.iconName, mask.prefix) : Promise.resolve({
            found: false,
            width: 512,
            height: 512,
            icon: {}
          })]).then((_ref) => {
            let [main, mask2] = _ref;
            resolve2([node, makeInlineSvgAbstract({
              icons: {
                main,
                mask: mask2
              },
              prefix,
              iconName,
              transform,
              symbol,
              maskId,
              title,
              titleId,
              extra,
              watchable: true
            })]);
          }).catch(reject);
        });
      };
      providers$$1.generateAbstractIcon = function(_ref2) {
        let {
          children,
          attributes,
          main,
          transform,
          styles: styles2
        } = _ref2;
        const styleString = joinStyles(styles2);
        if (styleString.length > 0) {
          attributes["style"] = styleString;
        }
        let nextChild;
        if (transformIsMeaningful(transform)) {
          nextChild = callProvided("generateAbstractTransformGrouping", {
            main,
            transform,
            containerWidth: main.width,
            iconWidth: main.width
          });
        }
        children.push(nextChild || main.icon);
        return {
          children,
          attributes
        };
      };
    }
  };
  var Layers = {
    mixout() {
      return {
        layer(assembler) {
          let params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          const {
            classes = []
          } = params;
          return domVariants({
            type: "layer"
          }, () => {
            callHooks("beforeDOMElementCreation", {
              assembler,
              params
            });
            let children = [];
            assembler((args) => {
              Array.isArray(args) ? args.map((a) => {
                children = children.concat(a.abstract);
              }) : children = children.concat(args.abstract);
            });
            return [{
              tag: "span",
              attributes: {
                class: ["".concat(config.cssPrefix, "-layers"), ...classes].join(" ")
              },
              children
            }];
          });
        }
      };
    }
  };
  var LayersCounter = {
    mixout() {
      return {
        counter(content) {
          let params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          const {
            title = null,
            classes = [],
            attributes = {},
            styles: styles2 = {}
          } = params;
          return domVariants({
            type: "counter",
            content
          }, () => {
            callHooks("beforeDOMElementCreation", {
              content,
              params
            });
            return makeLayersCounterAbstract({
              content: content.toString(),
              title,
              extra: {
                attributes,
                styles: styles2,
                classes: ["".concat(config.cssPrefix, "-layers-counter"), ...classes]
              }
            });
          });
        }
      };
    }
  };
  var LayersText = {
    mixout() {
      return {
        text(content) {
          let params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          const {
            transform = meaninglessTransform,
            title = null,
            classes = [],
            attributes = {},
            styles: styles2 = {}
          } = params;
          return domVariants({
            type: "text",
            content
          }, () => {
            callHooks("beforeDOMElementCreation", {
              content,
              params
            });
            return makeLayersTextAbstract({
              content,
              transform: _objectSpread2$1(_objectSpread2$1({}, meaninglessTransform), transform),
              title,
              extra: {
                attributes,
                styles: styles2,
                classes: ["".concat(config.cssPrefix, "-layers-text"), ...classes]
              }
            });
          });
        }
      };
    },
    provides(providers$$1) {
      providers$$1.generateLayersText = function(node, nodeMeta) {
        const {
          title,
          transform,
          extra
        } = nodeMeta;
        let width = null;
        let height = null;
        if (IS_IE) {
          const computedFontSize = parseInt(getComputedStyle(node).fontSize, 10);
          const boundingClientRect = node.getBoundingClientRect();
          width = boundingClientRect.width / computedFontSize;
          height = boundingClientRect.height / computedFontSize;
        }
        if (config.autoA11y && !title) {
          extra.attributes["aria-hidden"] = "true";
        }
        return Promise.resolve([node, makeLayersTextAbstract({
          content: node.innerHTML,
          width,
          height,
          transform,
          title,
          extra,
          watchable: true
        })]);
      };
    }
  };
  const CLEAN_CONTENT_PATTERN = new RegExp('"', "ug");
  const SECONDARY_UNICODE_RANGE = [1105920, 1112319];
  const _FONT_FAMILY_WEIGHT_TO_PREFIX = _objectSpread2$1(_objectSpread2$1(_objectSpread2$1(_objectSpread2$1({}, {
    FontAwesome: {
      normal: "fas",
      400: "fas"
    }
  }), lt), wa), Yt);
  const FONT_FAMILY_WEIGHT_TO_PREFIX = Object.keys(_FONT_FAMILY_WEIGHT_TO_PREFIX).reduce((acc, key) => {
    acc[key.toLowerCase()] = _FONT_FAMILY_WEIGHT_TO_PREFIX[key];
    return acc;
  }, {});
  const FONT_FAMILY_WEIGHT_FALLBACK = Object.keys(FONT_FAMILY_WEIGHT_TO_PREFIX).reduce((acc, fontFamily) => {
    const weights = FONT_FAMILY_WEIGHT_TO_PREFIX[fontFamily];
    acc[fontFamily] = weights[900] || [...Object.entries(weights)][0][1];
    return acc;
  }, {});
  function hexValueFromContent(content) {
    const cleaned = content.replace(CLEAN_CONTENT_PATTERN, "");
    const codePoint = codePointAt(cleaned, 0);
    const isPrependTen = codePoint >= SECONDARY_UNICODE_RANGE[0] && codePoint <= SECONDARY_UNICODE_RANGE[1];
    const isDoubled = cleaned.length === 2 ? cleaned[0] === cleaned[1] : false;
    return {
      value: isDoubled ? toHex(cleaned[0]) : toHex(cleaned),
      isSecondary: isPrependTen || isDoubled
    };
  }
  function getPrefix(fontFamily, fontWeight) {
    const fontFamilySanitized = fontFamily.replace(/^['"]|['"]$/g, "").toLowerCase();
    const fontWeightInteger = parseInt(fontWeight);
    const fontWeightSanitized = isNaN(fontWeightInteger) ? "normal" : fontWeightInteger;
    return (FONT_FAMILY_WEIGHT_TO_PREFIX[fontFamilySanitized] || {})[fontWeightSanitized] || FONT_FAMILY_WEIGHT_FALLBACK[fontFamilySanitized];
  }
  function replaceForPosition(node, position) {
    const pendingAttribute = "".concat(DATA_FA_PSEUDO_ELEMENT_PENDING).concat(position.replace(":", "-"));
    return new Promise((resolve2, reject) => {
      if (node.getAttribute(pendingAttribute) !== null) {
        return resolve2();
      }
      const children = toArray(node.children);
      const alreadyProcessedPseudoElement = children.filter((c$$1) => c$$1.getAttribute(DATA_FA_PSEUDO_ELEMENT) === position)[0];
      const styles2 = WINDOW.getComputedStyle(node, position);
      const fontFamily = styles2.getPropertyValue("font-family");
      const fontFamilyMatch = fontFamily.match(FONT_FAMILY_PATTERN);
      const fontWeight = styles2.getPropertyValue("font-weight");
      const content = styles2.getPropertyValue("content");
      if (alreadyProcessedPseudoElement && !fontFamilyMatch) {
        node.removeChild(alreadyProcessedPseudoElement);
        return resolve2();
      } else if (fontFamilyMatch && content !== "none" && content !== "") {
        const content2 = styles2.getPropertyValue("content");
        let prefix = getPrefix(fontFamily, fontWeight);
        const {
          value: hexValue,
          isSecondary
        } = hexValueFromContent(content2);
        const isV4 = fontFamilyMatch[0].startsWith("FontAwesome");
        let iconName = byUnicode(prefix, hexValue);
        let iconIdentifier = iconName;
        if (isV4) {
          const iconName4 = byOldUnicode(hexValue);
          if (iconName4.iconName && iconName4.prefix) {
            iconName = iconName4.iconName;
            prefix = iconName4.prefix;
          }
        }
        if (iconName && !isSecondary && (!alreadyProcessedPseudoElement || alreadyProcessedPseudoElement.getAttribute(DATA_PREFIX) !== prefix || alreadyProcessedPseudoElement.getAttribute(DATA_ICON) !== iconIdentifier)) {
          node.setAttribute(pendingAttribute, iconIdentifier);
          if (alreadyProcessedPseudoElement) {
            node.removeChild(alreadyProcessedPseudoElement);
          }
          const meta = blankMeta();
          const {
            extra
          } = meta;
          extra.attributes[DATA_FA_PSEUDO_ELEMENT] = position;
          findIcon(iconName, prefix).then((main) => {
            const abstract = makeInlineSvgAbstract(_objectSpread2$1(_objectSpread2$1({}, meta), {}, {
              icons: {
                main,
                mask: emptyCanonicalIcon()
              },
              prefix,
              iconName: iconIdentifier,
              extra,
              watchable: true
            }));
            const element = DOCUMENT.createElementNS("http://www.w3.org/2000/svg", "svg");
            if (position === "::before") {
              node.insertBefore(element, node.firstChild);
            } else {
              node.appendChild(element);
            }
            element.outerHTML = abstract.map((a$$1) => toHtml(a$$1)).join("\n");
            node.removeAttribute(pendingAttribute);
            resolve2();
          }).catch(reject);
        } else {
          resolve2();
        }
      } else {
        resolve2();
      }
    });
  }
  function replace(node) {
    return Promise.all([replaceForPosition(node, "::before"), replaceForPosition(node, "::after")]);
  }
  function processable(node) {
    return node.parentNode !== document.head && !~TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS.indexOf(node.tagName.toUpperCase()) && !node.getAttribute(DATA_FA_PSEUDO_ELEMENT) && (!node.parentNode || node.parentNode.tagName !== "svg");
  }
  function searchPseudoElements(root2) {
    if (!IS_DOM) return;
    return new Promise((resolve2, reject) => {
      const operations = toArray(root2.querySelectorAll("*")).filter(processable).map(replace);
      const end2 = perf.begin("searchPseudoElements");
      disableObservation();
      Promise.all(operations).then(() => {
        end2();
        enableObservation();
        resolve2();
      }).catch(() => {
        end2();
        enableObservation();
        reject();
      });
    });
  }
  var PseudoElements = {
    hooks() {
      return {
        mutationObserverCallbacks(accumulator) {
          accumulator.pseudoElementsCallback = searchPseudoElements;
          return accumulator;
        }
      };
    },
    provides(providers2) {
      providers2.pseudoElements2svg = function(params) {
        const {
          node = DOCUMENT
        } = params;
        if (config.searchPseudoElements) {
          searchPseudoElements(node);
        }
      };
    }
  };
  let _unwatched = false;
  var MutationObserver$1 = {
    mixout() {
      return {
        dom: {
          unwatch() {
            disableObservation();
            _unwatched = true;
          }
        }
      };
    },
    hooks() {
      return {
        bootstrap() {
          observe(chainHooks("mutationObserverCallbacks", {}));
        },
        noAuto() {
          disconnect();
        },
        watch(params) {
          const {
            observeMutationsRoot
          } = params;
          if (_unwatched) {
            enableObservation();
          } else {
            observe(chainHooks("mutationObserverCallbacks", {
              observeMutationsRoot
            }));
          }
        }
      };
    }
  };
  const parseTransformString = (transformString) => {
    let transform = {
      size: 16,
      x: 0,
      y: 0,
      flipX: false,
      flipY: false,
      rotate: 0
    };
    return transformString.toLowerCase().split(" ").reduce((acc, n) => {
      const parts = n.toLowerCase().split("-");
      const first = parts[0];
      let rest = parts.slice(1).join("-");
      if (first && rest === "h") {
        acc.flipX = true;
        return acc;
      }
      if (first && rest === "v") {
        acc.flipY = true;
        return acc;
      }
      rest = parseFloat(rest);
      if (isNaN(rest)) {
        return acc;
      }
      switch (first) {
        case "grow":
          acc.size = acc.size + rest;
          break;
        case "shrink":
          acc.size = acc.size - rest;
          break;
        case "left":
          acc.x = acc.x - rest;
          break;
        case "right":
          acc.x = acc.x + rest;
          break;
        case "up":
          acc.y = acc.y - rest;
          break;
        case "down":
          acc.y = acc.y + rest;
          break;
        case "rotate":
          acc.rotate = acc.rotate + rest;
          break;
      }
      return acc;
    }, transform);
  };
  var PowerTransforms = {
    mixout() {
      return {
        parse: {
          transform: (transformString) => {
            return parseTransformString(transformString);
          }
        }
      };
    },
    hooks() {
      return {
        parseNodeAttributes(accumulator, node) {
          const transformString = node.getAttribute("data-fa-transform");
          if (transformString) {
            accumulator.transform = parseTransformString(transformString);
          }
          return accumulator;
        }
      };
    },
    provides(providers2) {
      providers2.generateAbstractTransformGrouping = function(_ref) {
        let {
          main,
          transform,
          containerWidth,
          iconWidth
        } = _ref;
        const outer = {
          transform: "translate(".concat(containerWidth / 2, " 256)")
        };
        const innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
        const innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
        const innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
        const inner = {
          transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
        };
        const path = {
          transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
        };
        const operations = {
          outer,
          inner,
          path
        };
        return {
          tag: "g",
          attributes: _objectSpread2$1({}, operations.outer),
          children: [{
            tag: "g",
            attributes: _objectSpread2$1({}, operations.inner),
            children: [{
              tag: main.icon.tag,
              children: main.icon.children,
              attributes: _objectSpread2$1(_objectSpread2$1({}, main.icon.attributes), operations.path)
            }]
          }]
        };
      };
    }
  };
  const ALL_SPACE = {
    x: 0,
    y: 0,
    width: "100%",
    height: "100%"
  };
  function fillBlack(abstract) {
    let force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    if (abstract.attributes && (abstract.attributes.fill || force)) {
      abstract.attributes.fill = "black";
    }
    return abstract;
  }
  function deGroup(abstract) {
    if (abstract.tag === "g") {
      return abstract.children;
    } else {
      return [abstract];
    }
  }
  var Masks = {
    hooks() {
      return {
        parseNodeAttributes(accumulator, node) {
          const maskData = node.getAttribute("data-fa-mask");
          const mask = !maskData ? emptyCanonicalIcon() : getCanonicalIcon(maskData.split(" ").map((i) => i.trim()));
          if (!mask.prefix) {
            mask.prefix = getDefaultUsablePrefix();
          }
          accumulator.mask = mask;
          accumulator.maskId = node.getAttribute("data-fa-mask-id");
          return accumulator;
        }
      };
    },
    provides(providers2) {
      providers2.generateAbstractMask = function(_ref) {
        let {
          children,
          attributes,
          main,
          mask,
          maskId: explicitMaskId,
          transform
        } = _ref;
        const {
          width: mainWidth,
          icon: mainPath
        } = main;
        const {
          width: maskWidth,
          icon: maskPath
        } = mask;
        const trans = transformForSvg({
          transform,
          containerWidth: maskWidth,
          iconWidth: mainWidth
        });
        const maskRect = {
          tag: "rect",
          attributes: _objectSpread2$1(_objectSpread2$1({}, ALL_SPACE), {}, {
            fill: "white"
          })
        };
        const maskInnerGroupChildrenMixin = mainPath.children ? {
          children: mainPath.children.map(fillBlack)
        } : {};
        const maskInnerGroup = {
          tag: "g",
          attributes: _objectSpread2$1({}, trans.inner),
          children: [fillBlack(_objectSpread2$1({
            tag: mainPath.tag,
            attributes: _objectSpread2$1(_objectSpread2$1({}, mainPath.attributes), trans.path)
          }, maskInnerGroupChildrenMixin))]
        };
        const maskOuterGroup = {
          tag: "g",
          attributes: _objectSpread2$1({}, trans.outer),
          children: [maskInnerGroup]
        };
        const maskId = "mask-".concat(explicitMaskId || nextUniqueId());
        const clipId = "clip-".concat(explicitMaskId || nextUniqueId());
        const maskTag = {
          tag: "mask",
          attributes: _objectSpread2$1(_objectSpread2$1({}, ALL_SPACE), {}, {
            id: maskId,
            maskUnits: "userSpaceOnUse",
            maskContentUnits: "userSpaceOnUse"
          }),
          children: [maskRect, maskOuterGroup]
        };
        const defs = {
          tag: "defs",
          children: [{
            tag: "clipPath",
            attributes: {
              id: clipId
            },
            children: deGroup(maskPath)
          }, maskTag]
        };
        children.push(defs, {
          tag: "rect",
          attributes: _objectSpread2$1({
            fill: "currentColor",
            "clip-path": "url(#".concat(clipId, ")"),
            mask: "url(#".concat(maskId, ")")
          }, ALL_SPACE)
        });
        return {
          children,
          attributes
        };
      };
    }
  };
  var MissingIconIndicator = {
    provides(providers2) {
      let reduceMotion = false;
      if (WINDOW.matchMedia) {
        reduceMotion = WINDOW.matchMedia("(prefers-reduced-motion: reduce)").matches;
      }
      providers2.missingIconAbstract = function() {
        const gChildren = [];
        const FILL = {
          fill: "currentColor"
        };
        const ANIMATION_BASE = {
          attributeType: "XML",
          repeatCount: "indefinite",
          dur: "2s"
        };
        gChildren.push({
          tag: "path",
          attributes: _objectSpread2$1(_objectSpread2$1({}, FILL), {}, {
            d: "M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"
          })
        });
        const OPACITY_ANIMATE = _objectSpread2$1(_objectSpread2$1({}, ANIMATION_BASE), {}, {
          attributeName: "opacity"
        });
        const dot = {
          tag: "circle",
          attributes: _objectSpread2$1(_objectSpread2$1({}, FILL), {}, {
            cx: "256",
            cy: "364",
            r: "28"
          }),
          children: []
        };
        if (!reduceMotion) {
          dot.children.push({
            tag: "animate",
            attributes: _objectSpread2$1(_objectSpread2$1({}, ANIMATION_BASE), {}, {
              attributeName: "r",
              values: "28;14;28;28;14;28;"
            })
          }, {
            tag: "animate",
            attributes: _objectSpread2$1(_objectSpread2$1({}, OPACITY_ANIMATE), {}, {
              values: "1;0;1;1;0;1;"
            })
          });
        }
        gChildren.push(dot);
        gChildren.push({
          tag: "path",
          attributes: _objectSpread2$1(_objectSpread2$1({}, FILL), {}, {
            opacity: "1",
            d: "M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"
          }),
          children: reduceMotion ? [] : [{
            tag: "animate",
            attributes: _objectSpread2$1(_objectSpread2$1({}, OPACITY_ANIMATE), {}, {
              values: "1;0;0;0;0;1;"
            })
          }]
        });
        if (!reduceMotion) {
          gChildren.push({
            tag: "path",
            attributes: _objectSpread2$1(_objectSpread2$1({}, FILL), {}, {
              opacity: "0",
              d: "M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"
            }),
            children: [{
              tag: "animate",
              attributes: _objectSpread2$1(_objectSpread2$1({}, OPACITY_ANIMATE), {}, {
                values: "0;0;1;1;0;0;"
              })
            }]
          });
        }
        return {
          tag: "g",
          attributes: {
            "class": "missing"
          },
          children: gChildren
        };
      };
    }
  };
  var SvgSymbols = {
    hooks() {
      return {
        parseNodeAttributes(accumulator, node) {
          const symbolData = node.getAttribute("data-fa-symbol");
          const symbol = symbolData === null ? false : symbolData === "" ? true : symbolData;
          accumulator["symbol"] = symbol;
          return accumulator;
        }
      };
    }
  };
  var plugins = [InjectCSS, ReplaceElements, Layers, LayersCounter, LayersText, PseudoElements, MutationObserver$1, PowerTransforms, Masks, MissingIconIndicator, SvgSymbols];
  registerPlugins(plugins, {
    mixoutsTo: api
  });
  api.noAuto;
  api.config;
  const library$1 = api.library;
  api.dom;
  const parse$1 = api.parse;
  api.findIconDefinition;
  api.toHtml;
  const icon = api.icon;
  api.layer;
  api.text;
  api.counter;
  function _defineProperty(e, r2, t2) {
    return (r2 = _toPropertyKey(r2)) in e ? Object.defineProperty(e, r2, {
      value: t2,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e[r2] = t2, e;
  }
  function ownKeys(e, r2) {
    var t2 = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o2 = Object.getOwnPropertySymbols(e);
      r2 && (o2 = o2.filter(function(r22) {
        return Object.getOwnPropertyDescriptor(e, r22).enumerable;
      })), t2.push.apply(t2, o2);
    }
    return t2;
  }
  function _objectSpread2(e) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t2 = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys(Object(t2), true).forEach(function(r22) {
        _defineProperty(e, r22, t2[r22]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys(Object(t2)).forEach(function(r22) {
        Object.defineProperty(e, r22, Object.getOwnPropertyDescriptor(t2, r22));
      });
    }
    return e;
  }
  function _objectWithoutProperties(e, t2) {
    if (null == e) return {};
    var o2, r2, i = _objectWithoutPropertiesLoose(e, t2);
    if (Object.getOwnPropertySymbols) {
      var n = Object.getOwnPropertySymbols(e);
      for (r2 = 0; r2 < n.length; r2++) o2 = n[r2], -1 === t2.indexOf(o2) && {}.propertyIsEnumerable.call(e, o2) && (i[o2] = e[o2]);
    }
    return i;
  }
  function _objectWithoutPropertiesLoose(r2, e) {
    if (null == r2) return {};
    var t2 = {};
    for (var n in r2) if ({}.hasOwnProperty.call(r2, n)) {
      if (-1 !== e.indexOf(n)) continue;
      t2[n] = r2[n];
    }
    return t2;
  }
  function _toPrimitive(t2, r2) {
    if ("object" != typeof t2 || !t2) return t2;
    var e = t2[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t2, r2);
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t2);
  }
  function _toPropertyKey(t2) {
    var i = _toPrimitive(t2, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _typeof(o2) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o22) {
      return typeof o22;
    } : function(o22) {
      return o22 && "function" == typeof Symbol && o22.constructor === Symbol && o22 !== Symbol.prototype ? "symbol" : typeof o22;
    }, _typeof(o2);
  }
  function objectWithKey(key, value) {
    return Array.isArray(value) && value.length > 0 || !Array.isArray(value) && value ? _defineProperty({}, key, value) : {};
  }
  function classList(props2) {
    var _classes;
    var classes = (_classes = {
      "fa-spin": props2.spin,
      "fa-pulse": props2.pulse,
      // the fixedWidth property has been deprecated as of version 7.0.0
      "fa-fw": props2.fixedWidth,
      "fa-border": props2.border,
      "fa-li": props2.listItem,
      "fa-inverse": props2.inverse,
      "fa-flip": props2.flip === true,
      "fa-flip-horizontal": props2.flip === "horizontal" || props2.flip === "both",
      "fa-flip-vertical": props2.flip === "vertical" || props2.flip === "both"
    }, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_classes, "fa-".concat(props2.size), props2.size !== null), "fa-rotate-".concat(props2.rotation), props2.rotation !== null), "fa-rotate-by", props2.rotateBy), "fa-pull-".concat(props2.pull), props2.pull !== null), "fa-swap-opacity", props2.swapOpacity), "fa-bounce", props2.bounce), "fa-shake", props2.shake), "fa-beat", props2.beat), "fa-fade", props2.fade), "fa-beat-fade", props2.beatFade), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_classes, "fa-flash", props2.flash), "fa-spin-pulse", props2.spinPulse), "fa-spin-reverse", props2.spinReverse), "fa-width-auto", props2.widthAuto));
    return Object.keys(classes).map(function(key) {
      return classes[key] ? key : null;
    }).filter(function(key) {
      return key;
    });
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  var humps$1 = { exports: {} };
  (function(module) {
    (function(global2) {
      var _processKeys = function(convert2, obj, options) {
        if (!_isObject(obj) || _isDate(obj) || _isRegExp(obj) || _isBoolean(obj) || _isFunction(obj)) {
          return obj;
        }
        var output, i = 0, l = 0;
        if (_isArray(obj)) {
          output = [];
          for (l = obj.length; i < l; i++) {
            output.push(_processKeys(convert2, obj[i], options));
          }
        } else {
          output = {};
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              output[convert2(key, options)] = _processKeys(convert2, obj[key], options);
            }
          }
        }
        return output;
      };
      var separateWords = function(string, options) {
        options = options || {};
        var separator = options.separator || "_";
        var split = options.split || /(?=[A-Z])/;
        return string.split(split).join(separator);
      };
      var camelize2 = function(string) {
        if (_isNumerical(string)) {
          return string;
        }
        string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
          return chr ? chr.toUpperCase() : "";
        });
        return string.substr(0, 1).toLowerCase() + string.substr(1);
      };
      var pascalize = function(string) {
        var camelized = camelize2(string);
        return camelized.substr(0, 1).toUpperCase() + camelized.substr(1);
      };
      var decamelize = function(string, options) {
        return separateWords(string, options).toLowerCase();
      };
      var toString2 = Object.prototype.toString;
      var _isFunction = function(obj) {
        return typeof obj === "function";
      };
      var _isObject = function(obj) {
        return obj === Object(obj);
      };
      var _isArray = function(obj) {
        return toString2.call(obj) == "[object Array]";
      };
      var _isDate = function(obj) {
        return toString2.call(obj) == "[object Date]";
      };
      var _isRegExp = function(obj) {
        return toString2.call(obj) == "[object RegExp]";
      };
      var _isBoolean = function(obj) {
        return toString2.call(obj) == "[object Boolean]";
      };
      var _isNumerical = function(obj) {
        obj = obj - 0;
        return obj === obj;
      };
      var _processor = function(convert2, options) {
        var callback = options && "process" in options ? options.process : options;
        if (typeof callback !== "function") {
          return convert2;
        }
        return function(string, options2) {
          return callback(string, convert2, options2);
        };
      };
      var humps2 = {
        camelize: camelize2,
        decamelize,
        pascalize,
        depascalize: decamelize,
        camelizeKeys: function(object, options) {
          return _processKeys(_processor(camelize2, options), object);
        },
        decamelizeKeys: function(object, options) {
          return _processKeys(_processor(decamelize, options), object, options);
        },
        pascalizeKeys: function(object, options) {
          return _processKeys(_processor(pascalize, options), object);
        },
        depascalizeKeys: function() {
          return this.decamelizeKeys.apply(this, arguments);
        }
      };
      if (module.exports) {
        module.exports = humps2;
      } else {
        global2.humps = humps2;
      }
    })(commonjsGlobal);
  })(humps$1);
  var humps = humps$1.exports;
  var _excluded = ["class", "style"];
  function styleToObject(style) {
    return style.split(";").map(function(s2) {
      return s2.trim();
    }).filter(function(s2) {
      return s2;
    }).reduce(function(output, pair) {
      var idx = pair.indexOf(":");
      var prop = humps.camelize(pair.slice(0, idx));
      var value = pair.slice(idx + 1).trim();
      output[prop] = value;
      return output;
    }, {});
  }
  function classToObject(classes) {
    return classes.split(/\s+/).reduce(function(output, className) {
      output[className] = true;
      return output;
    }, {});
  }
  function convert(abstractElement) {
    var props2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var attrs = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    if (typeof abstractElement === "string") {
      return abstractElement;
    }
    var children = (abstractElement.children || []).map(function(child) {
      return convert(child);
    });
    var mixins = Object.keys(abstractElement.attributes || {}).reduce(function(mixins2, key) {
      var value = abstractElement.attributes[key];
      switch (key) {
        case "class":
          mixins2.class = classToObject(value);
          break;
        case "style":
          mixins2.style = styleToObject(value);
          break;
        default:
          mixins2.attrs[key] = value;
      }
      return mixins2;
    }, {
      attrs: {},
      class: {},
      style: {}
    });
    attrs.class;
    var _attrs$style = attrs.style, aStyle = _attrs$style === void 0 ? {} : _attrs$style, otherAttrs = _objectWithoutProperties(attrs, _excluded);
    return h(abstractElement.tag, _objectSpread2(_objectSpread2(_objectSpread2({}, props2), {}, {
      class: mixins.class,
      style: _objectSpread2(_objectSpread2({}, mixins.style), aStyle)
    }, mixins.attrs), otherAttrs), children);
  }
  var PRODUCTION = false;
  try {
    PRODUCTION = false;
  } catch (e) {
  }
  function log() {
    if (!PRODUCTION && console && typeof console.error === "function") {
      var _console;
      (_console = console).error.apply(_console, arguments);
    }
  }
  function normalizeIconArgs(icon2) {
    if (icon2 && _typeof(icon2) === "object" && icon2.prefix && icon2.iconName && icon2.icon) {
      return icon2;
    }
    if (parse$1.icon) {
      return parse$1.icon(icon2);
    }
    if (icon2 === null) {
      return null;
    }
    if (_typeof(icon2) === "object" && icon2.prefix && icon2.iconName) {
      return icon2;
    }
    if (Array.isArray(icon2) && icon2.length === 2) {
      return {
        prefix: icon2[0],
        iconName: icon2[1]
      };
    }
    if (typeof icon2 === "string") {
      return {
        prefix: "fas",
        iconName: icon2
      };
    }
  }
  var FontAwesomeIcon = /* @__PURE__ */ defineComponent({
    name: "FontAwesomeIcon",
    props: {
      border: {
        type: Boolean,
        default: false
      },
      // the fixedWidth property has been deprecated as of version 7
      fixedWidth: {
        type: Boolean,
        default: false
      },
      flip: {
        type: [Boolean, String],
        default: false,
        validator: function validator2(value) {
          return [true, false, "horizontal", "vertical", "both"].indexOf(value) > -1;
        }
      },
      icon: {
        type: [Object, Array, String],
        required: true
      },
      mask: {
        type: [Object, Array, String],
        default: null
      },
      maskId: {
        type: String,
        default: null
      },
      listItem: {
        type: Boolean,
        default: false
      },
      pull: {
        type: String,
        default: null,
        validator: function validator2(value) {
          return ["right", "left"].indexOf(value) > -1;
        }
      },
      pulse: {
        type: Boolean,
        default: false
      },
      rotation: {
        type: [String, Number],
        default: null,
        validator: function validator3(value) {
          return [90, 180, 270].indexOf(Number.parseInt(value, 10)) > -1;
        }
      },
      // the rotateBy property is only supported in version 7.0.0 and later
      rotateBy: {
        type: Boolean,
        default: false
      },
      swapOpacity: {
        type: Boolean,
        default: false
      },
      size: {
        type: String,
        default: null,
        validator: function validator4(value) {
          return ["2xs", "xs", "sm", "lg", "xl", "2xl", "1x", "2x", "3x", "4x", "5x", "6x", "7x", "8x", "9x", "10x"].indexOf(value) > -1;
        }
      },
      spin: {
        type: Boolean,
        default: false
      },
      transform: {
        type: [String, Object],
        default: null
      },
      symbol: {
        type: [Boolean, String],
        default: false
      },
      title: {
        type: String,
        default: null
      },
      titleId: {
        type: String,
        default: null
      },
      inverse: {
        type: Boolean,
        default: false
      },
      bounce: {
        type: Boolean,
        default: false
      },
      shake: {
        type: Boolean,
        default: false
      },
      beat: {
        type: Boolean,
        default: false
      },
      fade: {
        type: Boolean,
        default: false
      },
      beatFade: {
        type: Boolean,
        default: false
      },
      flash: {
        type: Boolean,
        default: false
      },
      spinPulse: {
        type: Boolean,
        default: false
      },
      spinReverse: {
        type: Boolean,
        default: false
      },
      // the widthAuto property is only supported in version 7.0.0 and later
      widthAuto: {
        type: Boolean,
        default: false
      }
    },
    setup: function setup(props2, _ref) {
      var attrs = _ref.attrs;
      var icon$1 = computed(function() {
        return normalizeIconArgs(props2.icon);
      });
      var classes = computed(function() {
        return objectWithKey("classes", classList(props2));
      });
      var transform = computed(function() {
        return objectWithKey("transform", typeof props2.transform === "string" ? parse$1.transform(props2.transform) : props2.transform);
      });
      var mask = computed(function() {
        return objectWithKey("mask", normalizeIconArgs(props2.mask));
      });
      var renderedIcon = computed(function() {
        var iconProps = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, classes.value), transform.value), mask.value), {}, {
          symbol: props2.symbol,
          maskId: props2.maskId
        });
        iconProps.title = props2.title;
        iconProps.titleId = props2.titleId;
        return icon(icon$1.value, iconProps);
      });
      watch(renderedIcon, function(value) {
        if (!value) {
          return log("Could not find one or more icon(s)", icon$1.value, mask.value);
        }
      }, {
        immediate: true
      });
      var vnode = computed(function() {
        return renderedIcon.value ? convert(renderedIcon.value.abstract[0], {}, attrs) : null;
      });
      return function() {
        return vnode.value;
      };
    }
  });
  /*!
   * Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com
   * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
   * Copyright 2024 Fonticons, Inc.
   */
  const faFileImage = {
    prefix: "fas",
    iconName: "file-image",
    icon: [384, 512, [128443], "f1c5", "M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM64 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm152 32c5.3 0 10.2 2.6 13.2 6.9l88 128c3.4 4.9 3.7 11.3 1 16.5s-8.2 8.6-14.2 8.6l-88 0-40 0-48 0-48 0c-5.8 0-11.1-3.1-13.9-8.1s-2.8-11.2 .2-16.1l48-80c2.9-4.8 8.1-7.8 13.7-7.8s10.8 2.9 13.7 7.8l12.8 21.4 48.3-70.2c3-4.3 7.9-6.9 13.2-6.9z"]
  };
  const faFileVideo = {
    prefix: "fas",
    iconName: "file-video",
    icon: [384, 512, [], "f1c8", "M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM64 288c0-17.7 14.3-32 32-32l96 0c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32l0-96zM300.9 397.9L256 368l0-64 44.9-29.9c2-1.3 4.4-2.1 6.8-2.1c6.8 0 12.3 5.5 12.3 12.3l0 103.4c0 6.8-5.5 12.3-12.3 12.3c-2.4 0-4.8-.7-6.8-2.1z"]
  };
  const faFile = {
    prefix: "fas",
    iconName: "file",
    icon: [384, 512, [128196, 128459, 61462], "f15b", "M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z"]
  };
  const faVideo = {
    prefix: "fas",
    iconName: "video",
    icon: [576, 512, ["video-camera"], "f03d", "M0 128C0 92.7 28.7 64 64 64l256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2l0 256c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1l0-17.1 0-128 0-17.1 14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"]
  };
  library$1.add(faFile, faFileImage, faFileVideo, faVideo);
  function IconsPlugin(app) {
    app.component("fa-icon", FontAwesomeIcon);
  }
  const render = (el) => {
    const app = createApp$2(S3Upload, {
      payload: JSON.parse(el.dataset.payload)
    });
    app.use(IconsPlugin);
    app.mount(`#${el.id}`);
  };
  watchElement(".s3-upload-field", (el) => {
    setTimeout(() => {
      render(el);
    }, 1);
  });
})();
//# sourceMappingURL=s3upload.js.map
