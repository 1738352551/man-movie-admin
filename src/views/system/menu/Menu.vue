<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="菜单名称">
              <a-input placeholder="请输入菜单名称" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="菜单状态">
              <a-select placeholder='请选择菜单状态'>
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="2">禁止</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary">查询</a-button>
            <a-button style="margin-left: 8px">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-table
      :columns="columns"
      :data-source="menudata"
      :row-selection="rowSelection"
      :expanded-row-keys.sync="expandedRowKeys"
    >
      <span style="display: flex;flex-flow: row;gap: 5px;justify-content: center;" slot="action" slot-scope="">
        <a-button type="primary">编辑</a-button>
        <a-button type="primary">分配角色</a-button>
        <a-button type="danger" >删除</a-button>
      </span>
    </a-table>
  </div>
</template>
<script>
export default {
  name: 'Menu',
  data () {
    return {
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        },
        onSelect: (record, selected, selectedRows) => {
          console.log(record, selected, selectedRows)
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          console.log(selected, selectedRows, changeRows)
        }
      },
      expandedRowKeys: [],
      columns: [
        {
          title: '菜单名称',
          key: 'menuName',
          dataIndex: 'menuName'
        },
        {
          title: '图标',
          key: 'icon',
          dataIndex: 'icon'
        },
        {
          title: '权限标识',
          key: 'permission',
          dataIndex: 'permission'
        },
        {
          title: '组件地址',
          key: 'component',
          dataIndex: 'component'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      menudata: [
        {
          key: 1,
          menuName: '菜单1',
          icon: 'el-icon-s-help',
          permission: 'dashboard',
          component: 'dashboard',
          children: [
            {
              key: 10,
              menuName: '菜单1-1',
              icon: 'el-icon-s-help',
              permission: 'dashboard',
              component: 'dashboard'
            }
          ]
        },
        {
          key: 2,
          menuName: '菜单2',
          icon: 'el-icon-s-help',
          permission: 'dashboard',
          component: 'dashboard',
          children: [
            {
              key: 20,
              menuName: '菜单2-1',
              icon: 'el-icon-s-help',
              permission: 'dashboard',
              component: 'dashboard'
            }
          ]
        },
        {
          key: 3,
          menuName: '菜单3',
          icon: 'el-icon-s-help',
          permission: 'dashboard',
          component: 'dashboard',
          children: [
            {
              key: 30,
              menuName: '菜单3-1',
              icon: 'el-icon-s-help',
              permission: 'dashboard',
              component: 'dashboard'
            }
          ]
        },
        {
          key: 4,
          menuName: '菜单4',
          icon: 'el-icon-s-help',
          permission: 'dashboard',
          component: 'dashboard',
          children: [
            {
              key: 40,
              menuName: '菜单4-1',
              icon: 'el-icon-s-help',
              permission: 'dashboard',
              component: 'dashboard'
            }
          ]
        },
        {
          key: 5,
          menuName: '菜单5',
          icon: 'el-icon-s-help',
          permission: 'dashboard',
          component: 'dashboard',
          children: [
            {
              key: 50,
              menuName: '菜单5-1',
              icon: 'el-icon-s-help',
              permission: 'dashboard',
              component: 'dashboard',
              children: [
                {
                  key: 500,
                  menuName: '菜单5-1-1',
                  icon: 'el-icon-s-help',
                  permission: 'dashboard',
                  component: 'dashboard'
                }]
            }]
        }
      ]
    }
  },
  methods: {

  }
}
</script>
<style scoped lang='less'>

</style>
