<template>
  <div class="manager-host-container">
    <el-card>
      <el-tabs v-model="sql_tables_value" type="card" editable @edit="handleTabsEdit">
        <el-tab-pane
        v-for="(item, index) in sql_tables"
        :key="item.name"
        :label="item.title"
        :name="item.name">
          <el-row>
            <el-col :offset="1" :span="22">
              <el-card>
                <div slot="header" class="clearfix">
                  数据库：
                  <el-select v-model="item.table" placeholder="请选择" clearable filterable>
                    <el-option
                      key="user"
                      label="user"
                      value="1">
                    </el-option>
                    <el-option
                      key="ops"
                      label="ops"
                      value="2">
                    </el-option>
                  </el-select>
                  <el-button type="primary" icon="el-icon-refresh" circle @click="init_database(item)"></el-button>
                  <el-button type="warning" @click="sqlSearch(item)">查询</el-button>
                </div>
                <editor v-model="item.sql" @init="editorInit" lang="mysql" theme="github" width="1600" height="200"></editor>
              </el-card>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="1" :span="22">
              <el-card>
                <el-table
                  :data="item.data"
                  height="250"
                  stripe
                  border
                  style="width: 100%">
                  <el-table-column
                  v-for="(i, index) in item.cols"
                  :key="i.name"
                  :prop="i.prop"
                  :label="i.label"
                  ></el-table-column>
                </el-table>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import editor from "vue2-ace-editor";
export default {
  data() {
    return {
      content: "",
      sql_tables_value: "1",
      sql_tables: [
        {
          title: "SQL窗口",
          name: "1",
          table: null,
          sql: "",
          cols:[
            {name:'date',prop:'date',label:'时间'},
            {name:'name',prop:'name',label:'名称'},
            {name:'address',prop:'address',label:'地址'}
          ],
          data: [
            {
              date: "2016-05-02",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1518 弄"
            },
            {
              date: "2016-05-04",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1517 弄"
            },
            {
              date: "2016-05-01",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1519 弄"
            },
            {
              date: "2016-05-03",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1516 弄"
            }
          ]
        }
      ],
      tabIndex: 1
    };
  },
  methods: {
    editorInit(editor) {
      require("brace/ext/language_tools");
      require("brace/theme/github");
      require("brace/mode/mysql");
      editor.setFontSize(18);
      editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        wrap: "free"
      });
    },
    handleTabsEdit(targetName, action) {
      if (action === "add") {
        let newTabName = ++this.tabIndex + "";
        this.sql_tables.push({
          title: "SQL窗口",
          name: newTabName
        });
        this.sql_tables_value = newTabName;
      }
      if (action === "remove") {
        let tabs = this.sql_tables;
        let activeName = this.sql_tables_value;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.sql_tables_value = activeName;
        this.sql_tables = tabs.filter(tab => tab.name !== targetName);
      }
    },
    sqlSearch(item) {
      console.log(item);
    },
    init_database(item) {
      console.log(item);
    }
  },
  components: {
    editor
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.manager-host-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
}
.editor {
  position: absolute;
  width: 500px;
  height: 400px;
}
.el-row {
  margin-bottom: 30px;
}
.el-tag {
  margin-left: 10px;
  margin-bottom: 5px;
  font-size: 15px;
}
</style>
