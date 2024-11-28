
<script setup>
import { RouterLink,RouterView } from 'vue-router';

</script>
<template>
<div id="containerHome">
    <h1>ChatBot</h1>
    <div>
    <RouterLink to="/signup" style="text-decoration: none;"><span  class="links">SignUp</span></RouterLink>
    <RouterLink to="/login" style="text-decoration: none;"><span  class="links">Login</span></RouterLink> 
</div>
</div>
<RouterView/>
</template>

<style scoped>
#containerHome{
    margin-top: 150px;
    padding-top: 40px;
    padding-bottom: 40px;
    display:flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   margin-left: auto;
   margin-right: auto;
border-radius: 40px;
    width: 600px;
    background-color: #0093E9;
background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);

}
#containerHome h1{
    text-align: center;
    font-size: 90px;
    width: 400px;

    border-radius: 25%;
    padding: 10px;
    color: rgb(9, 24, 228);
    margin-bottom: 60px;
}
.links{
    font-size: 40px;
background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
border-radius: 10px;
text-align: center;
display: inline-block;
width: 150px;
padding:5px;
color: #320bbe;
margin-right: 40px;
margin-left: 40px;
}


</style>
