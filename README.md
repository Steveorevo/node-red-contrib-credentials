# node-red-contrib-credentials
Provides a credentials node to store one or more values privately; preventing
inadvertent export to flows or to version control commits. Node-RED stores
your node information in flows.json and any values setup as credentials into
an encrypted separate flows_cred.json file. Values designated as credentials are
also omitted when using the clipboard to keep your information private. Use
this node to configure any property values you wish to keep private.

When sharing your flows, the values are omitted but property definitions are
retained to help users understand what values need to be filled out. A runtime
warning is issued for any un-configured values.

## Examples

#### Basic Example
Here we will supply the msg object with two properties; username and password.

![Node-RED Basic Example](/credentials/demo/basic.jpg?raw=true "Basic use")

The settings panel for the credentials node enables storing one or more values.
The private field has two modes "string" and "hidden". Both store information
the same but "hidden" has the added benefit of hiding any observer's view of the
value. After storage, changing the field from "hidden" to "string" prevents the
user interface from revealing the contents. *Note: the value is stored using
Node-RED's credentials API using the 'text' option; it is decoded in both
runtime and editor mode. The value can be viewed using the debugger or when
doing editor side DOM inspection. The "hidden" mode is only used to protect
values from plain view.*

Regardless of hidden/string mode, the values are stored encrypted outside of
the flows.json file.

#### WordPress Login Example
The following example shows how we can use the credentials node to supply login
information into a WordPress powered website to check for updates. This flow has
the [credentials](https://github.com/steveorevo/node-red-contrib-credentials) node and the [nbrowser](https://github.com/steveorevo/node-red-contrib-nbrowser) node installed. Here we see the
credentials node configured to store the login information in the msg.username
and msg.password properties. The nbrowser node then uses the properties to type
login credentials into WordPress' admin web page to access the dashboard.
Lastly, the html node is used to parse out the .update-count span element from
the web page before sending it to the debug window.


![Node-RED WordPress Login](/credentials/demo/wp.jpg?raw=true "Check for WordPress updates")

The exported flow appears below. Opening the credentials node will show the
username and password fields with blank (omitted) values that need to be supplied
by the user. Simply change the URL in the injector and supply your credentials
to your own WordPress site to run the flow.
```
[
    {
        "id": "cf934781.dbe858",
        "type": "inject",
        "z": "bd6efcab.b2b6b",
        "name": "http://domain.tld/wp-admin/",
        "topic": "",
        "payload": "http://domain.tld/wp-admin/",
        "payloadType": "str",
        "repeat": "",
        "crontab": "",
        "once": false,
        "x": 160,
        "y": 40,
        "wires": [
            [
                "73df4bbf.8e1da4"
            ]
        ]
    },
    {
        "id": "73df4bbf.8e1da4",
        "type": "credentials",
        "z": "bd6efcab.b2b6b",
        "name": "",
        "props": [
            {
                "value": "username",
                "type": "msg"
            },
            {
                "value": "password",
                "type": "msg"
            }
        ],
        "x": 150,
        "y": 140,
        "wires": [
            [
                "77b7ae1a.0469c"
            ]
        ]
    },
    {
        "id": "77b7ae1a.0469c",
        "type": "nbrowser",
        "z": "bd6efcab.b2b6b",
        "name": "",
        "methods": [
            {
                "name": "gotoURL",
                "func": "goto",
                "params": [
                    {
                        "type": "msg",
                        "value": "payload",
                        "typeDefault": "str"
                    }
                ]
            },
            {
                "name": "type",
                "func": "type",
                "params": [
                    {
                        "type": "str",
                        "value": "#user_login",
                        "typeDefault": "str"
                    },
                    {
                        "type": "msg",
                        "value": "username",
                        "typeDefault": "str"
                    }
                ]
            },
            {
                "name": "type",
                "func": "type",
                "params": [
                    {
                        "type": "str",
                        "value": "#user_pass",
                        "typeDefault": "str"
                    },
                    {
                        "type": "msg",
                        "value": "password",
                        "typeDefault": "str"
                    }
                ]
            },
            {
                "name": "click",
                "func": "click",
                "params": [
                    {
                        "type": "str",
                        "value": "#wp-submit",
                        "typeDefault": "str"
                    }
                ]
            },
            {
                "name": "wait",
                "func": "wait",
                "params": [
                    {
                        "type": "str",
                        "value": "#welcome-panel",
                        "typeDefault": "str"
                    }
                ]
            }
        ],
        "prop": "nbrowser",
        "propout": "payload",
        "object": "msg",
        "objectout": "msg",
        "close": false,
        "show": true,
        "outputs": 1,
        "x": 240,
        "y": 200,
        "wires": [
            [
                "933a7cc7.46675"
            ]
        ]
    },
    {
        "id": "2aa478c9.2dbe98",
        "type": "debug",
        "z": "bd6efcab.b2b6b",
        "name": "",
        "active": true,
        "console": "false",
        "complete": "false",
        "x": 410,
        "y": 100,
        "wires": []
    },
    {
        "id": "933a7cc7.46675",
        "type": "html",
        "z": "bd6efcab.b2b6b",
        "name": "",
        "tag": ".update-count",
        "ret": "html",
        "as": "single",
        "x": 340,
        "y": 260,
        "wires": [
            [
                "2aa478c9.2dbe98"
            ]
        ]
    }
]
```
## Installation
Run the following command in your Node-RED user directory (typically ~/.node-red):

    npm install node-red-contrib-credentials

The credentials node will appear in the palette under the storage group.
