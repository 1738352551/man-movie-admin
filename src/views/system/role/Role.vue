<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色名称">
              <a-input placeholder="请输入菜单名称" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="权限标识">
              <a-input placeholder="请输入权限标识" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="角色状态">
              <a-select placeholder="请选择角色状态">
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
    <div class="table-operator" style='margin-top: 20px;'>
      <a-button type="primary">新增</a-button>
      <a-button type="warning">修改</a-button>
      <a-button type="danger">删除</a-button>
    </div>
    <div class="ant-table-body" style="margin-top: 20px">
      <a-table
        :columns="columns"
        :data-source="roleData"
      >
      </a-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Role',
  data () {
    return {
      columns: [
        {
          title: '角色编号',
          key: 'roleId',
          dataIndex: 'roleId'
        },
        {
          title: '角色名称',
          key: 'roleName',
          dataIndex: 'roleName'
        },
        {
          title: '权限标识',
          key: 'roleKey',
          dataIndex: 'roleKey'
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      roleData: []
    }
  }
}
</script>
<style scoped lang='less'>

</style>
