var qs = require('querystring'),
        crypto = require('crypto'),
        sys = require('sys'),
        https = require('https');

function GatewayClient(opts, authInfo){
    verifyRequiredArguments(opts);

    this.request = function(request, callback){
        var requestString = qs.stringify(request);

        var req = https.request({
            host: opts.host
            ,path: opts.path
            ,port: 443
            ,method: 'POST'
            ,headers: {
                'Content-Length':requestString.length
                ,'Content-Type':opts.contentType
            }
        });

//        console.log('This is the compiled request:');
//        console.log(require('sys').inspect(requestString));
//        console.log(require('sys').inspect(req));

        req.end(requestString);
        req.on('response', function(res){
            res.on('data', function(data){
                callback(opts.responseParser.parseResponse(request, data.toString()))
            })
        })
    }
}

exports.GatewayClient = GatewayClient

function verifyRequiredArguments(opts){
    var required = ['host', 'path', 'contentType', 'responseParser']
    if(!opts) throw new Error("Required fields missing. Need an option containing configuration details.")
    var missingFields = required.filter(function(s){ return !(s in opts) || !opts[s]})
    if(missingFields.length > 0){
        throw new Error("GatewayClient ctor is missing required fields " + missingFields.join(','))
    }
}

