<script setup>
import { useRouter } from 'vue-router';
import {ref,onMounted} from 'vue';
const usersArray = ref([]);
const router1=useRouter();

const user = ref({
  email: "",
  password: "",
});
onMounted(() => {
  let retrievedData = localStorage.getItem("user");
  usersArray.value = JSON.parse(retrievedData);
  console.log(usersArray.value);
});
const handleCancel=()=>{
    router1.push('/')
}

const handleLogin=()=>{
if(usersArray.value.length)
{
    let checkUserEmail=usersArray.value.find((i)=>{
          return i.email===user.value.email
    })
    let checkUserPassword=usersArray.value.find((i)=>{
     return i.password===user.value.password
    })
    if(!checkUserEmail || !checkUserPassword)
    {
        alert('Username or Password InCorrect')
    }
   else
     router1.replace({name:'dashboard'})
}
}
</script>

<template>
 

 <form @submit.prevent="handleLogin">
<fieldset>
<legend>LogIn</legend>
<label>Enter your Username</label>
<input type="email" required v-model.trim="user.email"><br/>
<label>Enter your Password</label>
<input type="password" required v-model.trim="user.password"><br/>
<section>
<input type="submit"/>
<button @click="handleCancel">Cancel</button>
</section>
</fieldset>
</form>
 
</template>

<style>

</style>
