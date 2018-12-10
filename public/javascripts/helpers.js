var register = function(Handlebars) {
    var helpers = {
        // put all of your helpers inside this object
        foo: function(){
            return "FOO";
        },
        bar: function(){
            return "BAR";
        },
        times:function (minus,n, block) {
            if(minus!==0){
                n=minus-n;
            }
            var accum = '';
            for(var i = 0; i < n; ++i)
                accum += block.fn(i);
            return accum;
        }
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        // register helpers
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }

};

module.exports.register = register;
module.exports.helpers = register(null);