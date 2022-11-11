# Components

::: tip
The `self` appearing in the text indicates the current component instance itself.
:::

## vuci-form

Represents a uci configuration file. Other components must be wrapped by this component.

### Attributes
| Name      | Description        | Type      | Accepted Values       | Default  |
|---------- |------------ |---------- |-------------|-------- |
| uci-config    | uci configuration file  | string   | — | — |

### Events
| Name   | Description         | Parameters   |
|---------- |------------- |---------- |
| applied   | triggers when apply configuration complete | — |

## vuci-typed-section

Represents all uci sections which has the same type.

### Attributes
| Name      | Description        | Type      | Accepted Values       | Default  |
|---------- |------------ |---------- |-------------|-------- |
| type    | section type  | string   | — | — |
| title    | title  | string   | — | — |
| addremove   | Can be added or removed | boolean | — |  false |
| anonymous | Whether it is an anonymous section, if it is false, the add operation will add a named section  | boolean   | — |  true |
| columns     | table columns | array | — |  - |
| sortable  | Support for table sorting | boolean | — |  false |
| filter    | filter | Function(s) | — | — |
| collabsible | collabsible | boolean | — | true |
| teasers | The name of the option to display when collapsed (all options are displayed by default) | array | — | — |
| add | Custom add function. | Function(self) | — | — |

### Events
| Name   | Description         | Parameters   |
|---------- |------------- |---------- |
| change    | triggers when one option's value changed | (sid, self) |
| change-xx | Triggered when the value of a particular option changes(Where xx represents the specific option name) | (self) |

### Filter

Suppose there is such a uci configuration file: test
```
config item
    option name qa
    option age 32
config item
    option name qa
    option age 18
```
Require only showing items older than 30:
``` vue
<template>
  <vuci-form uci-config="test">
    <vuci-typed-section type="item" :filter="filter">
    ...
    </vuci-typed-section>
  </vuci-form>
</template>

<script>
export default {
  methods: {
    filter(s) {
      return s.age > 30
    }
  }
}
</script>
```

### Custom add function

Returns the added section ID or Promise object.

Suppose there is such a uci configuration file: test
```
config item
    option name qa
    option age 32
```
The name option is required to be entered by the user when adding a section, and cannot be repeated, and cannot be modified once added.
``` vue
<template>
  <vuci-form uci-config="test">
    <vuci-typed-section type="item" :filter="filter" addremove :add="addItem" v-slot="{ s }">
      <vuci-form-item-dummy label="Name" name="name":uci-section="s"/>
    </vuci-typed-section>
  </vuci-form>
</template>

<script>
export default {
  methods: {
    addItem(self) {
      this.$prompt({
        title: 'Add',
        placeholder: 'Please input a name',
        validator: value => {
          if (self.sections.filter(s => s.name === value).length > 0) {
            return 'The name already exist'
          }
        }
      }).then(value => {
        const sid = self.addSection()
        this.$uci.set('test', sid, 'name', value)
      })
    }
  }
}
</script>
```

## vuci-named-section

Represents a uci section of a named uci section.

### Attributes
| Name      | Description        | Type      | Accepted Values       | Default  |
|---------- |------------ |---------- |-------------|-------- |
| Name      | section name  | string   | — | — |
| title     | title  | string   | — | — |

### Events
| Name   | Description         | Parameters   |
|---------- |------------- |---------- |
| change    | triggers when one option's value changed | (sid, self) |
| change-xx | Triggered when the value of a particular option changes(Where xx represents the specific option name) | (self) |

## vuci-form-item

Used to customize UCI options

### Attributes
| Name        | Description        | Type      | Accepted Values       | Default  |
|------------ |------------ |---------- |-------------|-------- |
| uci-section | UCI object | object | - | - |
| label       | label | string | — | — |
| name        | option name (under the same section, must be unique) | string | — | — |
| help | a short description of the option(Support for HTML rendering) | string | — | — |
| required    | Required or not | boolean | — | false |
| initial     | initial value | string/number | — | — |
| depend      | depend | string | — | — |
| rules       | form validation rule | string/object/Function(value) | — | — |
| load        | Custom loading method | string/array/Function(self) | — | — |
| save        | Custom save function | Function(self) | — | — |

