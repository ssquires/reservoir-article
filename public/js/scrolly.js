$(document).ready(function() {
    
    slide3();
    makePDSISlider("PDSI-viz", "pdsi-label", "pdsi-slider");
    makePDSISlider("dependency-slider-viz", "dependency-label", "dependency-slider", 3, true);
    createSlide1Viz();
    slide2();
    makeFillGaugeForPDSISlider();
    makeMultipleFillGauge();
    handleScrolling();
    
    /* Every time the window is scrolled ... */
    $(window).scroll(handleScrolling);
});
    
function handleScrolling() {
    var w_pos = $(window).scrollTop();
    
        /* Check the location of each desired element */
        $('.fader').each( function(i){
            
            var bottom_of_object = $(this).position().top + $(this).outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            
            if (w_pos >= $(this).position().top && bottom_of_window <= bottom_of_object) {
                fraction_visible = 1;
            } else if (bottom_of_window > bottom_of_object) {
                fraction_visible = 1 - (bottom_of_window - bottom_of_object) / $(window).height();
            } else {
                fraction_visible = 1 - ($(this).position().top - w_pos) / $(window).height();
            }
            
            /* If the object is completely visible in the window, fade it in */
            if( bottom_of_window > $(this).position().top ){
                $(this).css('opacity', fraction_visible);
                    
            }
            
        }); 
        
        // Montague Bucket Visualization
        
        var top = $('#montague-viz').position().top;
        var pos_1_2 = $('#montague-viz').position().top + $('#montague-viz').outerHeight() / 7;
        var pos_1_3 = $('#montague-viz').position().top + 2 * $('#montague-viz').outerHeight() / 7;
        var pos_1_4 = $('#montague-viz').position().top + 3 * $('#montague-viz').outerHeight() / 7;
        var pos_1_5 = $('#montague-viz').position().top + 4 * $('#montague-viz').outerHeight() / 7;
        var pos_1_6 = $('#montague-viz').position().top + 5 * $('#montague-viz').outerHeight() / 7;
        var pos_1_7 = $('#montague-viz').position().top + 6 * $('#montague-viz').outerHeight() / 7;
        var bottom = $('#montague-viz').position().top + $('#montague-viz').outerHeight();
    
        if (w_pos < top) { // Slide 1.1
            hideSlides();
            showSlide('1');
            $('#slide1-inner').removeClass('fixed');
            $('#slide1-inner').removeClass('relative-bottom');
            $('#slide1-inner').addClass('relative');
            slide1();
        } else if (w_pos >= top && w_pos < pos_1_2) {
            hideSlides();
            showSlide('1');
            $('#slide1-inner').removeClass('relative');
            $('#slide1-inner').removeClass('relative-600');
            $('#slide1-inner').addClass('fixed');
            slide1();
        } else if (w_pos >= pos_1_2 && w_pos < pos_1_3) {
            hideSlides();
            showSlide('1-2');
            $('#slide1-inner').removeClass('relative');
            $('#slide1-inner').removeClass('relative-600');
            $('#slide1-inner').addClass('fixed');
            slide1_2()
        } else if (w_pos >= pos_1_3 && w_pos < pos_1_4) {
            hideSlides();
            showSlide('1-3');
            $('#slide1-inner').removeClass('relative');
            $('#slide1-inner').removeClass('relative-600');
            $('#slide1-inner').addClass('fixed');
            slide1_3();
        } else if (w_pos >= pos_1_4 && w_pos < pos_1_5) {
            hideSlides();
            showSlide('1-4');
            $('#slide1-inner').removeClass('relative');
            $('#slide1-inner').removeClass('relative-600');
            $('#slide1-inner').addClass('fixed');
            slide1_4();
        } else if (w_pos >= pos_1_5 && w_pos < pos_1_6) {
            hideSlides();
            showSlide('1-5');
            $('#slide1-inner').removeClass('relative');
            $('#slide1-inner').removeClass('relative-600');
            $('#slide1-inner').addClass('fixed');
            slide1_5();
        } else if (w_pos >= pos_1_6 && w_pos < pos_1_7) {
            hideSlides();
            showSlide('1-6');
            $('#slide1-inner').removeClass('relative');
            $('#slide1-inner').removeClass('relative-600');
            $('#slide1-inner').addClass('fixed');
            slide1_5();
            slide1_6();
        } else if (w_pos >= pos_1_7) {
            $('#slide1-inner').removeClass('fixed');
            $('#slide1-inner').removeClass('relative');
            $('#slide1-inner').addClass('relative-600');
            slide1_5();
            slide1_6();
        }

        // Line Graph Visualization
        
        var line_top = $('#seasonality').position().top;
        var line_slide1 = $('#seasonality').position().top + 1 * $('#seasonality').outerHeight() / 3;
        var line_slide2 = $('#seasonality').position().top + 2 * $('#seasonality').outerHeight() / 3;
        var line_bottom = $('#seasonality').position().top + $('#seasonality').outerHeight();
        
        if (w_pos < line_top) {
            $('#seasonality-inner').removeClass('fixed');
            $('#seasonality-inner').addClass('relative');
        } else if (w_pos < line_slide1) {
            $('#seasonality-inner').removeClass('relative');
            $('#seasonality-inner').addClass('fixed');
            slide2_1();
        } else if (w_pos < line_slide2) {
            $('#seasonality-inner').removeClass('relative-200');
            $('#seasonality-inner').addClass('fixed');
            slide2_2();
        } else if (w_pos < line_bottom) {
            $('#seasonality-inner').removeClass('fixed');
            $('#seasonality-inner').addClass('relative-200');
        }
}
    

function hideSlides() {
    $('#slide-1').css('opacity', 0);
    $('#slide-1-2').css('opacity', 0);
    $('#slide-1-3').css('opacity', 0);
    $('#slide-1-4').css('opacity', 0);
    $('#slide-1-5').css('opacity', 0);
    $('#slide-1-6').css('opacity', 0);
}

function showSlide(s) {
    $('#slide-' + s).css('opacity', 1);
}