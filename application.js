var file_system = new FileSystem();

update_display();

function update_display() {
    $('.contents').empty();
    for (var i=0; i < file_system.location.children.length; i++) {
        var curr = file_system.location.children[i];
        $('.contents').append('<div class="box ' + curr.type + '"><p>' + curr.value + '</p></div>');
    }
    $('#back-button').removeClass('not-clickable');
    if (file_system.location === file_system.tree.root) {
        $('#back-button').addClass('not-clickable');
    }
    var path = [];
    var curr = file_system.location;
    while (curr !== null) {
        path.push(curr.value);
        curr = curr.parent;
    }
    path = path.reverse().join('/');
    if (path.length === 0) {
        path = '/' + path;
    }
    $('input[name="address-bar"]').val(path);
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

$('.contents').on('click', '.box', function(e) {
    e.stopPropagation();
    if (e.altKey === false) {
        $('.box').removeClass('highlighted');
        $(this).addClass('highlighted');
    } else {
        $(this).toggleClass('highlighted');
    } 
});

$('.window').on('click', function(e) {
    $('.box').removeClass('highlighted');
});

$(document).on('keydown', function(e) {
    if (e.keyCode === 8) {
        var names = [];
        $('.box.highlighted').each(function() {
            var name = $(this).find('p').text();
            names.push(name);
            $(this).remove();
        });
        file_system.delete(names);
        console.log(file_system.tree.display());
    }
});

$('.window').on('dblclick', '.box', function(e) {
    if ($(this).hasClass('folder')) {
        var name = $(this).find('p').text();
        file_system.change_directory(name);
        update_display();
        console.log(file_system.location.value);
    }
});

$('.back-button').on('click', function(e) {
    if (file_system.location !== file_system.tree.root) {
        file_system.change_directory(file_system.location.parent);
        update_display();
    }
    console.log(file_system.location.value);
});