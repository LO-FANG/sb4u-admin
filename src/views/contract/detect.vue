<template>
    <div class="app-container">
      <el-carousel :interval="5000" type="card" height="400px">
        <el-carousel-item v-for="image in images" :key="image.url">
          <img  style="width:100%; height:100%" :src="image.url" alt="Image" />
        </el-carousel-item>
      </el-carousel>
  
      <el-steps :active="activeStep" finish-status="success" simple style="margin-top: 10px">
        <el-step title="选择漏洞类型"></el-step>
        <el-step title="审计中"></el-step>
        <el-step title="审计完成"></el-step>
      </el-steps>

      <div v-if="activeStep === 0"  class="transfer-container" style="margin: 10px 0 20px"  >
        <h3 style="text-align: center; margin: 10px 0 20px">选择漏洞类型</h3>
            <div style="text-align: center; margin: 10px 0 20px">
                <el-transfer
                style="text-align: left; display: inline-block"
                v-model="value4"
                filterable
                :left-default-checked="[2, 3]"
                :right-default-checked="[1]"
                :titles="['漏洞类型', '已选择']"
                :button-texts="['取消', '选择']"
                :format="{
                    noChecked: '${total}',
                    hasChecked: '${checked}/${total}'
                }"
                @change="handleChange"
                :data="data">
                <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
                <el-button class="transfer-footer" slot="right-footer" size="medium" @click="handleSubmit">确定</el-button>
                </el-transfer>
            </div>

      </div>


      <div v-if="activeStep === 2"  class="transfer-container word-on-canvas" style="margin: 10px 0 20px"  >
        <div class="canvas-container">
            <!-- <h3 class="typing" id="message" style="text-align: center; margin: 0px 0 5px">{{ currentText }}</h3> -->
            <div class="typing-container">
                <span id="message" class="typing">{{ currentText }}</span><span class="cursor"></span>
            </div>
            <div>
                <canvas ref="canvas" style="background:#fff; width: 100%; height: 100%;" class="blurred-canvas"></canvas>
            </div>
        </div>
      </div>

      <div v-if="activeStep === 3"  class="transfer-container" style="margin: 10px 0 20px"  >
        <h3 style="text-align: center; margin: 10px 0 20px">您的合约审计完成</h3>
      </div>

    </div>



  </template>
  
  <script>

  import contractApi from '@/api/contract'


  export default {
    name: 'ContractDetect',
    data() {

        const generateData = _ => {
        const data = [];
          data.push(
            {
                key: 1,
                label: '可重入漏洞',
            },
            {
                key: 2,
                label: '访问控制漏洞',
            },
            {
                key: 3,
                label: '算术漏洞',
            },
            {
                key: 4,
                label: '抢跑漏洞',
            },
            {
                key: 5,
                label: '短地址攻击',
            },

        );

        return data;
      };

      return {
        images: [
          { url: require('../assets/homeImages/1.png') },
          { url: require('../assets/homeImages/2.png') },
          { url: require('../assets/homeImages/3.png') }
        ],

        activeStep: 0,

        data: generateData(),
        value3: [1],
        value4: [1],
        renderFunc(h, option) {
          return <span>{ option.key } - { option.label }</span>;
        },

        currentText: '', // 当前显示的文本
        fullText: '您的合约正在审计中，请耐心等待...', // 完整的文本
        typingInterval: null, // 定时器
        currentIndex: 0, // 当前字符的索引

      };

    },

    methods: {
        handleChange(value, direction, movedKeys) {
            console.log(value, direction, movedKeys);
        },

        resetText() {
            this.currentText = '';
            this.currentIndex = 0;
        },
        
        startTyping() {
            console.log("--------------打字机启动--------------")
            this.typingInterval = setInterval(this.type, 300); // 每100毫秒添加一个字符
        },
        type() {
            if (this.currentIndex < this.fullText.length) {
                this.currentText = this.fullText.slice(0, this.currentIndex + 1);
                this.currentIndex++;
            } else {
                clearInterval(this.typingInterval); // 停止打字效果
                setTimeout(() => { // 等待一段时间后重新开始
                    clearInterval(this.typingInterval); // 组件销毁时清除定时器
                    this.resetText();
                    this.startTyping();
                }, 1000); // 等待1秒后重新开始
            }
        },

        handleSubmit() {
            this.activeStep = 2;
            // 构造请求数据
            this.createCodeRain();
            this.startTyping();
            
            const requestData = this.value4.map(key => {
            return this.data.find(item => item.key === key);
            });

            // 发送请求到后端
            contractApi.detectContract(requestData, this.$route.params.id)
            .then(response => {
                // 处理响应
                console.log(response);
                
                
            })
            .catch(error => {
                // 处理错误
                console.error(error);
            });
        },


        createCodeRain() {

            console.log("code rain code rain............")

            this.$nextTick(() => { // 确保 DOM 已经更新  
                const canvas = this.$refs.canvas;  
                if (canvas) {  
                    const context = canvas.getContext("2d");  
                    const W = 1605;  
                    const H = 320;  
                    canvas.width = W;  
                    canvas.height = H;  
                    const fontSize = 16;  
                    const colunms = Math.floor(W / fontSize);  
                    const drops = [];  
                    for (let i = 0; i < colunms; i++) {  
                        drops.push(0);  
                    }  
            
                    const str = "智能 合约 正在 审计";  
                    const draw = () => { 
                        context.fillStyle = "rgba(255,255,255,0.05)";  
                        context.fillRect(0, 0, W, H);  
                        context.font = "700 " + fontSize + "px 微软雅黑";  
                        context.fillStyle = "#00cc33";  
            
                        for (let i = 0; i < colunms; i++) {  
                            const index = Math.floor(Math.random() * str.length);  
                            const x = i * fontSize;  
                            const y = drops[i] * fontSize;  
                            context.fillText(str[index], x, y);  
                            if (y >= canvas.height && Math.random() > 0.99) {  
                                drops[i] = 0;  
                            }  
                            drops[i]++;  
                        }  
                    };  
            
                    draw();  
                    setInterval(draw, 30);  
                } else {  
                    console.error('Canvas element is not found');  
                }  
            });
        }

    },

    beforeDestroy() {
        clearInterval(this.typingInterval); // 组件销毁时清除定时器
    },

  };
  </script>
  
  <style>

    .typing-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10; /* 确保文本在画布上方 */
    }

    #message {
        display: inline-block; /* 确保在同一行 */
        position: relative; /* 相对定位 */
        color: #00cc33; /* 根据背景调整颜色 */
        margin: 0; /* 移除默认外边距 */
        padding: 5px; /* 根据需要添加内边距 */
        z-index: 10; /* 确保文本在画布上方 */
        font-family: '微软雅黑', sans-serif; /* 你可以选择任何你想要的字体 */
        font-size: 20px; /* 选择你想要的字号 */
        font-weight: bold; /* 字体加粗 */
    }

    .cursor {
        display: inline-block; /* 确保在同一行 */
        width: 10px; /* 光标宽度 */
        height: 1.2em; /* 光标高度 */
        background-color: #00cc33; /* 光标颜色 */
        animation: blink 1s infinite; /* 应用闪烁动画 */
        vertical-align: text-bottom; /* 确保光标与文本对齐 */
        margin-left: 2px; /* 给光标和文本之间留点空隙 */
    }    

    .typing {
        display: inline-block;
        position: relative;
    }

    @keyframes blink {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
    }

    .word-on-canvas {
        position: relative; /* 确保子元素可以相对于它进行定位 */
        margin: 10px 0 20px;
    }

    .canvas-container {
        position: relative; /* 为canvas提供定位上下文 */
        width: 100%; /* 根据需要设置宽度 */
        height: 100%; /* 根据需要设置高度 */
        overflow: hidden; /* 防止内容溢出 */
    }

    .blurred-canvas {
        width: 100%; /* 宽度填充整个父容器 */
        height: 100%; /* 高度填充整个父容器 */
    }

    


    .blurred-canvas {
        filter: blur(3.5px); /* 这里的5px是模糊程度，可以根据需要调整 */
        width: 100%; /* 或者你设置的具体宽度 */
        height: 100%; /* 或者你设置的具体高度 */
    }

    .transfer-container {
        border: 2px dashed #409EFF; /* 虚线边框 */
        padding: 10px; /* 内边距 */
        margin: 0 auto; /* 水平居中 */
        width: 100%; /* 宽度以父容器为主 */
        border-radius: 4px; /* 边框圆角 */
    }

    .transfer-footer {
        margin-left: 40%;
        padding: 5px 5px;
    }

    .el-carousel__item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }
    
    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }
  </style>