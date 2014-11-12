var tree = new Tree(null);

function logger(message) {
    var p = $('<p>' + message + '</p>');
    $('.box').append(p);
}

$('input').on('keydown', function(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        var input = $('input').val().trim();
        var split = input.split(' ');
        var command = split[0].trim();

        if (split.length < 2 && command !== 'display') {
            logger('Invalid command.');
        } else {
            if (command === 'insert') {
                if (tree.root === null) {
                    tree.root = new Node(split[1]);
                    logger(split[1] + ' added as root.');
                } else {
                    if (split.length < 3) {
                        logger('Please specify a parent.');
                    } else {
                        try {
                            tree.insert(split[1], split[2]);
                            logger(split[1] + ' added as child of ' + split[2]);
                        } catch(e) {
                            logger(e.message);
                        }
                    }
                }
            } else if (command === 'remove') {
                try {
                    tree.remove(split[1]);
                    logger(split[1] + ' was removed.');
                } catch(e) {
                    logger(e.message);
                }
            } else if (command === 'search') {
                var found = tree.search(split[1]);
                if (found.length === 0) {
                    logger('Item not found.');
                } else {
                    for (var i=0; i < found.length; i++) {
                        var curr = found[i];
                        var path = '';
                        while (curr !== null) {
                            path = '/' + curr.value + path;
                            curr = curr.parent;
                        }
                        logger('Found at: ' + path);
                    }
                }
            } else if (command === 'display') {
                logger(tree.display());
            } else {
                logger('Invalid command.');
            }
        }
        $('input').val(' ');
    }
});