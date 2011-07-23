/**
 * TreeView 控件
 * @mod tree
 */
var treeview = function() {
    /**
     * 获取数据
     */
    this.data = eval(arguments[0]);

    create()
    toggle();
};


/*存储树*/
var tree = [],
    /*第一级菜单*/
    firstItem = [];


/**
 * 检查是否有子树
 */
var hasTree = function(item) {
    if (item.treeItem) {
	return true;
    } else {
	return false;
    }
};


/**
 * 生成第一级树的DOM结构
 */
var create = function() {
    var ul = document.createElement("ul");

    ul.id = this.data.id;
    ul.className = 'ui-tree';


    var firstItemHtml = function() {
	var str = '';

	for (var i = 0, len = firstItem.length; i < len; i++) {
	    //为最后一个菜单追加 .last-item 作样式上的特殊处理
	    if (firstItem[i].id === len) {
		str += '<li class="item f-item last-item';
	    } else {
		str += '<li class="item f-item';
	    }

	    //根据是否拥有子菜单做不同的处理
	    if (hasTree(firstItem[i])) {
		str += ' haschild" data-index="' + firstItem[i].id +'">';
		str += '<span class="btn c-btn"></span>';
		str += '<img src="img/icon-1.gif">';
	    } else {
		str += '" data-index="' + firstItem[i].id +'">';
		str += '<img src="img/line.gif">';
		str += '<img src="img/icon-4.gif">';
	    }

	    str += '<a href="' + firstItem[i].href + '">' + firstItem[i].title + '</a></li>';
	}

	return str;
    };

    var getTree = function(d) {
	for (var i in d.treeItem) {
	    tree.push(d.treeItem[i]);
	    getTree(d.treeItem[i]);
	}
    };

    getTree(data);

    for (var i = 0, len = tree.length; i < len; i++) {
	if (tree[i].id) {
	    firstItem.push(tree[i]);
	}
    }

    ul.innerHTML = firstItemHtml();

    document.body.appendChild(ul);
};



/**
 * 检查elements是否已经包含classname
 * @param node list
 * @param string
 * @return boolen
 */
var hasClass = function(elm, cls) {
    if (typeof elm !== 'object') {
	if (console.error) {
	    console.error('no first argument.', 'type must use nodeList.');
	}
	return false;
    } else if (typeof cls !== 'string') {
	if (console.error) {
	    console.error('no second argument.', 'type must use string.');
	}
	return false;
    } else {
	//检查elements是否已经包含classname
	if (elm.className.match(cls)) {
	    return true;
	} else {
	    return false;
	}
    }
};


/*
 * 事件模型
 */
var EventUtil = {
    addHandler: function(elm, type, handler) {
	if (elm.addEventListener) {
	    elm.addEventListener(type, handler, false);
	} else if (elm.attachEvnet) {
	    elm.attachEvnet('on' + type, handler);
	} else {
	    elm['on' + type] = handler;
	}
    }
};



var handler = function(that) {
    var target = that;

    target.className = 'btn o-btn';

    var liItem = target.parentNode;
    //展开/收缩二级栏目
    //判断子级是否已经生成
    if (liItem.getElementsByTagName('ul')[0]) {
	var ulBox = liItem.getElementsByTagName('ul')[0];
	//切换按钮状态和子级菜单的展开/收缩
	if (hasClass(ulBox, 'hidden')) {
	    liItem.getElementsByTagName('img')[0].src = 'img/icon-0.gif';
	    target.className = 'btn o-btn';
	    ulBox.className = '';
	} else {
	    liItem.getElementsByTagName('img')[0].src = 'img/icon-1.gif';
	    target.className = 'btn c-btn';
	    ulBox.className += ' hidden';
	}
    } else {
	//生成子级菜单
	//子级栏目
	//DOM:
	//<li>
	//    <a href="#">first item</a>
	//    <ul>
	//        <li>
	//            <a href="#">second item</a>
	//        </li>
	//    </ul>
	//</li>
	var str = '',
	    childItem = [],
	    ul = document.createElement('ul'),
	    index = liItem.getAttribute('data-index');

	liItem.getElementsByTagName('img')[0].src = 'img/icon-0.gif';

	for (var i = 0, len = tree.length; i < len; i++) {
	    //tree[i].pid    子级有pid
	    //tree[i].pid.length === (index + 1).length	子级pid的长度是父级liItem长度+1
	    //parseInt((tree[i].pid+'').substring(0, index.length), 10) === parseInt(index, 10)    子级为liItem所有
	    if (tree[i].pid &&
		    tree[i].pid.length === (index + 1).length &&
		    parseInt((tree[i].pid+'').substring(0, index.length), 10) === parseInt(index, 10)) {
		childItem.push(tree[i]);
	    }
	}

	for (var i = 0, len = childItem.length; i < len; i++) {
		//为最后一个菜单追加 .last-item 作样式上的特殊处理
		if (firstItem[i].id === len) {
		    str += '<li class="item child-item last-item';
		} else {
		    str += '<li class="item child-item';
		}
		if (hasTree(childItem[i])) {
		    str += ' haschild" data-index="' + childItem[i].pid + '">';
		    str += '<span class="btn c-btn" onclick="handler(this)"></span>';
		    str += '<img src="img/icon-1.gif">';
		} else {
		    str += '" data-index="' + childItem[i].pid + '">　';
		    if (firstItem[i].id === len) {
			str += '<img src="img/line-2.gif">';
		    } else {
			str += '<img src="img/line-1.gif">';
		    }
		    str += '<img src="img/icon-4.gif">';
		}
		str += '<a href="' + childItem[i].href + '">' + childItem[i].title + '</a></li>';

	}

	ul.innerHTML = str;
	liItem.appendChild(ul);
    }
};


/**
 * 添加事件
 */
var toggle = function() {
    //item button
    var btn = document.getElementById(data.id).getElementsByTagName('span');

    for (var i = 0, len = btn.length; i < len; i++) {
	btn[i].onclick = function() {
	    handler(this);
	};
    }
};
