var file_system = new FileSystem();

var clipboard = [];
var operation = '';
update_display();

// display the contents at the current location
function update_display() {
    $('.contents').empty();
    for (var i=0; i < file_system.location.children.length; i++) {
        var curr = file_system.location.children[i];
        $('.contents').append('<div class="box ' + curr.type + '" data-path="' + file_system.get_absolute_path(curr) + '"><p>' + curr.value + '</p></div>');
    }
    $('#back-button').removeClass('not-clickable');
    if (file_system.location === file_system.tree.root) {
        $('#back-button').addClass('not-clickable');
    }
    $('input[name="address-bar"]').val(file_system.get_absolute_path(file_system.location));
}

// create a new folder
$('#new-folder-button').on('click', function(e) {
    var output = prompt('Enter folder name');
    if (output !== '' && output !== null) {
        try {
            file_system.create_folder(output);
        } catch(e) {
            alert(e.message);
        } 
    } else {
        alert('Please enter a name for your folder.');
    }
    update_display();
});

// create a new file
$('#new-file-button').on('click', function(e) {
    $('.editor').show();
    $('.editor').attr('new-file', 'true');
});

// text editor for files
$('.editor').on('keydown', function(e) {
    if (e.keyCode === 83 && e.ctrlKey === true) {
        e.preventDefault();
        var file_title = $('input[name="file-title"]').val();
        var file_content = $('textarea[name="file-content"]').val();
        if (file_title !== '') {
            var new_file = $(this).attr('new-file');
            if (new_file === 'true') {
                try {
                    file_system.create_file(file_title, file_content);
                } catch(e) {
                    alert(e.message);
                }
            } else {
                var path = $(this).attr('data-path');
                file_system.edit_file(path, file_content);
                file_system.rename(path, file_title);
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

// close button of text editor
$('#close-button').on('click', function(e) {
    $('input[name="file-title"]').val('');
    $('textarea[name="file-content"]').val('');
    $('.editor').hide();
});

// selection and highlighting of files and folders
$('.contents').on('click', '.box', function(e) {
    e.stopPropagation();
    if (e.altKey === true || e.ctrlKey === true) {
        $(this).toggleClass('highlighted');
    } else {
        $('.box').removeClass('highlighted');
        $(this).addClass('highlighted');        
    }
});

// after clicking in other areas of the window, the highlighted nodes are unhilighted
$('.window').on('click', function(e) {
    $('.box').removeClass('highlighted');
    $('.rename').hide();
});

// copy, cut and paste
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
        clipboard = [];
        $('.box.highlighted').each(function() {
            var path = $(this).attr('data-path');
            clipboard.push(path);
        });
        operation = 'copy';
    }
    // ctrl+x
    if (e.keyCode === 88 && e.ctrlKey === true) {
        clipboard = [];
        $('.box.highlighted').each(function() {
            var path = $(this).attr('data-path');
            clipboard.push(path);
        });
        operation = 'cut';
    }
    // ctrl+v
    if (e.keyCode === 86 && e.ctrlKey === true && clipboard.length > 0) {
        if (operation === 'copy') {
            file_system.copy(clipboard, file_system.location);
        }
        if (operation === 'cut') {
            file_system.move(clipboard, file_system.location);
        }
        console.log(file_system.tree.display());
        update_display();
        clipboard = [];
        operation = '';
    }
});

// double click: if folder, opens folder
// if file, opens editor and sets values of file if it already exists
$('.window').on('dblclick', '.box', function(e) {
    if ($(this).hasClass('folder')) {
        var path = $(this).attr('data-path');
        file_system.change_directory(path);
        update_display();
    }
    if ($(this).hasClass('file')) {
        $('.editor').show();
        var file = file_system.get_from_path($(this).attr('data-path'));
        $('.editor').attr('new-file', file.value);
        $('.editor').attr('data-path', $(this).data('path'));
        $('.editor input[name="file-title"]').val(file.value);
        $('.editor textarea[name="file-content"]').val(file.content);
    }
});

// go back / move up a directory
$('.back-button').on('click', function(e) {
    if (file_system.location !== file_system.tree.root) {
        file_system.change_directory(file_system.location.parent);
        update_display();
        $('#exit-search-button').hide();
    }
});

// accepts input in the address bar, changes directory if valid
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

// search bar, finds and displays results
$('input[name="search-bar"]').on('keydown', function(e) {
    if (e.keyCode === 13) {
        var query = $(this).val();
        query = query.replace(/\./g, '\\.').replace(/\*/g, '\.\*');
        var found = file_system.tree.search(query);
        $('.contents').empty();
        if (found.length === 0) {
            $('.contents').append('<p id="no-results">No results found.</p>');
        }
        for (var i=0; i < found.length; i++) {
            var curr = found[i];
            var path = file_system.get_absolute_path(curr);
            $('.contents').append('<div class="box ' + curr.type + '" data-path="' + path + '"><p>' + path + '</p></div>');
        }
        $('#back-button').removeClass('not-clickable');
        if (file_system.location === file_system.tree.root) {
            $('#back-button').addClass('not-clickable');
        }
        $('input[name="address-bar"]').val(file_system.get_absolute_path(file_system.location));
        $('#exit-search-button').show();
    }
});

// exit from the search results
$('#exit-search-button').on('click', function(e) {
    $(this).hide();
    update_display();
});

// right click on a box, shows rename button
$('.contents').on('contextmenu', '.box', function(e) {
    e.preventDefault();
    $('.rename').show();
    $('.rename').css({'top': (e.pageY + 'px'), 'left': (e.pageX + 'px')});
    $('.rename').attr('path', $(this).attr('data-path'));
});

// renames selected folder/file
$('.rename').on('click', function(e) {
    var name = prompt('Enter new name');
    if (name !== '') {
        file_system.rename($(this).attr('path'), name);
        update_display();
    } else {
        alert('Please enter a name.');
    }
});

$('#readme-button').on('click', function(e) {
    $('.readme').hide();
});