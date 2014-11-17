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