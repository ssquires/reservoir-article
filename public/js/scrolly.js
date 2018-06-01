$(document).ready(function() {
    
    /* Every time the window is scrolled ... */
    $(window).scroll( function(){
        var w_pos = $(window).scrollTop();
    
        /* Check the location of each desired element */
        $('.fader').each( function(i){
            
            var bottom_of_object = $(this).position().top + $(this).outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            
            var top_covered = 0;
            var bottom_covered = 0;
            
            if ($(window).scrollTop() > $(this).position().top) {
                top_covered = ($(window).scrollTop() - $(this).position().top) / $(this).outerHeight();
            }
            
            if (bottom_of_object > bottom_of_window) {
                bottom_covered = (bottom_of_object - bottom_of_window) / $(this).outerHeight();
            }
            
            var fraction_visible = 1 - top_covered - bottom_covered;
            
            
            /* If the object is completely visible in the window, fade it in */
            if( bottom_of_window > $(this).position().top ){
                $(this).css('opacity', fraction_visible);
                    
            }
            
        }); 

    });
    
});