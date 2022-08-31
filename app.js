const NodeMediaServer = require('node-media-server');

const config = {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    http: {
        port: process.env.PORT || 80,
        allow_origin: '*'
    },
}

var nms = new NodeMediaServer(config)
nms.run();
let ukey = 1;
nms.on('prePlay', (id, StreamPath, args) => {
    console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    let session = nms.getSession(id);
    console.log("See Argument Below");
    console.log(args.key);
    if(args.key!=="key-"+ukey){
        session.reject();
    }else {
        ukey++;
        console.log("Playing now, next key is: "+ukey);
    }
});
nms.on('prePublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    let session = nms.getSession(id);
    if(args.sign!=="newKey2022") {
        console.log("You cannot stream, accessKey is not allowed")
        session.reject();
    }else{
        //do nothing, just accept it
        console.log("It playing well now...")
    }
});