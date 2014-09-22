'use strict';

angular.module('tooltip', [])
.factory('Popup', ['$window', '$document', '$timeout', '$compile', '$parse',
function($window, $document, $timeout, $compile, $parse) {
    var openedPopup = null;
    var template = '<div class="Tooltip" ng-init="$reposition()" ng-bind="text" disabled="disabled"></div>';

    // Padding towards edges of screen.
    var padding = 10;

    function showPopup(anchor, scope, attrs) {
        var options = {
            placement: attrs.placement || 'top',
            margin: parseInt(attrs.tipMargin) || 5
        }

        $timeout(function() {
            makePopup(anchor, scope, options);
        });
    }


    function makePopup(anchor, scope, options) {
        scope.$reposition = function() {
            $timeout(function() {
                fixPosition();
            });
        }

        var element = $compile(template)(scope);
        openedPopup = {
            el: element,
            options: options,
            anchor: anchor,
            scope: scope
        }

        var body = $document.find('body');
        body.append(element);
    }


    function hidePopup() {
        if (!openedPopup)
            return;

        var popup = openedPopup;
        openedPopup = null;

        $timeout(function() {
            popup.el.remove();
        });
    }

    function offset(el) {
        var rect = el[0].getBoundingClientRect();
        return {
            width: rect.width || el.prop('offsetWidth'),
            height: rect.height || el.prop('offsetHeight'),
            top: rect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
            left: rect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
        };
    }

    function fixPosition() {
        if (!openedPopup) return;

        var popupPosition = null;
        var parent = offset(openedPopup.anchor);
        var placement = openedPopup.options.placement;
        var element = openedPopup.el;

        if (placement === 'right') {
            popupPosition = {
                top: parent.top + parent.height / 2 - element.outerHeight() / 2,
                left: parent.left + parent.width + openedPopup.options.margin
            }
        } else if (placement === 'left') {
            popupPosition = {
                top: parent.top + parent.height / 2 - element.outerHeight() / 2,
                left: parent.left - element.outerWidth() - openedPopup.options.margin
            }
        } else if (placement === 'bottom') {
            popupPosition = {
                top: parent.top + parent.height + openedPopup.options.margin,
                left: parent.left + parent.width / 2 - element.outerWidth() / 2
            }
        } else if (placement === 'top') {
            popupPosition = {
                top: parent.top - element.outerHeight() - openedPopup.options.margin,
                left: parent.left + parent.width / 2 - element.outerWidth() / 2
            }
        }
        else
            throw new Error('Unsupported placement ' + placement);

        popupPosition.top = Math.max(padding, popupPosition.top);
        popupPosition.left = Math.max(padding, popupPosition.left);

        element.removeClass('left right bottom top');
        element.addClass(placement);

        element.css(popupPosition);
        //$parse(openedPopup.options.popupShown)(openedPopup.scope);
    }

    return {
        show: showPopup,
        close: hidePopup
    };
}]).directive('tooltip', ['Popup', '$parse', '$timeout', '$rootScope',
function(Popup, $parse, $timeout, $rootScope) {
    return {
        restrict: 'A',
        scope: { text: '=tooltip' },
        link: function(scope, element, attrs) {
            var clearTimeout = false;
            element.mouseenter(function() {
                clearTimeout = false;
                $timeout(function() {
                    if (clearTimeout == true) return;
                    $rootScope.$emit('tooltip:show')
                    Popup.show(element, scope, attrs);
                })
            })

            element.mouseleave(function() {
                clearTimeout = true
                Popup.close();
            })

            $rootScope.$on('tooltip:show', function() {
                clearTimeout = true
                Popup.close();
            })
        }
    };
}]);