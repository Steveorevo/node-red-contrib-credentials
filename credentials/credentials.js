module.exports = function(RED) {
	function credentials(config) {
		RED.nodes.createNode(this, config);
    if (typeof this.credentials.creds != 'undefined') {
      if (this.credentials.creds != '') {
        this.creds = JSON.parse(this.credentials.creds);
      }
    }
    if (typeof this.creds == 'undefined') {
      this.creds = [];
    }
    if (typeof config.props == 'undefined') {
      config.propr = [];
    }
		var node = this;
    var globalContext = this.context().global;
    var flowContext = this.context().flow;
		this.on('input', function(msg) {
      function setContextPropertyValue(context, property, value) {
          // Assign value to given object and property
          switch(context) {
            case "msg":
              RED.util.setMessageProperty(msg, property, value);
              break;
            case "flow":
              flowContext.set(property, value);
              break;
            case "global":
              globalContext.set(property, value);
              break;
          }
      }
      if (typeof config.props != 'undefined') {
        for (var i = 0;i < config.props.length;i++) {
          var cred = '';
          if (typeof node.creds[i] != 'undefined') {
            cred = node.creds[i];
          }
          var prop = config.props[i];
          if (cred == '') {
            node.warn('credentials node sending empty value for ' + prop.type + '.' + prop.value + '; configured?');
          }
          setContextPropertyValue(prop.type, prop.value, cred.value);
        }
      }
			node.send(msg);
		});
	}
	RED.nodes.registerType("credentials", credentials, {
		credentials: {
			creds: {type: "text"},
		}
	});
}
