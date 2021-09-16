# RPC API Calls
- [RPC API Calls](#rpc-api-calls)
  - [Firewall](#firewall)
    - [Adding a...](#adding-a)
      - [RULE](#rule)
      - [ZONE](#zone)
      - [FORWARD](#forward)
  - [OpenVPN](#openvpn)
  

## Firewall

### Adding a...

  This section explains how to add a unnamed section to firewall configuration

  #### RULE
    
  - RPC Call: ```rpc.call('firewall', 'add_rule', { parameters_to_send })```
    
    | Parameter | Type          |
    |-----------|---------------|
    | name      | string        |
    | enabled   | int or string |
    | proto     | string        |
    | target    | string        |
    | src       | string        |

     - Returns: 
      - On success: `null`
      - Otherwise: returns a message: `Such entry in firewall already exists!` 

  #### ZONE

  - RPC Call: ```rpc.call('firewall', 'add_rule', { parameters_to_send })```
    
    | Parameter | Type          |
    |-----------|---------------|
    | name      | string        |
    | network   | int or string |
    | input     | string        |
    | output    | string        |
    | forward   | string        |

     - Returns: 
      - On success: `null`
      - Otherwise: returns a message: `Such entry in firewall already exists!` 

  #### FORWARD

  - RPC Call: ```rpc.call('firewall', 'add_rule', { parameters_to_send })```
    
    | Parameter | Type   |
    |-----------|--------|
    | dest      | string |
    | src       | string |

     - Returns: 
      - On success: `null`
      - Otherwise: returns a message: `Such entry in firewall already exists!` 

## OpenVPN
 Metdos