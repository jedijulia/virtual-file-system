function Node(value) {
    this.value = value;
    this.parent = null;
    this.children = [];

    // adds a node to the node's children
    this.add_child = function(child) {
        this.children.push(child);
    };

    // removes a node from the node's children
    this.remove = function(child) {
        var i = this.children.indexOf(child);
        this.children.splice(i, 1);
    }

    // accepts a value, returns an array of nodes
    this.search = function(to_search) {
        var found = [];
        if (this.value === to_search) {
            found.push(this);
        }
        for (var i=0; i < this.children.length; i++) {
            var child = this.children[i];
            found = found.concat(child.search(to_search));
        }
        return found;
    }

    // accepts a value, returns nodes that are direct children
    this.find = function(to_find) {
        for (var i=0; i < this.children.length; i++) {
            var child = this.children[i];
            if (child.value === to_find) {
                return child
            }
        }
        return null;
    }
}