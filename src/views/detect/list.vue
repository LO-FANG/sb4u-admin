<template>
  <div class="app-container">

    <!--查询表单-->
    <el-form :inline="true">
            <el-form-item>
                <el-input v-model="queryDetectResultDto.tool" placeholder="检测工具"/>
            </el-form-item>
            <el-form-item>
                <el-input v-model="queryDetectResultDto.type" placeholder="漏洞类型"/>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
                <el-button type="default" icon="el-icon-refresh" @click="resetData()">清空</el-button>
            </el-form-item>
        </el-form>

            
   
        <el-table :data="detectResList"  border stripe>
            <el-table-column label="#" width="80">
                <template slot-scope="scope">
                {{ (pageNo - 1) * pageSize + scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="contractName" label="合约名称" width="200" />
            <el-table-column prop="pc" label="程序计数器" width="150" />
            <el-table-column prop="opcode" label="操作码" width="150" />
            <el-table-column prop="type" label="漏洞类型" width="150" />
            <el-table-column prop="tool" label="检测工具" width="150" />
            <el-table-column prop="codeCoverage" label="代码覆盖率(%)" width="150" />
            <el-table-column prop="executionTime" label="执行时间(s)" width="200"/>
            <el-table-column prop="createTime" label="检测时间" width="170"/>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                        icon="el-icon-download"
                        size="mini"
                        type="success"
                        @click="download(scope.row.resultId)">下载合约审计报告</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            style="padding: 30px 0; text-align: center;"
            layout="prev, pager, next, sizes, jumper, ->, total"
            :current-page="pageNo"
            :page-size="pageSize"
            :page-sizes="[10,15,20,30]"
            :total="total"
            @current-change="changeCurrentPage"
            @size-change="changePageSize">
        </el-pagination>
  </div>
</template>

<script>

import contractApi from '@/api/contract'

export default {

  data() {
    return {
      detectResList: [], // 检测结果列表
      total: 0, // 总记录数
      pageNo: 1,
      pageSize: 10,
      queryDetectResultDto: {}, // 查询条件表单
      detectFileId: ''
      
    }
  },

  created() {
    this.fetchData()
  },
  

  methods: {
    //下载文件
    download(id) {
            console.log("下载############：   " + id)
        // 询问是否下载
        this.$confirm('是否下载该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            //调用后端接口
            return contractApi.getDetectFileDownloadUrl(id)
            }).then(response => {
            console.log("urllllll:  " + response.data.downloadUrl)
            
            window.open(response.data.downloadUrl)
            })
        },

        fetchData() {
            contractApi.detectResPageList(this.pageNo, this.pageSize, this.queryDetectResultDto).then(response => {
                this.detectResList = response.data.rows,
                this.total = response.data.total
            })
        },
        // 修改页码 引用调用，系统自动传入
        changeCurrentPage(pageNo) {
            this.pageNo = pageNo;
            this.fetchData();
        },
        // 改变每页记录数
        changePageSize(pageSize) {
            this.pageSize = pageSize;
            this.fetchData();
        },
        // 重置表单
        resetData() {
            this.queryDetectResultDto = {}
            
            this.fetchData()
        },
        handleChange(value, direction, movedKeys) {
            console.log(value, direction, movedKeys);
        },

        handleCheckHis() {
            this.activeStep = 3
            
            this.fetchData()
        },

        resetText() {
            this.currentText = '';
            this.currentIndex = 0;
        },
  }
}
</script>
