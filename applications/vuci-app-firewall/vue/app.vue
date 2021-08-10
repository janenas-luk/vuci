<template>
  <vuci-form uci-config="firewall">
    <a-tabs>
      <a-tab-pane key="general" :tab="$t('General Settings')">
        <vuci-typed-section type="defaults" v-slot="{ s }" :collapsible="false" :card="false">
          <vuci-form-item-switch :uci-section="s" :label="$t('firewall.Enable SYN-flood protection')" name="syn_flood"/>
          <vuci-form-item-switch :uci-section="s" :label="$t('firewall.Drop invalid packets')" name="drop_invalid"/>
          <vuci-form-item-select :uci-section="s" :label="$t('firewall.Input')" name="input" :options="targets" required/>
          <vuci-form-item-select :uci-section="s" :label="$t('firewall.Output')" name="output" :options="targets" required/>
          <vuci-form-item-select :uci-section="s" :label="$t('firewall.Forward')" name="forward" :options="targets" required/>
        </vuci-typed-section>
      </a-tab-pane>
      <a-tab-pane key="zones" :tab="$t('firewall.Zones')">
        <vuci-typed-section type="zone" :columns="zoneColumns" addremove :card="false" expanded>
          <template #name="{ s }">
            <vuci-form-item-dummy :uci-section="s" name="name"/>
          </template>
          <template #input="{ s }">
            <vuci-form-item-select :uci-section="s" name="input" :options="targets" initial="ACCEPT" required/>
          </template>
          <template #output="{ s }">
            <vuci-form-item-select :uci-section="s" name="output" :options="targets" initial="ACCEPT" required/>
          </template>
          <template #forward="{ s }">
            <vuci-form-item-select :uci-section="s" name="forward" :options="targets" initial="REJECT" required/>
          </template>
          <template #masq="{ s }">
            <vuci-form-item-switch :uci-section="s" name="masq"/>
          </template>
          <template #mtu_fix="{ s }">
            <vuci-form-item-switch :uci-section="s" name="mtu_fix"/>
          </template>
          <template #expandedRowRender="{ s }">
            <vuci-form-item-select :uci-section="s" :label="$t('firewall.Covered networks')" name="network" :options="interfaces" multiple/>
            <vuci-form-item-select :uci-section="s" :label="$t('firewall.Restrict to address family')" name="family" :options="families" multiple/>
            <vuci-form-item-switch :uci-section="s" :label="$t('firewall.Enable logging on this zone')" name="log"/>
            <vuci-form-item-input :uci-section="s" :label="$t('firewall.Limit log messages')" name="log_limit" placeholder="10/minute" depend="log"/>
          </template>
        </vuci-typed-section>
      </a-tab-pane>
      <a-tab-pane key="redirect" :tab="$t('firewall.Port Forwards')">
        <vuci-typed-section type="redirect" :columns="redirectColumns" addremove sortable :card="false" expanded>
          <template #name="{ s }">
            <vuci-form-item-input :uci-section="s" name="name"/>
          </template>
          <template #enabled="{ s }">
            <vuci-form-item-switch :uci-section="s" name="enabled" initial/>
          </template>
          <template #proto="{ s }">
            <vuci-form-item-select :uci-section="s" name="proto" :options="protos" initial="tcp udp" allow-create/>
          </template>
          <template #src="{ s }">
            <vuci-form-item-select :uci-section="s" name="src" :options="zones" required/>
          </template>
          <template #src_dport="{ s }">
            <vuci-form-item-input :uci-section="s" name="src_dport" rules="port"/>
          </template>
          <template #dest="{ s }">
            <vuci-form-item-select :uci-section="s" name="dest" :options="zones" required/>
          </template>
          <template #dest_ip="{ s }">
            <vuci-form-item-select :uci-section="s" name="dest_ip" :options="arps" allow-create rules="ip4addr"/>
          </template>
          <template #dest_port="{ s }">
            <vuci-form-item-input :uci-section="s" name="dest_port" rules="port"/>
          </template>
          <template #expandedRowRender="{ s }">
            <vuci-form-item-list :uci-section="s" :label="$t('firewall.Source MAC address')" name="src_mac" rules="macaddr"/>
            <vuci-form-item-select :uci-section="s" :label="$t('firewall.Source IP address')" name="src_ip" :options="arps" rules="ip4addr" :placeholder="$t('firewall.any')" allow-create/>
            <vuci-form-item-input :uci-section="s" :label="$t('firewall.External IP address')" name="src_dip" rules="ip4addr" :placeholder="$t('firewall.any')"/>
            <vuci-form-item-switch :uci-section="s" :label="$t('firewall.Enable NAT Loopback')" name="reflection" initial/>
          </template>
        </vuci-typed-section>
      </a-tab-pane>
      <a-tab-pane key="rules" :tab="$t('firewall.Traffic Rules')">
        <vuci-typed-section type="rule" :title="$t('firewall.Traffic Rules')" :columns="ruleColumns" addremove sortable :card="false" expanded>
          <template #name="{ s }">
            <vuci-form-item-input :uci-section="s" name="name"/>
          </template>
          <template #enabled="{ s }">
            <vuci-form-item-switch :uci-section="s" name="enabled" initial/>
          </template>
          <template #proto="{ s }">
            <vuci-form-item-select :uci-section="s" name="proto" :options="protos" initial="tcp udp" allow-create/>
          </template>
          <template #src="{ s }">
            <vuci-form-item-select :uci-section="s" name="src" :options="zones" required/>
          </template>
          <template #dest="{ s }">
            <vuci-form-item-select :uci-section="s" name="dest" :options="zones" required/>
          </template>
          <template #dest_port="{ s }">
            <vuci-form-item-input :uci-section="s" name="dest_port" rules="port" :placeholder="$t('firewall.any')" depend="proto == 'tcp' || proto == 'udp' || proto == 'tcp udp'"/>
          </template>
          <template #target="{ s }">
            <vuci-form-item-select :uci-section="s" name="target" :options="actions" initial="DROP" required/>
          </template>
          <template #expandedRowRender="{ s }">
            <vuci-form-item-select :uci-section="s" :label="$t('firewall.Restrict to address family')" name="family" :options="families" multiple/>
            <vuci-form-item-select :uci-section="s" :label="$t('firewall.Week Days')" name="weekdays" :options="weekdays" multiple/>
            <vuci-form-item-select :uci-section="s" :label="$t('firewall.Month Days')" name="monthdays" :options="monthdays" multiple/>
            <vuci-form-item-input :uci-section="s" :label="$t('firewall.Start Time (hh:mm:ss)')" name="start_time"/>
            <vuci-form-item-input :uci-section="s" :label="$t('firewall.Stop Time (hh:mm:ss)')" name="stop_time"/>
            <vuci-form-item-input :uci-section="s" :label="$t('firewall.Start Date (yyyy-mm-dd)')" name="start_date"/>
            <vuci-form-item-input :uci-section="s" :label="$t('firewall.Stop Date (yyyy-mm-dd)')" name="stop_date"/>
            <vuci-form-item-switch :uci-section="s" :label="$t('firewall.Time in UTC')" name="utc_time"/>
          </template>
        </vuci-typed-section>
      </a-tab-pane>
    </a-tabs>
  </vuci-form>
