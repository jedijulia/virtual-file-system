var root = new Node('7');
var tree = new Tree(root);
logger('Tree created');
var root = tree.root;
logger('7 added as root');
tree.insert('3', root);
logger('3 added as child of root');
tree.insert('11', root);
logger('11 added as child of root');
tree.insert('7', '3');
logger('7 added as child of 3');
tree.insert('5', '3');
logger('5 added as child of 3');
tree.insert('4', '5');
logger('4 added as child of 5');
tree.insert('10', '11');
logger('10 added as child of 11');
tree.insert('15', '11');
logger('15 added as child of 11');
tree.insert('8', '11');
logger('8 added as child of 11');
tree.insert('9', '15');
logger('9 added as child of 15');
logger(tree.display());
tree.remove('11');
logger('11 removed');
logger(tree.display());

function logger(message) {
	var p = document.createElement('p');
	p.textContent = message;
	$('.box').append(p);
}