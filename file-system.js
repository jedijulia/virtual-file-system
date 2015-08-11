function FileSystem() {
    var root = new Node('');
    this.tree = new Tree(root);
    this.location = this.tree.root;
}

FileSystem.prototype.create_folder = function(name) {
    if (this.location.find(name) === null) {
        this.tree.insert(name, this.location);
        var new_folder = this.location.find(name, undefined);
        new_folder.type = 'folder';
    } else {
        throw new Error('Name already exists.');
    }
};

FileSystem.prototype.create_file = function(name, content) {
    if (this.location.find(name) === null) {
        this.tree.insert(name, this.location);
        var new_file = this.location.find(name, undefined);
        new_file.type = 'file';
        new_file.content = content;
    } else {
        throw new Error('Name already exists.');
    }

};

FileSystem.prototype.edit_file = function(path, content) {
    var file = this.get_from_path(path);
    file.content = content;
};

FileSystem.prototype.rename = function(path, new_name) {
    var to_rename = this.get_from_path(path);
    to_rename.value = new_name;
};

FileSystem.prototype.delete = function(names) {
    for (var i=0; i < names.length; i++) {
        var to_delete = this.location.find(names[i]);
        this.tree.remove(to_delete);
    }
};

FileSystem.prototype.copy = function(paths, destination) {
    for (var i=0; i < paths.length; i++) {
        var to_copy = this.get_from_path(paths[i]);
        if (destination.find(to_copy.value) === null) {
            var copy = new Node(to_copy.value);
            for (var j=0; j < to_copy.children.length; j++) {
                var child = to_copy.children[j];
                this.copy([this.get_absolute_path(child)], copy);
            }
            copy.type = to_copy.type;
            this.tree.insert(copy, destination);
        }
    }
};

FileSystem.prototype.move = function(paths, destination) {
    for (var i=0; i < paths.length; i++) {
        var to_move = this.get_from_path(paths[i]);
        if (destination.find(to_move.value) === null) {
            this.tree.remove(to_move);
            this.tree.insert(to_move, destination);
        }
    }
};

FileSystem.prototype.change_directory = function(destination) {
    if (destination instanceof Node) {
        this.location = destination;
    } else {
        this.location = this.get_from_path(destination);
    }
};

FileSystem.prototype.get_from_path = function(path) {
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

FileSystem.prototype.get_absolute_path = function(node) {
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