</template>

<script>
export default {
  data () {
    return {
      zones: [],
      arps: [],
      protos: [
        ['tcp udp', 'TCP+UDP'],
        ['tcp', 'TCP'],
        ['udp', 'UDP'],
        ['icmp', 'ICMP']
      ],
      targets: [
        ['REJECT', this.$t('firewall.reject')],
        ['DROP', this.$t('firewall.drop')],
        ['ACCEPT', this.$t('firewall.accept')]
      ],
      zoneColumns: [
        { name: 'name', label: this.$t('firewall.Name') },
        { name: 'input', label: this.$t('firewall.Input') },
        { name: 'output', label: this.$t('firewall.Output') },
        { name: 'forward', label: this.$t('firewall.Forward') },
        { name: 'masq', label: this.$t('firewall.Masquerading') },
        { name: 'mtu_fix', label: this.$t('firewall.MSS clamping') }
      ],
      interfaces: [],
      families: [
        ['', this.$t('firewall.IPv4 and IPv6')],
        ['ipv4', this.$t('firewall.IPv4 only')],
        ['ipv6', this.$t('firewall.IPv6 only')]
      ],
      redirectColumns: [
        { name: 'name', label: this.$t('firewall.Name') },
        { name: 'enabled', label: this.$t('firewall.Enable') },
        { name: 'proto', label: this.$t('firewall.Protocol'), width: 200 },
        { name: 'src', label: this.$t('firewall.Source zone'), width: 180 },
        { name: 'src_dport', label: this.$t('firewall.External port') },
        { name: 'dest', label: this.$t('firewall.Internal zone'), width: 180 },
        { name: 'dest_ip', label: this.$t('firewall.Internal IP address'), width: 300 },
        { name: 'dest_port', label: this.$t('firewall.Internal port') }
      ],
      ruleColumns: [
        { name: 'name', label: this.$t('firewall.Name') },
        { name: 'proto', label: this.$t('firewall.Protocol'), width: 200 },
        { name: 'src', label: this.$t('firewall.Source zone'), width: 180 },
        { name: 'dest', label: this.$t('firewall.Internal zone'), width: 180 },
        { name: 'dest_port', label: this.$t('firewall.Destination port') },
        { name: 'target', label: this.$t('firewall.Action'), width: 180 }
      ],
      actions: [
        ['DROP', this.$t('firewall.drop')],
        ['ACCEPT', this.$t('firewall.accept')],
        ['REJECT', this.$t('firewall.reject')],
        ['NOTRACK', this.$t('firewall.don\'t track')]
      ],
      weekdays: [
        ['Sun', this.$t('Sunday')],
        ['Mon', this.$t('Monday')],
        ['Tue', this.$t('Tuesday')],
        ['Wed', this.$t('Wednesday')],
        ['Thu', this.$t('Thursday')],
        ['Fri', this.$t('Friday')],
        ['Sat', this.$t('Saturday')]
      ],
      monthdays: [...Array(31).keys()].map(i => i + 1)
    }
  },
  created () {
    this.$network.load().then(() => {
      this.interfaces = this.$network.getInterfaces().map(item => item.name)
    })

    this.$firewall.load().then(() => {
      this.zones = this.$firewall.zones.map(z => z.name())
    })

    this.$rpc.call('network', 'arp_table').then(r => {
      r.entries.forEach(arp => {
        if (arp.macaddr === '00:00:00:00:00:00') return

        this.arps.push([arp.ipaddr, `${arp.ipaddr}(${arp.macaddr})`])
      })
    })
  }
}
</script>
