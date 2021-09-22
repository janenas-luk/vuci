# RPC API Calls
- [RPC API Calls](#rpc-api-calls)
  - [Firewall](#firewall)
    - [Adding a...](#adding-a)
      - [RULE](#rule)
      - [ZONE](#zone)
      - [FORWARD](#forward)
    - [Deleting a...](#deleting-a)
      - [RULE](#rule-1)
      - [ZONE](#zone-1)
      - [FORWARD](#forward-1)
  - [OpenVPN](#openvpn)
    - [Adding OpenVPN configuration](#adding-openvpn-configuration)
    - [Deleting OpenVPN configuration](#deleting-openvpn-configuration)

## Firewall

### Adding a...

  This section explains how to add an unnamed section (it can be a rule, forward, or zone) to firewall's configuration file.

  #### RULE
    
  - What it does: Adds a rule to the firewall.
  - RPC Call: 
    ```js
    rpc.call('firewall', 'add_rule', { parameters_to_send })
    ```

  - Parameters to send are listed below:
    
    | Parameter | Type          |
    |-----------|---------------|
    | name      | string        |
    | enabled   | int or string |
    | proto     | string        |
    | target    | string        |
    | src       | string        |

   - Returns:  
      - On success: `null`
      - Otherwise: if a **rule** with the **same name** exists, the **response** will be a **message**: `'Such entry in firewall already exists!` 

  #### ZONE

  - What it does: Adds a zone to the firewall.
  - RPC Call: 
    ```js
    rpc.call('firewall', 'add_zone', { parameters_to_send })
    ```
  - Parameters to send are listed below:
    
    | Parameter | Type          |
    |-----------|---------------|
    | name      | string        |
    | network   | int or string |
    | input     | string        |
    | output    | string        |
    | forward   | string        |

   - Returns:
      - On success: `null`
      - Otherwise: if a **zone** with the **same name** exists, the **response** will be a **message**: `'Such entry in firewall already exists!'`

  #### FORWARD

  - What it does: Adds a forwarding to the firewall.
  - RPC Call: 
    ```js
    rpc.call('firewall', 'add_forward', { parameters_to_send })
    ```
  - Parameters to send:

    | Parameter | Type   |
    |-----------|--------|
    | dest      | string |
    | src       | string |

   - Returns:
    
      - On success: `null`
      - Otherwise: if a **forwarding** with the same **src** and **dest** attributes exist, the **response** will be a **message**: `'Such entry in firewall already exists!'`

### Deleting a...

  This section explains how to delete an unnamed section (it can be a rule, forward, or zone) from firewall's configuration file.

  #### RULE
    
  - What it does: Deletes a rule from firewall.
  - RPC Call: 
    ```js
    rpc.call('firewall', 'delete_rule', { parameters_to_send })
    ```

  - Parameters to send are listed below:
    
    | Parameter | Type          |
    |-----------|---------------|
    | name      | string        |

   - Returns:  
      - On success: `Rule deleted`
      - Otherwise: if `name` is not provided or it's not a `string` it returns error message that `name` is needed

  #### ZONE

  - What it does: Adds a zone to the firewall.
  - RPC Call: 
    ```js
    rpc.call('firewall', 'delete_zone', { parameters_to_send })
    ```
  - Parameters to send are listed below:
    
    | Parameter | Type          |
    |-----------|---------------|
    | name      | string        |

   - Returns:
      - On success: `Zone deleted`
      - Otherwise: if `name` is not provided or it's not a `string` it returns error message that `name` is needed

  #### FORWARD

  - What it does: Adds a forwarding to the firewall.
  - RPC Call: 
    ```js
    rpc.call('firewall', 'delete_forwarding', { parameters_to_send })
    ```
  - Parameters to send
    | Parameter | Type   |
    |-----------|--------|
    | dest      | string |
    | src       | string |

   - Returns:
    
      - On success: `Forwarding deleted`
      - Otherwise: if `src` and `dest` are not provided in `parameters_to_send` it returns an error that both `src` and `dest` parameters are required.

## OpenVPN

This section explains how openVPN file works. Main functions in OpenVPN that are listed below is just wrappers for other functions that are in firewall.

### Adding OpenVPN configuration

  - What it does: Adds all necessary configurations to firewall (includes: rule, two forwardings and a zone)
  - RPC Call: 
    ```js
    rpc.call('openvpn', 'add_openvpn_config', { params_to_send })
    ```  

  - Params to send: 
  
    | Parameter | Type   |
    |-----------|--------|
    | port      | int    |

  > you can leave params_to_send section even empty, or don't include it, if the port is 1194 (it's default in openvpn file)

  - Returns:  
    - On success: array of 3 ```null``` values that represents returns  of:
      1.  Firewall
      2.  Zone
      3.  Forwardings
   
    - Otherwise: it tries to add firewall rule, zone and forwardings, so the same rules apply from them. See [Adding a...](#adding-a) section in [Firewall](#firewall) tab.

### Deleting OpenVPN configuration

  - What it does: Deletes all imported keys for specific OpenVPN configuration, deletes configuration section from openVPN config file, counts all configs, and if that's zero, it also deletes the firewall rules that were created with `add_openvpn_config` method.

  - RPC Call: 
      ```js
      rpc.call('openvpn', 'delete_vpn_config', { params_to_send }
      ```
  - Params to send:
  
    | Parameter | Type   |
    |-----------|--------|
    |   name    | string |

  - Returns:
    - On success: Nothing
  - Otherwise: Error from any of the other methods that this wrapper calls.