<script setup>
import { useRouter } from 'vue-router';
import {ref,onMounted} from 'vue';
const usersArray = ref([]);
const router=useRouter();
const user = ref({
  id:'',
  email: "",
  password: "",
});
onMounted(() => {
  let retrievedData = localStorage.getItem("user");
  usersArray.value = retrievedData?JSON.parse(retrievedData):[];
  console.log(usersArray.value);
});
const handleCancel=()=>{
    router.push('/')
}

const handleLogin=()=>{
if(usersArray.value.length)
{
    let userDetails=usersArray.value.find((i)=>{
          return i.email===user.value.email
    })
    if(!userDetails)
    {
        alert('UserName or password mismatch')
    }
    else
    {
    user.value.id=userDetails.id;
    let checkUserFound=usersArray.value.find((i)=>{
     return i.id===user.value.id
    })
   //console.log(checkUseFound);
   if(checkUserFound.email===user.value.email && checkUserFound.password===user.value.password)
   {
    localStorage.setItem("loggedIn",JSON.stringify(checkUserFound));
    router.push(`/dashboard`)
   }
   else
   {
    alert('UserName or password mismatch')
   }
   
  }
}
else
{
 alert("No User exists")
}}
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
