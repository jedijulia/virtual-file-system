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

    this.edit_file = function(name, content) {
        var file = this.location.find(name);
        file.content = content;
    };

    this.rename = function(name, new_name) {
        var to_rename = this.location.find(name);
        to_rename.value = new_name;
    };

    this.delete = function(names) {
        for (var i=0; i < names.length; i++) {
            var to_delete = this.location.find(names[i]);
            this.tree.remove(to_delete);
        }
    };

    this.copy = function(names, destination) {
        for (var i=0; i < names.length; i++) {
            var to_copy = this.location.find(names[i]);
            var copy = new Node(to_copy.value);
            copy.children = to_copy.children;
            copy.type = to_copy.type;
            this.tree.insert(copy, destination);
        }
    };

    this.move = function(names, destination) {
        for (var i=0; i < names.length; i++) {
            var to_move = this.location.find(names[i]);
            this.tree.remove(to_move);
            this.tree.insert(to_move, destination);
        }
    };
}