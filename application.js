var file_system = new FileSystem();

update_display();

function update_display() {
    $('.contents').empty();
    for (var i=0; i < file_system.location.children.length; i++) {
        var curr = file_system.location.children[i];
        $('.contents').append('<div class="box ' + curr.type + '"><p>' + curr.value + '</p></div>');
    }
}

$('#new-folder-button').on('click', function(e) {
    var output = prompt('Enter folder name');
    file_system.create_folder(output);
    console.log(file_system.tree.display());
    $('.contents').append('<div class="box folder"><p>' + output + '</p></div>');
});

$('#new-file-button').on('click', function(e) {
    var output = prompt('Enter file name');
    file_system.create_file(output, '');
    console.log(file_system.tree.display());
    $('.contents').append('<div class="box file"><p>' + output + '</p></div>');
});