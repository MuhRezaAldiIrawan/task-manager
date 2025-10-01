<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
export default {
    name: "App",
};
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: #f5f7fa;
    color: #2d3748;
}

#app {
    min-height: 100vh;
}
</style>
