var socket = io.connect();
socket.on('comment', function(data) {
    $('a[name=commentscount]').html(data);
});

$(function() {

    if (!isNewMode()) {
        loadArticleState();
        loadComments();
        $('a[name=commentscount]').click(loadComments);
        $('.rating-value').click(onRatingClick);
        $('#update').click(onUpdateClick);
        $('#delete').click(onDeleteClick);
        $('#postComment').click(onPostCommentClick);
    } else {
        $('#create').click(onCreateClick);
    }

});

function isNewMode() {
    return $('input[name=articleUID]').val() === 'undefined';
}

function loadArticleState() {
    $.ajax({
        url: '/articleobj/' + $('input[name=articleUsername]').val() + '/' + $('input[name=articleUID]').val(),
        method: 'GET',
        statusCode: {
            200: function (article) {
                $('h4[name=articletitle]').html(article.title);
                $('p[name=articletext]').html(article.text);
                $('input[name=articletitle]').val(article.title);
                $('input[name=articletext]').val(article.text);
                $('input[name=newarticletitle]').val(article.title);
                $('textarea[name=newarticletext]').val(article.text);
                if (article.rating !== 0) {
                    updateRating(Math.round(article.rating / article.numberOfVotes));
                }
            },
            403: function (jqXHR) {
                var error = JSON.parse(jqXHR.responseText);
                $('.error', form).html(error.message);
            }
        }
    });
}

function updateRating(rating) {
    $('.rating-value').removeClass('selected');

    switch(rating) {
        case 1:
            $('.one').addClass('selected');
            break;
        case 2:
            $('.two').addClass('selected');
            break;
        case 3:
            $('.three').addClass('selected');
            break;
        case 4:
            $('.four').addClass('selected');
            break;
        case 5:
            $('.five').addClass('selected');
            break;
        default:
            break;
    }
}

function loadComments() {

    $.ajax({
        url: '/commentlist/' + $('input[name=articleUID]').val(),
        method: 'GET',
        statusCode: {
            200: function (comments) {
                $('.comments').html('');
                $('a[name=commentscount]').html(comments.length);

                comments.forEach(function(comment) {
                    if ($('.comments').html() !== '') {
                        $('.comments').append('</br>');
                    }
                    $('.comments').append('<il><b>' + comment.username + ':</b> ' + comment.text + '</il>');
                });
            },
            403: function (jqXHR) {
                var error = JSON.parse(jqXHR.responseText);
                $('.error', form).html(error.message);
            }
        }
    });

}

function onRatingClick(e) {
    var rating = parseInt($(e.target).html());

    $.ajax({
        url: '/articleobj/'
            + $('input[name=articleUsername]').val() + '/'
            + $('input[name=articleUID]').val(),
        method: 'PUT',
        data: { rating: rating },
        statusCode: {
            200: function (articles) {
                loadArticleState();
                form.html('Article was updated.').addClass('alert-success');
            },
            403: function (jqXHR) {
                var error = JSON.parse(jqXHR.responseText);
                $('.error', form).html(error.message);
            }
        }
    });
}

function onUpdateClick() {
    var form = $('.article-form');
    $.ajax({
        url: '/articleobj/'
            + $('input[name=articleUsername]').val() + '/'
            + $('input[name=articleUID]').val(),
        method: 'PUT',
        data: form.serialize(),
        statusCode: {
            200: function (articles) {
                form.html('Article was updated.').addClass('alert-success');
            },
            403: function (jqXHR) {
                var error = JSON.parse(jqXHR.responseText);
                $('.error', form).html(error.message);
            }
        }
    });
}

function onDeleteClick() {
    var form = $('.article-form');
    var username =  $('input[name=username]').val();

    $.ajax({
        url: '/articleobj/'
            + $('input[name=articleUsername]').val() + '/'
            + $('input[name=articleUID]').val(),
        method: 'DELETE',
        statusCode: {
            200: function () {
                form.html('Article was deleted.').addClass('alert-success');
                window.location.href = '/profile/' + username;
            },
            403: function (jqXHR) {
                var error = JSON.parse(jqXHR.responseText);
                $('.error', form).html(error.message);
            }
        }
    });
}

function onCreateClick() {
    var form = $('.article-form');
    var username = $('input[name=username]').val();

    $.ajax({
        url: '/articleobj/'
            + $('input[name=articleUsername]').val() + '/'
            + $('input[name=articleUID]').val(),
        method: 'POST',
        data: form.serialize(),
        statusCode: {
            200: function (article) {
                window.location.href = '/article/' + username + '/' + article._id;
            },
            403: function (jqXHR) {
                var error = JSON.parse(jqXHR.responseText);
                $('.error', form).html(error.message);
            }
        }
    });
}

function onPostCommentClick() {

    var username = $('input[name=username]').val();
    var text = $('input[name=newcomment]').val();

    $.ajax({
        url: '/comment/' + $('input[name=articleUID]').val(),
        method: 'POST',
        data: {
            username: username,
            text: text
        },
        statusCode: {
            200: function () {
                $('input[name=newcomment]').val('');
                loadComments();
                var commentsCount = parseInt($('a[name=commentscount]').html()) + 1;
                socket.emit('comment', commentsCount);
            },
            403: function (jqXHR) {
                var error = JSON.parse(jqXHR.responseText);
                $('.error', form).html(error.message);
            }
        }
    });

}