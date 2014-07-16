(function ( $ ) {

    $.fn.translate = $.fn.translate || {}

    $.fn.translate.defaults = {
        'refresh': false
    }

    $.fn.translate.init = function( options ) {
        // options object should look like
        // {'translations' : {'en': '/languages/en.json', 'fr': '/languages/fr.json'}, 'refresh': false}
        $.fn.translate.options = $.extend($.fn.translate.defaults, options);
        $.fn.translate.translations = $.fn.translate.translations || {};

        if ( $.fn.translate.options.refresh ){
            localStorage.clear();
        }
        $.each($.fn.translate.options.translations, function(key, value){
            var translationKey = location.host + "." + key;
            var translationObject = JSON.parse(localStorage.getItem(translationKey));
            $.fn.translate.translations[key] = translationObject;
            if ( !translationObject ) {
                $.get(value, function(data){
                    localStorage.setItem(translationKey, JSON.stringify(data));
                    $.fn.translate.translations[key] = data;
                })
            }
        })
    }

    $.fn.translate.translate = function(className, dataKey, language) {
        var translations = $.fn.translate.translations[language];
        if (!translations) {
            return;
        } else {
            $(className).each(function(i, ele){ 
                if (translations[$(ele).data(dataKey)]) {
                    $(ele).html(translations[$(ele).data(dataKey)])
                } else {
                    $.fn.translate.init($.extend($.fn.translate.options, {'refresh': true}))
                }
                
            })
        }
    }

}( jQuery ));
// $.fn.translate.init({'translations' : {'en': 'i18n/en.json', 'fr': 'i18n/fr.json'}});
// $.fn.translate.translate('.translate', 'i18n', 'fr' );