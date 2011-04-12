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

    /**
     * building a static list of elements to modify
     */
    var collectTemp = [];
    for (var i = 0, len = itemTree.length; i < len; i++) {
	collectTemp[collectTemp.length] = itemTree[i];
    }

    var duffDevice = function() {
	/**
	 * Duff's Device
	 */
	var iterations = Math.floor(collectTemp.length / 8);
	var leftover = collectTemp.length % 8;
	var j = 0;

	if (leftover > 0) {
	    do {
		collectTemp[j++].className = "hidden";
	    } while (--leftover > 0);
	}

	do {
	    collectTemp[j++].className = "hidden";
	    collectTemp[j++].className = "hidden";
	    collectTemp[j++].className = "hidden";
	    collectTemp[j++].className = "hidden";
	    collectTemp[j++].className = "hidden";
	    collectTemp[j++].className = "hidden";
	    collectTemp[j++].className = "hidden";
	    collectTemp[j++].className = "hidden";
	} while (--iterations > 0);
    };

    /**
     * 当有大量数据时使用 Duff's Device
     * 只是少量数据则使用 for loop
     */
    if (collectTemp.length > 3000) {
	duffDevice();
    } else {
	for (var j = 0, len = collectTemp.length; j < len; j++) {
	    collectTemp[j].className = "hidden";
	}
    }

    collectTemp = null;
};



/**
 * 初始化
 * 
 * @type Function
 */
tree.init = function(callback) {
    /**
     * building a static list of elements to modify
     */
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

	_item.className = "hasNode";
	_item.getElementsByTagName("a")[0].className = "hasNode-btn";
	_item.insertBefore(treeBtn, _item.childNodes[0]);
    };

    var duffDevice = function() {

	/**
	 * Duff's Device
	 */
	var iterations = Math.floor(collectTemp.length / 8);
	var leftover = collectTemp.length % 8;
	var j = 0;

	if (leftover > 0) {
	    do {
		format(collectTemp[j++]);
	    } while (--leftover > 0);
	}

	do {
	    format(collectTemp[j++]);
	    format(collectTemp[j++]);
	    format(collectTemp[j++]);
	    format(collectTemp[j++]);
	    format(collectTemp[j++]);
	    format(collectTemp[j++]);
	    format(collectTemp[j++]);
	    format(collectTemp[j++]);
	} while (--iterations > 0);
    };



    /**
     * 当有大量数据时使用 Duff's Device
     * 只是少量数据则使用 for loop
     */
    if (collectTemp.length > 3000) {
	duffDevice();
    } else {
	for (var j = 0, len = collectTemp.length; j < len; j++) {
	    format(collectTemp[j]);
	}
    }

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
	    }
	}
    };

    tree.EventAdd(elm, "click", btnHandle);

    //收缩所有子级
    var allChildTree = elm.getElementsByTagName("ul")[0];
    allChildTree.className = "hidden";

    callback();
};



var loadHandle = function() {
    tree.init(tree.hiddenAll);
};


//tree.EventAdd(doc.getElementById("go"), "click", loadHandle);
tree.EventAdd(window, "load", loadHandle);
