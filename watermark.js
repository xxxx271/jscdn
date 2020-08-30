(function ($) {
    $.fn.penicillin = function (options) {
        var options = $.extend({
            type: 'regular',
            text: '小米安全', // 明文水印内容
            fontSize: '50px', // 字体大小
            angle: 30, // 水印倾斜角度
            width: 250, // 水印宽度
            height: 100, // 水印长度
            xSpace: 15, // 水印之间x间距
            ySpace: 100, // 水印之间y间距
            paddingX: 15, // 水印距离DOM元素x边距
            paddingY: 50, // 水印距离DOM元素y边距
            maxPageHeight: 100 // 最大页面高度，大于此高度时使用固定水印方式
        }, options);

        // 设置水印样式
        function setStyle(e, wm) {
            //设置水印div倾斜显示
            e.style.webkitTransform = 'rotate(-' + wm.angle + 'deg)';
            e.style.MozTransform = 'rotate(-' + wm.angle + 'deg)';
            e.style.msTransform = 'rotate(-' + wm.angle + 'deg)';
            e.style.OTransform = 'rotate(-' + wm.angle + 'deg)';
            e.style.transform = 'rotate(-' + wm.angle + 'deg)';
            //选不中
            e.style.color = wm.color;
            e.style.opacity = wm.opacity;
            e.style.width = wm.width + 'px';
            e.style.height = wm.height + 'px';
            e.style.lineHeight = 'normal';
            e.style.textAlign = 'center';
            e.style.fontSize = wm.fontSize;
            e.style.zIndex = 99999;
            e.style.overflow = 'hidden';
            e.style.display = 'block';
            e.style.pointerEvents = 'none';

            return e;
        }

        // 固定位置的水印，用于长页面
        function fixedWatermarking(wm) {
            if (typeof (options.text) != 'string' || options.text.length == 0) {
                return;
            }
            clientW = document.documentElement.clientWidth;
            clientH = document.documentElement.clientHeight;

            wm.rows = Math.ceil(clientH / (wm.height + wm.ySpace));
            wm.cols = Math.floor((clientW - 2 * wm.paddingX) / (wm.width + wm.xSpace));

            var x, y;
            var tmpNode = document.createDocumentFragment();

            for (var i = 0; i < wm.rows; i++) {
                y = wm.paddingY + (wm.ySpace + wm.height) * i;
                for (var j = 0; j < wm.cols; j++) {
                    x = wm.paddingX + (wm.width + wm.xSpace) * j;

                    var maskDiv = setStyle(document.createElement('div'), wm);
                    maskDiv.className = 'dun-penicillin'
                    maskDiv.style.top = y + 'px';
                    maskDiv.style.left = x + 'px';
                    maskDiv.style.position = 'fixed';
                    maskDiv.appendChild(document.createTextNode(wm.text));

                    tmpNode.appendChild(maskDiv);
                }
            }
            document.body.appendChild(tmpNode)
        }

        // 显示水印
        function watermarking(e, wm) {
            if (typeof (options.text) != 'string' || options.text.length == 0) {
                return;
            }

            wm.rows = Math.ceil($(e).height() / (wm.height + wm.ySpace));
            wm.cols = Math.floor(($(e).width() - 2 * wm.paddingX) / (wm.width + wm.xSpace));

            var x, y;
            var eOffset = $(e).offset();
            var tmpNode = document.createDocumentFragment();

            for (var i = 0; i < wm.rows; i++) {
                y = wm.paddingY + (wm.ySpace + wm.height) * i;
                for (var j = 0; j < wm.cols; j++) {
                    x = wm.paddingX + (wm.width + wm.xSpace) * j;

                    var maskDiv = setStyle(document.createElement('div'), wm);
                    maskDiv.className = 'dun-penicillin';
                    maskDiv.style.left = (eOffset.left + x) + 'px';
                    maskDiv.style.top = (eOffset.top + y) + 'px';
                    maskDiv.style.position = 'absolute';
                    maskDiv.appendChild(document.createTextNode(wm.text));

                    tmpNode.appendChild(maskDiv);
                }
            }
            $(e).append(tmpNode)
        }

        // 设置文字颜色
        if (options.type === 'blind') {
            options.opacity = 0.02;
            if (!options.color) {
                options.color = '#fee';
            }
        } else {
            options.opacity = 0.05;
            if (!options.color) {
                options.color = '#000';
            }
        }

        $(this).children('.dun-penicillin').remove();

        // 根据页面长度自动选择
        if(document.body.scrollHeight < options.maxPageHeight){
            watermarking(this, options);
        } else {
            fixedWatermarking(options);
        }
    };
})(jQuery);