### Events
| Name   | Description         | Parameters   |
|---------- |------------- |---------- |
| change    | triggers when the option's value changed | self |

### Scoped Slots
| Name | Description     |
|------|----------|
| —    | Custom option content, the parameter is { self } |

### Custom option loading method

Implemented by providing the `load` attribute. This property supports three types of strings, arrays, and functions.
If you provide a function, you can return a value directly or a Promise object. If you supply a string or an array,
you can dynamically update the value of this option.
``` vue
<vuci-form-item-switch label="X" name="x" :load="xEnabled" :uci-section="s"/>
...
<script>
export default {
  methods: {
    xEnabled() {
      return new Promise(resolve => {
        let en = false
        // TODO
        resolve(en);
      });
    }
  }
}
</script>  
```

### Custom option UI

``` vue
<vuci-form-item label="名称" name="name" :uci-section="s">
  <template v-slot="{ self }">
    <span>{{ self.model }}</span>
  </template>
</vuci-form-item>
```
Equivalent to
``` vue
<vuci-form-item-dummy label="名称" name="name" :uci-section="s"/>
```

``` vue
<vuci-form-item label="名称" name="name" :uci-section="s">
  <template v-slot="{ self }">
    <a-input v-model="self.model"/>
  </template>
</vuci-form-item>
```
Equivalent to
``` vue
<vuci-form-item-input label="名称" name="name" :uci-section="s"/>
```

## vuci-form-item-dummy

Used only to display values, not for editing.

## vuci-form-item-input

Used for editable uci options.

### Attributes
| Name        | Description        | Type      | Accepted Values       | Default  |
|------------ |------------ |---------- |-------------|-------- |
| placeholder | placeholder | string | — | — |
| password | toggleable password input | boolean | — | false |
| append | content to append after Input | string | — | — |

### content to append after Input

For example, some options require adding a unit after the input box.
![](./input_append.png)
``` vue
<vuci-form-item-input label="Size" name="size" append="kiB" :uci-section="s"/>
```

## vuci-form-item-switch

Used for options with a switch state.

### Attributes
| Name           | Description        | Type      | Accepted Values       | Default  |
|--------------- |------------ |---------- |-------------|-------- |
| initial        | initial value | boolean | — | — |
| true-value   | switch value when in on state | string/number/boolean | — | true |
| false-value | switch value when in off state | string/number/boolean | — | false |

## vuci-form-item-select

Used when an option has multiple optional values.

### Attributes
| Name        | Description        | Type      | Accepted Values       | Default  |
|------------ |------------ |---------- |-------------|-------- |
| initial | initial value | string/array | — | — |
| options | optional list value | array | — | —  |
| multiple | whether multiple-select is activated | boolean | — | false |
| allow-create | whether creating new items is allowed | boolean | — | false |

## vuci-form-item-dlist

Dynamic list. Corresponds to the list in the uci configuration.

## vuci-form-item-upload

Used to upload files and save their locations in uci config.

### Attributes
| Name        | Description        | Type      | Accepted Values       | Default  |
|------------ |------------ |---------- |-------------|-------- |
| path | Location where files will be saved | string | — | /etc/vuci-uploads/ |
| size | Max allowed file size in bytes | number/string | — | 10000 |
| multiple | Allows to upload multiple files | boolean | — | false |

## vuci-progress-bar

Used to create dynamic linear progress bar.

### Attributes
| Name        | Description        | Type      | Accepted Values       | Default  |
|------------ |------------ |---------- |-------------|-------- |
| title | title of a progress bar which displayed above the bar | string | — | — | 
| value | value according which progress bar will be created and filled | number | — | — |
| max-value | value which indicates maximum value of progress bar | number | — | 100 |
| unit | displays progress bar units  | string | — | % |
| show-info | displays value and info at the end of progress bar | boolean | — | true |
| bar-weight | allows to change weight of progress bar ( in px ) | number | — | 10 |
| bar-width | allows to change width of progress bar ( in % ) | number | — | 50 |