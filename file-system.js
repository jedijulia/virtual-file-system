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
}