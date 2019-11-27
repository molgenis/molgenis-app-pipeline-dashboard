<template>
  <b-container>
    <b-table :fields="colorFields" :items="colorItems" borderless small>
      <template v-slot:cell(color)="data">
        <font-awesome-icon :class="data.value" icon="square"></font-awesome-icon>
      </template>
    </b-table>
    <b-table :fields="iconFields" :items="iconItems" borderless small>
      <template v-slot:cell(status)="data">
        <font-awesome-icon :class="data.value.color" :icon="data.value.icon"></font-awesome-icon>
      </template>
    </b-table>
  </b-container>
</template>

<script>
import StatusIcon from '@/components/Track&Trace-Components/StatusIcon'
export default {
  name: 'help-modal-content',
  components: {
    StatusIcon
  },
  data() {
    return {
      iconFields: [
        {key: 'status', label: 'Icon'},
        'name',
        'description'
      ],
      iconItems: [
        {name: 'Finished', status: {icon: 'check-circle', color: 'success'}, description: 'Success, Finished'},
        {name: 'Waiting', status: {icon: 'hourglass-start', color: 'secondary'}, description: 'Waiting, On hold, Paused'},
        {name: 'Error', status: {icon: 'exclamation-circle', color: 'danger'}, description: 'Error, Run/Project Failed'},
        {name: 'Warning', status: {icon: 'exclamation-triangle', color: 'warning'}, description: 'Warning, Something is not right'}
      ],
      colorFields: [
        {key: 'color', label: 'Color'},
        'description'
      ],
      colorItems: [
        {color: 'primary', description: 'Selected or Running'},
        {color: 'danger', description: 'Error, somthing has crashed or stopped working'},
        {color: 'success', description: 'Finished, Complete, Done'},
        {color: 'warning', description: 'Warning, something is wrong'},
        {color: 'secondary', description: 'Not currently active, Waiting'}
      ],
    }
  }
}
</script>

<style lang="scss" scoped>

@import 'bootstrap/scss/bootstrap';
@import 'bootstrap-vue/src/index.scss';

.success {
    color: $success;
}
.primary {
    color: $primary
}
.secondary {
    color: $secondary
}
.warning {
    color: $warning
}
.danger {
    color: $danger
}

</style>