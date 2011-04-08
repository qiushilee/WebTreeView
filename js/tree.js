/**
 * TreeView 控件
 * @mod tree
 */
var tree = tree || {};


/**
 * DOM高级事件模型
 * 封装了W3C和微软的高级事件模型
 */
tree.EventAdd = function(obj, type, fn) {
    if (obj.addEventListener) {
	obj.addEventListener(type, fn, false);
	return true;
    } else if (obj.attachEvent) {
	obj['e' + type + fn] = fn;
	obj[type + fn] = function() {
	    obj['e' + type + fn](window.event);
	};
	obj.attachEvent('on' + type, obj[type + fn]);
	return true;
    }
    return false;	
};


/**
 * 声明document
 * 减少作用域
 * 提升性能
 */
var doc/*:Object*/ = document;

//#tree 即树的容器
var elm/*:Object*/ = doc.getElementById("tree");

/**
 * item 树的子级
 * 诸如：二级、三级、四级
 */
var item/*:Object*/ = elm.getElementsByTagName("li");

//每级树中的按钮
var btn/*:Object*/ = elm.getElementsByTagName("a");

//控件载入状态
tree.ready = false;

/**
 * 显示/隐藏所有子树
 */
tree.toggle = function() {
    var itemTree = elm.getElementsByTagName("ul"),
	//显示/隐藏 命令
	switchs = arguments[0],
	//树长度
	itemTreeLength = itemTree.length,
	showAll;

    //载入所有树
    showAll = function() {
	var tLen = itemTree.length;
	if (arguments[0]) {
	    tLen -= arguments[0];
	}

	for (var i = tLen; i--;) {
	    var _item = itemTree[i];
	    var box = _item.parentNode;
	    //_item.parentNode.removeChild(_item);

	    if (switchs === "close") {
		_item.className = "hidden";
	    } else {
		_item.className = "";
	    }
	    //box.appendChild(_item);
	}
    };

    showAll();
};

/**
 * 初始化
 * 这里使用了后测试循环
 * 优点是可以避免最初终止条件的计算
 * 使运行更快
 * 子级树长度为20001时
 * 
 * @type Function
 */
tree.init = function(callback) {
    var collectTemp = [];
    for (var i = 0, len = item.length; i < len; i++) {
	if (item[i].getElementsByTagName("ul")[0]) {
	    collectTemp[collectTemp.length] = item[i];
	}
    }

    /**
     * 格式化所有子级树
     * 凡是有子级的加上+/-
     * 并且加上鼠标指针手型
     */
    var format = function(_item) {
	var treeBtn = doc.createElement("span");
	treeBtn.innerHTML = "+";
	treeBtn.className = "por";

	_item.insertBefore(treeBtn, _item.childNodes[0]);
    };

    /**
     * Duff's device
     */
    var iterations = Math.floor(collectTemp.length / 8);
    var leftover = collectTemp.length % 8;
    var di = 0;

    if (leftover > 0) {
	do {
	    format(collectTemp[di++]);
	} while (--leftover > 0);
    }

    do {
	format(collectTemp[di++]);
	format(collectTemp[di++]);
	format(collectTemp[di++]);
	format(collectTemp[di++]);
	format(collectTemp[di++]);
	format(collectTemp[di++]);
	format(collectTemp[di++]);
	format(collectTemp[di++]);
    } while (--iterations > 0);

    /**
     * 添加收缩/展开事件
     */
    var btnHandle = function(e) {
	e = e || window.event;
	var target = e.target || e.srcElement;

	if(target.className === "por" && target.nodeName === "SPAN") {
	    //子级树
	    var con = target.parentNode.getElementsByTagName("ul")[0];
	    if (con) {
		if (con.className === "hidden") {
		    // 显示树
		    con.className = "";
		    target.innerHTML = "-";
		} else {
		    // 隐藏树
		    con.className = "hidden";
		    target.innerHTML = "+";
		}
	    } else {
		return "该栏目没有下级菜单";
	    }
	}
    }

    tree.EventAdd(elm, "click", btnHandle);

    //隐藏所有子树
    var allChildTree = elm.getElementsByTagName("ul")[0];
    allChildTree.className = "hidden";

    return tree.ready = true;
};


/**
 * 测试Function执行时间
 */
tree.time = function(fn) {
    //开始时间
    var start = new Date().getMilliseconds();

    //被测试的Function
    fn();

    //结束时间
    var stop = new Date().getMilliseconds();

    //总计耗费的时间
    var excutionTime = stop - start;

    console.log(excutionTime + "ms");
    console.log(start + "ms");
    console.log(stop + "ms");
};


//初始化
//tree.init(tree.toggle("close"));

var loadHandle = function() {
    var log = doc.getElementById("log");

    log.innerHTML = "window onload ok!";

    tree.init();
    log.innerHTML += "<br>tree.init() load ok!";

    if (tree.ready) {
	tree.toggle("close");
	log.innerHTML += "<br>tree.toggle('close') load ok!";
    }
};

tree.EventAdd(window, "load", loadHandle);
