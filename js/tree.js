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
 * 减少作用域长度
 */
var doc = document;

//树的容器
var elm = doc.getElementById("tree");

/**
 * item 树的子级
 * 诸如：二级、三级、四级
 */
var item = elm.getElementsByTagName("li");

//展开/收缩按钮
var btn = elm.getElementsByTagName("a");

//控件载入状态
tree.ready = false;

/**
 * 收缩所有子级
 */
tree.hiddenAll = function() {
    //所有的子树
    var itemTree = elm.getElementsByTagName("ul");
    var collectTemp = [];

    for (var i = 0, len = itemTree.length; i < len; i++) {
	collectTemp[collectTemp.length] = itemTree[i];
    }

    /**
     * Duff's device
     */
    var iterations = Math.floor(collectTemp.length / 8);
    var leftover = collectTemp.length % 8;
    var di = 0;

    if (leftover > 0) {
	do {
	    collectTemp[di++].className = "hidden";
	} while (--leftover > 0);
    }

    do {
	collectTemp[di++].className = "hidden";
	collectTemp[di++].className = "hidden";
	collectTemp[di++].className = "hidden";
	collectTemp[di++].className = "hidden";
	collectTemp[di++].className = "hidden";
	collectTemp[di++].className = "hidden";
	collectTemp[di++].className = "hidden";
	collectTemp[di++].className = "hidden";
    } while (--iterations > 0);

    collectTemp = null;
};

/**
 * 初始化
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

    collectTemp = null;

    /**
     * 添加展开/收缩事件
     */
    var btnHandle = function(e) {
	e = e || window.event;
	var target = e.target || e.srcElement;

	if(target.className === "por" && target.nodeName === "SPAN") {
	    //子级
	    var con = target.parentNode.getElementsByTagName("ul")[0];
	    if (con) {
		if (con.className === "hidden") {
		    //展开
		    con.className = "";
		    target.innerHTML = "-";
		} else {
		    //收缩
		    con.className = "hidden";
		    target.innerHTML = "+";
		}
	    } else {
		return "该栏目没有下级菜单";
	    }
	}
    }

    tree.EventAdd(elm, "click", btnHandle);

    //收缩所有子级
    var allChildTree = elm.getElementsByTagName("ul")[0];
    allChildTree.className = "hidden";

    callback();
};


var loadHandle = function() {
    tree.init(tree.hiddenAll);
};

tree.EventAdd(doc.getElementById("go"), "click", loadHandle);
