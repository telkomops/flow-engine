'use strict';

module.exports = function (config) {

    return function (props, context, next) {
        var logger = context.get('logger');
        logger.info('execute subscribe task');
        var eh = function(event, next) {
            if (props['next-error']) {
                let count = getCount(context.get('verify-me'));
                context.set('verify-me', 'ev-error-' + (count+1));
                next(new Error('from subscribe-finish-counter'));
            } else {
                let count = getCount(context.get('verify-me'));
                context.set('verify-me', 'ev-ok-' + (count+1));
                next();
            }
        };
        var events = props.event.split(',');
        events.forEach( function ( event ) {
            context._flow.subscribe(event, eh);
        });
        next();
    };
};

function getCount(value) {
    if ( value === undefined ) {
        return 0;
    } else if (value.indexOf('ev-error') === 0) {
        let re = /ev-error-(\d)/;
        let match = re.exec(value);
        return parseInt(match[1]);
    } else if ( value.indexOf('ev-ok') === 0) {
        let re = /ev-ok-(\d)/;
        let match = re.exec(value);
        return parseInt(match[1]);
    }
    return 0;
}