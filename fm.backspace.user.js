// ==UserScript==
// @name                Backspacefm *-side
// @namespace    https://github.com/asymme/
// @description      Inserts *-side Menu to backspace.fm
// @description:ja  *-sideのメニューを http://backspace.fm/ に挿入します
// @author              Asymme
// @include             http://backspace.fm/
// @version             1.0
// @history              Initial version
// @history:ja          最初のバージョン
// ==/UserScript==

(function($) {
    var Backspace = function() {
        this.articleList = [];
    };
    
    Backspace.prototype.fm = function() {
        var ul = $('<ul>').attr({
            'id': 'side-list'
        }).css({
            'padding-left': '0',
            'text-align': 'center'
        });
        $('.entry-content').eq(0).prepend(ul);

        var sideList = [];
        var postListA = $('.post-list a');
        sideList.push({'side': 'all', 'elem': this.createList('all'), 'length': postListA.length});
        
        var _this = this;
        postListA.each(function(idx, elem) {
            // Getting *-side
            var res = $(elem).attr('href').match(/\/([a-z]*)(-side\/)?\d+\/?$/);
            var sideName = (res[1] === '') ? 'a' : res[1];
            _this.articleList.push({'elem': $(elem).parents('li'), 'side': sideName});
            
            for(var i = 0, len = sideList.length; i < len; i++) {
                // Side毎に記事数をカウント
                if(sideList[i].side === sideName) {
                    sideList[i].length++;
                    return true;
                }
            }
            sideList.push({'side': sideName, 'elem': _this.createList(sideName), 'length': 1});
        });

         // 投稿数降順ソート
        sideList.sort(function(a , b) {
            var c = 0;
            if(a.length > b.length) {
                c = -1;
            } else if(a.length < b.length) {
                c = 1;
            }
            return c;
        });
        
        // ページにリンク表示
        var elem = null;
        var storageSideName = (localStorage) ? localStorage.getItem('side') : '';
        $.each(sideList, function(i, obj) {
            var li = obj.elem;
            $(li).html( $(li).html() + '(' + obj.length + ')' );
            $('#side-list').append(li);
            
            if(obj.side === storageSideName) {
                elem = li;
            }
        });
        if(elem) {
            elem.click();
        }
    };
    
    Backspace.prototype.createList = function(sideName) {
        var _this = this;
        var li = $('<li>').attr({
            'class': 'btn'
        }).css({
            'cursor': 'pointer',
            'margin': '0 0.25em 0.5em 0',
            'textDecoration': 'underline'
        }).click(function() {
            _this.clickList(sideName);
        }).html(sideName.charAt(0).toUpperCase() + sideName.slice(1) + '-side');
        return li;
    };
    
    Backspace.prototype.clickList = function(sideName) {
        var pList = $('.post-list').eq(0);
        pList.empty();
        $.each(this.articleList, function(i, obj) {
            if(obj.side === sideName || sideName === 'all') {
                pList.append(obj.elem);
            }
        });
        if(localStorage) {
            localStorage.setItem('side', sideName);
        }
    };

    var backspace = new Backspace();
    backspace.fm();
    
})(jQuery);
