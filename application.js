var file_system = new FileSystem();

var clipboard = [];
var clipboard_src;
var operation = '';
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
    // var output = prompt('Enter file name');
    $('.editor').show();
    $('.editor').attr('new-file', 'true');
});

$('.editor').on('keydown', function(e) {
    if (e.keyCode === 83 && e.ctrlKey === true) {
        e.preventDefault();
        var file_title = $('input[name="file-title"]').val();
        var file_content = $('textarea[name="file-content"]').val();
        if (file_title !== '') {
            var new_file = $(this).attr('new-file');
            if (new_file === 'true') {
                file_system.create_file(file_title, file_content);
                console.log(file_system.tree.display());
            } else {
                file_system.rename(new_file, file_title);
                file_system.edit_file(file_title, file_content);
            }
            $('input[name="file-title"]').val('');
            $('textarea[name="file-content"]').val('');        
            $('.editor').hide();
            update_display();
        } else {
            alert('Please enter a title for your file.');
        }
    }
});

$('#close-button').on('click', function(e) {
    $('input[name="file-title"]').val('');
    $('textarea[name="file-content"]').val('');
    $('.editor').hide();
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
    // ctrl+c
    if (e.keyCode === 67 && e.ctrlKey === true) {
        $('.box.highlighted').each(function() {
            var name = $(this).find('p').text();
            clipboard.push(name);
        });
        clipboard_src = file_system.location;
        operation = 'copy';
    }
    // ctrl+x
    if (e.keyCode === 88 && e.ctrlKey === true) {
        $('.box.highlighted').each(function() {
            var name = $(this).find('p').text();
            clipboard.push(name);
        });
        clipboard_src = file_system.location;
        operation = 'cut';
    }
    // ctrl+v
    if (e.keyCode === 86 && e.ctrlKey === true && clipboard.length > 0) {
        if (operation === 'copy') {
            file_system.copy(clipboard_src, clipboard, file_system.location);
        }
        if (operation === 'cut') {
            file_system.move(clipboard_src, clipboard, file_system.location);
        }
        console.log(file_system.tree.display());
        update_display();
        clipboard = [];
        clipboard_src = undefined;
        operation = '';
    }
});

$('.window').on('dblclick', '.box', function(e) {
    if ($(this).hasClass('folder')) {
        var name = $(this).find('p').text();
        file_system.change_directory(name);
        update_display();
        console.log(file_system.location.value);
    }
    if ($(this).hasClass('file')) {
        $('.editor').show();
        var file = file_system.location.find($(this).find('p').text());
        $('.editor').attr('new-file', file.value);
        $('.editor input[name="file-title"]').val(file.value);
        $('.editor textarea[name="file-content"]').val(file.content);
    }
});

$('.back-button').on('click', function(e) {
    if (file_system.location !== file_system.tree.root) {
        file_system.change_directory(file_system.location.parent);
        update_display();
    }
    console.log(file_system.location.value);
});

$('input[name="address-bar"]').on('keydown', function(e) {
    if (e.keyCode === 13) {
        try {
            file_system.change_directory($(this).val());
        } catch(e) {
            alert(e.message);
        }
        update_display();
    }
});

