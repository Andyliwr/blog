<template>
  <div class="questionitem">
    <div class="question-item" v-for="(item,index) in question_data.resultList">
      <h3 class="question-name">{{index+1}}.{{item.question_content}}</h3>
      <ul class="question-content">
        <li v-for="(value,key,inx) in item.answer_content" :class="{'testpaper-option-item':question_type === 'test','revisit-option-item':question_type==='revisit'}">
          <input type="radio" :id="key" :value="key" v-model="radios[index]" style="display:none;"><label :for="key" :class="{checked:key===radios[index]}" >{{value}}</label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  
  export default {
    name: 'questionitem',
    data() {
      return {
        radios: [],
        question_data: {}
      }
    },
    props: ['question_type', 'url'],

    computed: {
      answer_string(){
        let str = '';
        for(let i = 0;i < this.radios.length;i++){
          str += `${this.question_data.resultList[i].question_no}&${this.radios[i]}|`;
        }
        return str;
      }
    },
    created: function () {
      var self = this;
      axios.get(self.url).then(function (response) {
        self.question_data = response.data;
        for (let i = 0; i < self.question_data.resultList.length; i++) {
          self.radios.push(self.question_data.resultList[i].default_answer);
        }
      });
    },
    watch:{
      answer_string:function(val,oldval){
        this.$emit('returnAnswer', val);
      }
    }
  }

</script>
<style>
  .question-name {
    color: #333;
    font-size: 0.32rem;
    padding: 0.15rem 0;
  }
  
  .question-content {
    border-bottom: 1px solid #d7d7d7;
    color: #666;
  }
  
  .question-content li.testpaper-option-item {
    padding: 0.2rem 0.2rem 0.2rem 0.1rem;
    border-top: 1px solid #d7d7d7;
    border-left: 1px solid #d7d7d7;
    border-right: 1px solid #d7d7d7;
    font-size: 0.3rem;
  }
  
  .question-content li.testpaper-option-item label {
    padding-left: 0.4rem;
    background: url(../../images/TestPaper/radiouncheck.png) no-repeat left center;
    background-size: 0.3rem 0.3rem;
    display: block;
  }
  
  .question-content li.testpaper-option-item label.checked {
    background: url(../../images/TestPaper/radiochecked.png) no-repeat left center;
    background-size: 0.3rem 0.3rem;
  }
  
  .question-content li.revisit-option-item {
    float: left;
    margin-right: 0.2rem;
  }
  
  .question-content li.revisit-option-item label {
    display: block;
    height: 0.8rem;
    line-height: 0.8rem;
    font-size: 0.28rem;
    width: 3.3rem;
    border: 1px solid #d7d7d7;
    background-color: #fff;
    text-align: center;
    border-radius: 0.1rem;
    color: #999;
  }
  
  .question-content li.revisit-option-item label.checked {
    border: 1px solid #3a83d7;
    color: #3a83d7;
  }

</style>
