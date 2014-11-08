class Node:
    def __init__(self, value):
        self.value = value
        self.parent = None
        self.children = []

    def add_child(self, child):
        self.children.append(child)

    def remove(self, child):
        self.children.remove(child)

    def search(self, to_search):
        found = []
        if self.value == to_search:
            found.append(self)
        for child in self.children:
            found += child.search(to_search)
        return found

    # tofind(value)
    # returns nodes that are direct children
    def find(to_find):
        for child in self.children:
            if child.value == to_find:
                return child
            return None


class Tree:
    def __init__(self, root):
        self.root = root

    # toinsert(value), parent(node/value)
    def insert(self, to_insert, parent):
        # return error if parent is not found
        to_insert_node = Node(to_insert)
        if isinstance(parent, Node):
            parent.add_child(to_insert_node)
            to_insert_node.parent = parent
        else:
            found = self.search(parent)
            parent_node = self.search(parent)[0]
            parent_node.add_child(to_insert_node)
            to_insert_node.parent = parent_node

    # toremove(node/value)
    def remove(self, to_remove):
        # return error if root is removed
        if isinstance(to_remove, Node):
            print 'GOT HERE SUCKAS'
            parent = to_remove.parent
            parent.remove(to_remove)
        else:
            to_remove_nodes = self.search(to_remove)
            for to_remove_node in to_remove_nodes:
                parent = to_remove_node.parent
                parent.remove(to_remove_node)

    # tosearch(value)
    # returns all the nodes
    def search(self, to_search):
        found = self.root.search(to_search)
        return found

    def display(self):
        queue = []
        queue.append(self.root)
        while len(queue) != 0:
            curr = queue.pop(0)
            print curr.value
            for child in curr.children:
                queue.append(child)

# Test
root = Node('7')
tree = Tree(root)
root = tree.root
tree.insert('3', root)
tree.insert('11', root)
tree.insert('7', '3')
tree.insert('5', '3')
tree.insert('4', '5')
tree.insert('10', '11')
tree.insert('15', '11')
tree.insert('8', '11')
tree.insert('9', '15')
tree.display()

print 'removal of 11'
seven = tree.root.children[1]
tree.remove('5')
tree.display()