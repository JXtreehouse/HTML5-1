//添加事件句柄
function addEvent(ele,type,handler){
	if(ele.addEventListener){
		ele.addEventListener(type,handler,false);
	}else if(ele.attachEvent){
		/*因为在IE中，事件侦听器即事件处理函数内部的this默认指向window对象，
		W3C中指向所绑定的对象本身，因此为了使事件处理函数内部的this指向所绑定的对象，
		可以将函数赋值为该对象的某个属性成为他的方法，那么this指针就指向了所绑定的对象本身。*/
		ele['e'+type+handler] = handler;
		ele[type+handler] = function(){ele['e'+type+handler](window.event);}
		ele.attachEvent("on"+type,ele[type+handler]);
	}
	else{
		ele["on"+type] = handler;
	}
}

//取消事件句柄
function removeEvent(element,type,handler){
	if(element.removeEventListener){
		element.removeEventListener(type,handler,false);    //false:事件冒泡，true：事件捕获
	}else if(element.detachEvent){
		ele['e'+type+handler] = handler;
		ele[type+handler] = function(){ele['e'+type+handler](window.event);}
		ele.detachEvent("on"+type,ele[type+handler]);
	}
	else{
		element["on"+type] = null;
	}
}

//阻止事件的默认行为
function preDefault(event){
        if(event.preventDefault){
                event.preventDefault();
        }else{
                event.returnValue = false;
        }
}

//阻止事件冒泡
function stopPropa(event){
        if(event.stopPropagation){
                event.stopPropagation();
        }else{
                event.cancelBubble  = true;
        }
}

String.prototype.trim = function(){
	return this.replace(/(^\s+)|(\s+$)/g,'');
}

//图片加载函数
function preLoadImg(src,callBack){
	var img = new Image();
	if(!!window.ActiveXObject){  //判断是否是IE浏览器
		img.onreadystatechange = function(){
			if(this.readyState == "complete"){
				callBack();
			}
		};
	}else{
		img.onload = function(){
			callBack();
		};
	}
	img.src = src;
}