<template>
  <div class="app-container">
    <!-- 输入表单 -->
    <el-form label-width="120px">
        <el-form-item label="合约名称">
            <el-input v-model="contract.name" />
        </el-form-item>

        <el-form-item label="公司名称">
            <el-input v-model="contract.companyName" />
        </el-form-item>

        <el-form-item label="运行平台">
          <el-select v-model="contract.platform" placeholder="请选择">
            <el-option
              v-for="item in platforms"
              :key="item.platform"
              :label="item.label"
              :value="item.platform">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="语言类型">
          <el-select v-model="contract.language" placeholder="请选择">
            <el-option
              v-for="item in languages"
              :key="item.language"
              :label="item.label"
              :value="item.language">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="合约等级">
            <el-select v-model="contract.grade">
                <!--
                数据类型一定要和取出的json中的一致，否则没法回填
                因此，这里value使用动态绑定的值，保证其数据类型是number
                -->
                <el-option :value="1" label="Easy"/>
                <el-option :value="2" label="Medium"/>
                <el-option :value="3" label="Hard"/>
            </el-select>
        </el-form-item>

        <el-form-item label="合约简介">
            <el-input v-model="contract.description" :rows="10" type="textarea"/>
        </el-form-item>
        <!-- 文件上传：TODO -->

        <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>

  import contractApi from '@/api/contract'
  export default {
    data () {
      return {
        // 合约对象
        contract:{},
        saveBtnDisabled: false,  //  默认按钮可用
        // TODO：动态查询数据
        languages: [{
          language: 'Solidity',
          label: 'Solidity'
        }, {
          language: 'Go',
          label: 'Go'
        }, {
          language: 'Javascript',
          label: 'Javascript'
        }, {
          language: 'Ruby',
          label: 'Ruby'
        }, {
          language: 'TypeScript',
          label: 'TypeScript'
        }],
        language: '',

        platforms: [{
          platform: 'Ethereum',
          label: 'Ethereum'
        }, {
          platform: 'Solana',
          label: 'Solana'
        }, {
          platform: 'Polkadot',
          label: 'Polkadot'
        }, {
          platform: 'Ergo',
          label: 'Ergo'
        }, {
          platform: 'Alogorand',
          label: 'Alogorand'
        }],
        platform: ''

      }
    },

    created () {
      if(this.$route.params.id) {
        this.fetchDataById(this.$route.params.id)
      }
      
    },

    methods: {
      saveOrUpdate() {
        this.saveBtnDisabled = true
        if(!this.contract.id) {
          this.saveData()
        } else {
          this.updataData()
        }
      },
      // 数据更新
      updataData() {
        contractApi.updateById(this.contract).then(response => {
          this.$notify({
              title: '成功',
              message: response.message,
              type: 'success'
            });
            this.$router.push({path: '/contract/list'})
        })
      }, 

      saveData() {
        contractApi.save(this.contract).then(response => {
          this.$notify({
              title: '成功',
              message: response.message,
              type: 'success'
            });
            this.$router.push({path: '/contract/list'})
        })
      },
      // 根据id查询数据
      fetchDataById(id) {
        contractApi.getById(id).then(response => {
          this.contract = response.data.item
        })
      }
    }
  }
</script>