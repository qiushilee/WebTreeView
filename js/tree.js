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


/**
 * 存储树
 */
var tree = [];


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

    var format = function(d) {
	var str = '';

	for (var i = 0, len = d.length; i < len; i++) {
	    if (d[i].id) {
		str += '<li class="item';
		if (hasTree(d[i])) {
		    str += ' haschild" data-index="' + d[i].id +'">';
		    str += '<span class="c-btn"></span>';
		    str += '<img src="img/icon-1.gif">';
		} else {
		    str += '" data-index="' + d[i].id +'">　';
		}
		str += '<a href="' + d[i].href + '">' + d[i].title + '</a></li>';
	    }
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

    ul.innerHTML = format(tree);

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



/**
 * 展开/收缩二级栏目
 */
var handler = function(that) {
    var target = that;

    target.className = 'f-btn';

    var liItem = target.parentNode;
    //判断子级是否已经生成
    if (liItem.getElementsByTagName('ul')[0]) {
	var ulBox = liItem.getElementsByTagName('ul')[0];
	//切换按钮状态和子级菜单的展开/收缩
	if (hasClass(ulBox, 'hidden')) {
	    liItem.getElementsByTagName('img')[0].src = 'img/icon-0.gif';
	    target.className = 'f-btn';
	    ulBox.className = '';
	} else {
	    liItem.getElementsByTagName('img')[0].src = 'img/icon-1.gif';
	    target.className = 'c-btn';
	    ulBox.className += ' hidden';
	}
    } else {
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
	var str = '';
	var ul = document.createElement('ul');
	var index = liItem.getAttribute('data-index');
	liItem.getElementsByTagName('img')[0].src = 'img/icon-0.gif';

	for (var i = 0, len = tree.length; i < len; i++) {
	    //tree[i].pid    子级有pid
	    //tree[i].pid.length === (index + 1).length	子级pid的长度是父级liItem长度+1
	    //parseInt((tree[i].pid+'').substring(0, index.length), 10) === parseInt(index, 10)    子级为liItem所有
	    if (tree[i].pid &&
		    tree[i].pid.length === (index + 1).length &&
		    parseInt((tree[i].pid+'').substring(0, index.length), 10) === parseInt(index, 10)) {

		str += '<li class="item child-item';
		if (hasTree(tree[i])) {
		    str += ' haschild" data-index="' + tree[i].pid + '">';
		    str += '<span class="c-btn" onclick="handler(this)"></span>';
		    str += '<img src="img/icon-1.gif">';
		} else {
		    str += '" data-index="' + tree[i].pid + '">　';
		}
		str += '<a href="' + tree[i].href + '">' + tree[i].title + '</a></li>';

	    }
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
