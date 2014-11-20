function FileSystem() {
    var root = new Node('');
    this.tree = new Tree(root);
    this.location = this.tree.root;

    this.create_folder = function(name) {
        this.tree.insert(name, this.location);
        var new_folder = this.location.find(name);
        new_folder.type = 'folder';
    };

    this.create_file = function(name, content) {
        this.tree.insert(name, this.location)
        var new_file = this.location.find(name);
        new_file.type = 'file';
        new_file.content = content; 
    };

    this.edit_file = function(path, content) {
        var file = this.get_from_path(path);
        console.warn(file.value)
        file.content = content;
    };

    this.rename = function(path, new_name) {
        var to_rename = this.get_from_path(path);
        to_rename.value = new_name;
    };

    this.delete = function(names) {
        for (var i=0; i < names.length; i++) {
            var to_delete = this.location.find(names[i]);
            this.tree.remove(to_delete);
        }
    };

    this.copy = function(paths, destination) {
        for (var i=0; i < paths.length; i++) {
            var to_copy = this.get_from_path(paths[i]);
            var copy = new Node(to_copy.value);
            copy.children = to_copy.children;
            copy.type = to_copy.type;
            this.tree.insert(copy, destination);
        }
    };

    this.move = function(paths, destination) {
        for (var i=0; i < paths.length; i++) {
            var to_move = this.get_from_path(paths[i]);
            this.tree.remove(to_move);
            this.tree.insert(to_move, destination);
        }
    };

    this.change_directory = function(destination) {
        if (destination instanceof Node) {
            this.location = destination;
        } else {
            this.location = this.get_from_path(destination);
        }
    };

    this.get_from_path = function(path) {
        console.info(path);
        path = path.split('/');
        if (path[0] === '') {
            var curr = this.tree.root;
            path = path.slice(1, path.length);
        } else {
            var curr = this.location;
        }
        for (var i=0; i < path.length; i++) {
            if (path[i] !== '') {
                curr = curr.find(path[i]);
                if (curr === null) {
                    throw new Error('Invalid path.');
                }
            }
        }
        return curr;
    };

    this.get_absolute_path = function(node) {
        var path = [];
        var curr = node;
        while (curr !== null) {
            path.push(curr.value);
            curr = curr.parent;
        }
        path = path.reverse().join('/');
        if (path.length === 0) {
            path = '/' + path;
        }
        return path;
    }
}