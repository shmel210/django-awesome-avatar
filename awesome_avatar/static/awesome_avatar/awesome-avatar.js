var j = jQuery.noConflict();
    function bind_on_change_input_file(selector, config) {

        j(selector).change(function() {
            if(j(this).val() == '') {
                return;
            }

            // if selection, remove
            var $last_img = j(selector + '-select-area img');
            if ($last_img.length) {
                var img_obj = $last_img.imgAreaSelect({instance: true});
                img_obj.remove();
            }

            j(selector + '-select-area').empty();
    //        j(selector + '-select-area img').hide();
    //        j(selector + '-preview').empty();
            j(selector + '-preview img').hide();

            var p = new RegExp(/\.(jpg|jpeg|png|gif)$/);
            var fileanme = j(this).val().toLowerCase().replace(/^\s+|\s+$/g, '');
            if(!p.test(fileanme)){
                alert('{% trans "Неверный формат. Выберите изображение" %}');
                return ;
            }

            var file = this.files[0];
            if (!file.type.match(/image.*/)) {
                return;
            }
            var reader = new FileReader();
            reader.onload = bind_preview.bind(null, selector, config);
            reader.readAsDataURL(file);
        });
    }

    function bind_preview(selector, config, e) {
        var image_data = e.target.result;
    //    $(selector + '-preview').empty();
    //    $(selector + '-preview').append('<img />');
        j(selector + '-preview img').show();
        j(selector + '-preview img').css('max-width', 'none');
        j(selector + '-preview img').attr('src', image_data);

        j(selector + '-select-area').empty();
        j(selector + '-select-area').append('<img />');
    //    $(selector + '-select-area img').show();
        j(selector + '-select-area img').attr('src', image_data).load(function(){
            j(this).unbind('load');

            var img_width = j(this).width();
            var img_height = j(this).height();

            var ratio_x = img_width / config.select_area_width;
            var ratio_y = img_height / config.select_area_height;

            if (ratio_x > 1 || ratio_y > 1) {
                if (ratio_x > ratio_y) {
                    j(this).css('width', config.select_area_width + 'px');
                    j(selector + '-ratio').val(ratio_x);
                }
                else {
                    j(this).css('height', config.select_area_height + 'px');
                    j(selector + '-ratio').val(ratio_y);
                }
            } else {
                j(selector + '-ratio').val(1);
            }

            img_width = j(this).width();
            img_height = j(this).height();

            j(selector + '-width').val(ratio_x);
            j(selector + '-height').val(ratio_y);

            var sel = {};
            sel['x1'] = Math.round(img_width/2-25 > 0 ? img_width/2-25 : 0),
            sel['y1'] = Math.round(img_height/2-25 > 0 ? img_height/2-25 : 0),
            sel['x2'] = Math.round(img_width/2+25 > img_width ? img_width : img_width/2+25),
            sel['y2'] = Math.round(img_height/2+25 > img_height ? img_height : img_height/2+25),
            sel['width'] = 50;

            j(this).imgAreaSelect({
    //            handles: true,
                aspectRatio: config.width + ":" + config.height,
                fadeSpeed: 100,
    //            minHeight: 50,
    //            minWidth: 50,
                x1: sel.x1,
                y1: sel.y1,
                x2: sel.x2,
                y2: sel.y2,
                onSelectChange: update_coors.bind(null, selector, config)
            });

            update_coors(selector, config, {'width': img_width}, sel);
        })();
    }

    function update_coors(selector, config, img, selection) {
        j(selector + "-x1").val(selection.x1);
        j(selector + "-y1").val(selection.y1);
        j(selector + "-x2").val(selection.x2);
        j(selector + "-y2").val(selection.y2);

        if (parseInt(selection.width) > 0) {
            var ratiox = config.width / (selection.width || 1);
            var ratioy = config.height / (selection.height || 1);

            j(selector + '-preview img').css({
                width: Math.round(ratiox * img.width) + 'px',
                height: Math.round(ratioy * img.height) + 'px',
                marginLeft: '-' + Math.round(ratiox * selection.x1) + 'px',
                marginTop: '-' + Math.round(ratiox * selection.y1) + 'px'
            });
        }
    }

